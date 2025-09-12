import { useState, useEffect } from 'react';
import { 
  Camera, 
  Play, 
  Pause, 
  Square, 
  Maximize2, 
  Minimize2,
  Settings, 
  Wifi, 
  WifiOff,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  RotateCcw,
  Download,
  AlertCircle,
  X,
  Save,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

interface CameraFeed {
  id: string;
  name: string;
  room: string;
  floor: string;
  status: 'online' | 'offline' | 'recording' | 'error';
  lastSeen: string;
  resolution: string;
  type: 'indoor' | 'outdoor' | 'dome' | 'ptz';
  isRecording: boolean;
  thumbnail: string;
  settings?: {
    brightness: number;
    contrast: number;
    saturation: number;
    volume: number;
    motionDetection: boolean;
    nightVision: boolean;
    recordingQuality: 'low' | 'medium' | 'high';
    recordingDuration: number;
  };
}

interface CameraSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  camera: CameraFeed | null;
  onSave: (settings: any) => void;
}

// Camera Settings Modal Component
function CameraSettingsModal({ isOpen, onClose, camera, onSave }: CameraSettingsModalProps) {
  const [settings, setSettings] = useState({
    brightness: 50,
    contrast: 50,
    saturation: 50,
    volume: 50,
    motionDetection: true,
    nightVision: false,
    recordingQuality: 'high' as 'low' | 'medium' | 'high',
    recordingDuration: 24
  });

  useEffect(() => {
    if (camera?.settings) {
      setSettings(camera.settings);
    }
  }, [camera]);

  if (!isOpen || !camera) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Paramètres - {camera.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Video Settings */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Paramètres vidéo</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Luminosité: {settings.brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.brightness}
                  onChange={(e) => setSettings({...settings, brightness: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraste: {settings.contrast}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.contrast}
                  onChange={(e) => setSettings({...settings, contrast: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saturation: {settings.saturation}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.saturation}
                  onChange={(e) => setSettings({...settings, saturation: parseInt(e.target.value)})}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Paramètres audio</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volume: {settings.volume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.volume}
                onChange={(e) => setSettings({...settings, volume: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>

          {/* Recording Settings */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Paramètres d'enregistrement</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualité d'enregistrement
                </label>
                <select
                  value={settings.recordingQuality}
                  onChange={(e) => setSettings({...settings, recordingQuality: e.target.value as 'low' | 'medium' | 'high'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Faible (720p)</option>
                  <option value="medium">Moyenne (1080p)</option>
                  <option value="high">Élevée (4K)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée d'enregistrement (heures)
                </label>
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={settings.recordingDuration}
                  onChange={(e) => setSettings({...settings, recordingDuration: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Paramètres avancés</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.motionDetection}
                  onChange={(e) => setSettings({...settings, motionDetection: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Détection de mouvement</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.nightVision}
                  onChange={(e) => setSettings({...settings, nightVision: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Vision nocturne</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Enregistrer</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Mock camera data
const mockCameras: CameraFeed[] = [
  {
    id: 'cam-001',
    name: 'Caméra Entrée Principale',
    room: 'Entrée',
    floor: 'RDC',
    status: 'online',
    lastSeen: '2024-01-15T10:30:00Z',
    resolution: '1920x1080',
    type: 'dome',
    isRecording: true,
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'cam-002',
    name: 'Caméra Bureau 1',
    room: 'Bureau 1',
    floor: '1er étage',
    status: 'online',
    lastSeen: '2024-01-15T10:29:00Z',
    resolution: '1920x1080',
    type: 'indoor',
    isRecording: false,
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'cam-003',
    name: 'Caméra Parking',
    room: 'Parking',
    floor: 'Sous-sol',
    status: 'recording',
    lastSeen: '2024-01-15T10:28:00Z',
    resolution: '1920x1080',
    type: 'outdoor',
    isRecording: true,
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'cam-004',
    name: 'Caméra Salle de Réunion',
    room: 'Salle de Réunion',
    floor: '2ème étage',
    status: 'online',
    lastSeen: '2024-01-15T10:31:00Z',
    resolution: '1920x1080',
    type: 'ptz',
    isRecording: false,
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'cam-005',
    name: 'Caméra Cafétéria',
    room: 'Cafétéria',
    floor: 'RDC',
    status: 'offline',
    lastSeen: '2024-01-15T09:45:00Z',
    resolution: '1920x1080',
    type: 'indoor',
    isRecording: false,
    thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 'cam-006',
    name: 'Caméra Couloir Principal',
    room: 'Couloir Principal',
    floor: '1er étage',
    status: 'error',
    lastSeen: '2024-01-15T08:20:00Z',
    resolution: '1920x1080',
    type: 'dome',
    isRecording: false,
    thumbnail: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop&crop=center'
  }
];

function CameraCard({ 
  camera, 
  isSelected, 
  onSelect, 
  isCompact = false 
}: { 
  camera: CameraFeed; 
  isSelected: boolean; 
  onSelect: () => void;
  isCompact?: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'recording': return 'text-red-600 bg-red-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi className="h-3 w-3" />;
      case 'recording': return <Square className="h-3 w-3" />;
      case 'offline': return <WifiOff className="h-3 w-3" />;
      case 'error': return <AlertCircle className="h-3 w-3" />;
      default: return <WifiOff className="h-3 w-3" />;
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays}j`;
  };

  if (isCompact) {
    return (
      <button
        onClick={onSelect}
        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
          isSelected 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={camera.thumbnail}
              alt={camera.name}
              className="w-12 h-9 object-cover rounded"
            />
            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center ${getStatusColor(camera.status)}`}>
              {getStatusIcon(camera.status)}
            </div>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-gray-900 truncate">{camera.name}</p>
            <p className="text-xs text-gray-500">{camera.room}</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        <img
          src={camera.thumbnail}
          alt={camera.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium ${getStatusColor(camera.status)}`}>
            {getStatusIcon(camera.status)}
            <span className="capitalize">{camera.status}</span>
          </div>
          {camera.isRecording && (
            <div className="px-2 py-1 bg-red-600 text-white rounded-full text-xs font-medium flex items-center space-x-1">
              <Square className="h-3 w-3" />
              <span>REC</span>
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <button className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-colors">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{camera.name}</h3>
          <span className="text-xs text-gray-500">{camera.resolution}</span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{camera.room} - {camera.floor}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatLastSeen(camera.lastSeen)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 capitalize">{camera.type}</span>
          <button
            onClick={onSelect}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir
          </button>
        </div>
      </div>
    </div>
  );
}

function CameraControls({ 
  camera, 
  onSettingsClick, 
  onFullscreen, 
  isFullscreen = false 
}: { 
  camera: CameraFeed; 
  onSettingsClick: () => void;
  onFullscreen: () => void;
  isFullscreen?: boolean;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    onFullscreen();
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 rounded-lg p-3">
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          
          <button className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors" title="Enregistrer">
            <Square className="h-4 w-4" />
          </button>
          
          <button className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors" title="Screenshot">
            <Camera className="h-4 w-4" />
          </button>
        </div>

        {/* Center Controls - PTZ for PTZ cameras */}
        {camera.type === 'ptz' && (
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors" title="Pan Left">
              <Move className="h-4 w-4 rotate-90" />
            </button>
            <button className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors" title="Pan Right">
              <Move className="h-4 w-4 -rotate-90" />
            </button>
            <button className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors" title="Tilt Up">
              <Move className="h-4 w-4" />
            </button>
            <button className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors" title="Tilt Down">
              <Move className="h-4 w-4 rotate-180" />
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          
          <span className="text-white text-sm px-2 py-1 bg-white bg-opacity-20 rounded">
            {zoomLevel}%
          </span>
          
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleResetZoom}
            className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        
        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          
          <button className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors" title="Download">
            <Download className="h-4 w-4" />
          </button>
          
          <button
            onClick={onSettingsClick}
            className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleFullscreen}
            className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Surveillance() {
  const { rooms } = useData();
  const [cameras, setCameras] = useState<CameraFeed[]>(mockCameras);
  const [selectedCamera, setSelectedCamera] = useState<CameraFeed | null>(cameras[0] || null);
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get unique rooms from cameras
  const cameraRooms = Array.from(new Set(cameras.map(cam => cam.room)));

  // Filter cameras by selected room
  const filteredCameras = selectedRoom === 'all' 
    ? cameras 
    : cameras.filter(camera => camera.room === selectedRoom);

  // Get status counts
  const statusCounts = {
    online: cameras.filter(c => c.status === 'online').length,
    recording: cameras.filter(c => c.status === 'recording').length,
    offline: cameras.filter(c => c.status === 'offline').length,
    error: cameras.filter(c => c.status === 'error').length,
  };

  // Settings handler
  const handleSaveSettings = (settings: any) => {
    if (selectedCamera) {
      setCameras(prev => prev.map(cam => 
        cam.id === selectedCamera.id 
          ? { ...cam, settings: { ...cam.settings, ...settings } }
          : cam
      ));
      setSelectedCamera(prev => prev ? { ...prev, settings: { ...prev.settings, ...settings } } : null);
    }
  };

  // Fullscreen handler
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Surveillance</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <EyeOff className="h-5 w-5" />
              </button>
            </div>
            
            {/* Status Overview */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-green-50 p-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">{statusCounts.online}</span>
                </div>
                <p className="text-xs text-green-600">En ligne</p>
              </div>
              <div className="bg-red-50 p-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <Square className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700">{statusCounts.recording}</span>
                </div>
                <p className="text-xs text-red-600">Enregistrement</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <WifiOff className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{statusCounts.offline}</span>
                </div>
                <p className="text-xs text-gray-600">Hors ligne</p>
              </div>
              <div className="bg-orange-50 p-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">{statusCounts.error}</span>
                </div>
                <p className="text-xs text-orange-600">Erreur</p>
              </div>
            </div>

            {/* Room Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par salle</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes les salles</option>
                {cameraRooms.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Liste
              </button>
            </div>
          </div>

          {/* Camera List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredCameras.map(camera => (
                <CameraCard
                  key={camera.id}
                  camera={camera}
                  isSelected={selectedCamera?.id === camera.id}
                  onSelect={() => setSelectedCamera(camera)}
                  isCompact={viewMode === 'list'}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!showSidebar && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Eye className="h-5 w-5" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {selectedCamera ? selectedCamera.name : 'Sélectionnez une caméra'}
                </h1>
                {selectedCamera && (
                  <p className="text-sm text-gray-500">
                    {selectedCamera.room} - {selectedCamera.floor}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">
                {filteredCameras.length} caméra{filteredCameras.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Camera Feed */}
        <div className={`flex-1 bg-black relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
          {selectedCamera ? (
            <div className="relative w-full h-full">
              <img
                src={selectedCamera.thumbnail}
                alt={selectedCamera.name}
                className="w-full h-full object-contain"
              />
              <CameraControls 
                camera={selectedCamera} 
                onSettingsClick={() => setIsSettingsOpen(true)}
                onFullscreen={handleFullscreen}
                isFullscreen={isFullscreen}
              />
              
              {/* Camera Info Overlay */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Camera className="h-4 w-4" />
                  <span className="font-medium">{selectedCamera.name}</span>
                </div>
                <div className="text-sm text-gray-300">
                  {selectedCamera.resolution} • {selectedCamera.type}
                </div>
                {selectedCamera.settings && (
                  <div className="text-xs text-gray-400 mt-1">
                    Luminosité: {selectedCamera.settings.brightness}% • 
                    Contraste: {selectedCamera.settings.contrast}% • 
                    Volume: {selectedCamera.settings.volume}%
                  </div>
                )}
              </div>

              {/* Fullscreen Exit Button */}
              {isFullscreen && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleFullscreen}
                    className="p-2 bg-black bg-opacity-75 text-white rounded-lg hover:bg-opacity-90 transition-colors"
                    title="Exit Fullscreen"
                  >
                    <Minimize2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune caméra sélectionnée</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Sélectionnez une caméra dans la liste pour voir le flux vidéo.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      <CameraSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        camera={selectedCamera}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
