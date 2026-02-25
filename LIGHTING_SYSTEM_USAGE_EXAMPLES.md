# 燈光參數驅動系統 - 使用範例

## 快速開始

### 基本使用

```typescript
import { generateCompleteLightingPrompt } from './utils/lightingPromptGenerator';

// 定義當前的燈光設定
const keyLight = {
  azimuth: 45,
  elevation: 40,
  color: '#ffffff',
  intensity: 85
};

const fillLight = {
  azimuth: 225,
  elevation: 15,
  color: '#cbd5e1',
  intensity: 30
};

const rimLight = {
  azimuth: 225,
  elevation: 45,
  color: '#ffffff',
  intensity: 50
};

// 生成 Prompt
const prompt = generateCompleteLightingPrompt(
  keyLight,
  fillLight,
  rimLight,
  'rembrandt',  // 選中的 Preset ID
  false         // 是否為產品攝影模式
);

console.log(prompt);
// 輸出：(Geometry) Rembrandt lighting style, Triangle catchlight on cheek, ...
```

---

## 情境範例

### 情境 1：人像攝影 - 完全符合 Preset

**使用者操作**：
1. 選擇「林布蘭光 (Rembrandt)」
2. 不調整滑桿（或僅微調 ±5°）

**代碼**：
```typescript
const prompt = generateCompleteLightingPrompt(
  { azimuth: 45, elevation: 40, color: '#ffffff', intensity: 85 },
  { azimuth: 225, elevation: 15, color: '#cbd5e1', intensity: 30 },
  { azimuth: 225, elevation: 45, color: '#ffffff', intensity: 50 },
  'rembrandt',
  false  // 人像模式
);
```

**輸出**：
```
(Geometry) Rembrandt lighting style, Triangle catchlight on cheek, Classic 45-degree portrait setup, Nose shadow reaching toward cheek, (Key Light) Main illumination in neutral white color, (Style) Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows, Renaissance painting quality.
```

**特點**：
- ✅ 包含完整的幾何標籤（Rembrandt lighting style）
- ✅ 包含風格標籤（Dramatic chiaroscuro）
- ✅ 使用人像用語（cheek, nose shadow）

---

### 情境 2：人像攝影 - 調整角度（風格繼承）

**使用者操作**：
1. 選擇「林布蘭光 (Rembrandt)」
2. 將主光移到 80°（偏離 35°，超過容許誤差）

**代碼**：
```typescript
const prompt = generateCompleteLightingPrompt(
  { azimuth: 80, elevation: 40, color: '#ffffff', intensity: 85 },
  { azimuth: 225, elevation: 15, color: '#cbd5e1', intensity: 30 },
  { azimuth: 225, elevation: 45, color: '#ffffff', intensity: 50 },
  'rembrandt',
  false
);
```

**輸出**：
```
(Geometry) Key light positioned at side slightly above with strong intensity, (Key Light) Main illumination in neutral white color, (Style) Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows, Renaissance painting quality.
```

**特點**：
- ❌ 移除幾何標籤（不再是 Rembrandt）
- ✅ 保留風格標籤（仍然是戲劇性的明暗對比）
- ✅ 加入物理描述（Key light positioned at side）

---

### 情境 3：產品攝影 - 完全符合 Preset

**使用者操作**：
1. 選擇「林布蘭光 (Rembrandt)」
2. 系統偵測到產品攝影模式（subject.type 包含 "product" 或 "bottle"）

**代碼**：
```typescript
const prompt = generateCompleteLightingPrompt(
  { azimuth: 45, elevation: 40, color: '#ffffff', intensity: 85 },
  { azimuth: 225, elevation: 15, color: '#cbd5e1', intensity: 30 },
  { azimuth: 225, elevation: 45, color: '#ffffff', intensity: 50 },
  'rembrandt',
  true  // 產品模式
);
```

**輸出**：
```
(Geometry) Rembrandt lighting style, Triangle reflective highlight on surface, Classic 45-degree portrait setup, volume shadow reaching toward surface, (Key Light) Main illumination in neutral white color, (Style) Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows, Renaissance painting quality.
```

