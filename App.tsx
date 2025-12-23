
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, RefreshCcw } from 'lucide-react';
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

  // Danh sách các liên kết hệ thống bắt buộc phải có
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
  ];

  // Logic load dữ liệu thông minh
  useEffect(() => {
    const saved = localStorage.getItem('anphuc_links');
    let currentLinks: LinkItem[] = [];

    if (saved) {
      try {
        currentLinks = JSON.parse(saved);
      } catch (e) {
        currentLinks = SYSTEM_LINKS;
      }
    } else {
      currentLinks = SYSTEM_LINKS;
    }

    // Tự động kiểm tra và bổ sung các link hệ thống còn thiếu vào dữ liệu người dùng
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

  // Save to LocalStorage khi có thay đổi từ người dùng
  useEffect(() => {
    if (links.length > 0) {
      localStorage.setItem('anphuc_links', JSON.stringify(links));
    }
  }, [links]);

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục toàn bộ danh sách về mặc định hệ thống?')) {
      setLinks(SYSTEM_LINKS);
      localStorage.setItem('anphuc_links', JSON.stringify(SYSTEM_LINKS));
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

  // Sắp xếp các section theo đúng thứ tự trong Category Enum
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
    <div className="flex min-h-screen">
      <Sidebar 
        activeCategory={activeCategory} 
        onCategorySelect={setActiveCategory} 
        onReset={handleResetDefaults}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/40 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm nhanh..."
              className="w-full pl-11 pr-4 py-2.5 bg-white/60 border border-white/40 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            onClick={() => { setEditingLink(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-lg transition-all"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Thêm link</span>
          </button>
        </header>

        <div className="flex-1 p-6 sm:p-8 lg:p-10 space-y-12">
          {sections.map(section => (
            <section key={section.name} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-gray-800">{section.name}</h2>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
            <div className="text-center py-20 text-gray-400">Không tìm thấy liên kết nào.</div>
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
