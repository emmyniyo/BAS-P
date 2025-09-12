import React, { useState } from 'react';
import { Power, Settings, Wind, Sun, Activity, RotateCcw } from 'lucide-react';
import { Equipment, useData } from '../contexts/DataContext';

export default function Control() {
  const { equipment, updateEquipment } = useData();
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  const getIcon = (type: string) => {
    switch (type) {
      case 'hvac': return Wind;
      case 'lighting': return Sun;
      case 'door': return Activity;
      default: return Settings;
    }
  };

  const handleToggle = async (id: number, currentStatus: 'on' | 'off', control: Equipment) => {
    const newStatus = currentStatus === 'on' ? 'off' : 'on';
    
    // Set loading state for this specific equipment
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    
    try {
      await updateEquipment(id, "toggle", { ...control, status: newStatus });
    } catch (error) {
      console.error('Error toggling equipment:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleValueChange = async (id: number, value: number, control: Equipment) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    
    try {
      await updateEquipment(id, "update", { ...control, value });
    } catch (error) {
      console.error('Error updating equipment value:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hvac': return 'Climatisation';
      case 'lighting': return 'Éclairage';
      case 'door': return 'Porte';
      default: return 'Équipement';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contrôle des Équipements</h1>
        <p className="text-gray-600 mt-2">Gérez vos équipements à distance en temps réel</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Power className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Équipements Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {equipment.filter(e => e.status === 'on').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Contrôlables</p>
              <p className="text-2xl font-bold text-gray-900">
                {equipment.filter(e => e.controllable).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{equipment.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Control Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {equipment.map((item) => {
          const Icon = getIcon(item.type);
          const isOn = item.status === 'on';
          const isLoading = loadingStates[item.id] || false;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${
                isLoading ? 'opacity-75' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${isOn ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Icon className={`h-6 w-6 ${isOn ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.room} - {item.floor}</p>
                      <p className="text-xs text-gray-500 mt-1">{getTypeLabel(item.type)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isOn ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isOn ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  {item.controllable && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">État</span>
                      <button
                        onClick={() => handleToggle(item.id, item.status, item)}
                        disabled={isLoading}
                        className={`toggle-button ${isOn ? 'toggle-button-on' : 'toggle-button-off'}`}
                      >
                        <span
                          className={`toggle-knob ${isOn ? 'toggle-knob-on' : 'toggle-knob-off'} ${isLoading ? 'toggle-loading' : ''}`}
                        />
                        {isLoading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="loading-spinner"></div>
                          </div>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Temperature/Value Control for HVAC */}
                  {item.type === 'hvac' && item.value !== undefined && isOn && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">Température</span>
                        <span className="text-lg font-semibold text-blue-600">{item.value}°C</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="28"
                        step="0.5"
                        value={item.value}
                        onChange={(e) => handleValueChange(item.id, parseFloat(e.target.value), item)}
                        disabled={isLoading}
                        className="slider disabled:opacity-50"
                        style={{'--value': `${((item.value - 16) / (28 - 16)) * 100}%`} as React.CSSProperties}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>16°C</span>
                        <span>28°C</span>
                      </div>
                    </div>
                  )}

                  {/* Intensity Control for Lighting */}
                  {item.type === 'lighting' && item.value !== undefined && isOn && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">Intensité</span>
                        <span className="text-lg font-semibold text-blue-600">{item.value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={item.value}
                        onChange={(e) => handleValueChange(item.id, parseInt(e.target.value), item)}
                        disabled={isLoading}
                        className="slider disabled:opacity-50"
                        style={{'--value': `${item.value}%`} as React.CSSProperties}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  )}

                  {/* Last Update */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Dernière action:</span>
                      <span>{item.lastUpdate.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {equipment.length === 0 && (
        <div className="text-center py-12">
          <Settings className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun équipement configuré</h3>
          <p className="mt-1 text-sm text-gray-500">
            Ajoutez des équipements depuis la section Administration.
          </p>
        </div>
      )}
    </div>
  );
}
