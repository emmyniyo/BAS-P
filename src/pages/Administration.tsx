import React, { useEffect, useState } from 'react';
import { Plus, Building, Scissors as Sensors, Settings, Users, Save, X, Edit2 } from 'lucide-react';
import { useData, Room, Sensor, Equipment, User } from '../contexts/DataContext';



/** =========================
 *  Modals – Users
 *  ========================= */
function AddUserModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { firstname: string; lastname: string, email: string; role: string; password: string }) => void;
}) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "user",
    password: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({ firstname: "", lastname: "", email: "", role: "user", password: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // backend hash
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Ajouter un Utilisateur</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom d'utilisateur first name</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={formData.firstname}
              onChange={(e) => setFormData((p) => ({ ...p, firstname: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom d'utilisateur last name</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={formData.lastname}
              onChange={(e) => setFormData((p) => ({ ...p, lastname: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border px-3 py-2"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Rôle</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={formData.role}
              onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2"
              value={formData.password}
              onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">
              Annuler
            </button>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditUserModal({
  isOpen,
  onClose,
  onSubmit,
  initial,
}: {
  isOpen: boolean;
  onClose: () => void;
    onSubmit: (data: { firstname: string; lastname: string; email: string; role: string; password?: string }) => void;
  initial: User | null;
}) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "user",
    password: "",
  });

  useEffect(() => {
    if (initial) {
      setFormData({
        firstname: initial.firstname,
        lastname: initial.lastname,
        email: initial.email,
        role: initial.role,
        password: "",
      });
    }
  }, [initial]);

  if (!isOpen || !initial) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: { firstname: string; lastname: string; email: string; role: string; password?: string } = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      role: formData.role,
    };
    if (formData.password.trim()) payload.password = formData.password; // sinon backend ne change pas
    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Modifier l’Utilisateur</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom d'utilisateu firstnamer</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={formData.firstname}
              onChange={(e) => setFormData((p) => ({ ...p, firstname: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nom d'utilisateur last name</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={formData.lastname}
              onChange={(e) => setFormData((p) => ({ ...p, lastname: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border px-3 py-2"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Rôle</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={formData.role}
              onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mot de passe (laisser vide pour ne pas changer)
            </label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2"
              value={formData.password}
              onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">
              Annuler
            </button>
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (room: Omit<Room, 'id'>) => void;
}

function AddRoomModal({ isOpen, onClose, onSubmit }: AddRoomModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    floor: '',
    area: 0,
    sensors: [] as string[],
    equipment: [] as string[]
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      floor: '',
      area: 0,
      sensors: [],
      equipment: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ajouter une Salle</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la salle
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Étage
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surface (m²)
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) })}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AddSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sensor: Sensor) => void;
  rooms: Room[];
}

function AddSensorModal({ isOpen, onClose, onSubmit, rooms }: AddSensorModalProps) {
  const [formData, setFormData] = useState( {
    name: '',
    type: 'temperature',
    room: '',
    floor: '',
    value: 0,
    unit: '°C',
    status: 'active' as const,
    minThreshold: undefined as number | undefined,
    maxThreshold: undefined as number | undefined
  });

  if (!isOpen) return null;

  const sensorTypes = [
    { value: 'temperature', label: 'Température', unit: '°C' },
    { value: 'humidity', label: 'Humidité', unit: '%' },
    { value: 'co2', label: 'CO₂', unit: 'ppm' },
    { value: 'light', label: 'Luminosité', unit: 'lux' },
    { value: 'noise', label: 'Bruit', unit: 'dB' },
    { value: 'pressure', label: 'Pression', unit: 'hPa' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Sensor);


    // setFormData({
    //   name: '',
    //   type: 'temperature',
    //   room: '',
    //   floor: '',
    //   value: 0,
    //   unit: '°C',
    //   status: 'active',
    //   minThreshold: undefined,
    //   maxThreshold: undefined
    // });
    onClose();
  };

  const selectedType = sensorTypes.find(t => t.value === formData.type);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ajouter un Capteur</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du capteur
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de capteur
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.type}
              onChange={(e) => {
                const selectedType = sensorTypes.find(t => t.value === e.target.value);
                setFormData({
                  ...formData,
                  type: e.target.value,
                  unit: selectedType?.unit || ''
                });
              }}
            >
              {sensorTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salle
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.room}
              onChange={(e) => {
                const selectedRoom = rooms.find(r => r.name === e.target.value);
                setFormData({
                  ...formData,
                  room: e.target.value,
                  floor: selectedRoom?.floor || ''
                });
              }}
            >
              <option value="">Sélectionner une salle</option>
              {rooms.map(room => (
                <option key={room.id} value={room.name}>{room.name} ({room.floor})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seuil min ({selectedType?.unit})
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.minThreshold || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  minThreshold: e.target.value ? parseFloat(e.target.value) : undefined
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seuil max ({selectedType?.unit})
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.maxThreshold || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  maxThreshold: e.target.value ? parseFloat(e.target.value) : undefined
                })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Administration() {
  const { users, rooms, sensors, equipment, addRoom, addSensor, addEquipment, createUser, updateUser, deleteUser } = useData();
  const [activeTab, setActiveTab] = useState<'rooms' | 'sensors' | 'equipment' | 'users'>('rooms');
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isAddSensorModalOpen, setIsAddSensorModalOpen] = useState(false);

  /** Users Modals */
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userBeingEdited, setUserBeingEdited] = useState<User | null>(null);

  const tabs = [
    { id: 'rooms', label: 'Salles', icon: Building },
    { id: 'sensors', label: 'Capteurs', icon: Sensors },
    { id: 'equipment', label: 'Équipements', icon: Settings },
    { id: 'users', label: 'Utilisateurs', icon: Users }
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-600 mt-2">Gérez la configuration de votre système</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Gestion des Salles</h2>
                <button
                  onClick={() => setIsAddRoomModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5" />
                  <span>Ajouter une salle</span>
                </button>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => {
                  // ✅ Normalize sensors
                  let sensorsArray = [];
                  if (Array.isArray(room.sensors)) {
                    sensorsArray = room.sensors;
                  } else if (typeof room.sensors === "string") {
                    try {
                      sensorsArray = JSON.parse(room.sensors);
                    } catch (e) {
                      sensorsArray = [];
                    }
                  }

                  // ✅ Normalize equipment
                  let equipmentArray = [];
                  if (Array.isArray(room.equipment)) {
                    equipmentArray = room.equipment;
                  } else if (typeof room.equipment === "string") {
                    try {
                      equipmentArray = JSON.parse(room.equipment);
                    } catch (e) {
                      equipmentArray = [];
                    }
                  }

                  return (
                    <div
                      key={room.id}
                      className="bg-gray-50 p-6 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{room.name}</h3>
                          <p className="text-sm text-gray-600">{room.floor}</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div>Surface: {room.area} m²</div>
                        <div>Capteurs: {sensorsArray.length}</div>
                        <div>Équipements: {equipmentArray.length}</div>
                      </div>
                    </div>
                  );
                })}


              </div>

            </div>
          )}

          {/* Sensors Tab */}
          {activeTab === 'sensors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Gestion des Capteurs</h2>
                <button
                  onClick={() => setIsAddSensorModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5" />
                  <span>Ajouter un capteur</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capteur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localisation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valeur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sensors.map((sensor) => (
                      <tr key={sensor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{sensor.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{sensor.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{sensor.room}</div>
                          <div className="text-sm text-gray-500">{sensor.floor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {sensor?.value?.toFixed(1)} {sensor?.unit}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${sensor.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : sensor.status === 'inactive'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {sensor.status === 'active' ? 'Actif' :
                              sensor.status === 'inactive' ? 'Inactif' : 'Erreur'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Modifier
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Equipment Tab */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Gestion des Équipements</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Plus className="h-5 w-5" />
                  <span>Ajouter un équipement</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Équipement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localisation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contrôlable
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {equipment.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{item.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.room}</div>
                          <div className="text-sm text-gray-500">{item.floor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'on'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {item.status === 'on' ? 'ON' : 'OFF'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.controllable
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {item.controllable ? 'Oui' : 'Non'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            Modifier
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Gestion des Utilisateurs</h2>
                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5" />
                  <span>Ajouter un utilisateur</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Créé le
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="whitespace-nowrap px-6 py-4">{u.firstname}  {u.lastname}</td>
                        <td className="whitespace-nowrap px-6 py-4">{u.email}</td>
                        <td className="whitespace-nowrap px-6 py-4">{u.role}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {u.created_at ? new Date(u.created_at).toLocaleString() : "—"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                          <button
                            className="mr-3 text-blue-600 hover:text-blue-900"
                            onClick={() => {
                              setUserBeingEdited(u);
                              setIsEditUserModalOpen(true);
                            }}
                          >
                            Modifier
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900" onClick={() => deleteUser(u.id)}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Modals */}
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onSubmit={addRoom}
      />

      <AddSensorModal
        isOpen={isAddSensorModalOpen}
        onClose={() => setIsAddSensorModalOpen(false)}
        onSubmit={addSensor}
        rooms={rooms}
      />

      {/* Users */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={(data: any) => createUser(data.firstname, data.lastname, data.email, data.role, data.password)}
      />
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setUserBeingEdited(null);
        }}
        onSubmit={(data: any) => userBeingEdited && updateUser(userBeingEdited.id, data.firstname, data.lastname, data.email, data.role, data.password)}
        initial={userBeingEdited}
      />
    </div>
  );
}