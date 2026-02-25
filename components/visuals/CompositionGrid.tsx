
import React, { useState } from 'react';
import { ElementPlacement } from '../../types';

interface CompositionGridProps {
  aspectRatio: string;
  alignment: string;
  elementPlacements?: ElementPlacement[];
  onAlignmentChange: (alignment: string) => void;
  onElementPlacementsChange?: (placements: ElementPlacement[]) => void;
}

const CompositionGrid: React.FC<CompositionGridProps> = ({ 
  aspectRatio, 
  alignment, 
  elementPlacements = [],
  onAlignmentChange,
  onElementPlacementsChange 
}) => {
  const [newElementName, setNewElementName] = useState('');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const ratioMap: Record<string, number> = {
    '1:1': 1,
    '4:3': 0.75,
    '3:4': 1.33,
    '16:9': 0.56,
    '9:16': 1.77,
  };

  const regions = [
    'top_left_region', 'top_center_region', 'top_right_region',
    'middle_left_region', 'center', 'middle_right_region',
    'bottom_left_region', 'bottom_center_region', 'bottom_right_region'
  ];

  const intersections = [
    { id: 'top_left_intersection', top: '33.33%', left: '33.33%' },
    { id: 'top_right_intersection', top: '33.33%', left: '66.66%' },
    { id: 'bottom_left_intersection', top: '66.66%', left: '33.33%' },
    { id: 'bottom_right_intersection', top: '66.66%', left: '66.66%' },
  ];

  const currentRatio = ratioMap[aspectRatio] || 1;

  const handleAddElement = () => {
    if (!newElementName.trim() || !onElementPlacementsChange) return;
    
    const newElement: ElementPlacement = {
      id: `element_${Date.now()}`,
      elementName: newElementName.trim(),
      position: 'center'
    };
    
    onElementPlacementsChange([...elementPlacements, newElement]);
    setNewElementName('');
    setSelectedElementId(newElement.id);
  };

  const handleRemoveElement = (id: string) => {
    if (!onElementPlacementsChange) return;
    onElementPlacementsChange(elementPlacements.filter(e => e.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const handlePositionClick = (position: string) => {
    if (selectedElementId && onElementPlacementsChange) {
      // 更新選中元素的位置
      onElementPlacementsChange(
        elementPlacements.map(e => 
          e.id === selectedElementId ? { ...e, position } : e
        )
      );
    } else {
      // 原本的對齊功能
      onAlignmentChange(position);
    }
  };

  const getElementAtPosition = (position: string) => {
    return elementPlacements.find(e => e.position === position);
  };

  const elementColors = [
    'bg-purple-500/40 border-purple-400 text-purple-200',
    'bg-green-500/40 border-green-400 text-green-200',
    'bg-orange-500/40 border-orange-400 text-orange-200',
    'bg-pink-500/40 border-pink-400 text-pink-200',
    'bg-cyan-500/40 border-cyan-400 text-cyan-200',
  ];

  const getElementColor = (id: string) => {
    const index = elementPlacements.findIndex(e => e.id === id);
    return elementColors[index % elementColors.length];
  };

  return (
    <div className="space-y-4">
      {/* 整合的構圖工具容器 */}
      <div className="bg-slate-900/40 p-5 rounded-xl border border-step-camera-light/30 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-[18px] font-black text-white uppercase tracking-[0.15em]">萬用構圖工具</label>
          <span className="text-[18px] text-step-camera-light font-mono bg-step-camera/10 px-4 py-2 rounded-xl border border-step-camera/20 font-black">{alignment}</span>
        </div>

        {/* 元素標註管理區 */}
        {onElementPlacementsChange && (
          <div className="space-y-4 pt-2 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <label className="text-[18px] font-black text-white uppercase tracking-widest">畫面元素標註</label>
                <p className="text-[18px] text-slate-300 leading-relaxed">
                  標記畫面中的重要元素位置（例如：人物頭部、商品 Logo、背景道具等）
                </p>
              </div>
            </div>

            {/* 輸入框永久顯示 */}
            <div className="flex gap-3 p-4 bg-slate-950/50 rounded-xl border border-step-camera/30">
              <input
                type="text"
                value={newElementName}
                onChange={(e) => setNewElementName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddElement()}
                placeholder="例如：頭部、左手、Logo、背景道具"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-[18px] font-bold text-white focus:ring-1 focus:ring-step-camera outline-none placeholder-slate-500"
              />
              <button
                onClick={handleAddElement}
                className="px-5 py-2.5 bg-step-camera hover:bg-step-camera-light text-white rounded-lg text-[18px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
              >
                + 新增元素
              </button>
            </div>

            {elementPlacements.length > 0 && (
              <div className="space-y-3">
                <div className="bg-step-camera/10 p-3 rounded-lg border border-step-camera/20">
                  <p className="text-[18px] text-slate-300 leading-relaxed">
                    <span className="font-black text-step-camera-light">📍 使用步驟：</span><br/>
                    1️⃣ 點擊下方元素按鈕選取<br/>
                    2️⃣ 在構圖網格中點擊目標位置<br/>
                    3️⃣ 可重複選取並調整位置
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {elementPlacements.map((element) => (
                    <button
                      key={element.id}
                      onClick={() => setSelectedElementId(selectedElementId === element.id ? null : element.id)}
                      className={`px-5 py-2.5 rounded-lg text-[18px] font-black border-2 transition-all flex items-center gap-2 ${
                        selectedElementId === element.id
                          ? getElementColor(element.id) + ' scale-105 shadow-lg'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {element.elementName}
                      <span className="text-[18px] opacity-60">@ {element.position.replace(/_/g, ' ')}</span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveElement(element.id);
                        }}
                        className="ml-1 text-red-400 hover:text-red-300 transition-colors text-[18px]"
                      >
                        ×
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      
        <div className="w-full flex justify-center py-6 bg-slate-950/40 rounded-xl border border-slate-800 shadow-inner">
          <div 
            className="relative border border-slate-700 bg-slate-900 transition-all duration-500 overflow-hidden rounded-xl shadow-3xl"
            style={{ 
              width: '320px', 
              height: `${320 * currentRatio}px`,
              maxHeight: '480px',
              minHeight: '180px'
            }}
          >
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-1 gap-1">
              {regions.map((region) => {
                const elementAtPosition = getElementAtPosition(region);
                const isAlignmentActive = alignment === region && !selectedElementId;
                
                return (
                  <button
                    key={region}
                    onClick={() => handlePositionClick(region)}
                    className={`w-full h-full rounded-lg transition-all flex items-center justify-center group relative ${
                      isAlignmentActive
                        ? 'bg-step-camera/40 border border-step-camera-light/50 shadow-2xl scale-[0.98]'
                        : elementAtPosition
                        ? getElementColor(elementAtPosition.id) + ' border-2 shadow-lg'
                        : 'hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    {elementAtPosition ? (
                      <span className="text-[11px] font-black text-center px-1">
                        {elementAtPosition.elementName}
                      </span>
                    ) : (
                      <span className={`text-[11px] font-black font-mono transition-opacity ${
                        isAlignmentActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-40 text-slate-500'
                      }`}>
                        {region.replace('_region', '').replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="absolute inset-0 pointer-events-none flex flex-col">
                <div className="flex-1 border-b border-white/5 flex">
                  <div className="flex-1 border-r border-white/5" />
                  <div className="flex-1 border-r border-white/5" />
                  <div className="flex-1" />
                </div>
                <div className="flex-1 border-b border-white/5 flex">
                  <div className="flex-1 border-r border-white/5" />
                  <div className="flex-1 border-r border-white/5" />
                  <div className="flex-1" />
                </div>
                <div className="flex-1 flex" />
              </div>

              {intersections.map(point => {
                const elementAtPosition = getElementAtPosition(point.id);
                const isAlignmentActive = alignment === point.id && !selectedElementId;
                
                return (
                  <button
                    key={point.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePositionClick(point.id);
                    }}
                    className={`absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 transition-all z-20 shadow-3xl flex items-center justify-center ${
                      isAlignmentActive
                        ? 'bg-yellow-400 border-white scale-110 shadow-yellow-500/60'
                        : elementAtPosition
                        ? getElementColor(elementAtPosition.id).replace('/40', '/80') + ' border-4 scale-110'
                        : 'bg-slate-700/80 border-slate-500 hover:scale-125 hover:bg-slate-600'
                    }`}
                    style={{ top: point.top, left: point.left }}
                  >
                    {elementAtPosition && (
                      <span className="text-[9px] font-black text-center leading-tight px-0.5">
                        {elementAtPosition.elementName}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <p className="text-[18px] text-slate-300 text-center leading-relaxed font-medium">💡 點擊格點或交叉點以設定主體對齊位置 ({aspectRatio})</p>
      </div>
    </div>
  );
};

export default CompositionGrid;
