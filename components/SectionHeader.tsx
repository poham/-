
import React from 'react';

interface SectionHeaderProps {
  number: number;
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title }) => {
  return (
    <div className="flex items-center gap-6 mb-8">
      <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white w-[140px] h-[140px] rounded-[32px] flex items-center justify-center font-black text-[64px] shadow-2xl shadow-emerald-500/30">
        {String(number).padStart(2, '0')}
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-[32px] font-black tracking-tight text-white leading-tight">{title}</h2>
      </div>
    </div>
  );
};

export default SectionHeader;
