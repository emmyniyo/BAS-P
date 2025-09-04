import { Sensor } from "../contexts/DataContext";

// API service for Node-RED integration
export interface ApiConfig {
  baseUrl: string;
  wsUrl: string;
  wsSensorUrl: string; // Optional WebSocket URL for sensor data
  apiKey?: string;
  enableMockData?: boolean;
}

// Default configuration - update these URLs to match your Node-RED setup
const defaultConfig: ApiConfig = {
  baseUrl: 'http://localhost:1880/api',
  wsUrl: 'ws://localhost:1880/ws/equipement',
  wsSensorUrl: 'ws://localhost:1880/ws/sensor',
};

export class BackendApiService {
  private config: ApiConfig;
  private ws: WebSocket | null = null;
  private wsSensor: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  constructor(config: ApiConfig = defaultConfig) {
    this.config = config;
  }

  // HTTP API methods for Node-RED endpoints
  private async makeRequest(endpoint: string, options: RequestInit = {}) {

    const url = `${this.config.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    };


    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Sensor data endpoints
  async getSensorData() {
    return this.makeRequest('/sensor');
  }

  async getSensorHistory(sensorId: string, timeRange: string = '24h') {
    return this.makeRequest(`/sensor/${sensorId}/history?range=${timeRange}`);
  }

  // Room control endpoints
  async getRoomControls() {
    return this.makeRequest('/equipment');
  }
  // Room data endpoints
  async getRoomData() {
    return this.makeRequest('/room');
  }

  // Users data endpoints
  async getUsersData() {
    return this.makeRequest('/users');
  }

  // Update room control (e.g., turn on/off lights, adjust thermostat)
  async updateRoomControl(controlId: string, status: boolean, value?: number) {
    return this.makeRequest(`/equipment/${controlId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, value })
    });
  }


  async addSensor(sensor:  Omit<Sensor, 'id'>) {
    const payload = {
      name: sensor.name,
      type: sensor.type,
      room: sensor.room,
      floor: sensor.floor,
      value: sensor.value,
      unit: sensor.unit,
      minThreshold: sensor.minThreshold,
      maxThreshold: sensor.maxThreshold,
      room_id: "room-1-uuid"
    };

    return this.makeRequest(`/sensors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };




  async addUser(firstname: string, lastname: string, email: string, role: string, password: string) {
    const payload = { first_name: firstname, last_name: lastname, email, role, password };
    return this.makeRequest(`/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };


  async updateUser(id: string, firstname: string, lastname: string, email: string, role: string, password: string) {
    const payload = { id, first_name: firstname, last_name: lastname, email, role, password };
    return this.makeRequest(`/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };


  async deleteUser(id: string) {
    const payload = { id };
    return this.makeRequest(`/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  // Alert endpoints
  async getAlerts() {
    return this.makeRequest('/alert');
  }

  // Acknowledge an alert 
  async acknowledgeAlert(alertId: string) {
    return this.makeRequest(`/alert/${alertId}/acknowledge`, {
      method: 'POST'
    });
  }

  // Access logs
  async getAccessLogs(limit: number = 50) {
    return this.makeRequest(`/access_logs?limit=${limit}`);
  }

  // System status
  async getSystemStatus() {
    return this.makeRequest('/system_status');
  }

  // Update sensor
  async updateSensor(sensorId: string, updates: any) {
    return this.makeRequest(`/sensor/${sensorId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // WebSocket connection for real-time data
  connectWebSocket(onMessage: (data: any) => void, onError?: (error: Event) => void) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(this.config.wsUrl);
      this.wsSensor = new WebSocket(this.config.wsSensorUrl);

      this.ws.onopen = () => {
        // Wait a moment to ensure connection is fully open
        setTimeout(() => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            console.log('WebSocket connected to Node-RED');
          } else {
            console.warn('WebSocket not open when trying to send subscribe');
          }
        }, 100); // Delay by 100ms
      };


      this.wsSensor.onopen = () => {
        // Wait a moment to ensure connection is fully open
        setTimeout(() => {
          if (this.wsSensor?.readyState === WebSocket.OPEN) {
            console.log('WebSocket for sensors connected to Node-RED');
          } else {
            console.warn('WebSocket not open when trying to send subscribe');
          }
        }, 100); // Delay by 100ms
      };


      this.wsSensor.onmessage = (event) => {

        const msg = JSON.parse(event.data);
        onMessage(msg);

        // if (msg.type === "sensors_list") {
        //   console.log("✅ Sensors list received now in services:", msg.data);
        // }
      };


      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
          console.log("Message from websocket", event.data);

        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect(onMessage, onError);
        } else {
          console.log('Max reconnection attempts reached, switching to mock data mode');
        }
      };

      this.ws.onerror = (error) => {
        if (onError) {
          onError(error);
        }
      };

    } catch (error) {
      if (onError) {
        onError(error as Event);
      }
    }
  }

  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }



  private attemptReconnect(onMessage: (data: any) => void, onError?: (error: Event) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connectWebSocket(onMessage, onError);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.log('Max reconnection attempts reached for Node-RED connection');
    }
  }



  sendWsRequest(action: string = "get_sensors") {
    if (this.wsSensor && this.wsSensor.readyState === WebSocket.OPEN) {
      this.wsSensor.send(JSON.stringify(action));
    } else {
      console.warn('WebSocket sensor not connected, cannot send request');
    }
  }


  // Send commands to Node-RED
  sendCommand(
    command: string,           // e.g. "update", "delete", "toggle", "create"
    target: string,            // e.g. "sensor", "room", "actuator", "user"
    id?: string | number,      // target id (optional if creating new entity)
    payload: any = {},         // flexible data object
    meta: any = {}             // additional info like userId, role, etc.
  ) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // {"equipmentId":"2","status":"off","command":"toggle","userId":"u1"}
      this.ws.send(JSON.stringify({
        type: 'command',
        "command": command,     // what to do
        target,      // where to apply
        "equipmentId": id,          // which item
        "userId": meta.userId || "u1", // user performing action
        "timestamp": new Date().toISOString(), // current time
        "status": payload.status, // e.g. "on", "off"
        "value": payload.value,   // e.g. temperature, brightness, etc.
        payload,     // data body
        meta,        // extra info
      }));
    } else {
      console.warn('WebSocket not connected to Node-RED, cannot send command');
    }
  }

}

// Export singleton instance
export const nodeRedApi = new BackendApiService();