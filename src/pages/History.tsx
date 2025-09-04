import React, { useState } from 'react';
import { Calendar, Download, BarChart3, TrendingUp, Filter } from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface ChartData {
  time: string;
  value: number;
}

// Composant graphique simple
function SimpleChart({ data, title, unit, color }: {
  data: ChartData[];
  title: string;
  unit: string;
  color: string;
}) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
          {data[data.length - 1]?.value.toFixed(1)} {unit}
        </span>
      </div>
      
      <div className="relative h-32">
        <svg className="w-full h-full" viewBox="0 0 300 100">
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className={color.includes('blue') ? 'text-blue-200' : 
                                          color.includes('green') ? 'text-green-200' : 
                                          color.includes('yellow') ? 'text-yellow-200' : 'text-red-200'} 
                    stopOpacity="0.8" />
              <stop offset="100%" className={color.includes('blue') ? 'text-blue-200' : 
                                            color.includes('green') ? 'text-green-200' : 
                                            color.includes('yellow') ? 'text-yellow-200' : 'text-red-200'} 
                    stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          <polyline
            fill="none"
            stroke={color.includes('blue') ? '#3B82F6' : 
                    color.includes('green') ? '#10B981' : 
                    color.includes('yellow') ? '#F59E0B' : '#EF4444'}
            strokeWidth="2"
            points={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 280 + 10;
              const y = 90 - ((point.value - minValue) / range) * 80;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          <polygon
            fill={`url(#gradient-${title})`}
            points={`10,90 ${data.map((point, index) => {
              const x = (index / (data.length - 1)) * 280 + 10;
              const y = 90 - ((point.value - minValue) / range) * 80;
              return `${x},${y}`;
            }).join(' ')} 290,90`}
          />
        </svg>
      </div>
      
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>{data[0]?.time}</span>
        <span>{data[data.length - 1]?.time}</span>
      </div>
    </div>
  );
}

export default function History() {
  const { sensors } = useData();
  const [selectedSensor, setSelectedSensor] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('24h');

  // Générer des données historiques simulées
  const generateHistoricalData = (sensor: any, hours: number): ChartData[] => {
    const data: ChartData[] = [];
    const now = new Date();
    
    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseValue = sensor.value;
      const variation = (Math.random() - 0.5) * 4;
      data.push({
        time: time.toLocaleTimeString(),
        value: Math.max(0, baseValue + variation)
      });
    }
    
    return data;
  };

  const getHoursFromRange = (range: string) => {
    switch (range) {
      case '1h': return 1;
      case '6h': return 6;
      case '24h': return 24;
      case '7d': return 168;
      case '30d': return 720;
      default: return 24;
    }
  };

  const exportData = () => {
    const hours = getHoursFromRange(dateRange);
    let csvContent = "Capteur,Heure,Valeur,Unité\n";
    
    const sensorsToExport = selectedSensor === 'all' ? sensors : sensors.filter(s => s.id === selectedSensor);
    
    sensorsToExport.forEach(sensor => {
      const data = generateHistoricalData(sensor, hours);
      data.forEach(point => {
        csvContent += `${sensor.name},${point.time},${point.value.toFixed(2)},${sensor.unit}\n`;
      });
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historique_capteurs_${dateRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getChartColor = (type: string) => {
    switch (type) {
      case 'temperature': return 'bg-blue-100 text-blue-700';
      case 'humidity': return 'bg-green-100 text-green-700';
      case 'co2': return 'bg-red-100 text-red-700';
      case 'light': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const hours = getHoursFromRange(dateRange);
  const sensorsToDisplay = selectedSensor === 'all' ? sensors : sensors.filter(s => s.id === selectedSensor);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Historique des Données</h1>
        <p className="text-gray-600 mt-2">Analysez l'évolution de vos mesures dans le temps</p>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedSensor}
                onChange={(e) => setSelectedSensor(e.target.value)}
              >
                <option value="all">Tous les capteurs</option>
                {sensors.map(sensor => (
                  <option key={sensor.id} value={sensor.id}>{sensor.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="1h">Dernière heure</option>
                <option value="6h">6 dernières heures</option>
                <option value="24h">24 dernières heures</option>
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
              </select>
            </div>
          </div>

          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="h-5 w-5" />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Capteurs analysés</p>
              <p className="text-2xl font-bold text-gray-900">{sensorsToDisplay.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Points de données</p>
              <p className="text-2xl font-bold text-gray-900">{hours * sensorsToDisplay.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Période</p>
              <p className="text-lg font-bold text-gray-900">
                {dateRange === '1h' ? '1 heure' :
                 dateRange === '6h' ? '6 heures' :
                 dateRange === '24h' ? '24 heures' :
                 dateRange === '7d' ? '7 jours' : '30 jours'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Download className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Export disponible</p>
              <p className="text-lg font-bold text-gray-900">CSV</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sensorsToDisplay.map(sensor => (
          <SimpleChart
            key={sensor.id}
            data={generateHistoricalData(sensor, hours)}
            title={`${sensor.name} (${sensor.room})`}
            unit={sensor.unit}
            color={getChartColor(sensor.type)}
          />
        ))}
      </div>

      {sensorsToDisplay.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune donnée à afficher</h3>
          <p className="mt-1 text-sm text-gray-500">
            Sélectionnez un capteur pour voir son historique.
          </p>
        </div>
      )}
    </div>
  );
}