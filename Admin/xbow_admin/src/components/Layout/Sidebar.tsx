import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Users, 
  CreditCard, 
  FileText, 
  Settings,
  Building2,
  Receipt
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'loads', label: 'Load Management', icon: Package },
  { id: 'vehicles', label: 'Vehicle Management', icon: Truck },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
  { id: 'commission', label: 'Commission', icon: Receipt },
  { id: 'pods', label: 'POD Management', icon: FileText },
  { id: 'payments', label: 'Payments', icon: Building2 },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-slate-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400">XBOW Admin</h1>
        <p className="text-slate-400 text-sm">Logistics Management</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};