# Design Document: Studio Lighting System

## Overview

Studio Lighting System 是 Nano Banana 的燈光物理控制模組，提供專業級的三點照明系統、攝影棚預設選擇、互動式光源旋轉控制，以及豐富的情緒氛圍管理功能。系統採用 SVG + CSS 技術實現高效能的即時視覺化預覽，無需 3D 渲染引擎即可提供清晰直觀的光影效果展示。

## Architecture

### High-Level Component Structure

```
OpticsSection (Main Container)
├── Mood & Atmosphere Section
│   ├── Mood Textarea (自由描述)
│   ├── Custom Tag Input (自定義標籤管理)
│   │   ├── Input Field + Add Button
│   │   └── Custom Tags Display (with delete)
│   └── Preset Mood Tags (預設標籤組)
│       ├── 商業與簡潔 (6+ tags)
│       ├── 電影與氛圍 (6+ tags)
│       └── 藝術與夢幻 (6+ tags)
│
├── Advanced Lighting Toggle
│   ├── Toggle Switch (啟用/停用)
│   └── Visual Indicator (發光效果)
│
└── Advanced Lighting Controls (conditional render)
    ├── Studio Presets Grid (10 預設)
    │   └── Preset Cards (name + description)
    │
    ├── Left Column: Visualization
    │   ├── PortraitLightingVisualizer (SVG + CSS)
    │   └── Light Rotation Controller (互動式圓盤)
    │
    └── Right Column: Light Layer Controls
        ├── Layer Tabs (Key/Fill/Rim/Ambient)
        └── Layer Control Panel (conditional render)
            ├── Key Light: Color + Intensity
            ├── Fill Light: Color + Intensity
            ├── Rim Light: Color + Intensity
            └── Ambient Light: Color only
```

### Data Flow

```
User Interaction
      ↓
Event Handler (handleMoodTagClick, handleRotationChange, etc.)
      ↓
onChange({ ...config, [field]: newValue })
      ↓
Parent Component (App.tsx)
      ↓
Updated OpticsConfig
      ↓
Re-render OpticsSection + PortraitLightingVisualizer
```

## Components and Interfaces

### Core Interfaces

```typescript
interface OpticsConfig {
  // Mood & Atmosphere
  mood: string;
  
  // Advanced Lighting Toggle
  useAdvancedLighting: boolean;
  
  // Studio Setup
  studioSetup: string; // 'rembrandt' | 'butterfly' | ... | 'manual'
  lightRotation: number; // 0-360°
  
  // Key Light (主光)
  lightColor: string; // hex color
  lightIntensity: number; // 0-100
  
  // Fill Light (補光)
  fillLightColor: string;
  fillLightIntensity: number; // 0-100
  
  // Rim Light (輪廓光)
  rimLightColor: string;
  rimLightIntensity: number; // 0-100
  
  // Ambient Light (環境光)
  ambientColor: string;
  
  // Legacy fields (for compatibility)
  dof: string;
  source: string;
}

interface OpticsSectionProps {
  config: OpticsConfig;
  customTags: string[]; // 自定義情緒標籤
  setCustomTags: (tags: string[]) => void;
  onChange: (config: OpticsConfig) => void;
}
```


### Studio Setup Presets

```typescript
// From constants.tsx
const STUDIO_SETUPS = [
  { id: 'rembrandt', name: '林布蘭光', angle: 45, desc: '臉頰處形成三角形光斑' },
  { id: 'butterfly', name: '蝴蝶光', angle: 0, desc: '鼻子下方形成蝴蝶狀陰影' },
  { id: 'split', name: '側光/分割光', angle: 90, desc: '半臉亮半臉暗' },
  { id: 'loop', name: '環形光', angle: 30, desc: '鼻子旁有小環狀陰影' },
  { id: 'rim', name: '輪廓光/背光', angle: 180, desc: '邊緣發光' },
  { id: 'clamshell', name: '貝殼光', angle: 0, desc: '上下柔和補光' },
  { id: 'broad', name: '寬光', angle: 45, desc: '照亮面向相機的一側' },
  { id: 'short', name: '窄光', angle: 45, desc: '照亮背向相機的一側' },
  { id: 'flat', name: '平光', angle: 0, desc: '陰影極少' },
  { id: 'high_key', name: '高調光', angle: 0, desc: '明亮，純白背景' }
];
```

### Mood Tag Groups

