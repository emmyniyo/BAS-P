import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Filter, Bell, BellOff } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export default function Alerts() {
  const { alerts, acknowledgeAlert, sensors, equipment } = useData();
  const [filter, setFilter] = useState<'all' | 'acknowledged' | 'unacknowledged'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'warning' | 'error' | 'info'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filteredAlerts = alerts.filter(alert => {
    const statusMatch = filter === 'all' || 
                       (filter === 'acknowledged' && alert.acknowledged) ||
                       (filter === 'unacknowledged' && !alert.acknowledged);
    const typeMatch = typeFilter === 'all' || alert.type === typeFilter;
    const priorityMatch = priorityFilter === 'all' || alert.priority === priorityFilter;
    
    return statusMatch && typeMatch && priorityMatch;
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'info': return Bell;
      default: return Bell;
    }
  };

  const getAlertColor = (type: string, priority: string) => {
    if (type === 'error' || priority === 'high') {
      return 'bg-red-50 border-red-200 text-red-700';
    }
    if (type === 'warning' || priority === 'medium') {
      return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return 'Inconnue';
    }
  };

  const getRelatedItem = (alert: any) => {
    if (alert.sensorId) {
      const sensor = sensors.find(s => s.id === alert.sensorId);
      return sensor ? { type: 'Capteur', name: sensor.name, room: sensor.room } : null;
    }
    if (alert.equipmentId) {
      const equip = equipment.find(e => e.id === alert.equipmentId);
      return equip ? { type: 'Équipement', name: equip.name, room: equip.room } : null;
    }
    return null;
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-gray-900">Alertes</h1>
          {unacknowledgedCount > 0 && (
            <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
              {unacknowledgedCount} non lues
            </span>
          )}
        </div>
        <p className="text-gray-600 mt-2">Surveillez et gérez toutes les alertes système</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Alertes actives</p>
              <p className="text-2xl font-bold text-gray-900">{unacknowledgedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Traitées</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.acknowledged).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Haute priorité</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter(a => a.priority === 'high' && !a.acknowledged).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtres:</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">Tous les statuts</option>
              <option value="unacknowledged">Non traitées</option>
              <option value="acknowledged">Traitées</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
            >
              <option value="all">Tous les types</option>
              <option value="error">Erreur</option>
              <option value="warning">Avertissement</option>
              <option value="info">Information</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
            >
              <option value="all">Toutes les priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const Icon = getAlertIcon(alert.type);
          const relatedItem = getRelatedItem(alert);
          
          return (
            <div
              key={alert.id}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                alert.acknowledged 
                  ? 'bg-gray-50 border-gray-200 opacity-75' 
                  : getAlertColor(alert.type, alert.priority)
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${alert.acknowledged ? 'bg-gray-200' : ''}`}>
                    {alert.acknowledged ? (
                      <BellOff className="h-6 w-6 text-gray-500" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`font-semibold ${alert.acknowledged ? 'text-gray-600' : 'text-gray-900'}`}>
                        {alert.message}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(alert.priority)}`}>
                        {getPriorityLabel(alert.priority)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {relatedItem && (
                        <p className={`text-sm ${alert.acknowledged ? 'text-gray-500' : 'text-gray-600'}`}>
                          {relatedItem.type}: {relatedItem.name} ({relatedItem.room})
                        </p>
                      )}
                      
                      <div className={`flex items-center space-x-4 text-sm ${alert.acknowledged ? 'text-gray-500' : 'text-gray-600'}`}>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{alert.timestamp.toLocaleString()}</span>
                        </div>
                        
                        {alert.acknowledged && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Traitée</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {!alert.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Marquer comme traitée</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune alerte trouvée</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'unacknowledged' 
              ? "Toutes les alertes ont été traitées." 
              : "Modifiez vos filtres pour voir plus d'alertes."}
          </p>
        </div>
      )}
    </div>
  );
}