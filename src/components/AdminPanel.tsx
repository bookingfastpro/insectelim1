import { useState, useEffect } from 'react';
import { LogOut, FileText, Settings, MessageSquare, Wrench } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AdminBlog from './admin/AdminBlog';
import AdminServices from './admin/AdminServices';
import AdminMessages from './admin/AdminMessages';
import AdminSettings from './admin/AdminSettings';

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'blog' | 'services' | 'messages' | 'settings'>('blog');

  const tabs = [
    { id: 'blog' as const, name: 'Articles', icon: FileText },
    { id: 'services' as const, name: 'Services', icon: Wrench },
    { id: 'messages' as const, name: 'Messages', icon: MessageSquare },
    { id: 'settings' as const, name: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#27ae60]">INSECTELIM</h1>
              <span className="text-sm text-gray-500">Admin</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-[#27ae60] transition-colors"
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#27ae60] text-[#27ae60]'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <IconComponent size={20} />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'blog' && <AdminBlog />}
            {activeTab === 'services' && <AdminServices />}
            {activeTab === 'messages' && <AdminMessages />}
            {activeTab === 'settings' && <AdminSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
