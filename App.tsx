
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, RefreshCcw } from 'lucide-react';
import { LinkItem, Category, LinkFormData } from './types';
import { generateId } from './utils/helpers';
import Sidebar from './components/Sidebar';
import LinkCard from './components/LinkCard';
import AddEditModal from './components/AddEditModal';

// Nâng cấp lên v5 để xóa hoàn toàn cache cũ trên Vercel/Trình duyệt
const STORAGE_KEY = 'anphuc_links_v5'; 

const App: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  // Danh sách hệ thống chuẩn theo yêu cầu mới nhất
  const SYSTEM_LINKS: LinkItem[] = [
    // Trường học
    { id: 'sys-school-1', title: 'Vnedu', url: 'https://ouzvvavumsgdkhanhhoa.vnedu.vn/v5/', category: Category.SCHOOL, createdAt: 101 },
    { id: 'sys-school-2', title: 'Mailtruong', url: 'https://mail.google.com/mail/u/0/#inbox', category: Category.SCHOOL, createdAt: 102 },
    
    // Trung tâm An Phúc
    { id: 'sys-ap-1', title: 'Thuphi', url: 'https://diemdanhvathuphi.netlify.app/', category: Category.AN_PHUC, createdAt: 201 },
    { id: 'sys-ap-2', title: 'VeHInh', url: 'https://web-dung-hinh.vercel.app/', category: Category.AN_PHUC, createdAt: 202 },
    { id: 'sys-ap-3', title: 'An Phúc Website', url: 'https://trungtamanphuc.vn', category: Category.AN_PHUC, createdAt: 203 },
    
    // Công cụ AI (Thêm AiStudio)
    { id: 'sys-ai-1', title: 'NoteBookDuc', url: 'https://notebooklm.google.com/', category: Category.AI, createdAt: 301 },
    { id: 'sys-ai-2', title: 'geminiDuc', url: 'https://gemini.google.com/u/1/app', category: Category.AI, createdAt: 302 },
    { id: 'sys-ai-3', title: 'GeminiTunhien', url: 'https://gemini.google.com/u/2/app', category: Category.AI, createdAt: 303 },
    { id: 'sys-ai-4', title: 'AiStudioDuc', url: 'https://aistudio.google.com/u/2/404', category: Category.AI, createdAt: 304 },
    { id: 'sys-ai-5', title: 'AiStudioTunhien', url: 'https://aistudio.google.com/u/2/404', category: Category.AI, createdAt: 305 },
    
    // Công cụ Web (Vercel nằm ở đây)
    { id: 'sys-web-1', title: 'Netlìy', url: 'https://app.netlify.com/teams/thdtunhien/projects', category: Category.TOOLS, createdAt: 401 },
    { id: 'sys-web-2', title: 'VercelTunhien', url: 'https://vercel.com/lehoangngocducs-projects', category: Category.TOOLS, createdAt: 402 },
    { id: 'sys-web-3', title: 'GifhubTunhien', url: 'https://github.com/LeHoangNgocDuc', category: Category.TOOLS, createdAt: 403 },
  ];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        // Tự động kiểm tra và gộp các link hệ thống còn thiếu nếu có cập nhật code mới
        const existingUrls = new Set(parsedData.map((l: any) => l.url.toLowerCase()));
        const missing = SYSTEM_LINKS.filter(s => !existingUrls.has(s.url.toLowerCase()));
        
        if (missing.length > 0) {
          const merged = [...parsedData, ...missing];
          setLinks(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } else {
          setLinks(parsedData);
        }
      } catch (e) {
        resetToDefaults();
      }
    } else {
      // Lần đầu vào hoặc sau khi nâng version key
      resetToDefaults();
    }
  }, []);

  const resetToDefaults = () => {
    setLinks(SYSTEM_LINKS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SYSTEM_LINKS));
    setActiveCategory(null);
    // Xóa cache các version cũ nếu có
    localStorage.removeItem('anphuc_links');
    localStorage.removeItem('anphuc_links_v3');
    localStorage.removeItem('anphuc_links_v4');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Cập nhật lại toàn bộ danh sách liên kết từ hệ thống? Các liên kết bạn tự thêm sẽ được giữ lại nếu không trùng URL.')) {
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

  // Luôn tạo các section cho TẤT CẢ danh mục để hiển thị đầy đủ tiêu đề
  const sections = Object.values(Category).map(cat => ({
    name: cat,
    links: filteredLinks.filter(l => l.category === cat)
  }));

  const handleAddOrEdit = (data: LinkFormData) => {
    if (editingLink) {
      const updated = links.map(l => l.id === editingLink.id ? { ...l, ...data } : l);
      setLinks(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setEditingLink(null);
    } else {
      const newLink: LinkItem = {
        ...data,
        id: generateId(),
        createdAt: Date.now()
      };
      const updated = [newLink, ...links];
      setLinks(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Xóa liên kết này?')) {
      const updated = links.filter(l => l.id !== id);
      setLinks(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const openEditModal = (link: LinkItem) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar 
        activeCategory={activeCategory} 
        onCategorySelect={setActiveCategory} 
        onReset={handleResetDefaults}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm nhanh: Vnedu, AiStudio, Vercel..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button 
            onClick={() => { setEditingLink(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} />
            <span className="hidden sm:inline text-sm">Thêm mới</span>
          </button>
        </header>

        <div className="flex-1 p-6 sm:p-8 lg:p-10 space-y-12">
          {sections.map(section => (
            // Chỉ hiển thị section nếu nó có links HOẶC nếu đang không tìm kiếm (để show cấu trúc trang)
            (section.links.length > 0 || (!searchQuery && !activeCategory)) && (
              <section key={section.name} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-sm font-extrabold text-gray-400 uppercase tracking-[0.2em]">{section.name}</h2>
                  <div className="h-[1px] flex-1 bg-gray-200/60"></div>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-lg border border-blue-100">
                    {section.links.length}
                  </span>
                </div>
                
                {section.links.length > 0 ? (
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
                ) : (
                  <div className="py-8 border-2 border-dashed border-gray-100 rounded-3xl flex items-center justify-center text-gray-300 text-xs font-medium italic">
                    Chưa có liên kết trong danh mục này
                  </div>
                )}
              </section>
            )
          ))}
          
          {links.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 text-gray-400">
              <Search size={64} className="mb-4 opacity-10" />
              <p className="font-medium">Chưa có dữ liệu liên kết</p>
              <button onClick={handleResetDefaults} className="mt-4 text-blue-600 text-sm font-bold flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                <RefreshCcw size={16} /> Tải lại dữ liệu hệ thống
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
