# Design Document

## Overview

Nano Banana 是一個專業級的電影攝影提示詞產生器，採用模組化的三欄佈局架構。系統透過 React 狀態管理實現即時的參數同步，並使用 LocalStorage 提供資料持久化。設計重點在於提供直覺的工作流程導航、靈活的響應式佈局，以及強大的預設集管理系統。

## Architecture

### High-Level Architecture (Modularized)

```
┌─────────────────────────────────────────────────────────────┐
│                    App.tsx (Orchestrator)                    │
│                      < 200 lines of code                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Custom Hooks (State Management Layer)          │ │
│  │  usePromptState | useSidebarState | useCustomTags     │ │
│  │  useUserPresets | useImageGeneration                   │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────┬─────────────────┬─────────────────┬─────────────┘
            │                 │                 │
    ┌───────▼────────┐ ┌─────▼──────┐ ┌────────▼────────┐
    │ Navigation     │ │   Main     │ │   Protocol      │
    │ Sidebar        │ │  Content   │ │     Deck        │
    │ (Left Panel)   │ │   Area     │ │ (Right Panel)   │
    └────────────────┘ └────┬───────┘ └─────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
         ┌────▼─────┐              ┌─────▼──────┐
         │ Section  │              │  Preset    │
         │Components│              │  Manager   │
         └──────────┘              └────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
         ┌────▼─────┐              ┌─────▼──────┐
         │  Utils   │              │  Helpers   │
         │ (Logic)  │              │ (Storage)  │
         └──────────┘              └────────────┘
```

### Modular Architecture Benefits

**問題：** App.tsx 過大（~400 行）導致：
- AI 輔助開發時檔案過大難以處理
- 狀態邏輯、UI 邏輯、業務邏輯混雜
- 難以定位和修改特定功能

**解決方案：** 採用分層模組化架構：
1. **Hooks Layer** - 封裝狀態管理邏輯
2. **Components Layer** - 獨立的 UI 元件
3. **Utils Layer** - 純函數工具集

### Component Hierarchy

```
App (< 200 lines, orchestration only)
├── usePromptState() hook
├── useSidebarState() hook
├── useCustomTags() hook
├── useUserPresets() hook
├── useImageGeneration() hook
│
├── NavigationSidebar (新元件 - components/layout/)
│   ├── BrandHeader
│   └── NavItems (9 steps)
│
├── MainContentArea (新元件 - components/layout/)
│   │   這個元件只是路由容器，會根據 activeTab 渲染對應的 section
│   │   所有 section 元件保持在原位置 components/sections/
│   │
│   ├── SectionHeader
│   └── 根據 activeTab 動態渲染：
│       ├── PresetManager (components/PresetManager.tsx)
│       ├── CategorySection (components/sections/CategorySection.tsx)
│       ├── SubjectSection (components/sections/SubjectSection.tsx)
│       ├── BackgroundSection (components/sections/BackgroundSection.tsx)
│       ├── CameraSection (components/sections/CameraSection.tsx)
│       ├── OpticsSection (components/sections/OpticsSection.tsx)
│       ├── StyleSection (components/sections/StyleSection.tsx)
│       ├── ShareSection (components/sections/ShareSection.tsx)
│       └── SettingsSection (components/sections/SettingsSection.tsx)
│
└── ProtocolDeck (新元件 - components/layout/)
    ├── LivePreview
    ├── PromptParts
    └── CoreMetadata
```

**重要說明：**
- `/components/sections/` 資料夾和其中的所有元件**保持不變**
- `/components/visuals/` 資料夾和其中的所有元件**保持不變**
- `PresetManager.tsx`, `SectionHeader.tsx`, `TagInput.tsx` **保持在原位置**
- 只新增 `/components/layout/` 資料夾來放置三個新的佈局元件

### Responsive Layout Strategy

**Desktop (≥1024px):**
```
┌────────┬──────────────────┬────────┐
│  Nav   │   Main Content   │Protocol│
│ (280px)│     (flex-1)     │(500px) │
└────────┴──────────────────┴────────┘
```

**Tablet (768px - 1023px):**
```
┌────────┬──────────────────┐
│  Nav   │   Main Content   │
│ (280px)│     (flex-1)     │
└────────┴──────────────────┘
         [Protocol: 收合，可透過按鈕開啟]
```

