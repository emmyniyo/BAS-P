import React, { useState } from 'react';
import { Search, Filter, Thermometer, Droplets, Wind, Sun, Activity, Wifi, WifiOff } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function Sensors() {
  const { sensors } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'error'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'temperature': return Thermometer;
      case 'humidity': return Droplets;
      case 'co2': return Wind;
      case 'light': return Sun;
      default: return Activity;
    }
  };

  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sensor.status === statusFilter;
    const matchesType = typeFilter === 'all' || sensor.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const uniqueTypes = [...new Set(sensors.map(s => s.type))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Capteurs</h1>
        <p className="text-gray-600 mt-2">Gestion et surveillance de tous vos capteurs</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou salle..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="error">Erreur</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tous les types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type} className="capitalize">{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSensors.map((sensor) => {
          const Icon = getIcon(sensor.type);

          const getStatusColor = (lastUpdate: Date) => {

            const now = new Date();
            const last = new Date(lastUpdate); // <-- convert to Date
            const diffMs = now.getTime() - last.getTime(); // difference in milliseconds

            let status = "active";  // default
            if (diffMs > 5 * 60 * 1000) {  // 5 minutes threshold
              status = "inactive";       // sensor hasn't reported recently
            }

            switch (status) {
              case 'active': return 'text-green-600 bg-green-100';
              case 'inactive': return 'text-red-600 bg-red-100';
              default: return 'text-gray-600 bg-gray-100';
            }
          };


          const getSensorStatus = (lastUpdate: Date) => {
            const now = new Date();
            const last = new Date(lastUpdate); // <-- convert to Date
            const diffMs = now.getTime() - last.getTime(); // difference in milliseconds


            if (diffMs < 5 * 60 * 1000) return 'Actif';
            if (diffMs < 30 * 60 * 1000) return 'Inactif';
            return 'Erreur';
          };

          const getThresholdStatus = () => {
            if (sensor.maxThreshold && sensor.value > sensor.maxThreshold) {
              return { status: 'danger', text: 'Seuil dépassé' };
            }
            if (sensor.minThreshold && sensor.value < sensor.minThreshold) {
              return { status: 'danger', text: 'Sous le seuil' };
            }
            if (sensor.maxThreshold && sensor.value > sensor.maxThreshold * 0.8) {
              return { status: 'warning', text: 'Proche du seuil' };
            }
            return { status: 'good', text: 'Normal' };
          };

          const thresholdStatus = getThresholdStatus();

          return (
            <div key={sensor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{sensor.name}</h3>
                      <p className="text-sm text-gray-600">{sensor.room} - {sensor.floor}</p>
                    </div>
                  </div>
                  {sensor.status === 'active' ? (
                    <Wifi className="h-5 w-5 text-green-600" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {sensor.value.toFixed(1)}
                      </span>
                      <span className="text-lg text-gray-600">{sensor.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sensor.lastUpdate)}`}>
                      {getSensorStatus(sensor.lastUpdate)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${thresholdStatus.status === 'danger' ? 'bg-red-100 text-red-600' :
                      thresholdStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                      {thresholdStatus.text}
                    </span>
                  </div>

                  {(sensor.minThreshold !== undefined || sensor.maxThreshold !== undefined) && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500 space-y-1">
                        {sensor.minThreshold !== undefined && (
                          <div>Min: {sensor.minThreshold} {sensor.unit}</div>
                        )}
                        {sensor.maxThreshold !== undefined && (
                          <div>Max: {sensor.maxThreshold} {sensor.unit}</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Dernière mise à jour: {sensor.lastUpdate.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSensors.length === 0 && (
        <div className="text-center py-12">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun capteur trouvé</h3>
          <p className="mt-1 text-sm text-gray-500">
            Essayez de modifier vos critères de recherche.
          </p>
        </div>
      )}
    </div>
  );
}