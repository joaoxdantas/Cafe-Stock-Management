import React from 'react';
import { X } from 'lucide-react';

export default function ImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[110] backdrop-blur-sm cursor-zoom-out animate-in fade-in"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-black/50 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X className="w-6 h-6" />
      </button>
      <img 
        src={src} 
        className="max-w-full max-h-[90vh] rounded-md shadow-2xl animate-in zoom-in-95 cursor-default" 
        onClick={e => e.stopPropagation()} 
        alt="Enlarged view" 
      />
    </div>
  );
}