**Mobile (<768px):**
```
┌──────────────────┐
│   Main Content   │
│    (full-width)  │
└──────────────────┘
[Nav: 漢堡選單] [Protocol: 預覽按鈕]
```

## Components and Interfaces

### Module Organization

#### `/hooks` - Custom Hooks (State Management)

**usePromptState.ts**
```typescript
export function usePromptState() {
  const [state, setState] = useState<PromptState>(DEFAULT_STATE);
  
  const updateCategory = (category: CategoryType) => 
    setState(prev => ({ ...prev, category }));
  
  const updateCamera = (camera: CameraConfig) => 
    setState(prev => ({ ...prev, camera }));
  
  // ... other update functions
  
  return { state, setState, updateCategory, updateCamera, ... };
}
```

**useSidebarState.ts**
```typescript
export function useSidebarState() {
  const [sidebarState, setSidebarState] = useState<SidebarState>(() => {
    // LocalStorage initialization logic
  });
  
  useEffect(() => {
    // Persist to LocalStorage
  }, [sidebarState]);
  
  useEffect(() => {
    // Responsive breakpoint detection
  }, []);
  
  const toggleLeftSidebar = () => { /* ... */ };
  const toggleRightSidebar = () => { /* ... */ };
  
  return { sidebarState, toggleLeftSidebar, toggleRightSidebar };
}
```

**useCustomTags.ts**
```typescript
export function useCustomTags() {
  const [customTags, setCustomTags] = useState<CustomTags>(() => {
    // Load from LocalStorage
  });
  
  useEffect(() => {
    // Auto-persist
  }, [customTags]);
  
  const addTag = (category: keyof CustomTags, tag: string) => { /* ... */ };
  const removeTag = (category: keyof CustomTags, tag: string) => { /* ... */ };
  
  return { customTags, setCustomTags, addTag, removeTag };
}
```

**useUserPresets.ts**
```typescript
export function useUserPresets() {
  const [userPresets, setUserPresets] = useState<Preset[]>(() => {
    // Load from LocalStorage
  });
  
  useEffect(() => {
    // Auto-persist
  }, [userPresets]);
  
  const savePreset = (name: string, config: PromptState) => { /* ... */ };
  const deletePreset = (id: string) => { /* ... */ };
  
  return { userPresets, setUserPresets, savePreset, deletePreset };
}
```

**useImageGeneration.ts**
```typescript
export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const generateImage = async (prompt: string, aspectRatio: string) => {
    setIsGenerating(true);
    try {
      const img = await generateNanoBananaImage(prompt, aspectRatio);
      setGeneratedImage(img);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return { isGenerating, generatedImage, generateImage };
}
```

#### `/components/layout` - Layout Components

**NavigationSidebar.tsx**
```typescript
interface NavigationSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isOpen: boolean;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen
}) => {
  // 包含所有導航欄的 UI 邏輯
  return (
    <aside className={`... ${isOpen ? 'w-80' : 'w-0'}`}>
      {/* Brand Header + Nav Items */}
    </aside>
  );
};
```

**ProtocolDeck.tsx**
```typescript
interface ProtocolDeckProps {
  promptParts: { label: string; text: string }[];
  finalPrompt: string;
  cameraConfig: CameraConfig;
  isOpen: boolean;
}

export const ProtocolDeck: React.FC<ProtocolDeckProps> = ({
  promptParts,
  finalPrompt,
  cameraConfig,
  isOpen
}) => {
  // 包含所有協定面板的 UI 邏輯
  return (
    <aside className={`... ${isOpen ? 'w-[500px]' : 'w-0'}`}>
      {/* Live Preview + Metadata */}
    </aside>
  );
};
```

