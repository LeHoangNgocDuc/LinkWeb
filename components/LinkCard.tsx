
import React from 'react';
import { ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { LinkItem } from '../types';
import { getFaviconUrl } from '../utils/helpers';

interface LinkCardProps {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit, onDelete }) => {
  return (
    <div className="group relative bg-white/70 backdrop-blur-md border border-white/30 rounded-2xl p-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-white/90">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
          <img 
            src={getFaviconUrl(link.url)} 
            alt={link.title} 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?domain=google.com&sz=128';
            }}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate pr-16 group-hover:text-blue-600 transition-colors">
            {link.title}
          </h3>
          <p className="text-xs text-gray-500 truncate mt-1">
            {new URL(link.url).hostname}
          </p>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onEdit(link)}
          className="p-1.5 bg-gray-100/50 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
          title="Sửa"
        >
          <Edit2 size={14} />
        </button>
        <button 
          onClick={() => onDelete(link.id)}
          className="p-1.5 bg-gray-100/50 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
          title="Xóa"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {link.category}
        </span>
        <a 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          Truy cập <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

export default LinkCard;
