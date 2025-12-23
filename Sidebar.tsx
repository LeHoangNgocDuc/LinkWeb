
import React from 'react';
import { Briefcase, Heart, Wrench, LayoutDashboard, Bot, GraduationCap } from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  activeCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onCategorySelect }) => {
  const menuItems = [
    { label: 'Tất cả', id: null, icon: <LayoutDashboard size={20} /> },
    { label: Category.SCHOOL, id: Category.SCHOOL, icon: <GraduationCap size={20} /> },
    { label: Category.WORK, id: Category.WORK, icon: <Briefcase size={20} /> },
    { label: Category.AN_PHUC, id: Category.AN_PHUC, icon: <Heart size={20} /> },
    { label: Category.AI, id: Category.AI, icon: <Bot size={20} /> },
    { label: Category.TOOLS, id: Category.TOOLS, icon: <Wrench size={20} /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col p-6 border-r border-white/20 bg-white/20 backdrop-blur-xl h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Heart size={24} fill="white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 leading-tight">Link Hub</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">An Phúc Center</p>
        </div>
      </div>

      <nav className="space-y-2">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Danh mục</p>
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onCategorySelect(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
              activeCategory === item.id 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
              : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'
            }`}
          >
            {item.icon}
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-10">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-3xl border border-white/50">
          <p className="text-xs font-bold text-indigo-800 mb-1">Mẹo nhỏ</p>
          <p className="text-[11px] text-indigo-600 leading-relaxed">
            Sử dụng phím <strong>/</strong> để tìm kiếm nhanh các liên kết của bạn.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
