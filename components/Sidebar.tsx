import React from 'react';
import { LayoutDashboard, ShoppingBag, Globe, ShoppingCart, Settings, Share2, FileBarChart, PackageSearch } from 'lucide-react';
import { AppState } from '../types';

interface SidebarProps {
  activeState: AppState;
  setActiveState: (state: AppState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeState, setActiveState }) => {
  const menuItems = [
    { id: AppState.DASHBOARD, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: AppState.EXTRACTOR, label: 'استخراج جديد', icon: ShoppingBag },
    { id: AppState.LIBRARY, label: 'مكتبة المنتجات', icon: PackageSearch }, // New Item
    { id: AppState.EBAY_PREVIEW, label: 'معاينة eBay', icon: ShoppingCart },
    { id: AppState.BLOGGER_PREVIEW, label: 'مدونة بلوجر', icon: Globe },
    { id: AppState.SOCIAL_MEDIA, label: 'حملات السوشيال', icon: Share2 },
    { id: AppState.REPORTS, label: 'التقارير الآلية', icon: FileBarChart },
  ];

  return (
    <div className="w-64 bg-white border-l border-gray-200 h-screen flex flex-col hidden md:flex sticky top-0">
      <div className="p-6 border-b border-gray-100 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Affiliate AI</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveState(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeState === item.id
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={() => setActiveState(AppState.SETTINGS)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
            activeState === AppState.SETTINGS 
              ? 'bg-gray-100 text-gray-900 font-medium' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Settings size={20} />
          <span>الإعدادات</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;