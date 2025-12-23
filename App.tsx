
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, RefreshCcw } from 'lucide-react';
import { LinkItem, Category, LinkFormData } from './types';
import { generateId } from './utils/helpers';
import Sidebar from './components/Sidebar';
import LinkCard from './components/LinkCard';
import AddEditModal from './components/AddEditModal';

// Nâng cấp lên v6 để đảm bảo Vercel/Trình duyệt cập nhật bản hiển thị sắc nét nhất
const STORAGE_KEY = 'anphuc_link_hub_v6'; 

const App: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  const SYSTEM_LINKS: LinkItem[] = [
    { id: 'sys-school-1', title: 'Vnedu', url: 'https://ouzvvavumsgdkhanhhoa.vnedu.vn/v5/', category: Category.SCHOOL, createdAt: 101 },
    { id: 'sys-school-2', title: 'Mailtruong', url: 'https://mail.google.com/mail/u/0/#inbox', category: Category.SCHOOL, createdAt: 102 },
    { id: 'sys-ap-1', title: 'Thuphi', url: 'https://diemdanhvathuphi.netlify.app/', category: Category.AN_PHUC, createdAt: 201 },
    { id: 'sys-ap-2', title: 'VeHInh', url: 'https://web-dung-hinh.vercel.app/', category: Category.AN_PHUC, createdAt: 202 },
    { id: 'sys-ap-3', title: 'An Phúc Website', url: 'https://trungtamanphuc.vn', category: Category.AN_PHUC, createdAt: 203 },
    { id: 'sys-ai-1', title: 'NoteBookDuc', url: 'https://notebooklm.google.com/', category: Category.AI, createdAt: 301 },
    { id: 'sys-ai-2', title: 'geminiDuc', url: 'https://gemini.google.com/u/1/app', category: Category.AI, createdAt: 302 },
    { id: 'sys-ai-3', title: 'GeminiTunhien', url: 'https://gemini.google.com/u/2/app', category: Category.AI, createdAt: 303 },
    { id: 'sys-ai-4', title: 'AiStudioDuc', url: 'https://aistudio.google.com/u/2/404', category: Category.AI, createdAt: 304 },
    { id: 'sys-ai-5', title: 'AiStudioTunhien', url: 'https://aistudio.google.com/u/2/404', category: Category.AI, createdAt: 305 },
    { id: 'sys-web-1', title: 'Netlìy', url: 'https://app.netlify.com/teams/thdtunhien/projects', category: Category.TOOLS, createdAt: 401 },
    { id: 'sys-web-2', title: 'VercelTunhien', url: 'https://vercel.com/lehoangngocducs-projects', category: Category.TOOLS, createdAt: 402 },
    { id: 'sys-web-3', title: 'GifhubTunhien', url: 'https://github.com/LeHoangNgocDuc', category: Category.TOOLS, createdAt: 403 },
  ];

  const resetToDefaults = () => {
    setLinks(SYSTEM_LINKS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SYSTEM_LINKS));
    setActiveCategory(null);
    // Xóa triệt để các version cũ
    ['anphuc_links', 'anphuc_links_v3', 'anphuc_links_v4', 'anphuc_links_v5'].forEach(k => localStorage.removeItem(k));
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Tự động gộp nếu thiếu link hệ thống mới
        const existingUrls = new Set(parsed.map((l: any) => l.url.toLowerCase()));
        const missing = SYSTEM_LINKS.filter(s => !existingUrls.has(s.url.toLowerCase()));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          setLinks(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } else {
          setLinks(parsed);
        }
      } catch (e) {
        resetToDefaults();
      }
    } else {
      resetToDefaults();
    }
  }, []);

  const handleResetDefaults = () => {
    if (window.confirm('Cập nhật lại toàn bộ danh sách hệ thống mới nhất?')) {
      resetToDefaults();
    }
  };

  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const search = searchQuery.toLowerCase();
      const matchesSearch = (link.title || '').toLowerCase().includes(search) || 
                          (link.url || '').toLowerCase().includes(search);
      const matchesCategory = activeCategory ? link.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [links, searchQuery, activeCategory]);

  const sections = Object.values(Category).map(cat => ({
    name: cat,
    links: filteredLinks.filter(l => l.category === cat)
  }));

  const handleAddOrEdit = (data: LinkFormData) => {
    let updated;
    if (editingLink) {
      updated = links.map(l => l.id === editingLink.id ? { ...l, ...data } : l);
      setEditingLink(null);
    } else {
      updated = [{ ...data, id: generateId(), createdAt: Date.now() }, ...links];
    }
    setLinks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Xóa liên kết này?')) {
      const updated = links.filter(l => l.id !== id);
      setLinks(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        activeCategory={activeCategory} 
        onCategorySelect={setActiveCategory} 
        onReset={handleResetDefaults}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 py-5 flex items-center justify-between gap-6">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh tài liệu, công cụ AI, website..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-900 shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            onClick={() => { setEditingLink(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-blue-800 text-white px-7 py-3 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} strokeWidth={3} />
            <span className="hidden sm:inline">THÊM MỚI</span>
          </button>
        </header>

        <div className="flex-1 p-8 sm:p-10 lg:p-14 space-y-16">
          {sections.map(section => (
            // Luôn hiển thị cấu trúc trang khi không tìm kiếm
            (section.links.length > 0 || (!searchQuery && !activeCategory)) && (
              <section key={section.name} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-5 mb-8">
                  <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.3em]">{section.name}</h2>
                  <div className="h-[2px] flex-1 bg-slate-200/50"></div>
                  <span className="text-xs font-black text-white bg-slate-900 px-3 py-1 rounded-full">
                    {section.links.length}
                  </span>
                </div>
                
                {section.links.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {section.links.map(link => (
                      <LinkCard 
                        key={link.id} 
                        link={link} 
                        onEdit={(l) => { setEditingLink(l); setIsModalOpen(true); }} 
                        onDelete={handleDelete} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 border-2 border-dashed border-slate-200 rounded-[3rem] flex items-center justify-center text-slate-400 text-sm font-bold italic bg-slate-50/50">
                    Chưa có liên kết nào
                  </div>
                )}
              </section>
            )
          ))}
        </div>
      </main>

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOrEdit}
        initialData={editingLink}
      />
    </div>
  );
};

export default App;