```typescript
// From constants.tsx
const MOOD_TAGS: TagGroup[] = [
  {
    name: '商業與簡潔 (Commercial)',
    tags: ['高調商業', '極簡主義', '奢華', '乾淨俐落', '產品英雄照', '鮮豔']
  },
  {
    name: '電影與氛圍 (Moody)',
    tags: ['黑色電影', '陰鬱黑暗', '戲劇性對比', '史詩感', '憂鬱', '賽博龐克']
  },
  {
    name: '藝術與夢幻 (Artistic)',
    tags: ['空靈', '超 surreal', '柔和夢境', '復古', '粉彩流行', '朦朧氛圍']
  }
];
```

## Data Models

### State Management

**Local Component State:**
```typescript
const [activeLayer, setActiveLayer] = useState<'key' | 'fill' | 'rim' | 'ambient'>('key');
const [newTag, setNewTag] = useState('');
```

**Props State (from parent):**
```typescript
config: OpticsConfig // 當前光學配置
customTags: string[] // 自定義情緒標籤
```

### LocalStorage Schema

```typescript
// Key: 'banana_custom_tags'
interface CustomTags {
  mood: string[]; // 自定義情緒標籤
  // ... other categories
}
```

### Event Handlers

```typescript
// Mood tag click - appends tag to mood string
const handleMoodTagClick = (tag: string) => {
  const currentMood = config.mood.trim();
  if (currentMood.includes(tag)) return; // Prevent duplicates
  const newMood = currentMood === '' ? tag : `${currentMood}, ${tag}`;
  onChange({ ...config, mood: newMood });
};

// Custom tag management
const handleAddCustomTag = (e: React.FormEvent) => {
  e.preventDefault();
  if (newTag.trim() && !customTags.includes(newTag.trim())) {
    setCustomTags([...customTags, newTag.trim()]);
    setNewTag('');
  }
};

const removeCustomTag = (tagToRemove: string, e: React.MouseEvent) => {
  e.stopPropagation();
  setCustomTags(customTags.filter(t => t !== tagToRemove));
};

// Studio preset selection
const handleSetupSelect = (setup: typeof STUDIO_SETUPS[0]) => {
  if (!config.useAdvancedLighting) return;
  onChange({
    ...config,
    studioSetup: setup.id,
    lightRotation: setup.angle
  });
};

// Light rotation control (drag interaction)
const handleRotationChange = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!config.useAdvancedLighting) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
  const normalizedAngle = (angle + 90 + 360) % 360; // Normalize to 0-360
  onChange({ 
    ...config, 
    lightRotation: Math.round(normalizedAngle), 
    studioSetup: 'manual' 
  });
};
```

## Visual Design: PortraitLightingVisualizer

### Current Implementation Analysis

**Strengths:**
- Uses SVG for scalable face silhouette
- CSS transitions for smooth animations
- Multiple blend modes for light mixing

**Areas for Improvement:**
1. **Shadow rendering** - Current gradient masks are simplistic
2. **Light direction indication** - Not clear where light is coming from
3. **Fill light effect** - Barely visible in current implementation
4. **Rim light effect** - Only shows as edge glow, not realistic

### Enhanced SVG + CSS Design

#### Architecture

```
<div className="visualizer-container">
  {/* Background Layer: Ambient Color */}
  <div className="ambient-layer" style={{ backgroundColor: ambientColor }} />
  
  {/* Rim Light Glow (Behind face) */}
  <div className="rim-glow" style={{ 
    backgroundColor: rimLightColor,
    opacity: rimLightIntensity / 100,
    filter: 'blur(40px)'
  }} />
  
  {/* Face SVG with Multiple Layers */}
  <svg viewBox="0 0 100 150">
    <defs>
      {/* SVG Filters for realistic shadows */}
      <filter id="softShadow">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
        <feOffset dx="2" dy="2"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.4"/>
        </feComponentTransfer>
      </filter>
      
      {/* Gradient for key light direction */}
      <radialGradient id="keyLightGrad" 
        cx={50 + Math.cos(lightRotation * Math.PI/180) * 30}
        cy={50 + Math.sin(lightRotation * Math.PI/180) * 30}>
        <stop offset="0%" stopColor={lightColor} stopOpacity={lightIntensity/100} />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      
      {/* Gradient for fill light (opposite side) */}
      <radialGradient id="fillLightGrad"
        cx={50 - Math.cos(lightRotation * Math.PI/180) * 20}
        cy={50 - Math.sin(lightRotation * Math.PI/180) * 20}>
        <stop offset="0%" stopColor={fillLightColor} stopOpacity={fillLightIntensity/100} />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>
    
    {/* Base face shape */}
    <path d="M50 10 C30 10, 20 40, 20 80..." fill="#475569" />
    
    {/* Key light layer */}
    <path d="..." fill="url(#keyLightGrad)" style={{ mixBlendMode: 'screen' }} />
    
    {/* Fill light layer */}
    <path d="..." fill="url(#fillLightGrad)" style={{ mixBlendMode: 'soft-light' }} />
    
    {/* Shadow mask (based on studioSetup) */}
    <path d="..." fill="black" opacity={0.7} style={{ mixBlendMode: 'multiply' }} />
  </svg>
  
  {/* Light Direction Indicator */}
  <svg className="direction-indicator">
    <line x1="50%" y1="50%" 
          x2={50 + Math.cos(lightRotation * Math.PI/180) * 40}
          y2={50 + Math.sin(lightRotation * Math.PI/180) * 40}
          stroke="yellow" strokeWidth="2" markerEnd="url(#arrow)" />
  </svg>
  
  {/* Rim Light Edge Highlight */}
  <div className="rim-highlight" style={{
    boxShadow: `inset -10px 0 15px -5px ${rimLightColor}`,
    opacity: rimLightIntensity / 100
  }} />
</div>
```


