
import React from 'react';
import { Briefcase, Heart, Wrench, LayoutDashboard, Bot, GraduationCap, RefreshCcw } from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  activeCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onCategorySelect, onReset }) => {
  const menuItems = [
    { label: 'Tất cả', id: null, icon: <LayoutDashboard size={20} /> },
    { label: Category.SCHOOL, id: Category.SCHOOL, icon: <GraduationCap size={20} /> },
    { label: Category.WORK, id: Category.WORK, icon: <Briefcase size={20} /> },
    { label: Category.AN_PHUC, id: Category.AN_PHUC, icon: <Heart size={20} /> },
    { label: Category.AI, id: Category.AI, icon: <Bot size={20} /> },
    { label: Category.TOOLS, id: Category.TOOLS, icon: <Wrench size={20} /> },
  ];

  return (
    <aside className="w-[280px] flex-shrink-0 hidden lg:flex flex-col p-6 border-r border-gray-100 bg-[#f0f7ff] h-screen sticky top-0 overflow-y-auto">
      <div className="flex items-center gap-4 mb-10 px-2">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
          <Heart size={28} fill="white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">Link Hub</h1>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">AN PHÚC CENTER</p>
        </div>
      </div>

      <nav className="space-y-1.5 flex-1 pr-1">
        <p className="px-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-4">Danh mục</p>
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onCategorySelect(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[1.25rem] transition-all duration-300 ${
              activeCategory === item.id 
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
              : 'text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-sm'
            }`}
          >
            <span className={`${activeCategory === item.id ? 'text-white' : 'text-gray-400'}`}>
              {item.icon}
            </span>
            <span className="font-bold text-[15px]">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 space-y-4">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-white hover:bg-blue-50 text-blue-600 rounded-2xl transition-all border border-blue-50 text-[13px] font-bold shadow-sm"
        >
          <RefreshCcw size={18} />
          Làm mới danh sách
        </button>

        <div className="bg-blue-50/60 p-6 rounded-[2rem] border border-blue-100/50">
          <p className="text-sm font-extrabold text-blue-900 mb-2">Mẹo nhỏ</p>
          <p className="text-xs text-blue-700 leading-relaxed font-medium">
            Nhấn <strong className="font-bold">Làm mới</strong> để cập nhật các liên kết mới nhất từ hệ thống.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
