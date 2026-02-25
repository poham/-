
import React, { useRef, useState } from 'react';
import { CustomTags, Preset } from '../../types';
import SectionHeader from '../SectionHeader';

interface SettingsSectionProps {
  currentTags: CustomTags;
  currentPresets: Preset[];
  onImport: (tags: CustomTags, presets: Preset[]) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ currentTags, currentPresets, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleExportAll = () => {
    const exportData = {
      type: 'NANO_BANANA_BACKUP',
      version: '2.5',
      timestamp: new Date().toISOString(),
      payload: {
        presets: currentPresets,
        tags: currentTags
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nano-banana-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    setSyncStatus('匯出完成！');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleImportAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.type !== 'NANO_BANANA_BACKUP') throw new Error('Invalid format');

        if (confirm('確定要匯入備份嗎？系統將自動合併所有分頁的自定義標籤。')) {
          const newPresets = (data.payload.presets || []) as Preset[];
          const mergedPresets = [...currentPresets];
          newPresets.forEach(np => {
            if (!mergedPresets.find(ep => ep.id === np.id)) {
              mergedPresets.unshift(np);
            }
          });

          // 全面合併 5 種類別標籤
          const newTags = data.payload.tags || {};
          const mergedTags: CustomTags = {
            subject: Array.from(new Set([...currentTags.subject, ...(newTags.subject || [])])),
            background: Array.from(new Set([...currentTags.background, ...(newTags.background || [])])),
            cameraAngle: Array.from(new Set([...currentTags.cameraAngle, ...(newTags.cameraAngle || [])])),
            mood: Array.from(new Set([...currentTags.mood, ...(newTags.mood || [])])),
            style: Array.from(new Set([...currentTags.style, ...(newTags.style || [])]))
          };
          
          localStorage.setItem('banana_custom_tags', JSON.stringify(mergedTags));
          localStorage.setItem('banana_user_presets', JSON.stringify(mergedPresets));

          onImport(mergedTags, mergedPresets);

          setSyncStatus('匯入成功！所有分頁標籤已同步。');
          setTimeout(() => setSyncStatus(null), 3000);
        }
      } catch (err) {
        console.error("Import failed:", err);
        alert('匯入失敗：請檢查備份檔格式。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* 使用標準 SectionHeader - 齒輪圖示用特殊處理 */}
      <div className="flex items-center gap-6 mb-8">
        <div className="bg-gradient-to-br from-slate-500 to-slate-700 text-white w-[140px] h-[140px] rounded-[32px] flex items-center justify-center font-black text-[64px] shadow-2xl shadow-slate-500/30">
          ⚙️
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-[32px] font-black tracking-tight text-white leading-tight">系統設定</h2>
          <p className="text-[18px] text-slate-400 font-medium">管理自定義標籤和用戶預設，匯入或匯出你的設定。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-10">
        <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-[3.5rem] space-y-8 shadow-2xl">
          <div className="space-y-2">
             <h4 className="text-xl font-black text-white uppercase">備份與移轉 (Backup)</h4>
             <p className="text-xs text-slate-500 font-medium leading-relaxed">
               目前已儲存：<br/>
               <span className="text-blue-400 font-mono">● {currentTags.subject.length} 主體 / {currentTags.background.length} 場景</span><br/>
               <span className="text-orange-400 font-mono">● {currentTags.cameraAngle.length} 角度 / {currentTags.mood.length} 情緒</span><br/>
               <span className="text-purple-400 font-mono">● {currentTags.style.length} Style 標籤</span>
             </p>
          </div>
          <button 
            onClick={handleExportAll}
            className="w-full py-8 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl text-sm font-black transition-all shadow-xl shadow-blue-900/20 border border-blue-400/30 flex items-center justify-center gap-4 group"
          >
             <span className="text-2xl group-hover:-translate-y-1 transition-transform">📤</span>
             匯出資料 (EXPORT)
          </button>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-[3.5rem] space-y-8 shadow-2xl">
          <div className="space-y-2">
             <h4 className="text-xl font-black text-white uppercase">同步與還原 (Restore)</h4>
             <p className="text-xs text-slate-500 font-medium leading-relaxed">
               匯入備份檔。系統會自動識別 5 大類別標籤並智慧合併，不會刪除您現有的資料。
             </p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImportAll}
            className="hidden" 
            accept=".json"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-8 bg-slate-800 hover:bg-indigo-600 border-2 border-slate-700 hover:border-indigo-400 text-slate-400 hover:text-white rounded-3xl text-sm font-black transition-all flex items-center justify-center gap-4 group"
          >
             <span className="text-2xl group-hover:scale-110 transition-transform">📥</span>
             匯入資料 (IMPORT)
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-10 py-5 bg-green-600 text-white rounded-2xl font-black text-sm shadow-2xl animate-in fade-in slide-in-from-bottom-4 flex items-center gap-3 ring-4 ring-green-500/20 z-[100]">
           <span className="text-xl">✓</span>
           {syncStatus}
        </div>
      )}
    </div>
  );
};

export default SettingsSection;