#### Shadow Mask Generation

Different studio setups require different shadow patterns:

```typescript
const getShadowMask = (studioSetup: string, lightRotation: number) => {
  switch (studioSetup) {
    case 'split':
      // Half face in shadow
      return 'linear-gradient(90deg, transparent 50%, rgba(0,0,0,0.8) 50%)';
      
    case 'rembrandt':
      // Triangle of light on cheek
      return 'radial-gradient(ellipse at 35% 45%, transparent 15%, rgba(0,0,0,0.7) 35%)';
      
    case 'butterfly':
      // Shadow under nose
      return 'radial-gradient(circle at 50% 30%, transparent 40%, rgba(0,0,0,0.6) 80%)';
      
    case 'loop':
      // Small loop shadow beside nose
      return 'radial-gradient(circle at 40% 40%, transparent 20%, rgba(0,0,0,0.7) 50%)';
      
    case 'rim':
      // Most of face in shadow (backlit)
      return 'rgba(0,0,0,0.9)';
      
    case 'high_key':
      // Minimal shadow (bright)
      return 'rgba(255,255,255,0.05)';
      
    case 'manual':
    default:
      // Dynamic shadow based on light rotation
      return `linear-gradient(${lightRotation + 90}deg, transparent 30%, rgba(0,0,0,0.7) 90%)`;
  }
};
```

#### CSS Blend Modes Strategy

```css
/* Key Light - Additive lighting */
.key-light-layer {
  mix-blend-mode: screen; /* Brightens */
}

/* Fill Light - Soft illumination */
.fill-light-layer {
  mix-blend-mode: soft-light; /* Gentle brightening */
}

/* Rim Light - Edge highlight */
.rim-light-layer {
  mix-blend-mode: overlay; /* Strong highlight */
}

/* Shadow - Subtractive */
.shadow-layer {
  mix-blend-mode: multiply; /* Darkens */
}

/* Ambient - Base tone */
.ambient-layer {
  mix-blend-mode: normal; /* Background */
}
```

### Light Rotation Controller Design

#### Interactive Circular Controller

```typescript
<div className="rotation-controller">
  {/* Circular track */}
  <svg className="track" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="80" 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="2"
            strokeDasharray="5,5" />
    
    {/* Angle markers (every 45°) */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
      <line key={angle}
            x1="100" y1="20"
            x2="100" y2="30"
            transform={`rotate(${angle} 100 100)`}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2" />
    ))}
    
    {/* Cardinal direction labels */}
    <text x="100" y="15" textAnchor="middle" fill="white" fontSize="10">0°</text>
    <text x="185" y="105" textAnchor="middle" fill="white" fontSize="10">90°</text>
    <text x="100" y="195" textAnchor="middle" fill="white" fontSize="10">180°</text>
    <text x="15" y="105" textAnchor="middle" fill="white" fontSize="10">270°</text>
  </svg>
  
  {/* Draggable light indicator */}
  <div className="light-indicator"
       style={{
         transform: `rotate(${lightRotation}deg)`,
         transformOrigin: 'center'
       }}>
    <div className="light-dot" 
         style={{ 
           backgroundColor: lightColor,
           boxShadow: `0 0 20px ${lightColor}`
         }} />
  </div>
  
  {/* Center label */}
  <div className="center-label">DRAG LIGHT</div>
</div>
```

