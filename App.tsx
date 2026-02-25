import React, { useState, useMemo } from 'react';

// Custom Hooks
import { usePromptState } from './hooks/usePromptState';
import { useSidebarState } from './hooks/useSidebarState';
import { useCustomTags } from './hooks/useCustomTags';
import { useUserPresets } from './hooks/useUserPresets';
import { useWindowSize } from './hooks/useWindowSize';

// Utils
import { assemblePromptParts, assembleFinalPrompt } from './utils/promptAssembly';

// Layout Components
import NavigationSidebar from './components/layout/NavigationSidebar';
import MainContentArea from './components/layout/MainContentArea';
import ProtocolDeck from './components/layout/ProtocolDeck';
import OverlayBackdrop from './components/layout/OverlayBackdrop';
import FloatingNavButtons from './components/layout/FloatingNavButtons';
import HelpModal from './components/HelpModal';

type ActiveTab = 'presets' | 'subject' | 'scene' | 'camera' | 'light' | 'style' | 'export' | 'settings';

const App: React.FC = () => {
  // 1. Custom Hooks (狀態管理)
  const { state, setState } = usePromptState();
  const { sidebarState, toggleLeftSidebar, toggleRightSidebar } = useSidebarState();
  const { customTags, setCustomTags } = useCustomTags();
  const { userPresets, setUserPresets } = useUserPresets();
  const { width: windowWidth } = useWindowSize();
  
  // 2. Local UI State
  const [activeTab, setActiveTab] = useState<ActiveTab>('presets');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  
  // 3. Computed Values
  const promptParts = useMemo(() => assemblePromptParts(state), [state]);
  const finalPrompt = useMemo(() => assembleFinalPrompt(state), [state]);
  const isMobileOrTablet = windowWidth < 1500; // xl 斷點
  
  // 檢查當前 Section 是否有內容
  const hasContent = useMemo(() => {
    switch (activeTab) {
      case 'presets':
        return true; // 預設頁面總是可以進入下一步
      case 'subject':
        return true; // 主體設定可選，總是可以進入下一步
      case 'scene':
        return true; // 場景設定可選，總是可以進入下一步
      case 'camera':
        return true; // 相機設定有預設值，總是可以進入下一步
      case 'light':
        return true; // 燈光設定有預設值，總是可以進入下一步
      case 'style':
        return true; // 風格設定有預設值，總是可以進入下一步
      case 'export':
        return false; // 導出頁面是最後一步，沒有下一步
      default:
        return true;
    }
  }, [activeTab, state]);
  
  // 4. Event Handlers
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(finalPrompt);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };
  
  const handleLoadPreset = (cfg: typeof state) => {
    setState(cfg);
    setActiveTab('export');
  };
  
  const handleImportSettings = (newTags: typeof customTags, newPresets: typeof userPresets) => {
    setCustomTags(newTags);
    setUserPresets(newPresets);
    setActiveTab('presets');
  };
  
  // 處理導航項目點擊 - 在手機和平板上自動關閉導航欄
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (isMobileOrTablet) {
      toggleLeftSidebar();
    }
  };
  
  // 處理底部導覽按鈕點擊 - 不觸發側欄
  const handleBottomNavChange = (tab: ActiveTab) => {
    setActiveTab(tab);
  };
  
  // 處理使用說明彈窗
  const toggleHelpModal = () => {
    setHelpModalOpen(!helpModalOpen);
  };
  
  // 5. Render
  return (
    <div className="flex h-screen bg-[#0a0e1a] text-slate-200 overflow-hidden selection:bg-orange-500/30">
      {/* 背景遮罩 - 當左側導航欄在手機或平板上開啟時顯示 */}
      <OverlayBackdrop
        isVisible={sidebarState.leftSidebarOpen && isMobileOrTablet}
        onClick={toggleLeftSidebar}
        zIndex={40}
      />
      
      {/* 背景遮罩 - 當右側預覽欄在手機或平板上開啟時顯示 */}
      <OverlayBackdrop
        isVisible={sidebarState.rightSidebarOpen && isMobileOrTablet}
        onClick={toggleRightSidebar}
        zIndex={40}
      />
      
      <NavigationSidebar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isOpen={sidebarState.leftSidebarOpen}
        onToggle={toggleLeftSidebar}
        onToggleHelp={toggleHelpModal}
      />
      
      <MainContentArea
        activeTab={activeTab}
        state={state}
        onStateChange={setState}
        customTags={customTags}
        onCustomTagsChange={setCustomTags}
        userPresets={userPresets}
        onUserPresetsChange={setUserPresets}
        finalPrompt={finalPrompt}
        onLoadPreset={handleLoadPreset}
        onImportSettings={handleImportSettings}
        leftSidebarOpen={sidebarState.leftSidebarOpen}
        rightSidebarOpen={sidebarState.rightSidebarOpen}
        onToggleLeftSidebar={toggleLeftSidebar}
        onToggleRightSidebar={toggleRightSidebar}
        onNavigate={setActiveTab}
        onToggleHelp={toggleHelpModal}
      />
      
      <ProtocolDeck
        promptParts={promptParts}
        finalPrompt={finalPrompt}
        cameraConfig={state.camera}
        promptState={state}
        isOpen={sidebarState.rightSidebarOpen}
        onToggle={toggleRightSidebar}
        onCopy={handleCopyPrompt}
        copyFeedback={copyFeedback}
      />
      
      {/* 浮動導航按鈕 - 只在手機/平板模式顯示 */}
      <FloatingNavButtons
        activeTab={activeTab}
        onTabChange={handleBottomNavChange}
        hasContent={hasContent}
      />
      
      {/* 使用說明彈窗 */}
      <HelpModal
        isOpen={helpModalOpen}
        onClose={toggleHelpModal}
      />
    </div>
  );
};

export default App;