**MainContentArea.tsx**
```typescript
interface MainContentAreaProps {
  activeTab: ActiveTab;
  state: PromptState;
  onStateChange: (state: PromptState) => void;
  customTags: CustomTags;
  onCustomTagsChange: (tags: CustomTags) => void;
  userPresets: Preset[];
  onUserPresetsChange: (presets: Preset[]) => void;
  isGenerating: boolean;
  generatedImage: string | null;
  onGenerate: () => void;
  finalPrompt: string;
}

export const MainContentArea: React.FC<MainContentAreaProps> = (props) => {
  const { activeTab, state, onStateChange, customTags, onCustomTagsChange, ... } = props;
  
  // 這個元件只是路由容器，負責根據 activeTab 渲染對應的 section
  // 所有的 section 元件都保持在 components/sections/ 目錄下
  
  return (
    <section className="flex-1 overflow-y-auto p-6 md:p-14 ...">
      <header className="mb-14">
        {/* Section Header */}
      </header>

      <div className="bg-[#0f172a]/40 border border-slate-800 p-8 ...">
        {activeTab === 'presets' ? (
          <PresetManager 
            currentConfig={state} 
            userPresets={userPresets}
            setUserPresets={onUserPresetsChange}
            onLoadPreset={(cfg) => { onStateChange(cfg); /* navigate to export */ }} 
          />
        ) : activeTab === 'theme' ? (
          <CategorySection 
            selected={state.category} 
            onChange={(cat) => onStateChange({...state, category: cat})} 
          />
        ) : activeTab === 'subject' ? (
          <SubjectSection 
            state={state.subject} 
            customTags={customTags.subject} 
            setCustomTags={(tags) => onCustomTagsChange({...customTags, subject: tags})} 
            onChange={(sub) => onStateChange({...state, subject: sub})} 
          />
        ) : /* ... 其他 sections ... */
        }
      </div>
    </section>
  );
};
```

**重要：** 這個元件不會改變任何現有 section 元件的位置或內容，只是把路由邏輯從 App.tsx 搬過來。

#### `/utils` - Utility Functions

**responsive.ts**
```typescript
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
}

export function getDefaultSidebarState(deviceType: DeviceType): SidebarState {
  switch (deviceType) {
    case 'mobile':
      return { leftSidebarOpen: false, rightSidebarOpen: false };
    case 'tablet':
      return { leftSidebarOpen: true, rightSidebarOpen: false };
    case 'desktop':
    default:
      return { leftSidebarOpen: true, rightSidebarOpen: true };
  }
}
```

**promptAssembly.ts**
```typescript
export function assemblePromptParts(state: PromptState): { label: string; text: string }[] {
  const { category, camera, subject, background, optics, style } = state;
  const parts: { label: string; text: string }[] = [];
  
  // 提示詞組裝邏輯（從 App.tsx 移過來）
  parts.push({ label: 'THEME', text: `${category}.` });
  // ... rest of the logic
  
  return parts;
}

export function assembleFinalPrompt(parts: { label: string; text: string }[]): string {
  return parts.map(p => p.text).join(' ');
}
```

**storage.ts**
```typescript
export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Failed to read from localStorage: ${key}`, error);
    return defaultValue;
  }
}