#### Drag Interaction Logic

```typescript
const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  if (!config.useAdvancedLighting) return;
  
  const moveHandler = (moveEvent: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle from center
    const deltaX = moveEvent.clientX - centerX;
    const deltaY = moveEvent.clientY - centerY;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Normalize to 0-360° (0° = top, clockwise)
    const normalizedAngle = (angle + 90 + 360) % 360;
    
    onChange({ 
      ...config, 
      lightRotation: Math.round(normalizedAngle),
      studioSetup: 'manual' // Override preset when manually adjusted
    });
  };
  
  const upHandler = () => {
    window.removeEventListener('mousemove', moveHandler);
    window.removeEventListener('mouseup', upHandler);
  };
  
  window.addEventListener('mousemove', moveHandler);
  window.addEventListener('mouseup', upHandler);
  
  // Initial position
  moveHandler(e as unknown as MouseEvent);
};
```

## Correctness Properties

*屬性（Property）是一個應該在系統所有有效執行中保持為真的特徵或行為——本質上是關於系統應該做什麼的形式化陳述。屬性作為人類可讀規範和機器可驗證正確性保證之間的橋樑。*

### Property 1: 情緒標籤附加與去重

*For any* 預設或自定義情緒標籤，點擊該標籤應該將其附加到 mood 字串的末尾（以逗號分隔），且如果標籤已存在於 mood 中，則不應重複添加。

**Validates: Requirements 1.5, 1.6**

### Property 2: 自定義標籤管理與去重

*For any* 非空白的標籤字串，添加到自定義標籤集合應該成功，且如果標籤已存在於集合中，則不應重複添加，集合應保持不變。

**Validates: Requirements 2.2, 2.3, 17.1, 17.2**

### Property 3: 自定義標籤持久化 Round-Trip

*For any* 自定義標籤陣列，儲存到 LocalStorage 後重新載入，應該能夠恢復完全相同的標籤陣列（順序和內容都相同）。

**Validates: Requirements 2.8, 2.9**

### Property 4: 進階燈光停用時的互動禁用

*For any* OpticsConfig，當 useAdvancedLighting 為 false 時，所有燈光控制區域應該具有 pointer-events-none 或 disabled 屬性，且視覺上應該降低透明度。

**Validates: Requirements 3.4**

### Property 5: 進階燈光停用時的導出省略

*For any* OpticsConfig，當 useAdvancedLighting 為 false 時，導出的配置應該省略所有燈光參數（lightColor, lightIntensity, fillLightColor, fillLightIntensity, rimLightColor, rimLightIntensity, lightRotation, studioSetup）。

**Validates: Requirements 3.7**

### Property 6: 攝影棚預設選擇同步更新

*For any* STUDIO_SETUPS 中的預設，點擊該預設應該同時更新 studioSetup 為預設的 id，且 lightRotation 為預設的 angle 值。

**Validates: Requirements 4.5**

### Property 7: 光源角度標準化

*For any* 計算出的角度值（包括負數或大於 360 的值），儲存到 lightRotation 的值應該被標準化為 0-360° 範圍內的整數。

**Validates: Requirements 5.6, 17.3**

### Property 8: 手動旋轉覆蓋預設

*For any* 透過拖曳改變的 lightRotation 值，studioSetup 應該被設定為 'manual'，表示使用者已覆蓋預設配置。

**Validates: Requirements 5.10**

### Property 9: 光源參數即時更新

*For any* 有效的顏色值（hex）或強度值（0-100），改變該值應該立即呼叫 onChange callback 並傳遞包含新值的完整 OpticsConfig 物件。

**Validates: Requirements 7.5, 7.6, 13.3**

### Property 10: 光源強度範圍限制

*For any* lightIntensity, fillLightIntensity, 或 rimLightIntensity 的值，儲存的值應該被限制在 0-100 範圍內（包含邊界）。

**Validates: Requirements 17.4**


## Error Handling

### Input Validation

```typescript
// Whitespace-only tag prevention
const isValidTag = (tag: string): boolean => {
  return tag.trim().length > 0;
};

// Duplicate tag check
const isDuplicateTag = (tag: string, existingTags: string[]): boolean => {
  return existingTags.includes(tag.trim());
};

// Angle normalization
const normalizeAngle = (angle: number): number => {
  return ((angle % 360) + 360) % 360;
};

// Intensity clamping
const clampIntensity = (value: number): number => {
  return Math.max(0, Math.min(100, value));
};
```

