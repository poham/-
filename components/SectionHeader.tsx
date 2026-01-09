
import React from 'react';

interface SectionHeaderProps {
  number: number;
  title: string;
  icon?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title, icon }) => {
  return (
    <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-3">
      <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20">
        {number}
      </div>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-semibold tracking-tight text-slate-100">{title}</h2>
      </div>
    </div>
  );
};

export default SectionHeader;
