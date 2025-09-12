import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Zap, 
  Wifi, 
  WifiOff,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'good' | 'warning' | 'danger';
  trend?: 'up' | 'down' | 'stable';
  room: string;
}

function MetricCard({ title, value, unit, icon: Icon, status, trend, room }: MetricCardProps) {
  const statusColors = {
    good: 'bg-blue-50 text-blue-700 border-blue-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200'
  };

  const statusIcons = {
    good: CheckCircle,
    warning: AlertCircle,
    danger: AlertCircle
  };

  const StatusIcon = statusIcons[status];

  return (
    <div className={`p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="h-8 w-8" />
        <StatusIcon className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm opacity-80">{title}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold">{value}</span>
          <span className="text-sm opacity-70">{unit}</span>
        </div>
        <p className="text-xs opacity-60">{room}</p>
      </div>
    </div>
  );
}

interface EquipmentCardProps {
  name: string;
  type: string;
  status: 'on' | 'off';
  value?: number;
  room: string;
}

function EquipmentCard({ name, type, status, value, room }: EquipmentCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'hvac': return Wind;
      case 'lighting': return Sun;
      case 'door': return Activity;
      default: return Zap;
    }
  };

  const Icon = getIcon();
  const isOn = status === 'on';

  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
      isOn ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-6 w-6 ${isOn ? 'text-blue-600' : 'text-gray-400'}`} />
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isOn ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {isOn ? 'ON' : 'OFF'}
        </div>
      </div>
      <h4 className="font-medium text-sm text-gray-900 mb-1">{name}</h4>
      {value !== undefined && (
        <p className="text-sm text-gray-600 mb-1">{value}°C</p>
      )}
      <p className="text-xs text-gray-500">{room}</p>
    </div>
  );
}

export default function Dashboard() {
  const { sensors, equipment, alerts } = useData();
  
  
  console.log("sensors, ", sensors);

  const getMetricStatus = (sensor: any) => {
    if (sensor.maxThreshold && sensor.value > sensor.maxThreshold) return 'danger';
    if (sensor.minThreshold && sensor.value < sensor.minThreshold) return 'danger';
    if (sensor.maxThreshold && sensor.value > sensor.maxThreshold * 0.8) return 'warning';
    return 'good';
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'temperature': return Thermometer;
      case 'humidity': return Droplets;
      case 'co2': return Wind;
      case 'light': return Sun;
      default: return Activity;
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de vos installations</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700">Capteurs Actifs</p>
              <p className="text-2xl font-bold text-blue-900">
                {sensors.filter(s => s.status === 'active').length}/{sensors.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700">Équipements ON</p>
              <p className="text-2xl font-bold text-green-900">
                {equipment.filter(e => e.status === 'on').length}/{equipment.length}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-sm border ${
          activeAlerts.length > 0 
            ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${activeAlerts.length > 0 ? 'bg-red-500' : 'bg-gray-400'}`}>
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className={`text-sm ${activeAlerts.length > 0 ? 'text-red-700' : 'text-gray-600'}`}>Alertes Actives</p>
              <p className={`text-2xl font-bold ${activeAlerts.length > 0 ? 'text-red-900' : 'text-gray-700'}`}>{activeAlerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sensors Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Mesures en Temps Réel</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sensors.map((sensor) => (
              <MetricCard
                key={sensor.id}
                title={sensor.name}
                value={sensor.value.toFixed(1)}
                unit={sensor.unit}
                icon={getIcon(sensor.type)}
                status={getMetricStatus(sensor)}
                room={sensor.room}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Control */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">État des Équipements</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((item) => (
              <EquipmentCard
                key={item.id}
                name={item.name}
                type={item.type}
                status={item.status}
                value={item.value}
                room={item.room}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      {activeAlerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Alertes Récentes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activeAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-900">{alert.message}</p>
                    <p className="text-sm text-red-600 mt-1">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}