# Smart System - Node-RED MySQL Integration Guide

## Complete Database Setup and Connection Guide

### Step 1: Create MySQL Database and Tables

Run these SQL commands in your MySQL server (via Node-RED or MySQL client):

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS smart_system;
USE smart_system;

-- Create sensor_readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_type VARCHAR(50) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(10),
    location VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sensor_type (sensor_type),
    INDEX idx_timestamp (timestamp)
);

-- Create device_status table
CREATE TABLE IF NOT EXISTS device_status (
    device_id VARCHAR(50) PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    status ENUM('online', 'offline', 'error') NOT NULL,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    INDEX idx_status (status)
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    device_id VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged BOOLEAN DEFAULT FALSE,
    INDEX idx_alert_type (alert_type),
    INDEX idx_timestamp (timestamp),
    INDEX idx_acknowledged (acknowledged)
);

-- Insert sample data
INSERT INTO sensor_readings (sensor_type, value, unit, location) VALUES
('temperature', 23.5, '°C', 'living_room'),
('humidity', 65.0, '%', 'living_room'),
('pressure', 1013.25, 'hPa', 'outdoor');

INSERT INTO device_status (device_id, device_name, status, ip_address) VALUES
('sensor_001', 'Living Room Sensor', 'online', '192.168.1.100'),
('camera_001', 'Front Door Camera', 'online', '192.168.1.101');

INSERT INTO alerts (alert_type, message, severity, device_id) VALUES
('temperature', 'Temperature above threshold', 'medium', 'sensor_001'),
('connectivity', 'Device offline detected', 'high', 'camera_001');
```

### Step 2: Node-RED MySQL Configuration

#### Install MySQL node in Node-RED:
1. Open Node-RED (usually http://localhost:1880)
2. Go to Menu → Manage Palette → Install
3. Search for "node-red-node-mysql" and install

#### Configure MySQL connection:
1. Drag a MySQL node to your flow
2. Double-click to configure:
   - **Host**: localhost
   - **Port**: 3306
   - **Database**: smart_system
   - **Username**: your_mysql_user
   - **Password**: your_mysql_password

### Step 3: Complete Node-RED Flow

Import this flow into Node-RED:

```json
[
  {
    "id": "mysql_config",
    "type": "MySQLdatabase",
    "name": "Smart System DB",
    "host": "localhost",
    "port": "3306",
    "db": "smart_system",
    "username": "your_mysql_user",
    "password": "your_mysql_password"
  },
  {
    "id": "store_sensor_data",
    "type": "mysql",
    "z": "flow_1",
    "name": "Store Sensor Data",
    "topic": "",
    "x": 400,
    "y": 200,
    "wires": [["debug_output"]],
    "database": "mysql_config"
  },
  {
    "id": "get_sensor_data",
    "type": "mysql",
    "z": "flow_1",
    "name": "Get Sensor Data",
    "topic": "SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT 100",
    "x": 400,
    "y": 300,
    "wires": [["http_response"]],
    "database": "mysql_config"
  },
  {
    "id": "store_device_status",
    "type": "mysql",
    "z": "flow_1",
    "name": "Store Device Status",
    "topic": "",
    "x": 400,
    "y": 400,
    "wires": [["debug_output"]],
    "database": "mysql_config"
  },
  {
    "id": "get_device_status",
    "type": "mysql",
    "z": "flow_1",
    "name": "Get Device Status",
    "topic": "SELECT * FROM device_status ORDER BY last_seen DESC",
    "x": 400,
    "y": 500,
    "wires": [["http_response"]],
    "database": "mysql_config"
  },
  {
    "id": "store_alert",
    "type": "mysql",
    "z": "flow_1",
    "name": "Store Alert",
    "topic": "",
    "x": 400,
    "y": 600,
    "wires": [["debug_output"]],
    "database": "mysql_config"
  },
  {
    "id": "get_alerts",
    "type": "mysql",
    "z": "flow_1",
    "name": "Get Alerts",
    "topic": "SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 50",
    "x": 400,
    "y": 700,
    "wires": [["http_response"]],
    "database": "mysql_config"
  },
  {
    "id": "debug_output",
    "type": "debug",
    "z": "flow_1",
    "name": "Debug",
    "active": true,
    "tosidebar": true,
    "console": false,
    "tostatus": false,
    "complete": "payload",
    "targetType": "msg",
    "x": 600,²                                                    
    "y": 200,
    "wires": []
  },
  {
    "id": "http_response",
    "type": "http response",
    "z": "flow_1",
    "name": "HTTP Response",
    "statusCode": "",
    "headers": {},
    "x": 600,
    "y": 300,
    "wires": []
  }
]
```

### Step 4: Backend Server Setup

#### Install server dependencies:
```bash
cd server
npm init -y
npm install express mysql2 ws dotenv
```

#### Create server configuration:
Create `server/.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=smart_system
HTTP_PORT=3000
```

#### Complete server code (`server/index.js`):
```javascript
require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mysql = require('mysql2/promise');
const path = require('path');

// MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json());

// API Routes
app.get('/api/sensors', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT 100');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/devices', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM device_status ORDER BY last_seen DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 50');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket for real-time updates
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send initial data
  const sendData = async () => {
    try {
      const [sensors] = await pool.query('SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT 10');
      const [devices] = await pool.query('SELECT * FROM device_status ORDER BY last_seen DESC');
      const [alerts] = await pool.query('SELECT * FROM alerts ORDER BY timestamp DESC LIMIT 10');
      
      ws.send(JSON.stringify({
        type: 'initial-data',
        sensors,
        devices,
        alerts
      }));
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
  
  sendData();
  
  ws.on('close', () => console.log('Client disconnected'));
});

const PORT = process.env.HTTP_PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Step 5: Frontend Integration

#### Install frontend dependencies:
```bash
npm install axios
```

#### Create service file (`src/services/api.js`):
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  getSensors: () => axios.get(`${API_BASE_URL}/sensors`),
  getDevices: () => axios.get(`${API_BASE_URL}/devices`),
  getAlerts: () => axios.get(`${API_BASE_URL}/alerts`)
};
```

### Step 6: Start Everything

1. **Start MySQL**: `sudo systemctl start mysql`
2. **Start Node-RED**: `node-red`
3. **Start backend**: `cd server && node index.js`
4. **Start frontend**: `npm run dev`

### Step 7: Test the Connection

1. Visit `http://localhost:5173` (frontend)
2. Check `http://localhost:3000/api/sensors` (backend API)
3. Verify Node-RED flow is running
4. Check MySQL database has data

## Complete Commands Summary

```bash
# 1. Database setup
mysql -u root -p < database-setup.sql

# 2. Install dependencies
npm install
cd server && npm install

# 3. Start services
sudo systemctl start mysql
node-red &  # In separate terminal
cd server && node index.js &  # In separate terminal
npm run dev  # Frontend
```