import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { alerts } = useData();

  const unreadAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="ml-4 text-2xl font-semibold text-gray-900 lg:ml-0">
            Gestion des Locaux
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
              <Bell className="h-5 w-5" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadAlerts.length}
                </span>
              )}
            </button>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50">
              <div className="flex items-center justify-center h-8 w-8 bg-blue-600 text-white rounded-full">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              title="Déconnexion"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}