**特點**：
- ✅ 自動替換用語：
  - `cheek` → `surface`
  - `catchlight` → `reflective highlight`
  - `nose shadow` → `volume shadow`

---

### 情境 4：產品攝影 - 調整角度 + 顏色

**使用者操作**：
1. 選擇「林布蘭光 (Rembrandt)」
2. 將主光移到 80°
3. 將主光顏色改為暖橘色 (#ff6b35)

**代碼**：
```typescript
const prompt = generateCompleteLightingPrompt(
  { azimuth: 80, elevation: 40, color: '#ff6b35', intensity: 85 },
  { azimuth: 225, elevation: 15, color: '#cbd5e1', intensity: 30 },
  { azimuth: 225, elevation: 45, color: '#ffffff', intensity: 50 },
  'rembrandt',
  true
);
```

**輸出**：
```
(Geometry) Key light positioned at side slightly above with strong intensity, (Key Light) Main illumination in warm orange color, (Style) Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows, Renaissance painting quality.
```

**特點**：
- ❌ 移除幾何標籤
- ✅ 保留風格標籤
- ✅ 明確標示顏色（warm orange color）
- ✅ 物理描述（side slightly above）

---

### 情境 5：不同的 Preset - 蝴蝶光 (Butterfly)

**使用者操作**：
1. 選擇「蝴蝶光 (Butterfly)」
2. 不調整滑桿

**代碼**：
```typescript
const prompt = generateCompleteLightingPrompt(
  { azimuth: 0, elevation: 50, color: '#ffffff', intensity: 90 },
  { azimuth: 180, elevation: -20, color: '#e0e7ff', intensity: 30 },
  { azimuth: 180, elevation: 40, color: '#ffffff', intensity: 40 },
  'butterfly',
  false
);
```

**輸出**：
```
(Geometry) Butterfly lighting, Glamour lighting setup, Centered high-angle key light, Butterfly-shaped shadow under nose, Beauty lighting pattern, (Key Light) Main illumination in neutral white color, (Style) Rendering with Soft flattering illumination, Even facial modeling, Glamorous aesthetic, Minimal shadow depth, Fashion photography quality.
```

---

### 情境 6：不同的 Preset - 側光 (Split)

**使用者操作**：
1. 選擇「側光 (Split)」
2. 不調整滑桿

**代碼**：
```typescript
const prompt = generateCompleteLightingPrompt(
  { azimuth: 90, elevation: 0, color: '#ffffff', intensity: 95 },
  { azimuth: 0, elevation: 0, color: '#cbd5e1', intensity: 0 },
  { azimuth: 270, elevation: 0, color: '#ffffff', intensity: 0 },
  'split',
  false
);
```

**輸出**：
```
(Geometry) Split lighting, Side profile illumination, 90-degree side light, Half-lit half-shadow division, Vertical light-dark split, (Key Light) Main illumination in neutral white color, (Style) Rendering with Mystery and drama, High contrast, Stark separation, Film noir aesthetic, Intense mood.
```

---

## 進階使用

### 獲取詳細的生成結果

如果你需要更多資訊（如偏差值、模式判定），可以使用 `generateLightingPrompt`：

```typescript
import { generateLightingPrompt } from './utils/lightingPromptGenerator';

const result = generateLightingPrompt(
  keyLight,
  fillLight,
  rimLight,
  'rembrandt',
  false
);

console.log('Mode:', result.mode);  // 'perfect_match' or 'style_inheritance'
console.log('Preset Name:', result.presetName);  // 'Rembrandt Lighting'
console.log('Azimuth Deviation:', result.deviationInfo.azimuthDiff);  // 5
console.log('Elevation Deviation:', result.deviationInfo.elevationDiff);  // 3
console.log('Geometry Tags:', result.geometryTags);
console.log('Style Tags:', result.styleTags);
```

### 在 UI 中顯示模式提示

```tsx
import { generateLightingPrompt } from './utils/lightingPromptGenerator';

function LightingSection() {
  const result = generateLightingPrompt(
    keyLight,
    fillLight,
    rimLight,
    selectedPreset,
    isProductMode
  );
  
  return (
    <div>
      {/* 模式指示器 */}
      {result.mode === 'perfect_match' && (
        <div className="text-green-400 text-sm">
          ✓ Perfect Match: {result.presetName}
        </div>
      )}
      
      {result.mode === 'style_inheritance' && (
        <div className="text-orange-400 text-sm">
          ⚠ Style Inheritance: Angle adjusted from {result.presetName}
          <br />
          Deviation: {result.deviationInfo.azimuthDiff}° azimuth, 
          {result.deviationInfo.elevationDiff}° elevation
        </div>
      )}
      
      {/* 重置按鈕 */}
      {result.deviationInfo.azimuthDiff > 20 && (
        <button onClick={resetToPresetAngles}>
          Reset to {result.presetName} base angles
        </button>
      )}
    </div>
  );
}
```

---

## 整合到現有系統

### 在 OpticsSection 中使用

```tsx
// components/sections/OpticsSection.tsx

import { formatLightingSection } from '../../utils/lightingFormatters';

function OpticsSection({ state, onUpdate }) {
  // 偵測產品攝影模式
  const isProductMode = 
    state.camera.framingMode === 'product' || 
    state.subject.type.toLowerCase().includes('product');
  
  // 生成燈光 Prompt（自動使用新系統）
  const lightingPrompt = formatLightingSection(
    state.optics.keyLight,
    state.optics.fillLight,
    state.optics.rimLight,
    state.optics.studioSetup,
    undefined,  // promptTags 不再使用
    isProductMode
  );
  
  return (
    <div>
      {/* UI 組件 */}
      <LightingPresetGrid
        currentSetup={state.optics.studioSetup}
        onSetupSelect={handleSetupSelect}
      />
      
      {/* 顯示生成的 Prompt */}
      <div className="mt-4 p-4 bg-slate-900 rounded">
        <p className="text-sm text-slate-300">{lightingPrompt}</p>
      </div>
    </div>
  );
}
```

---

## 常見問題

### Q1: 如何新增自定義 Preset？

在 `utils/lightingPresetDatabase.ts` 中新增定義：

```typescript
export const LIGHTING_PRESET_DATABASE: Record<string, LightingPresetDefinition> = {
  // ... 現有 Presets
  
  my_custom_preset: {
    id: 'my_custom_preset',
    name: 'My Custom Lighting',
    
    base_params: {
      keyLight: { azimuth: 60, elevation: 30 },
      fillLight: { azimuth: 240, elevation: 20 },
      rimLight: { azimuth: 240, elevation: 50 }
    },
    
    tolerance: {
      azimuth: 15,
      elevation: 15
    },
    
    geometry_tags: [
      'Custom lighting setup',
      'Unique angle configuration'
    ],
    
    style_tags: [
      'Artistic mood',
      'Creative rendering'
    ]
  }
};
```

### Q2: 如何調整容許誤差？

修改 Preset 定義中的 `tolerance` 值：

```typescript
tolerance: {
  azimuth: 20,   // 更寬鬆的方位角容許誤差
  elevation: 10  // 更嚴格的仰角容許誤差
}
```

### Q3: 如何新增產品模式的用語映射？

在 Preset 定義中加入 `product_mode_mapping`：

```typescript
product_mode_mapping: {
  'portrait term': 'product term',
  'face': 'surface',
  'skin': 'texture'
}
```

---

## 總結

新的燈光參數驅動系統提供了：

1. **智能檢測**：自動判定使用者是否偏離 Preset
2. **風格保留**：即使角度改變，仍保留質感描述
3. **清晰分離**：明確標示顏色和物理屬性
4. **產品模式**：自動替換人像用語
5. **易於擴展**：新增 Preset 只需定義資料

使用時無需修改現有 UI，系統會自動處理所有邏輯。