### LocalStorage Error Handling

```typescript
const safeLocalStorageSet = (key: string, value: any): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to save to localStorage: ${key}`, error);
    return false;
  }
};

const safeLocalStorageGet = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Failed to read from localStorage: ${key}`, error);
    return defaultValue;
  }
};
```

### Prop Validation

```typescript
// Ensure config is valid
const validateOpticsConfig = (config: OpticsConfig | undefined): OpticsConfig => {
  if (!config) {
    console.warn('OpticsConfig is undefined, using default values');
    return DEFAULT_OPTICS_CONFIG;
  }
  
  return {
    ...config,
    lightRotation: normalizeAngle(config.lightRotation),
    lightIntensity: clampIntensity(config.lightIntensity),
    fillLightIntensity: clampIntensity(config.fillLightIntensity),
    rimLightIntensity: clampIntensity(config.rimLightIntensity)
  };
};
```

## Testing Strategy

### Unit Tests

使用 Vitest 進行單元測試，重點測試：

1. **事件處理函數**
   - `handleMoodTagClick` - 標籤附加和去重邏輯
   - `handleAddCustomTag` - 自定義標籤添加和驗證
   - `handleRotationChange` - 角度計算和標準化
   - `handleSetupSelect` - 預設選擇和參數同步

2. **工具函數**
   - `normalizeAngle` - 角度標準化（負數、>360、邊界值）
   - `clampIntensity` - 強度限制（負數、>100、邊界值）
   - `isValidTag` - 標籤驗證（空白、空字串、有效字串）
   - `getShadowMask` - 陰影遮罩生成（所有預設類型）

3. **LocalStorage 操作**
   - `safeLocalStorageSet` - 儲存成功和失敗情況
   - `safeLocalStorageGet` - 讀取成功、失敗、不存在的情況

### Property-Based Tests

使用 fast-check 進行屬性測試（每個測試至少 100 次迭代）：

#### Property 1 測試：情緒標籤附加與去重

```typescript
// Feature: studio-lighting-system, Property 1: 情緒標籤附加與去重
import fc from 'fast-check';

fc.assert(
  fc.property(
    fc.string({ minLength: 1, maxLength: 50 }), // tag
    fc.string(), // existing mood
    (tag, existingMood) => {
      const result = appendMoodTag(tag, existingMood);
      
      // Should contain the tag
      const containsTag = result.includes(tag);
      
      // Should not have duplicate tags
      const tags = result.split(',').map(t => t.trim());
      const uniqueTags = [...new Set(tags)];
      const noDuplicates = tags.length === uniqueTags.length;
      
      return containsTag && noDuplicates;
    }
  ),
  { numRuns: 100 }
);
```

#### Property 2 測試：自定義標籤管理與去重

```typescript
// Feature: studio-lighting-system, Property 2: 自定義標籤管理與去重
fc.assert(
  fc.property(
    fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
    fc.array(fc.string({ minLength: 1, maxLength: 50 })),
    (newTag, existingTags) => {
      const result = addCustomTag(newTag, existingTags);
      
      // Should contain the new tag
      const containsTag = result.includes(newTag.trim());
      
      // Should not have duplicates
      const uniqueTags = [...new Set(result)];
      const noDuplicates = result.length === uniqueTags.length;
      
      return containsTag && noDuplicates;
    }
  ),
  { numRuns: 100 }
);
```

#### Property 3 測試：自定義標籤持久化 Round-Trip

```typescript
// Feature: studio-lighting-system, Property 3: 自定義標籤持久化 Round-Trip
fc.assert(
  fc.property(
    fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 20 }),
    (tags) => {
      // Save to LocalStorage
      safeLocalStorageSet('test_custom_tags', tags);
      
      // Retrieve from LocalStorage
      const retrieved = safeLocalStorageGet<string[]>('test_custom_tags', []);
      
      // Should be deeply equal
      return JSON.stringify(tags) === JSON.stringify(retrieved);
    }
  ),
  { numRuns: 100 }
);
```

#### Property 7 測試：光源角度標準化

