
import React, { useState, useMemo, useEffect } from 'react';
import { PromptState, CategoryType, CustomTags, Preset } from './types';
import { DEFAULT_STATE, STUDIO_SETUPS } from './constants';
import PresetManager from './components/PresetManager';
import { generateNanoBananaImage } from './services/gemini';

// Modular Sections
import CategorySection from './components/sections/CategorySection';
import CameraSection from './components/sections/CameraSection';
import SubjectSection from './components/sections/SubjectSection';
import BackgroundSection from './components/sections/BackgroundSection';
import OpticsSection from './components/sections/OpticsSection';
import StyleSection from './components/sections/StyleSection';
import ShareSection from './components/sections/ShareSection';
import SettingsSection from './components/sections/SettingsSection';

type ActiveTab = 'presets' | 'theme' | 'subject' | 'scene' | 'camera' | 'light' | 'style' | 'export' | 'settings';

const App: React.FC = () => {
  const [state, setState] = useState<PromptState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<ActiveTab>('presets');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  // 自定義標籤狀態 (支援更多類別)
  const [customTags, setCustomTags] = useState<CustomTags>(() => {
    const saved = localStorage.getItem('banana_custom_tags');
    return saved ? JSON.parse(saved) : { 
      subject: [], 
      background: [], 
      cameraAngle: [], 
      mood: [], 
      style: [] 
    };
  });

  // 個人預設集狀態
  const [userPresets, setUserPresets] = useState<Preset[]>(() => {
    const saved = localStorage.getItem('banana_user_presets');
    return saved ? JSON.parse(saved) : [];
  });

  // 自動持久化
  useEffect(() => {
    if (customTags) {
      localStorage.setItem('banana_custom_tags', JSON.stringify(customTags));
    }
  }, [customTags]);

  useEffect(() => {
    if (userPresets) {
      localStorage.setItem('banana_user_presets', JSON.stringify(userPresets));
    }
  }, [userPresets]);

  const promptParts = useMemo(() => {
    const { category, camera, subject, background, optics, style } = state;
    const parts: { label: string; text: string }[] = [];
    
    parts.push({ label: 'THEME', text: `${category}.` });
    parts.push({ label: 'SUBJECT', text: `${subject.type || 'main object'} (${subject.description}). Feature: ${subject.key_feature}. View: ${subject.view_angle}.` });
    
    let bgText = `Scene: ${background.description || 'clean environment'}.`;
    if (background.bgColor) bgText += ` BG tint: ${background.bgColor}.`;
    parts.push({ label: 'SCENE', text: bgText });
    
    let camText = `${camera.shotType}, ${camera.lens} lens, ${camera.angle}.`;
    if (camera.roll !== 0) {
      camText += ` Camera roll: ${camera.roll} degrees, Dutch angle, canted perspective.`;
    }
    camText += ` Aperture ${optics.dof}.`;
    
    parts.push({ label: 'OPTICS', text: camText });
    parts.push({ label: 'COMPOSITION', text: `${camera.composition.rule} aligned ${camera.composition.alignment}.` });
    
    parts.push({ label: 'MOOD', text: `Global mood: ${optics.mood}.` });

    if (optics.useAdvancedLighting) {
      const setup = STUDIO_SETUPS.find(s => s.id === optics.studioSetup);
      let lightingDesc = `${setup?.name || 'custom'} setup, Key: ${optics.lightRotation}°, ${optics.lightColor} at ${optics.lightIntensity}%.`;
      lightingDesc += ` Fill: ${optics.fillLightColor} at ${optics.fillLightIntensity}%.`;
      lightingDesc += ` Rim: ${optics.rimLightColor} at ${optics.rimLightIntensity}%.`;
      parts.push({ label: 'LIGHTING', text: lightingDesc });
    }
    
    if (style.postProcessing.length > 0) {
      parts.push({ label: 'PROCESSING', text: style.postProcessing.join(', ') + '.' });
    }
    
    return parts;
  }, [state]);

  const finalPrompt = useMemo(() => promptParts.map(p => p.text).join(' '), [promptParts]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const img = await generateNanoBananaImage(finalPrompt, state.camera.aspectRatio);
      setGeneratedImage(img);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: string; step: string }[] = [
    { id: 'presets', label: '藝廊預設', icon: '📁', step: '00' },
    { id: 'theme', label: '美學核心', icon: '🎨', step: '01' },
    { id: 'subject', label: '主體細節', icon: '💎', step: '02' },
    { id: 'scene', label: '場景空間', icon: '🏙️', step: '03' },
    { id: 'camera', label: '光學參數', icon: '📷', step: '04' },
    { id: 'light', label: '燈光物理', icon: '💡', step: '05' },
    { id: 'style', label: '模擬風格', icon: '🎞️', step: '06' },
    { id: 'export', label: '協定導出', icon: '⚡', step: '07' },
    { id: 'settings', label: '系統設定', icon: '⚙️', step: 'SET' },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden selection:bg-orange-500/30">
      <aside className="w-24 md:w-80 bg-[#080c18] border-r border-slate-800 flex flex-col z-50 shadow-2xl">
        <div className="p-8 border-b border-slate-800 mb-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-yellow-500/20">🍌</div>
             <div className="hidden md:block">
                <h1 className="font-black text-xs tracking-[0.3em] text-white">NANO BANANA</h1>
                <p className="text-[8px] text-slate-500 font-mono">PROTOCOL V2.5</p>
             </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto custom-scrollbar py-4 relative">
          <div className="absolute left-12 top-0 bottom-0 w-px bg-slate-800/50 hidden md:block" />
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-6 px-8 py-7 transition-all group relative border-b border-white/[0.01] ${
                activeTab === item.id ? 'bg-blue-600/10 text-blue-400' : 'text-slate-600 hover:bg-white/[0.02]'
              }`}
            >
              <span className={`text-4xl md:text-5xl font-black font-mono tracking-tighter transition-all z-10 ${
                activeTab === item.id ? 'text-blue-500 scale-110 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'opacity-20 group-hover:opacity-40'
              }`}>
                {item.step}
              </span>
              <div className="hidden md:flex flex-col items-start text-left z-10">
                 <span className={`font-black text-sm uppercase tracking-widest ${activeTab === item.id ? 'text-white' : ''}`}>{item.label}</span>
                 <span className="text-[10px] font-mono opacity-30 group-hover:opacity-60 transition-opacity uppercase">{item.id}</span>
              </div>
              {activeTab === item.id && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]" />}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
        <section className="flex-1 overflow-y-auto p-6 md:p-14 custom-scrollbar bg-[radial-gradient(circle_at_20%_20%,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
          <header className="mb-14">
             <div className="flex items-center gap-4 text-slate-500 mb-4">
                <span className="font-mono text-[11px] font-black tracking-[0.5em] uppercase opacity-50">Studio Station // Sequence Flow</span>
                <div className="h-px flex-1 bg-slate-800/50" />
             </div>
             <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
               {navItems.find(n => n.id === activeTab)?.label}
             </h2>
          </header>

          <div className="bg-[#0f172a]/40 border border-slate-800 p-8 md:p-14 rounded-[4rem] shadow-2xl backdrop-blur-3xl ring-1 ring-white/5 min-h-[700px]">
            {activeTab === 'presets' ? (
              <PresetManager 
                currentConfig={state} 
                userPresets={userPresets}
                setUserPresets={setUserPresets}
                onLoadPreset={(cfg) => { setState(cfg); setActiveTab('export'); }} 
              />
            ) : activeTab === 'theme' ? (
              <CategorySection selected={state.category} onChange={(cat) => setState({...state, category: cat})} />
            ) : activeTab === 'subject' ? (
              <SubjectSection state={state.subject} customTags={customTags.subject} setCustomTags={(tags) => setCustomTags({...customTags, subject: tags})} onChange={(sub) => setState({...state, subject: sub})} />
            ) : activeTab === 'scene' ? (
              <BackgroundSection state={state.background} customTags={customTags.background} setCustomTags={(tags) => setCustomTags({...customTags, background: tags})} onChange={(bg) => setState({...state, background: bg})} />
            ) : activeTab === 'camera' ? (
              <CameraSection config={state.camera} opticsConfig={state.optics} customTags={customTags.cameraAngle} setCustomTags={(tags) => setCustomTags({...customTags, cameraAngle: tags})} onChange={(cam) => setState({...state, camera: cam})} onOpticsChange={(opt) => setState({...state, optics: opt})} />
            ) : activeTab === 'light' ? (
              <OpticsSection config={state.optics} customTags={customTags.mood} setCustomTags={(tags) => setCustomTags({...customTags, mood: tags})} onChange={(opt) => setState({...state, optics: opt})} />
            ) : activeTab === 'style' ? (
              <StyleSection state={state.style} customTags={customTags.style} setCustomTags={(tags) => setCustomTags({...customTags, style: tags})} onChange={(sty) => setState({...state, style: sty})} />
            ) : activeTab === 'settings' ? (
              <SettingsSection 
                currentTags={customTags} 
                currentPresets={userPresets} 
                onImport={(newTags, newPresets) => {
                  setCustomTags(newTags);
                  setUserPresets(newPresets);
                  setActiveTab('presets');
                }}
              />
            ) : (
              <div className="space-y-12 animate-in fade-in duration-700">
                <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-blue-500/20 p-12 rounded-[4rem] text-center space-y-10 shadow-3xl ring-1 ring-blue-400/10">
                   <div className="space-y-4">
                      <div className="inline-block px-4 py-1.5 bg-blue-600 rounded-full text-[11px] font-black tracking-widest text-white mb-4">SYSTEM READY</div>
                      <h3 className="text-4xl font-black text-white uppercase tracking-tighter">啟動影像渲染核心</h3>
                      <p className="text-slate-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">所有的美學參數、光學設定與主體協定已成功編碼。</p>
                   </div>
                   <button
                    disabled={isGenerating}
                    onClick={handleGenerate}
                    className="group relative px-20 py-10 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black rounded-[2.5rem] shadow-2xl shadow-blue-900/50 transition-all hover:-translate-y-2 active:scale-95 disabled:opacity-50 tracking-[0.3em] uppercase text-sm border border-white/20 ring-4 ring-blue-500/20 overflow-hidden"
                   >
                    {isGenerating ? (
                      <div className="flex items-center gap-4">
                         <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                         影像計算中...
                      </div>
                    ) : '執行最終渲染 (EXECUTE RENDER)'}
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                   </button>
                </div>
                {generatedImage && (
                  <div className="animate-in fade-in zoom-in-95 duration-1000 space-y-10">
                    <div className="aspect-square max-w-2xl mx-auto bg-black rounded-[4rem] overflow-hidden shadow-3xl ring-1 ring-white/10 group relative border-4 border-slate-800">
                       <img src={generatedImage} className="w-full h-full object-cover" alt="Gen Result" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-6 group-hover:translate-y-0">
                          <a href={generatedImage} download="nano-banana-export.png" className="px-10 py-5 bg-white text-black rounded-[1.5rem] font-black text-sm shadow-2xl transition-transform hover:scale-110 uppercase tracking-widest flex items-center gap-3">
                             <span>💾</span> 儲存結果
                          </a>
                       </div>
                    </div>
                  </div>
                )}
                <div className="pt-10">
                  <ShareSection config={state} finalPrompt={finalPrompt} onUpdate={setState} />
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="w-full md:w-[500px] bg-[#050914] border-l border-slate-800 p-10 flex flex-col gap-10 shadow-inner overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between">
            <h4 className="text-[14px] font-black text-blue-500 uppercase tracking-[0.5em]">Live Protocol Deck</h4>
            <div className="flex items-center gap-3">
               <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
               <span className="text-[12px] font-mono text-slate-500 uppercase tracking-widest font-black">Linked</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-10">
            <div className="bg-[#0f172a] rounded-[3rem] p-10 border border-slate-800/60 shadow-3xl relative group overflow-hidden flex flex-col gap-8">
               {promptParts.map((part, idx) => (
                 <div key={part.label} className="space-y-2 animate-in fade-in duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-px bg-blue-500/50" />
                       <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em]">{part.label}</p>
                    </div>
                    <p className="text-2xl font-black text-white leading-relaxed tracking-tight selection:bg-orange-500 selection:text-white">
                      {part.text}
                    </p>
                 </div>
               ))}
               <div className="absolute -bottom-10 -right-10 text-[15rem] font-black text-white/[0.01] pointer-events-none select-none italic">
                 {navItems.find(n => n.id === activeTab)?.step}
               </div>
            </div>

            <div className="bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50 space-y-6">
               <div className="flex justify-between items-center">
                  <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em]">Core Metadata</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(finalPrompt);
                      setCopyFeedback(true);
                      setTimeout(() => setCopyFeedback(false), 2000);
                    }}
                    className="text-[12px] font-black text-blue-500 hover:text-white uppercase transition-colors px-4 py-2 bg-blue-500/5 rounded-xl border border-blue-500/20 hover:bg-blue-600 hover:border-blue-400"
                  >
                    {copyFeedback ? 'Copied ✓' : 'Copy String'}
                  </button>
               </div>
               <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-black/60 rounded-2xl border border-white/5 space-y-1">
                     <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Aspect</p>
                     <p className="text-xs font-black text-blue-400 font-mono">{state.camera.aspectRatio}</p>
                  </div>
                  <div className="p-4 bg-black/60 rounded-2xl border border-white/5 space-y-1">
                     <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Lens</p>
                     <p className="text-xs font-black text-blue-400 font-mono">{state.camera.lens.split(' ')[0]}</p>
                  </div>
                  <div className="p-4 bg-black/60 rounded-2xl border border-white/5 space-y-1">
                     <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Roll</p>
                     <p className={`text-xs font-black font-mono ${state.camera.roll !== 0 ? 'text-orange-400' : 'text-blue-400'}`}>{state.camera.roll}°</p>
                  </div>
               </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