export function safeLocalStorageSet(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to write to localStorage: ${key}`, error);
    return false;
  }
}
```

### Refactored App.tsx Structure

重構後的 App.tsx 應該只包含：

```typescript
const App: React.FC = () => {
  // 1. Custom Hooks (狀態管理)
  const { state, setState, updateCategory, ... } = usePromptState();
  const { sidebarState, toggleLeftSidebar, toggleRightSidebar } = useSidebarState();
  const { customTags, setCustomTags, addTag, removeTag } = useCustomTags();
  const { userPresets, setUserPresets, savePreset, deletePreset } = useUserPresets();
  const { isGenerating, generatedImage, generateImage } = useImageGeneration();
  
  // 2. Local UI State
  const [activeTab, setActiveTab] = useState<ActiveTab>('presets');
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  // 3. Computed Values
  const promptParts = useMemo(() => assemblePromptParts(state), [state]);
  const finalPrompt = useMemo(() => assembleFinalPrompt(promptParts), [promptParts]);
  
  // 4. Render
  return (
    <div className="flex h-screen ...">
      <NavigationSidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarState.leftSidebarOpen}
      />
      
      <MainContentArea
        activeTab={activeTab}
        state={state}
        onStateChange={setState}
        customTags={customTags}
        onCustomTagsChange={setCustomTags}
        userPresets={userPresets}
        onUserPresetsChange={setUserPresets}
        isGenerating={isGenerating}
        generatedImage={generatedImage}
        onGenerate={() => generateImage(finalPrompt, state.camera.aspectRatio)}
      />
      
      <ProtocolDeck
        promptParts={promptParts}
        finalPrompt={finalPrompt}
        cameraConfig={state.camera}
        isOpen={sidebarState.rightSidebarOpen}
        onCopy={() => {
          navigator.clipboard.writeText(finalPrompt);
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2000);
        }}
        copyFeedback={copyFeedback}
      />
    </div>
  );
};
```

**目標：App.tsx < 200 行**

### Core State Interface

```typescript
interface PromptState {
  category: CategoryType;
  camera: CameraConfig;
  subject: SubjectConfig;
  background: BackgroundConfig;
  optics: OpticsConfig;
  style: StyleConfig;
  thumbnail?: string;
}

interface CameraConfig {
  shotType: string;
  angle: string;
  aspectRatio: string;
  lens: string;
  roll: number;
  composition: CompositionConfig;
  visualYOffset: number; // UI only, not exported
}

interface OpticsConfig {
  dof: string;
  lightColor: string;
  ambientColor: string;
  lightIntensity: number;
  lightRotation: number;
  studioSetup: string;
  source: string;
  mood: string;
  useAdvancedLighting: boolean;
  fillLightColor: string;
  fillLightIntensity: number;
  rimLightColor: string;
  rimLightIntensity: number;
}
```

### Sidebar Collapse State

```typescript
interface SidebarState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
}

// LocalStorage key: 'banana_sidebar_state'
```

### New Components to Implement

#### 1. SidebarToggleButton

```typescript
interface SidebarToggleButtonProps {
  side: 'left' | 'right';
  isOpen: boolean;
  onClick: () => void;
  position: 'fixed' | 'inline';
}
```

**職責：**
- 顯示漢堡選單圖示（左側）或預覽圖示（右側）
- 固定在主要內容區的角落
- 提供視覺回饋（hover、active 狀態）

#### 2. OverlayBackdrop

```typescript
interface OverlayBackdropProps {
  isVisible: boolean;
  onClick: () => void;
  zIndex: number;
}
```

**職責：**
- 當側邊欄以覆蓋模式開啟時顯示半透明背景
- 點擊背景關閉側邊欄
- 提供平滑的淡入淡出動畫

### Modified Components

#### App.tsx 修改

**新增狀態：**
```typescript
const [sidebarState, setSidebarState] = useState<SidebarState>(() => {
  const saved = localStorage.getItem('banana_sidebar_state');
  if (saved) return JSON.parse(saved);
  
  // 根據螢幕尺寸設定預設值
  const width = window.innerWidth;
  if (width < 768) {
    return { leftSidebarOpen: false, rightSidebarOpen: false };
  } else if (width < 1024) {
    return { leftSidebarOpen: true, rightSidebarOpen: false };
  }
  return { leftSidebarOpen: true, rightSidebarOpen: true };
});
```

**新增功能：**
- 監聽視窗大小變化（useEffect + resize event）
- 持久化側邊欄狀態到 LocalStorage
- 提供 toggle 函數給子元件

## Data Models

### LocalStorage Schema

```typescript
// Key: 'banana_custom_tags'
interface CustomTags {
  subject: string[];
  background: string[];
  cameraAngle: string[];
  mood: string[];
  style: string[];
}

// Key: 'banana_user_presets'
type UserPresets = Preset[];

// Key: 'banana_sidebar_state' (NEW)
interface SidebarState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
}
```

### Prompt Assembly Logic

提示詞組裝遵循以下順序：

1. **THEME**: `${category}`
2. **SUBJECT**: `${subject.type} (${subject.description}). Feature: ${subject.key_feature}. View: ${subject.view_angle}`
3. **SCENE**: `Scene: ${background.description}. BG tint: ${background.bgColor}`
4. **OPTICS**: `${camera.shotType}, ${camera.lens} lens, ${camera.angle}. Aperture ${optics.dof}`
5. **COMPOSITION**: `${camera.composition.rule} aligned ${camera.composition.alignment}`
6. **MOOD**: `Global mood: ${optics.mood}`
7. **LIGHTING** (if useAdvancedLighting): 三點照明詳細參數
8. **PROCESSING**: `${style.postProcessing.join(', ')}`

### Export Data Sanitization

匯出時需要清理的欄位：
- `camera.visualYOffset` - 僅供 UI 使用
- `camera.roll` - 若非 0，轉換為描述字串
- `optics.*` - 若 `useAdvancedLighting` 為 false，清空所有燈光參數

## Correctness Properties

*屬性（Property）是一個應該在系統所有有效執行中保持為真的特徵或行為——本質上是關於系統應該做什麼的形式化陳述。屬性作為人類可讀規範和機器可驗證正確性保證之間的橋樑。*

### Property 1: 側邊欄狀態持久化一致性

*For any* 側邊欄狀態變更，當使用者重新載入應用程式時，從 LocalStorage 恢復的狀態應該與上次儲存的狀態完全相同。

**Validates: Requirements 16.11, 16.12**

### Property 2: 響應式斷點自動調整

*For any* 視窗寬度變化，當跨越響應式斷點（768px, 1024px）時，側邊欄的預設顯示狀態應該根據裝置類型自動調整。

**Validates: Requirements 17.9, 17.10**

### Property 3: 提示詞組裝完整性

*For any* 有效的 PromptState，組裝後的提示詞應該包含所有非空的配置區段，且順序固定為 THEME → SUBJECT → SCENE → OPTICS → COMPOSITION → MOOD → LIGHTING → PROCESSING。

**Validates: Requirements 10.2, 10.3**

### Property 4: 資料匯出淨化正確性

*For any* PromptState，匯出的 JSON 不應包含 `visualYOffset` 欄位，且當 `useAdvancedLighting` 為 false 時，所有燈光參數應為空值或 0。

**Validates: Requirements 12.2, 12.5**

### Property 5: 預設集載入完整性

*For any* 儲存的預設集，載入後的 PromptState 應該與儲存時的狀態完全相同（深度相等）。

**Validates: Requirements 2.4, 3.2**

### Property 6: 自定義標籤持久化

*For any* 自定義標籤的新增或刪除操作，LocalStorage 中的標籤列表應該立即反映該變更。

**Validates: Requirements 14.2, 14.4**

### Property 7: 側邊欄收合時主內容區寬度最大化

*For any* 側邊欄收合狀態組合，當兩側欄位都收合時，主內容區的寬度應該擴展至視窗的 100%（扣除邊距）。

**Validates: Requirements 16.10**

### Property 8: 覆蓋層導航關閉一致性

*For any* 覆蓋層導航開啟狀態，點擊背景遮罩或選擇導航項目後，導航欄應該關閉且背景遮罩應該消失。

**Validates: Requirements 17.7**

### Property 9: JSON 匯入驗證

*For any* 使用者貼上的 JSON 字串，若缺少必要欄位（category, camera, subject），系統應該拒絕匯入並顯示錯誤訊息。

**Validates: Requirements 12.9**

### Property 10: 相機傾斜角度格式轉換

*For any* 非零的 camera.roll 值，匯出時應該轉換為完整的描述字串格式，匯入時應該能夠從字串中提取數字並還原。

**Validates: Requirements 12.4**

## Error Handling

### LocalStorage 錯誤處理

```typescript
function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Failed to read from localStorage: ${key}`, error);
    return defaultValue;
  }
}

