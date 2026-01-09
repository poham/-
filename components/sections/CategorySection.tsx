
import React from 'react';
import { CATEGORIES } from '../../constants';
import { CategoryType } from '../../types';

interface CategorySectionProps {
  selected: CategoryType;
  onChange: (category: CategoryType) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ selected, onChange }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onChange(cat as CategoryType)}
            className={`px-8 py-10 rounded-[2.5rem] text-sm font-bold transition-all border text-left flex flex-col gap-4 group relative overflow-hidden ${
              selected === cat 
                ? 'bg-blue-600 border-blue-400 text-white shadow-2xl shadow-blue-600/30 scale-[1.02] ring-4 ring-blue-500/10' 
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex flex-col gap-1 relative z-10">
               <span className={`text-[10px] uppercase tracking-[0.3em] font-black ${selected === cat ? 'text-blue-200' : 'text-slate-600 group-hover:text-slate-400'}`}>
                 Visual Aesthetic Group
               </span>
               <span className="text-2xl font-black tracking-tight leading-tight">{cat}</span>
            </div>
            {selected === cat && (
              <div className="absolute -right-4 -bottom-4 text-white/10 text-8xl font-black select-none pointer-events-none">✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
