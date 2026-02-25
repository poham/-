
import React from 'react';

interface TagInputProps {
  label: string;
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({ label, availableTags, selectedTags, onToggleTag }) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                isSelected
                  ? 'bg-blue-500/20 border-blue-500 text-blue-200 shadow-sm'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagInput;
