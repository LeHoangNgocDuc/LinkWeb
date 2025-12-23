
import React from 'react';
import { Briefcase, Heart, Wrench, LayoutDashboard, Bot, GraduationCap, RefreshCcw } from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  activeCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onReset: () => void;
}

// BẮT BUỘC: Danh sách Sidebar Hằng số cố định để đảm bảo luôn hiển thị đủ 6 mục
const FIXED_SIDEBAR_ITEMS = [
  { id: null, label: 'Tất cả', icon: <LayoutDashboard size={22} /> },
  { id: Category.SCHOOL, label: 'Trường học', icon: <GraduationCap size={22} /> },
  { id: Category.WORK, label: 'Công việc', icon: <Briefcase size={22} /> },
  { id: Category.AN_PHUC, label: 'Trung tâm An Phúc', icon: <Heart size={22} /> },
  { id: Category.AI, label: 'Công cụ AI', icon: <Bot size={22} /> },
  { id: Category.TOOLS, label: 'Công cụ Web', icon: <Wrench size={22} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onCategorySelect, onReset }) => {
  return (
    <aside className="w-[300px] flex-shrink-0 hidden lg:flex flex-col p-7 border-r border-slate-200 bg-[#f1f5f9] h-screen sticky top-0 overflow-y-auto">
      {/* Logo Section */}
      <div className="flex items-center gap-4 mb-12 px-1">
        <div 
          className="w-14 h-14 bg-[#1d4ed8] rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-blue-200/50 transition-transform hover:scale-105 cursor-pointer" 
          onClick={() => onCategorySelect(null)}
        >
          <Heart size={32} fill="white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Link Hub</h1>
          <p className="text-[11px] text-blue-600 font-extrabold uppercase tracking-[0.15em] mt-1.5">AN PHÚC CENTER</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2 flex-1">
        <p className="px-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-5">Danh mục hệ thống</p>
        
        {FIXED_SIDEBAR_ITEMS.map((item) => {
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.label}
              onClick={() => onCategorySelect(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group border border-transparent ${
                isActive 
                ? 'sidebar-active translate-x-1' 
                : 'text-slate-600 hover:bg-white hover:text-[#1d4ed8] hover:shadow-md hover:border-slate-100'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#1d4ed8]'} transition-colors`}>
                {item.icon}
              </span>
              <span className={`font-bold text-[16px] ${isActive ? 'text-white' : 'text-slate-700'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="mt-8 space-y-5">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl transition-all border border-slate-200 text-[14px] font-black shadow-sm active:scale-95"
        >
          <RefreshCcw size={18} strokeWidth={2.5} className="text-blue-600" />
          Làm mới dữ liệu
        </button>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-sm font-black text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Ghi chú
          </p>
          <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
            Nếu thấy thiếu link, hãy nhấn <strong className="text-blue-700 font-bold underline">Làm mới</strong> để đồng bộ ngay.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
