import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { nodeRedApi } from '../services/api';

export interface Sensor {
  id: string;
  name: string;
  type: string;
  room: string;
  floor: string;
  value: number;
  unit: string;
  status: 'active' | 'inactive' | 'error';
  lastUpdate: Date;
  minThreshold?: number;
  maxThreshold?: number;
}

export interface Equipment {
  id: number;
  name: string;
  type: string;
  room: string;
  floor: string;
  status: 'on' | 'off';
  controllable: boolean;
  value?: number;
  lastUpdate: Date;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  sensorId?: string;
  equipmentId?: string;
  timestamp: Date;
  acknowledged: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  role: "admin" | "user";
  email: string;
  created_at?: string;
}

export interface Room {
  id: string;
  name: string;
  floor: string;
  area: number;
  sensors: string[];
  equipment: string[];
}

interface DataContextType {
  sensors: Sensor[];
  equipment: Equipment[];
  alerts: Alert[];
  rooms: Room[];
  users: User[];
  updateSensor: (id: string, updates: Partial<Sensor>) => void;
  updateEquipment: (id: number, action: string, updates: Partial<Equipment>) => void;
  createUser: (firstname: string, lastname: string, email: string, role: string, password: string) => void;
  updateUser: (id: string, firstname: string, lastname: string, email: string, role: string, password: string) => void;
  deleteUser: (id: string) => void;
  acknowledgeAlert: (id: string) => void;
  addRoom: (room: Omit<Room, 'id'>) => void;
  addSensor: (sensor: Omit<Sensor, 'id'>) => void;
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  deleteRoom: (id: string) => void;
  deleteSensor: (id: string) => void;
  deleteEquipment: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Handle WebSocket errors - removed unused function

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {

      try {
        const equipmentData = await nodeRedApi.getRoomControls();
        const roomData = await nodeRedApi.getRoomData();
        // const roomData = await nodeRedApi.getAccessLogs();
        const users = await nodeRedApi.getUsersData();
        setUsers(users);


        nodeRedApi.sendWsRequest("get_sensors");


        if (sensors.length == 0) {
          const sensorData = await nodeRedApi.getSensorData();
          setSensors(sensorData);
        }
        setEquipment(equipmentData);
        // setAlerts(alertData);
        setRooms(roomData);
      } catch (error: any) {
        console.error('Error fetching data:', error);

      }

    };

    fetchData();


    // // Set up real-time updates via WebSocket
    const handleWebSocketMessage = (data: any) => {
      if (data.type === 'sensor_update') {
        // setSensors(prev => prev.map(s => s.id === data.id ? { ...s, ...data } : s));
      } else if (data.type === 'equipment_update') {
        setEquipment(prev => prev.map(e => e.id === data.id ? { ...e, ...data } : e));
      } else if (data.type === 'alert_update') {
        setAlerts(prev => prev.map(a => a.id === data.id ? { ...a, ...data } : a));
      } else if (data.type === 'sensors_list') {
        console.log("✅ Sensors list received:", data.data);
        setSensors(data.data); // ✅ now we can refresh the full list
        console.log("Sensors updated:", sensors);
      }
    };

    nodeRedApi.connectWebSocket(handleWebSocketMessage);

    console.log("📊 Sensors state updated:", sensors);

    return () => {
      nodeRedApi.disconnectWebSocket();
    };


  }, []); // Remove sensors dependency to prevent infinite loop

  // Update sensor via API
  const updateSensor = async (id: string, updates: Partial<Sensor>) => {
    try {
      await nodeRedApi.updateSensor(id, updates);
      // setSensors(prev => prev.map(sensor =>
      //   sensor.id === id ? { ...sensor, ...updates } : sensor
      // ));
    } catch (error) {
      console.error('Error updating sensor:', error);
    }
  };


  // cREATE USER via API
  const createUser = async (firstname: string, lastname: string, email: string, role: string, password: string) => {
    try {
      await nodeRedApi.addUser(firstname, lastname, email, role, password);
      const users = await nodeRedApi.getUsersData();
      setUsers(users);
    } catch (error) {
      console.error('Error CREATING user:', error);
    }
  };


  // Update sensor via API
  const updateUser = async (id: string, firstname: string, lastname: string, email: string, role: string, password: string) => {
    try {
      await nodeRedApi.updateUser(id, firstname, lastname, email, role, password);
      const users = await nodeRedApi.getUsersData();
      setUsers(users);
    } catch (error) {
      console.error('Error updating sensor:', error);
    }
  };


  // Delete sensor via API
  const deleteUser = async (id: string) => {
    try {
      await nodeRedApi.deleteUser(id);
      const users = await nodeRedApi.getUsersData();
      setUsers(users);
    } catch (error) {
      console.error('Error r sensor:', error);
    }
  };


  // Update equipment via API
  const updateEquipment = async (id: number, action: string, updates: Partial<Equipment>) => {
    try {
      // await nodeRedApi.updateRoomControl(id, updates.status === 'on', updates.value);

      nodeRedApi.sendCommand(
        action,
        "equipment",
        id,
        { value: updates.value, status: updates.status },
        { userId: "u1" }
      );


      setEquipment(prev => prev.map(item =>
        item.id === id ? { ...item, ...updates, lastUpdate: new Date() } : item
      ));

      // setEquipment(prev => prev.map(item => 
      //   item.id === id ? { ...item, ...updates, lastUpdate: new Date() } : item
      // ));
    } catch (error) {
      console.error('Error updating equipment:', error);
    }
  };

  // Acknowledge alert via API
  const acknowledgeAlert = async (id: string) => {
    try {
      await nodeRedApi.acknowledgeAlert(id);
      setAlerts(prev => prev.map(alert =>
        alert.id === id ? { ...alert, acknowledged: true } : alert
      ));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  // Local CRUD operations (for demo/testing)
  const addRoom = (room: Omit<Room, 'id'>) => {
    setRooms(prev => [...prev, { ...room, id: Date.now().toString() }]);
  };

  const addSensor = async (sensor: Omit<Sensor, 'id'>) => {
    await nodeRedApi.addSensor(sensor);
    const sensors = await nodeRedApi.getSensorData();
    setSensors(sensors);
  };

  const addEquipment = (_equip: Omit<Equipment, 'id'>) => {
    // setEquipment(prev => [...prev, { ...equip, id: Date.now().toString(), lastUpdate: new Date() }]);
  };

  // Delete room via API
  const deleteRoom = async (id: string) => {
    try {
      await nodeRedApi.deleteRoom(id);
      setRooms(prev => prev.filter(room => room.id !== id));
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  // Delete sensor via API
  const deleteSensor = async (id: string) => {
    try {
      await nodeRedApi.deleteSensor(id);
      setSensors(prev => prev.filter(sensor => sensor.id !== id));
    } catch (error) {
      console.error('Error deleting sensor:', error);
    }
  };

  // Delete equipment via API
  const deleteEquipment = async (id: string) => {
    try {
      await nodeRedApi.deleteEquipment(id);
      setEquipment(prev => prev.filter(item => item.id.toString() !== id));
    } catch (error) {
      console.error('Error deleting equipment:', error);
    }
  };

  return (
    <DataContext.Provider value={{
      sensors,
      equipment,
      alerts,
      rooms,
      users,
      updateSensor,
      updateEquipment,
      acknowledgeAlert,
      addRoom,
      addSensor,
      addEquipment,
      createUser,
      updateUser,
      deleteUser,
      deleteRoom,
      deleteSensor,
      deleteEquipment
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
