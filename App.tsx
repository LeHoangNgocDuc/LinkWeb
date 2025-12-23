
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { LinkItem, Category, LinkFormData } from './types';
import { generateId } from './utils/helpers';
import Sidebar from './components/Sidebar';
import LinkCard from './components/LinkCard';
import AddEditModal from './components/AddEditModal';

const App: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  // Danh sách hệ thống chuẩn
  const SYSTEM_LINKS: LinkItem[] = [
    { id: 'sys-1', title: 'Vnedu', url: 'https://ouzvvavumsgdkhanhhoa.vnedu.vn/v5/', category: Category.SCHOOL, createdAt: 1 },
    { id: 'sys-2', title: 'Mailtruong', url: 'https://mail.google.com/mail/u/0/#inbox', category: Category.SCHOOL, createdAt: 2 },
    { id: 'sys-3', title: 'Thuphi', url: 'https://diemdanhvathuphi.netlify.app/', category: Category.AN_PHUC, createdAt: 3 },
    { id: 'sys-4', title: 'VeHInh', url: 'https://web-dung-hinh.vercel.app/', category: Category.AN_PHUC, createdAt: 4 },
    { id: 'sys-5', title: 'Netlìy', url: 'https://app.netlify.com/teams/thdtunhien/projects', category: Category.TOOLS, createdAt: 5 },
    { id: 'sys-6', title: 'VercelTunhien', url: 'https://vercel.com/lehoangngocducs-projects', category: Category.AI, createdAt: 6 },
    { id: 'sys-7', title: 'NoteBookDuc', url: 'https://notebooklm.google.com/?utm_source=app_launcher&utm_medium=referral&original_referer=https%3A%2F%2Fogs.google.com%23&pli=1&authuser=1&pageId=none', category: Category.AI, createdAt: 7 },
    { id: 'sys-8', title: 'geminiDuc', url: 'https://gemini.google.com/u/1/app?utm_source=app_launcher&utm_medium=owned&utm_campaign=base_all&pageId=none', category: Category.AI, createdAt: 8 },
    { id: 'sys-9', title: 'GeminiTunhien', url: 'https://gemini.google.com/u/2/app?utm_source=app_launcher&utm_medium=owned&utm_campaign=base_all&pageId=none', category: Category.AI, createdAt: 9 },
    { id: 'sys-10', title: 'GifhubTunhien', url: 'https://github.com/LeHoangNgocDuc', category: Category.TOOLS, createdAt: 10 },
    { id: 'sys-11', title: 'An Phúc Website', url: 'https://trungtamanphuc.vn', category: Category.AN_PHUC, createdAt: 11 },
  ];

  // Hàm chuẩn hóa danh mục để khắc phục dữ liệu cũ trong LocalStorage
  const normalizeCategory = (cat: any): Category => {
    const catStr = String(cat).toLowerCase();
    if (catStr.includes('school') || catStr.includes('trường')) return Category.SCHOOL;
    if (catStr.includes('work') || catStr.includes('công việc')) return Category.WORK;
    if (catStr.includes('an_phuc') || catStr.includes('an phúc') || catStr.includes('trung tâm')) return Category.AN_PHUC;
    if (catStr.includes('ai')) return Category.AI;
    if (catStr.includes('tools') || catStr.includes('công cụ web')) return Category.TOOLS;
    return Category.TOOLS; // Mặc định
  };

  useEffect(() => {
    const saved = localStorage.getItem('anphuc_links');
    let currentLinks: LinkItem[] = [];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Chuẩn hóa toàn bộ dữ liệu từ LocalStorage
        currentLinks = parsed.map((l: any) => ({
          ...l,
          category: normalizeCategory(l.category)
        }));
      } catch (e) {
        currentLinks = SYSTEM_LINKS;
      }
    } else {
      currentLinks = SYSTEM_LINKS;
    }

    // Tự động kiểm tra và đồng bộ các link hệ thống còn thiếu
    const existingUrls = new Set(currentLinks.map(l => l.url.toLowerCase()));
    const missingLinks = SYSTEM_LINKS.filter(sys => !existingUrls.has(sys.url.toLowerCase()));

    if (missingLinks.length > 0) {
      const merged = [...missingLinks, ...currentLinks];
      setLinks(merged);
      localStorage.setItem('anphuc_links', JSON.stringify(merged));
    } else {
      setLinks(currentLinks);
    }
  }, []);

  useEffect(() => {
    if (links.length > 0) {
      localStorage.setItem('anphuc_links', JSON.stringify(links));
    }
  }, [links]);

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục toàn bộ danh sách về mặc định hệ thống? Các liên kết bạn tự thêm sẽ bị mất.')) {
      setLinks(SYSTEM_LINKS);
      localStorage.setItem('anphuc_links', JSON.stringify(SYSTEM_LINKS));
      setActiveCategory(null);
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
  })).filter(s => s.links.length > 0);

  const handleAddOrEdit = (data: LinkFormData) => {
    if (editingLink) {
      setLinks(prev => prev.map(l => l.id === editingLink.id ? { ...l, ...data } : l));
      setEditingLink(null);
    } else {
      const newLink: LinkItem = {
        ...data,
        id: generateId(),
        createdAt: Date.now()
      };
      setLinks(prev => [newLink, ...prev]);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Xóa liên kết này?')) {
      setLinks(prev => prev.filter(l => l.id !== id));
    }
  };

  const openEditModal = (link: LinkItem) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        activeCategory={activeCategory} 
        onCategorySelect={setActiveCategory} 
        onReset={handleResetDefaults}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/60 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm link..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            onClick={() => { setEditingLink(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Thêm mới</span>
          </button>
        </header>

        <div className="flex-1 p-6 sm:p-8 lg:p-10 space-y-10">
          {sections.map(section => (
            <section key={section.name} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-lg font-extrabold text-gray-800 tracking-tight">{section.name}</h2>
                <div className="h-[1px] flex-1 bg-gray-200"></div>
                <span className="text-[10px] font-bold text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded-md">
                  {section.links.length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {section.links.map(link => (
                  <LinkCard 
                    key={link.id} 
                    link={link} 
                    onEdit={openEditModal} 
                    onDelete={handleDelete} 
                  />
                ))}
              </div>
            </section>
          ))}
          
          {sections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                <Search size={32} />
              </div>
              <p className="text-gray-400 font-medium">Không có liên kết nào để hiển thị.</p>
            </div>
          )}
        </div>
      </main>

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingLink(null); }}
        onSubmit={handleAddOrEdit}
        initialData={editingLink}
      />
    </div>
  );
};

export default App;
