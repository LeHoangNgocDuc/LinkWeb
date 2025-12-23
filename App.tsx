
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

  // Danh sách mặc định đầy đủ nhất theo yêu cầu của bạn
  const DEFAULT_LINKS: LinkItem[] = [
    { id: '9', title: 'Vnedu', url: 'https://ouzvvavumsgdkhanhhoa.vnedu.vn/v5/', category: Category.SCHOOL, createdAt: Date.now() },
    { id: '12', title: 'Mailtruong', url: 'https://mail.google.com/mail/u/0/#inbox', category: Category.SCHOOL, createdAt: Date.now() },
    { id: '1', title: 'Gmail Công việc', url: 'https://mail.google.com', category: Category.WORK, createdAt: Date.now() },
    { id: '2', title: 'An Phúc Website', url: 'https://trungtamanphuc.vn', category: Category.AN_PHUC, createdAt: Date.now() },
    { id: '13', title: 'Thuphi', url: 'https://diemdanhvathuphi.netlify.app/', category: Category.AN_PHUC, createdAt: Date.now() },
    { id: '14', title: 'VeHInh', url: 'https://web-dung-hinh.vercel.app/', category: Category.AN_PHUC, createdAt: Date.now() },
    { id: '4', title: 'ChatGPT', url: 'https://chatgpt.com/', category: Category.AI, createdAt: Date.now() },
    { id: '5', title: 'NoteBookDuc', url: 'https://notebooklm.google.com/?utm_source=app_launcher&utm_medium=referral&original_referer=https%3A%2F%2Fogs.google.com%23&pli=1&authuser=1&pageId=none', category: Category.AI, createdAt: Date.now() },
    { id: '6', title: 'geminiDuc', url: 'https://gemini.google.com/u/1/app?utm_source=app_launcher&utm_medium=owned&utm_campaign=base_all&pageId=none', category: Category.AI, createdAt: Date.now() },
    { id: '7', title: 'GeminiTunhien', url: 'https://gemini.google.com/u/2/app?utm_source=app_launcher&utm_medium=owned&utm_campaign=base_all&pageId=none', category: Category.AI, createdAt: Date.now() },
    { id: '10', title: 'VercelTunhien', url: 'https://vercel.com/lehoangngocducs-projects', category: Category.AI, createdAt: Date.now() },
    { id: '3', title: 'Canva Design', url: 'https://canva.com', category: Category.TOOLS, createdAt: Date.now() },
    { id: '8', title: 'GifhubTunhien', url: 'https://github.com/LeHoangNgocDuc', category: Category.TOOLS, createdAt: Date.now() },
    { id: '11', title: 'Netlìy', url: 'https://app.netlify.com/teams/thdtunhien/projects', category: Category.TOOLS, createdAt: Date.now() },
  ];

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('anphuc_links');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLinks(parsed);
        } else {
          setLinks(DEFAULT_LINKS);
        }
      } catch (e) {
        setLinks(DEFAULT_LINKS);
      }
    } else {
      setLinks(DEFAULT_LINKS);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (links.length > 0) {
      localStorage.setItem('anphuc_links', JSON.stringify(links));
    }
  }, [links]);

  const handleResetDefaults = () => {
    if (window.confirm('Bạn có muốn khôi phục danh sách liên kết mặc định? Thao tác này sẽ hiển thị các liên kết mới nhất như Vnedu, Thuphi, VeHInh...')) {
      setLinks(DEFAULT_LINKS);
      localStorage.setItem('anphuc_links', JSON.stringify(DEFAULT_LINKS));
      setActiveCategory(null);
      setSearchQuery('');
    }
  };

  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const title = link.title?.toLowerCase() || '';
      const url = link.url?.toLowerCase() || '';
      const search = searchQuery.toLowerCase();
      const matchesSearch = title.includes(search) || url.includes(search);
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
    if (window.confirm('Bạn có chắc chắn muốn xóa liên kết này?')) {
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
              placeholder="Tìm kiếm liên kết..."
              className="w-full pl-11 pr-4 py-2.5 bg-white/60 border border-white/40 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setEditingLink(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Thêm mới</span>
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 sm:p-8 lg:p-10 space-y-12">
          {sections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-gray-300 mb-6 border border-white/50 shadow-inner">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-700">Không tìm thấy kết quả nào</h3>
              <p className="text-gray-500 mt-2 max-w-xs">Nếu bạn không thấy các liên kết mới, hãy nhấn nút "Làm mới danh sách" ở thanh bên!</p>
            </div>
          ) : (
            sections.map(section => (
              <section key={section.name} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-bold text-gray-800">{section.name}</h2>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                  <span className="text-xs font-bold text-gray-400 bg-white/50 px-3 py-1 rounded-full border border-white/50">
                    {section.links.length} Link
                  </span>
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
            ))
          )}
        </div>

        <footer className="lg:hidden sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 flex justify-between items-center px-6">
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">© 2024 An Phúc Link Hub</p>
           <button onClick={handleResetDefaults} className="text-blue-600"><RefreshCcw size={18}/></button>
        </footer>
      </main>

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLink(null);
        }}
        onSubmit={handleAddOrEdit}
        initialData={editingLink}
      />
    </div>
  );
};

export default App;
