import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings, Bell } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="backdrop-blur-sm bg-black/20 min-h-screen">
        {/* Navigation */}
        <nav className="bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    HexaMentor
                  </div>
                </div>
                <div className="text-white/70 text-lg">{title}</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-white/70 hover:text-white transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="p-2 text-white/70 hover:text-white transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-white/90">
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="px-2 py-1 text-xs bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-white/70 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};