```typescript
// Feature: studio-lighting-system, Property 7: 光源角度標準化
fc.assert(
  fc.property(
    fc.integer({ min: -1000, max: 1000 }),
    (angle) => {
      const normalized = normalizeAngle(angle);
      
      // Should be in 0-360 range
      const inRange = normalized >= 0 && normalized < 360;
      
      // Should be equivalent modulo 360
      const equivalent = Math.abs((angle % 360) - normalized) < 1 || 
                        Math.abs((angle % 360) - normalized + 360) < 1;
      
      return inRange && equivalent;
    }
  ),
  { numRuns: 100 }
);
```

#### Property 10 測試：光源強度範圍限制

```typescript
// Feature: studio-lighting-system, Property 10: 光源強度範圍限制
fc.assert(
  fc.property(
    fc.integer({ min: -100, max: 200 }),
    (intensity) => {
      const clamped = clampIntensity(intensity);
      
      // Should be in 0-100 range
      return clamped >= 0 && clamped <= 100;
    }
  ),
  { numRuns: 100 }
);
```

### Integration Tests

測試完整的使用者流程：

1. **情緒標籤選擇流程**
   - 點擊預設標籤 → 驗證 mood 更新 → 驗證 UI 反映

2. **自定義標籤管理流程**
   - 輸入新標籤 → 點擊新增 → 驗證標籤出現 → 點擊刪除 → 驗證標籤消失

3. **攝影棚預設選擇流程**
   - 啟用進階燈光 → 選擇預設 → 驗證 studioSetup 和 lightRotation 更新 → 驗證視覺化器反映

4. **光源旋轉流程**
   - 拖曳旋轉控制器 → 驗證 lightRotation 更新 → 驗證 studioSetup 變為 'manual' → 驗證視覺化器反映

5. **光源層級切換流程**
   - 切換到 Fill 層 → 調整顏色和強度 → 驗證 config 更新 → 驗證視覺化器反映

### Visual Regression Tests

使用 Playwright 進行視覺回歸測試：

1. **PortraitLightingVisualizer 截圖對比**
   - 不同 studioSetup 的視覺效果
   - 不同 lightRotation 的陰影變化
   - 不同光源顏色和強度的混合效果

2. **Light Rotation Controller 截圖對比**
   - 不同角度的光源指示器位置
   - Hover 和 Active 狀態的視覺回饋

3. **進階燈光停用狀態**
   - 停用時的灰階和透明度效果

## Implementation Notes

### CSS Animation Strategy

```css
/* Smooth transitions for all lighting changes */
.visualizer-container * {
  transition: all 700ms ease-in-out;
}

/* Faster transitions for UI interactions */
.tag-button {
  transition: all 300ms ease-in-out;
}

/* Rotation animation */
.light-indicator {
  transition: transform 300ms ease-out;
}
```

### Performance Optimization

1. **React.memo** 用於 PortraitLightingVisualizer
   ```typescript
   export default React.memo(PortraitLightingVisualizer, (prev, next) => {
     return prev.config.lightRotation === next.config.lightRotation &&
            prev.config.lightColor === next.config.lightColor &&
            prev.config.lightIntensity === next.config.lightIntensity &&
            // ... other relevant fields
   });
   ```

2. **useCallback** 用於事件處理函數
   ```typescript
   const handleMoodTagClick = useCallback((tag: string) => {
     // ... implementation
   }, [config.mood, onChange]);
   ```

3. **CSS transforms** 而非 position 屬性
   ```css
   /* Good - GPU accelerated */
   transform: rotate(45deg) translate(10px, 20px);
   
   /* Avoid - triggers layout reflow */
   top: 20px;
   left: 10px;
   ```

### Accessibility Considerations

1. **鍵盤導航**
   ```typescript
   <button
     onClick={handleClick}
     onKeyDown={(e) => {
       if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         handleClick();
       }
     }}
     aria-label="Select Rembrandt lighting setup"
   />
   ```

2. **ARIA 屬性**
   ```typescript
   <div
     role="slider"
     aria-label="Light rotation angle"
     aria-valuemin={0}
     aria-valuemax={360}
     aria-valuenow={config.lightRotation}
     aria-valuetext={`${config.lightRotation} degrees`}
   />
   ```

3. **顏色對比度**
   - 確保所有文字與背景的對比度至少 4.5:1
   - 使用 WebAIM Contrast Checker 驗證

### Browser Compatibility

- **SVG Filters**: 支援所有現代瀏覽器（IE11+ 需要 polyfill）
- **CSS Blend Modes**: 支援 Chrome 35+, Firefox 32+, Safari 8+
- **CSS Transforms**: 支援所有現代瀏覽器
- **LocalStorage**: 支援所有現代瀏覽器（需要錯誤處理）

