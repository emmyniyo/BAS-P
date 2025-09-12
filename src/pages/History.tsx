import { useState, useMemo } from 'react';
import { Calendar, Download, BarChart3, TrendingUp, Filter, Activity } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

interface ChartData {
  time: string;
  value: number;
  timestamp: number;
}

// Enhanced chart component with Chart.js
function ProfessionalChart({ 
  data, 
  title, 
  unit, 
  type, 
  sensorType,
  showTrend = true 
}: {
  data: ChartData[];
  title: string;
  unit: string;
  type: 'line' | 'bar';
  sensorType: string;
  showTrend?: boolean;
}) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const avgValue = data.reduce((sum, d) => sum + d.value, 0) / data.length;

  // Calculate trend
  const trend = useMemo(() => {
    if (data.length < 2) return 0;
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.value, 0) / secondHalf.length;
    return ((secondAvg - firstAvg) / firstAvg) * 100;
  }, [data]);

  const getColorScheme = (sensorType: string) => {
    switch (sensorType) {
      case 'temperature':
        return {
          primary: '#3B82F6',
          secondary: '#60A5FA',
          gradient: 'rgba(59, 130, 246, 0.1)',
          border: '#3B82F6',
          background: 'rgba(59, 130, 246, 0.05)'
        };
      case 'humidity':
        return {
          primary: '#10B981',
          secondary: '#34D399',
          gradient: 'rgba(16, 185, 129, 0.1)',
          border: '#10B981',
          background: 'rgba(16, 185, 129, 0.05)'
        };
      case 'co2':
        return {
          primary: '#EF4444',
          secondary: '#F87171',
          gradient: 'rgba(239, 68, 68, 0.1)',
          border: '#EF4444',
          background: 'rgba(239, 68, 68, 0.05)'
        };
      case 'light':
        return {
          primary: '#F59E0B',
          secondary: '#FBBF24',
          gradient: 'rgba(245, 158, 11, 0.1)',
          border: '#F59E0B',
          background: 'rgba(245, 158, 11, 0.05)'
        };
      case 'noise':
        return {
          primary: '#8B5CF6',
          secondary: '#A78BFA',
          gradient: 'rgba(139, 92, 246, 0.1)',
          border: '#8B5CF6',
          background: 'rgba(139, 92, 246, 0.05)'
        };
      case 'pressure':
        return {
          primary: '#06B6D4',
          secondary: '#22D3EE',
          gradient: 'rgba(6, 182, 212, 0.1)',
          border: '#06B6D4',
          background: 'rgba(6, 182, 212, 0.05)'
        };
      default:
        return {
          primary: '#6B7280',
          secondary: '#9CA3AF',
          gradient: 'rgba(107, 114, 128, 0.1)',
          border: '#6B7280',
          background: 'rgba(107, 114, 128, 0.05)'
        };
    }
  };

  const colors = getColorScheme(sensorType);

  const chartData = {
    labels: data.map(d => d.time),
    datasets: [
      {
        label: `${title} (${unit})`,
        data: data.map(d => d.value),
        borderColor: colors.border,
        backgroundColor: type === 'line' ? colors.gradient : colors.primary,
        borderWidth: 3,
        fill: type === 'line',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: colors.primary,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: colors.border,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            return `${title} - ${context[0].label}`;
          },
          label: (context: any) => {
            return `${context.parsed.y.toFixed(2)} ${unit}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          maxTicksLimit: 8
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          callback: function(value: any) {
            return `${value} ${unit}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Header with stats */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 capitalize">{sensorType.replace('_', ' ')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-2xl font-bold" style={{ color: colors.primary }}>
              {data[data.length - 1]?.value.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">{unit}</p>
          </div>
          {showTrend && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend > 0 ? 'bg-red-100 text-red-700' : 
              trend < 0 ? 'bg-green-100 text-green-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              <TrendingUp className={`h-3 w-3 ${trend < 0 ? 'rotate-180' : ''}`} />
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-4">
        {type === 'line' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-xs text-gray-500">Min</p>
          <p className="text-sm font-semibold text-gray-900">{minValue.toFixed(1)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Moyenne</p>
          <p className="text-sm font-semibold text-gray-900">{avgValue.toFixed(1)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Max</p>
          <p className="text-sm font-semibold text-gray-900">{maxValue.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}

// Overview chart showing all sensors
function OverviewChart({ sensors, data, dateRange }: {
  sensors: any[];
  data: { [key: string]: ChartData[] };
  dateRange: string;
}) {
  const colors = [
    '#3B82F6', '#10B981', '#EF4444', '#F59E0B', 
    '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16'
  ];

  const chartData = {
    labels: data[sensors[0]?.id]?.map(d => d.time) || [],
    datasets: sensors.map((sensor, index) => ({
      label: sensor.name,
      data: data[sensor.id]?.map(d => d.value) || [],
      borderColor: colors[index % colors.length],
      backgroundColor: `${colors[index % colors.length]}20`,
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: (context: any) => {
            return `Données - ${context[0].label}`;
          },
          label: (context: any) => {
            const sensor = sensors.find(s => s.name === context.dataset.label);
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} ${sensor?.unit || ''}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          maxTicksLimit: 8
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Vue d'ensemble des capteurs</h3>
          <p className="text-sm text-gray-500">Comparaison de tous les capteurs sur {dateRange}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">{sensors.length} capteurs</span>
        </div>
      </div>
      
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default function History() {
  const { sensors } = useData();
  const [selectedSensor, setSelectedSensor] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('24h');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [showOverview, setShowOverview] = useState<boolean>(true);

  // Generate realistic historical data
  const generateHistoricalData = (sensor: any, hours: number): ChartData[] => {
    const data: ChartData[] = [];
    const now = new Date();
    const baseValue = sensor.value;
    
    for (let i = hours; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourOfDay = time.getHours();
      
      // Add realistic patterns based on sensor type and time
      let variation = 0;
      switch (sensor.type) {
        case 'temperature':
          // Temperature varies with time of day
          variation = Math.sin((hourOfDay - 6) * Math.PI / 12) * 3 + (Math.random() - 0.5) * 2;
          break;
        case 'humidity':
          // Humidity is more stable
          variation = (Math.random() - 0.5) * 5;
          break;
        case 'co2':
          // CO2 increases during business hours
          variation = hourOfDay >= 9 && hourOfDay <= 17 ? (Math.random() * 20) : (Math.random() - 0.5) * 10;
          break;
        case 'light':
          // Light follows day/night cycle
          variation = hourOfDay >= 6 && hourOfDay <= 18 ? Math.random() * 100 : (Math.random() - 0.5) * 10;
          break;
        default:
          variation = (Math.random() - 0.5) * 4;
      }
      
      data.push({
        time: time.toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        value: Math.max(0, baseValue + variation),
        timestamp: time.getTime()
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
    let csvContent = "Capteur,Heure,Valeur,Unité,Type\n";
    
    const sensorsToExport = selectedSensor === 'all' ? sensors : sensors.filter(s => s.id === selectedSensor);
    
    sensorsToExport.forEach(sensor => {
      const data = generateHistoricalData(sensor, hours);
      data.forEach(point => {
        csvContent += `${sensor.name},${point.time},${point.value.toFixed(2)},${sensor.unit},${sensor.type}\n`;
      });
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historique_capteurs_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const hours = getHoursFromRange(dateRange);
  const sensorsToDisplay = selectedSensor === 'all' ? sensors : sensors.filter(s => s.id === selectedSensor);
  
  // Generate data for all sensors
  const allSensorData = useMemo(() => {
    const data: { [key: string]: ChartData[] } = {};
    sensors.forEach(sensor => {
      data[sensor.id] = generateHistoricalData(sensor, hours);
    });
    return data;
  }, [sensors, hours]);

  // Calculate summary statistics
  const totalDataPoints = hours * sensorsToDisplay.length;
  const activeSensors = sensorsToDisplay.filter(s => s.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Historique des Données</h1>
        <p className="text-gray-600 mt-2">Analysez l'évolution de vos mesures dans le temps</p>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <Activity className="h-4 w-4" />
            <span>Données en temps réel</span>
          </div>
        </div>
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

            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-gray-400" />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'line' | 'bar')}
              >
                <option value="line">Ligne</option>
                <option value="bar">Barres</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowOverview(!showOverview)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                showOverview 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vue d'ensemble
            </button>
          <button
            onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="h-5 w-5" />
            <span>Exporter CSV</span>
          </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700">Capteurs analysés</p>
              <p className="text-2xl font-bold text-blue-900">{sensorsToDisplay.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-sm border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700">Points de données</p>
              <p className="text-2xl font-bold text-green-900">{totalDataPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-sm border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-700">Capteurs actifs</p>
              <p className="text-2xl font-bold text-purple-900">{activeSensors}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-sm border border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500 rounded-lg">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-orange-700">Période</p>
              <p className="text-lg font-bold text-orange-900">
                {dateRange === '1h' ? '1 heure' :
                 dateRange === '6h' ? '6 heures' :
                 dateRange === '24h' ? '24 heures' :
                 dateRange === '7d' ? '7 jours' : '30 jours'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Chart */}
      {showOverview && sensorsToDisplay.length > 1 && (
        <OverviewChart 
          sensors={sensorsToDisplay} 
          data={allSensorData} 
          dateRange={dateRange} 
        />
      )}

      {/* Individual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sensorsToDisplay.map(sensor => (
          <ProfessionalChart
            key={sensor.id}
            data={allSensorData[sensor.id] || []}
            title={`${sensor.name} (${sensor.room})`}
            unit={sensor.unit}
            type={chartType}
            sensorType={sensor.type}
            showTrend={true}
          />
        ))}
      </div>

      {sensorsToDisplay.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
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