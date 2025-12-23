
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, RefreshCcw } from 'lucide-react';
import { LinkItem, Category, LinkFormData } from './types';
import { generateId } from './utils/helpers';
import Sidebar from './components/Sidebar';
import LinkCard from './components/LinkCard';
import AddEditModal from './components/AddEditModal';

const STORAGE_KEY = 'anphuc_links_v3'; // Cập nhật key mới để ép trình duyệt load lại

const App: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  // Danh sách hệ thống chuẩn xác nhất
  const SYSTEM_LINKS: LinkItem[] = [
    { id: 's1', title: 'Vnedu', url: 'https://ouzvvavumsgdkhanhhoa.vnedu.vn/v5/', category: Category.SCHOOL, createdAt: 1 },
    { id: 's2', title: 'Mailtruong', url: 'https://mail.google.com/mail/u/0/#inbox', category: Category.SCHOOL, createdAt: 2 },
    { id: 's3', title: 'Thuphi', url: 'https://diemdanhvathuphi.netlify.app/', category: Category.AN_PHUC, createdAt: 3 },
    { id: 's4', title: 'VeHInh', url: 'https://web-dung-hinh.vercel.app/', category: Category.AN_PHUC, createdAt: 4 },
    { id: 's5', title: 'Netlìy', url: 'https://app.netlify.com/teams/thdtunhien/projects', category: Category.TOOLS, createdAt: 5 },
    { id: 's6', title: 'VercelTunhien', url: 'https://vercel.com/lehoangngocducs-projects', category: Category.AI, createdAt: 6 },
    { id: 's7', title: 'NoteBookDuc', url: 'https://notebooklm.google.com/?utm_source=app_launcher&utm_medium=referral&original_referer=https%3A%2F%2Fogs.google.com%23&pli=1&authuser=1&pageId=none', category: Category.AI, createdAt: 7 },
    { id: 's8', title: 'geminiDuc', url: 'https://gemini.google.com/u/1/app?utm_source=app_launcher&utm_medium=owned&utm_campaign=base_all&pageId=none', category: Category.AI, createdAt: 8 },
    { id: 's9', title: 'GeminiTunhien', url: 'https://gemini.google.com/u/2/app?utm_source=app_launcher&utm_medium=owned&utm_campaign=base_all&pageId=none', category: Category.AI, createdAt: 9 },
    { id: 's10', title: 'GifhubTunhien', url: 'https://github.com/LeHoangNgocDuc', category: Category.TOOLS, createdAt: 10 },
    { id: 's11', title: 'An Phúc Website', url: 'https://trungtamanphuc.vn', category: Category.AN_PHUC, createdAt: 11 },
  ];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let finalLinks: LinkItem[] = [];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Kiểm tra xem có đủ các link hệ thống quan trọng không
        const existingUrls = new Set(parsed.map((l: any) => l.url.toLowerCase()));
        const missing = SYSTEM_LINKS.filter(s => !existingUrls.has(s.url.toLowerCase()));
        finalLinks = [...missing, ...parsed];
      } catch (e) {
        finalLinks = SYSTEM_LINKS;
      }
    } else {
      // Nếu chưa có v3, thử lấy từ bản cũ và gộp
      const oldSaved = localStorage.getItem('anphuc_links');
      if (oldSaved) {
        try {
          const oldData = JSON.parse(oldSaved);
          finalLinks = [...SYSTEM_LINKS, ...oldData.filter((ol: any) => 
            !SYSTEM_LINKS.some(sl => sl.url.toLowerCase() === ol.url.toLowerCase())
          )];
        } catch (e) {
          finalLinks = SYSTEM_LINKS;
        }
      } else {
        finalLinks = SYSTEM_LINKS;
      }
    }

    setLinks(finalLinks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalLinks));
  }, []);

  useEffect(() => {
    if (links.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    }
  }, [links]);

  const handleResetDefaults = () => {
    if (window.confirm('Cập nhật lại toàn bộ danh sách liên kết từ hệ thống?')) {
      setLinks(SYSTEM_LINKS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SYSTEM_LINKS));
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
    <div className="flex min-h-screen">
      <Sidebar 
        activeCategory={activeCategory} 
        onCategorySelect={setActiveCategory} 
        onReset={handleResetDefaults}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
        <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm Vnedu, Mail, AI..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            onClick={() => { setEditingLink(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span className="hidden sm:inline text-sm">Thêm Link</span>
          </button>
        </header>

        <div className="flex-1 p-6 sm:p-8 lg:p-10 space-y-12">
          {sections.length > 0 ? (
            sections.map(section => (
              <section key={section.name} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-base font-extrabold text-gray-800 uppercase tracking-wider">{section.name}</h2>
                  <div className="h-[1px] flex-1 bg-gray-200"></div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
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
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="font-medium">Không tìm thấy kết quả phù hợp</p>
              <button onClick={handleResetDefaults} className="mt-4 text-blue-600 text-sm font-bold flex items-center gap-2">
                <RefreshCcw size={16} /> Làm mới dữ liệu
              </button>
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