function safeLocalStorageSet(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to write to localStorage: ${key}`, error);
    return false;
  }
}
```

### JSON 匯入驗證

```typescript
function validateImportedConfig(data: any): { valid: boolean; error?: string } {
  if (!data.category) return { valid: false, error: '缺少 category 欄位' };
  if (!data.camera) return { valid: false, error: '缺少 camera 欄位' };
  if (!data.subject) return { valid: false, error: '缺少 subject 欄位' };
  
  // 驗證必要的子欄位
  if (!data.camera.aspectRatio) return { valid: false, error: '缺少 camera.aspectRatio' };
  
  return { valid: true };
}
```

### Gemini API 錯誤處理

```typescript
async function generateNanoBananaImage(prompt: string, aspectRatio: string): Promise<string> {
  try {
    const response = await geminiAPI.generate({ prompt, aspectRatio });
    return response.imageUrl;
  } catch (error) {
    if (error.code === 'RATE_LIMIT') {
      throw new Error('API 請求過於頻繁，請稍後再試');
    } else if (error.code === 'INVALID_PROMPT') {
      throw new Error('提示詞格式無效，請檢查配置');
    }
    throw new Error('影像生成失敗，請稍後再試');
  }
}
```

## Testing Strategy

### Unit Tests

使用 Vitest 進行單元測試，重點測試：

1. **狀態管理邏輯**
   - PromptState 初始化
   - 狀態更新函數
   - LocalStorage 讀寫

2. **資料轉換函數**
   - 提示詞組裝邏輯
   - JSON 匯出淨化
   - JSON 匯入驗證

3. **工具函數**
   - 響應式斷點判斷
   - 側邊欄狀態計算

### Property-Based Tests

使用 fast-check 進行屬性測試（每個測試至少 100 次迭代）：

1. **Property 1 測試：側邊欄狀態持久化**
   ```typescript
   // Feature: nano-banana-architecture, Property 1: 側邊欄狀態持久化一致性
   fc.assert(
     fc.property(fc.boolean(), fc.boolean(), (left, right) => {
       const state = { leftSidebarOpen: left, rightSidebarOpen: right };
       localStorage.setItem('banana_sidebar_state', JSON.stringify(state));
       const restored = JSON.parse(localStorage.getItem('banana_sidebar_state'));
       return restored.leftSidebarOpen === left && restored.rightSidebarOpen === right;
     }),
     { numRuns: 100 }
   );
   ```

2. **Property 3 測試：提示詞組裝完整性**
   ```typescript
   // Feature: nano-banana-architecture, Property 3: 提示詞組裝完整性
   fc.assert(
     fc.property(arbitraryPromptState(), (state) => {
       const prompt = assemblePrompt(state);
       const parts = prompt.split('. ');
       // 驗證順序和完整性
       return parts[0].includes(state.category) && 
              parts.some(p => p.includes(state.subject.type));
     }),
     { numRuns: 100 }
   );
   ```

3. **Property 4 測試：資料匯出淨化**
   ```typescript
   // Feature: nano-banana-architecture, Property 4: 資料匯出淨化正確性
   fc.assert(
     fc.property(arbitraryPromptState(), (state) => {
       const exported = sanitizeForExport(state);
       return exported.camera.visualYOffset === undefined &&
              (state.optics.useAdvancedLighting || exported.optics.lightIntensity === 0);
     }),
     { numRuns: 100 }
   );
   ```

### Integration Tests

測試完整的使用者流程：

1. **預設集載入流程**
   - 選擇預設集 → 驗證狀態更新 → 驗證 UI 反映

2. **側邊欄收合流程**
   - 點擊收合按鈕 → 驗證動畫 → 驗證 LocalStorage → 重新載入驗證

3. **影像生成流程**
   - 配置參數 → 生成提示詞 → 呼叫 API → 顯示結果

### Visual Regression Tests

使用 Playwright 進行視覺回歸測試：

1. 三種裝置尺寸的截圖對比（Desktop, Tablet, Mobile）
2. 側邊欄收合前後的佈局對比
3. 各個配置區段的 UI 一致性

## Implementation Notes

### CSS 動畫策略

使用 Tailwind 的 transition 類別配合條件渲染：

```typescript
<aside className={`
  transition-all duration-300 ease-in-out
  ${leftSidebarOpen ? 'w-80' : 'w-0 -translate-x-full'}
  md:${leftSidebarOpen ? 'translate-x-0' : ''}
`}>
```

### 響應式斷點

```typescript
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

function getDeviceType(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
}
```

### 效能優化

1. **useMemo** 用於提示詞組裝（避免每次渲染重新計算）
2. **useCallback** 用於事件處理函數（避免子元件不必要的重新渲染）
3. **React.memo** 用於純展示型元件（PresetThumbnail, SectionHeader）
4. **延遲載入** 預設集封面圖片（使用 loading="lazy"）

### Accessibility 考量

1. 側邊欄收合按鈕應有 `aria-label` 和 `aria-expanded` 屬性
2. 覆蓋層背景應有 `role="button"` 和鍵盤支援（Enter/Space）
3. 導航項目應支援鍵盤導航（Tab, Arrow keys）
4. 顏色對比度符合 WCAG AA 標準（至少 4.5:1）
