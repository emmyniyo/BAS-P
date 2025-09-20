import React, { useEffect, useState } from 'react';
import { Plus, Building, Scissors as Sensors, Settings, Users, X, Edit2, AlertTriangle } from 'lucide-react';
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Entrez le prénom"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={formData.firstname}
                onChange={(e) => setFormData((p) => ({ ...p, firstname: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Entrez le nom de famille"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={formData.lastname}
                onChange={(e) => setFormData((p) => ({ ...p, lastname: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="exemple@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={formData.role}
              onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Minimum 8 caractères"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={formData.password}
              onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
              required
              minLength={8}
            />
            <p className="text-xs text-gray-500 mt-1">Le mot de passe doit contenir au moins 8 caractères</p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Ajouter l'utilisateur
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Entrez le prénom"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={formData.firstname}
                onChange={(e) => setFormData((p) => ({ ...p, firstname: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Entrez le nom de famille"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                value={formData.lastname}
                onChange={(e) => setFormData((p) => ({ ...p, lastname: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="exemple@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={formData.role}
              onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              placeholder="Laisser vide pour conserver le mot de passe actuel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              value={formData.password}
              onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
              minLength={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.password ? 'Le mot de passe doit contenir au moins 8 caractères' : 'Laissez vide pour ne pas modifier le mot de passe'}
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Enregistrer les modifications
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

function EditRoomModal({ isOpen, onClose, onSubmit, initial }: EditRoomModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    floor: '',
    area: 0,
    sensors: [] as string[],
    equipment: [] as string[]
  });

  useEffect(() => {
    if (initial) {
      setFormData({
        name: initial.name,
        floor: initial.floor,
        area: initial.area,
        sensors: initial.sensors || [],
        equipment: initial.equipment || []
      });
    }
  }, [initial]);

  if (!isOpen || !initial) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Room);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Modifier la Salle</h3>
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
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  itemName, 
  type 
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'room': return <Building className="h-8 w-8 text-red-500" />;
      case 'sensor': return <Sensors className="h-8 w-8 text-red-500" />;
      case 'equipment': return <Settings className="h-8 w-8 text-red-500" />;
      case 'user': return <Users className="h-8 w-8 text-red-500" />;
      default: return <AlertTriangle className="h-8 w-8 text-red-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'room': return 'cette salle';
      case 'sensor': return 'ce capteur';
      case 'equipment': return 'cet équipement';
      case 'user': return 'cet utilisateur';
      default: return 'cet élément';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-center mb-4">
          {getIcon()}
        </div>
        
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">{message}</p>
          <p className="text-sm font-medium text-gray-900">
            <span className="font-semibold text-red-600">"{itemName}"</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Cette action ne peut pas être annulée.
          </p>
        </div>

        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Supprimer {getTypeLabel()}
          </button>
        </div>
      </div>
    </div>
  );
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

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (equipment: Omit<Equipment, 'id'>) => void;
  rooms: Room[];
}

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (room: Room) => void;
  initial: Room | null;
}

interface EditSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sensor: Omit<Sensor, 'id'>) => void;
  initial: Sensor | null;
  rooms: Room[];
}

interface EditEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (equipment: Equipment) => void;
  initial: Equipment | null;
  rooms: Room[];
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName: string;
  type: 'room' | 'sensor' | 'equipment' | 'user';
}

interface AddSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sensor: Sensor) => void;
  rooms: Room[];
}

function AddEquipmentModal({ isOpen, onClose, onSubmit, rooms }: AddEquipmentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'hvac',
    room: '',
    floor: '',
    status: 'off' as 'on' | 'off',
    controllable: true,
    value: undefined as number | undefined
  });

  if (!isOpen) return null;

  const equipmentTypes = [
    { value: 'hvac', label: 'Climatisation', hasValue: true, valueLabel: 'Température (°C)', valueRange: { min: 16, max: 28, step: 0.5 } },
    { value: 'lighting', label: 'Éclairage', hasValue: true, valueLabel: 'Intensité (%)', valueRange: { min: 0, max: 100, step: 5 } },
    { value: 'door', label: 'Porte', hasValue: false },
    { value: 'security', label: 'Sécurité', hasValue: false },
    { value: 'ventilation', label: 'Ventilation', hasValue: true, valueLabel: 'Vitesse (%)', valueRange: { min: 0, max: 100, step: 10 } },
    { value: 'other', label: 'Autre', hasValue: false }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const equipmentData = {
      ...formData,
      lastUpdate: new Date()
    };
    onSubmit(equipmentData);
    setFormData({
      name: '',
      type: 'hvac',
      room: '',
      floor: '',
      status: 'off',
      controllable: true,
      value: undefined
    });
    onClose();
  };

  const selectedType = equipmentTypes.find(t => t.value === formData.type);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Ajouter un Équipement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'équipement
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
              Type d'équipement
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.type}
              onChange={(e) => {
                const selectedType = equipmentTypes.find(t => t.value === e.target.value);
                setFormData({
                  ...formData,
                  type: e.target.value,
                  value: selectedType?.hasValue ? (selectedType.valueRange?.min || 0) : undefined
                });
              }}
            >
              {equipmentTypes.map(type => (
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

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="controllable"
              checked={formData.controllable}
              onChange={(e) => setFormData({ ...formData, controllable: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="controllable" className="text-sm font-medium text-gray-700">
              Équipement contrôlable
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="status"
              checked={formData.status === 'on'}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'on' : 'off' })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              État initial: Allumé
            </label>
          </div>

          {selectedType?.hasValue && selectedType.valueRange && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {selectedType.valueLabel}
              </label>
              <input
                type="number"
                min={selectedType.valueRange.min}
                max={selectedType.valueRange.max}
                step={selectedType.valueRange.step}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.value || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  value: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{selectedType.valueRange.min}</span>
                <span>{selectedType.valueRange.max}</span>
              </div>
            </div>
          )}

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

function EditEquipmentModal({ isOpen, onClose, onSubmit, initial, rooms }: EditEquipmentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'hvac',
    room: '',
    floor: '',
    status: 'off' as 'on' | 'off',
    controllable: true,
    value: undefined as number | undefined
  });

  useEffect(() => {
    if (initial) {
      setFormData({
        name: initial.name,
        type: initial.type,
        room: initial.room,
        floor: initial.floor,
        status: initial.status,
        controllable: initial.controllable,
        value: initial.value
      });
    }
  }, [initial]);

  if (!isOpen || !initial) return null;

  const equipmentTypes = [
    { value: 'hvac', label: 'Climatisation', hasValue: true, valueLabel: 'Température (°C)', valueRange: { min: 16, max: 28, step: 0.5 } },
    { value: 'lighting', label: 'Éclairage', hasValue: true, valueLabel: 'Intensité (%)', valueRange: { min: 0, max: 100, step: 5 } },
    { value: 'door', label: 'Porte', hasValue: false },
    { value: 'security', label: 'Sécurité', hasValue: false },
    { value: 'ventilation', label: 'Ventilation', hasValue: true, valueLabel: 'Vitesse (%)', valueRange: { min: 0, max: 100, step: 10 } },
    { value: 'other', label: 'Autre', hasValue: false }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const equipmentData = {
      ...formData,
      lastUpdate: new Date()
    };
    onSubmit(equipmentData as Equipment);
    onClose();
  };

  const selectedType = equipmentTypes.find(t => t.value === formData.type);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Modifier l'Équipement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'équipement
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
              Type d'équipement
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.type}
              onChange={(e) => {
                const selectedType = equipmentTypes.find(t => t.value === e.target.value);
                setFormData({
                  ...formData,
                  type: e.target.value,
                  value: selectedType?.hasValue ? (formData.value || selectedType.valueRange?.min || 0) : undefined
                });
              }}
            >
              {equipmentTypes.map(type => (
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

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="controllable"
              checked={formData.controllable}
              onChange={(e) => setFormData({ ...formData, controllable: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="controllable" className="text-sm font-medium text-gray-700">
              Équipement contrôlable
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="status"
              checked={formData.status === 'on'}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'on' : 'off' })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              État: Allumé
            </label>
          </div>

          {selectedType?.hasValue && selectedType.valueRange && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {selectedType.valueLabel}
              </label>
              <input
                type="number"
                min={selectedType.valueRange.min}
                max={selectedType.valueRange.max}
                step={selectedType.valueRange.step}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.value || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  value: e.target.value ? parseFloat(e.target.value) : undefined 
                })}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{selectedType.valueRange.min}</span>
                <span>{selectedType.valueRange.max}</span>
              </div>
            </div>
          )}

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
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditSensorModal({ isOpen, onClose, onSubmit, initial, rooms }: EditSensorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'temperature',
    room: '',
    floor: '',
    value: 0,
    unit: '°C',
    status: 'active' as 'active' | 'inactive' | 'error',
    minThreshold: undefined as number | undefined,
    maxThreshold: undefined as number | undefined
  });

  useEffect(() => {
    if (initial) {
      setFormData({
        name: initial.name,
        type: initial.type,
        room: initial.room,
        floor: initial.floor,
        value: initial.value,
        unit: initial.unit,
        status: initial.status,
        minThreshold: initial.minThreshold,
        maxThreshold: initial.maxThreshold
      });
    }
  }, [initial]);

  if (!isOpen || !initial) return null;

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
    onSubmit(formData as Omit<Sensor, 'id'>);
    onClose();
  };

  const selectedType = sensorTypes.find(t => t.value === formData.type);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Modifier le Capteur</h3>
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
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
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
  const { 
    users, 
    rooms, 
    sensors, 
    equipment, 
    addRoom, 
    updateRoom,
    addSensor, 
    addEquipmentData, 
    updateEquipmentData, 
    deleteEquipmentData, 
    createUser, 
    updateUser, 
    deleteUser,
    deleteRoom,
    deleteSensor
  } = useData();
  const [activeTab, setActiveTab] = useState<'rooms' | 'sensors' | 'equipment' | 'users'>('rooms');
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
  const [isAddSensorModalOpen, setIsAddSensorModalOpen] = useState(false);

  /** Room Modals */
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [roomBeingEdited, setRoomBeingEdited] = useState<Room | null>(null);

  /** Sensor Modals */
  const [isEditSensorModalOpen, setIsEditSensorModalOpen] = useState(false);
  const [sensorBeingEdited, setSensorBeingEdited] = useState<Sensor | null>(null);

  /** Equipment Modals */
  const [isAddEquipmentModalOpen, setIsAddEquipmentModalOpen] = useState(false);
  const [isEditEquipmentModalOpen, setIsEditEquipmentModalOpen] = useState(false);
  const [equipmentBeingEdited, setEquipmentBeingEdited] = useState<Equipment | null>(null);

  /** Users Modals */
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [userBeingEdited, setUserBeingEdited] = useState<User | null>(null);

  /** Delete Confirmation Modal */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
    type: 'room' | 'sensor' | 'equipment' | 'user';
  } | null>(null);

  const handleDeleteClick = (id: string, name: string, type: 'room' | 'sensor' | 'equipment' | 'user') => {
    setItemToDelete({ id, name, type });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    const id = parseInt(itemToDelete.id);

    switch (itemToDelete.type) {
      case 'room':
        deleteRoom(id);
        break;
      case 'sensor':
        deleteSensor(itemToDelete.id);
        break;
      case 'equipment':
        deleteEquipmentData(id);
        break;
      case 'user':
        deleteUser(itemToDelete.id);
        break;
    }
    
    setItemToDelete(null);
  };

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
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setRoomBeingEdited(room);
                              setIsEditRoomModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(room.id, room.name, 'room')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
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
                          <button 
                            onClick={() => {
                              setSensorBeingEdited(sensor);
                              setIsEditSensorModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(sensor.id, sensor.name, 'sensor')}
                            className="text-red-600 hover:text-red-900"
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

          {/* Equipment Tab */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Gestion des Équipements</h2>
                <button 
                  onClick={() => setIsAddEquipmentModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
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
                          <button 
                            onClick={() => {
                              setEquipmentBeingEdited(item);
                              setIsEditEquipmentModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(item.id.toString(), item.name, 'equipment')}
                            className="text-red-600 hover:text-red-900"
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
                            className="text-red-600 hover:text-red-900" 
                            onClick={() => handleDeleteClick(u.id, `${u.firstname} ${u.lastname}`, 'user')}
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
      <EditRoomModal
        isOpen={isEditRoomModalOpen}
        onClose={() => {
          setIsEditRoomModalOpen(false);
          setRoomBeingEdited(null);
        }}
        onSubmit={updateRoom}
        initial={roomBeingEdited}
      />

      <AddSensorModal
        isOpen={isAddSensorModalOpen}
        onClose={() => setIsAddSensorModalOpen(false)}
        onSubmit={addSensor}
        rooms={rooms}
      />

      {/* Edit Sensor Modal */}
      <EditSensorModal
        isOpen={isEditSensorModalOpen}
        onClose={() => {
          setIsEditSensorModalOpen(false);
          setSensorBeingEdited(null);
        }}
        onSubmit={(data: any) => {
          // For now, just log the data since we don't have an updateSensor function yet
          console.log('Sensor update data:', data);
        }}
        initial={sensorBeingEdited}
        rooms={rooms}
      />

      {/* Equipment Modals */}
      <AddEquipmentModal
        isOpen={isAddEquipmentModalOpen}
        onClose={() => setIsAddEquipmentModalOpen(false)}
        onSubmit={addEquipmentData}
        rooms={rooms}
      />

      {/* Edit Equipment Modal */}
      <EditEquipmentModal
        isOpen={isEditEquipmentModalOpen}
        onClose={() => {
          setIsEditEquipmentModalOpen(false);
          setEquipmentBeingEdited(null);
        }}
        onSubmit={updateEquipmentData}
        initial={equipmentBeingEdited}
        rooms={rooms}
      />

      {/* Users */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={(data: any) => createUser(data.firstname, data.lastname, data.email, data.role, data.password)}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setUserBeingEdited(null);
        }}
        onSubmit={(data: any) => userBeingEdited && updateUser(userBeingEdited.id, data.firstname, data.lastname, data.email, data.role, data.password)}
        initial={userBeingEdited}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={itemToDelete ? `Supprimer ${itemToDelete.type === 'room' ? 'la salle' : itemToDelete.type === 'sensor' ? 'le capteur' : itemToDelete.type === 'equipment' ? 'l\'équipement' : 'l\'utilisateur'}` : ''}
        message={itemToDelete ? `Êtes-vous sûr de vouloir supprimer ${itemToDelete.type === 'room' ? 'cette salle' : itemToDelete.type === 'sensor' ? 'ce capteur' : itemToDelete.type === 'equipment' ? 'cet équipement' : 'cet utilisateur'} ?` : ''}
        itemName={itemToDelete?.name || ''}
        type={itemToDelete?.type || 'room'}
      />
    </div>
  );
}