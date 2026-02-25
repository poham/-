# 燈光參數驅動系統 - 重構完成報告

## 概述

本次重構將原本的「字串疊加（String Concatenation）」系統升級為「參數驅動（Parameter-Driven）+ 邏輯檢查（Logic Check）」的動態生成系統。

## 核心問題

### 舊系統的問題
- **參數衝突**：Preset 說是「林布蘭光（45°）」，但使用者手動將燈光移到了 80°，系統仍然輸出「Rembrandt lighting」
- **顏色互染**：背景顏色和燈光顏色混淆，AI 無法區分
- **缺乏邏輯**：沒有檢查機制，只是簡單地將字串疊加

### 新系統的解決方案
- **門檻檢查機制**：計算當前角度與 Preset 基準角度的偏差
- **智能模式判定**：Perfect Match（完全符合）vs Style Inheritance（風格繼承）
- **清晰的屬性分離**：明確標示顏色屬於誰（Key Light in Vivid Red color）

---

## 架構設計

### 1. 資料結構定義 (`lightingPresetDatabase.ts`)

每個 Preset 被拆解為：

```typescript
interface LightingPresetDefinition {
  id: string;
  name: string;
  
  // 物理參數定義
  base_params: {
    keyLight: { azimuth: number; elevation: number };
    fillLight?: { azimuth: number; elevation: number };
    rimLight?: { azimuth: number; elevation: number };
  };
  
  // 容許誤差（度數）
  tolerance: {
    azimuth: number;    // 方位角容許誤差
    elevation: number;  // 仰角容許誤差
  };
  
  // A類標籤：幾何特徵（角度改變過大時必須移除）
  geometry_tags: string[];
  
  // B類標籤：風格與光質（即使角度改變也應保留）
  style_tags: string[];
  
  // 產品攝影模式的替代用語
  product_mode_mapping?: {
    [key: string]: string;  // 例如 "cheek" → "surface"
  };
}
```

#### 範例：林布蘭光 (Rembrandt)

```typescript
rembrandt: {
  id: 'rembrandt',
  name: 'Rembrandt Lighting',
  
  base_params: {
    keyLight: { azimuth: 45, elevation: 40 },
    fillLight: { azimuth: 225, elevation: 15 },
    rimLight: { azimuth: 225, elevation: 45 }
  },
  
  tolerance: {
    azimuth: 15,   // ±15° 方位角容許誤差
    elevation: 15  // ±15° 仰角容許誤差
  },
  
  geometry_tags: [
    'Rembrandt lighting style',
    'Triangle catchlight on cheek',
    'Classic 45-degree portrait setup',
    'Nose shadow reaching toward cheek'
  ],
  
  style_tags: [
    'Dramatic chiaroscuro',
    'High contrast illumination',
    'Sculptural rendering',
    'Deep defined shadows',
    'Renaissance painting quality'
  ],
  
  product_mode_mapping: {
    'cheek': 'surface',
    'nose shadow': 'volume shadow',
    'catchlight': 'reflective highlight',
    'face': 'object'
  }
}
```

---

### 2. 核心生成邏輯 (`lightingPromptGenerator.ts`)

#### 流程圖

```
使用者調整燈光
    ↓
讀取當前角度 & 選中的 Preset
    ↓
計算偏差 (Deviation)
    ↓
判定模式
    ├─→ Perfect Match (偏差 ≤ 容許誤差)
    │   └─→ 輸出：geometry_tags + style_tags
    │
    └─→ Style Inheritance (偏差 > 容許誤差)
        └─→ 輸出：移除 geometry_tags，保留 style_tags + 物理描述
```

#### 核心函式

```typescript
function generateLightingPrompt(
  keyLight: LightSource,
  fillLight: LightSource,
  rimLight: LightSource,
  selectedPresetId: string,
  isProductMode: boolean = false
): LightingPromptResult
```

**輸入**：
- `keyLight`, `fillLight`, `rimLight`：當前的燈光設定
- `selectedPresetId`：使用者選中的 Preset ID（如 'rembrandt'）
- `isProductMode`：是否為產品攝影模式

**輸出**：
```typescript
interface LightingPromptResult {
  mode: 'perfect_match' | 'style_inheritance' | 'custom';
  presetName?: string;
  geometryTags: string[];
  styleTags: string[];
  physicalDescription: string;
  colorDescription: string;
  deviationInfo: {
    azimuthDiff: number;
    elevationDiff: number;
  };
}
```

---

### 3. 屬性組裝規則

#### Rule 1: 顏色分離 (Color Separation)

**錯誤示範**：
```
Red light, dark background
```
→ AI 無法區分紅色屬於燈光還是背景

**正確示範**：
```
(Key Light) Main illumination in Vivid Red color, (Background) remains neutral gray
```

#### Rule 2: 用語轉換 (Portrait to Product Mapping)

當系統偵測到產品攝影模式時，自動替換關鍵字：

| 人像用語 | 產品用語 |
|---------|---------|
| Cheek / Face | Surface / Texture |
| Nose shadow | Volume shadow |
| Eye catchlight | Reflective highlight |

---

## 使用範例

### 範例 1：Perfect Match（完全符合）

**情境**：使用者選擇「林布蘭光」，並且幾乎沒有調整角度

**輸入**：
```typescript
keyLight: { azimuth: 45, elevation: 40, color: '#ffffff', intensity: 85 }
selectedPresetId: 'rembrandt'
```

**輸出**：
```
(Geometry) Rembrandt lighting style, Triangle catchlight on cheek, Classic 45-degree portrait setup, Nose shadow reaching toward cheek, (Key Light) Main illumination in neutral white color, (Style) Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows, Renaissance painting quality.
```

---

### 範例 2：Style Inheritance（風格繼承）

**情境**：使用者選擇「林布蘭光」，但將主光移到了 80°（偏差 35°，超過容許誤差 15°）

**輸入**：
```typescript
keyLight: { azimuth: 80, elevation: 40, color: '#ff6b35', intensity: 85 }
selectedPresetId: 'rembrandt'
```

**輸出**：
```
(Geometry) Key light positioned at side slightly above with strong intensity, (Key Light) Main illumination in warm orange color, (Style) Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows, Renaissance painting quality.
```

**注意**：
- ❌ 移除了「Rembrandt lighting style」（幾何標籤）
- ✅ 保留了「Dramatic chiaroscuro」（風格標籤）
- ✅ 加入了物理描述「Key light positioned at side slightly above」

---

### 範例 3：產品攝影模式

**情境**：使用者選擇「林布蘭光」，並且系統偵測到產品攝影模式

**輸入**：
```typescript
keyLight: { azimuth: 45, elevation: 40, color: '#ffffff', intensity: 85 }
selectedPresetId: 'rembrandt'
isProductMode: true
```

**輸出**：
```
(Geometry) Rembrandt lighting style, Triangle reflective highlight on surface, Classic 45-degree portrait setup, volume shadow reaching toward surface, (Key Light) Main illumination in neutral white color, (Style) Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows, Renaissance painting quality.
```

**注意**：
- `cheek` → `surface`
- `catchlight` → `reflective highlight`
- `nose shadow` → `volume shadow`

---

## 整合到現有系統

### 1. 更新 `lightingFormatters.ts`

```typescript
export function formatLightingSection(
  keyLight: LightSource,
  fillLight: LightSource,
  rimLight: LightSource,
  studioSetup?: string,
  promptTags?: string,
  isProductMode: boolean = false  // 新增參數
): string {
  
  // 如果有選中 Preset，使用新的參數驅動系統
  if (studioSetup && studioSetup !== 'manual') {
    const smartPrompt = generateCompleteLightingPrompt(
      keyLight,
      fillLight,
      rimLight,
      studioSetup,
      isProductMode
    );
    return smartPrompt;
  }
  
  // Fallback：手動模式使用舊格式
  // ...
}
```

### 2. 更新 `promptAssembly.ts`

```typescript
// 偵測是否為產品攝影模式
const isProductMode = camera.framingMode === 'product' || 
                      camera.photographyMode === 'commercial' ||
                      subject.type.toLowerCase().includes('product');

const lightingDesc = formatLightingSection(
  migratedOptics.keyLight,
  migratedOptics.fillLight,
  migratedOptics.rimLight,
  setup?.id,
  setup?.promptTags,
  isProductMode  // 傳入產品模式標記
);
```

---

## 測試覆蓋

已建立完整的測試套件 (`lightingPromptGenerator.test.ts`)：

✅ Perfect Match Mode (2 tests)
✅ Style Inheritance Mode (2 tests)
✅ Product Mode Mapping (2 tests)
✅ String Assembly (2 tests)
✅ Different Presets (2 tests)
✅ Color Descriptions (1 test)

**總計：11 個測試，全部通過**

---

## 向後兼容性

- ✅ 保留舊的 `formatLightingSectionLegacy` 函式
- ✅ 如果 Preset 不存在，自動 fallback 到舊格式
- ✅ 手動模式（`studioSetup === 'manual'`）仍使用舊格式
- ✅ 現有的 UI 組件無需修改

---

## 未來擴展

### 1. UI 視覺提示

可以在 UI 上顯示當前模式：

```tsx
{result.mode === 'perfect_match' && (
  <div className="text-green-400">
    ✓ Perfect Match: {result.presetName}
  </div>
)}

{result.mode === 'style_inheritance' && (
  <div className="text-orange-400">
    ⚠ Style Inheritance: Angle adjusted from {result.presetName}
    (Deviation: {result.deviationInfo.azimuthDiff}°)
  </div>
)}
```

### 2. 自動建議

當偏差過大時，可以提示使用者：

```tsx
{result.deviationInfo.azimuthDiff > 20 && (
  <button onClick={resetToPreset}>
    Reset to {result.presetName} base angle
  </button>
)}
```

### 3. 更多 Preset

可以輕鬆新增更多 Preset，只需在 `lightingPresetDatabase.ts` 中定義即可。

---

## 總結

### 優點

1. **智能檢測**：自動判定使用者是否偏離 Preset
2. **邏輯清晰**：明確的門檻檢查機制
3. **避免衝突**：不會出現「說是林布蘭光但角度是 90°」的矛盾
4. **風格保留**：即使角度改變，仍保留 Preset 的質感描述
5. **產品模式**：自動替換人像用語為產品用語
6. **易於擴展**：新增 Preset 只需定義資料，無需修改邏輯

### 使用建議

- **介面保持不變**：使用者仍然可以選擇 Preset 並調整滑桿
- **自動降級**：當角度偏離過大時，系統自動從「Preset 名稱」降級為「物理描述 + 風格」
- **透明化**：可以在 UI 上顯示當前模式，讓使用者知道系統的判定結果

---

## 檔案清單

### 新增檔案
- `utils/lightingPresetDatabase.ts` - Preset 資料庫定義
- `utils/lightingPromptGenerator.ts` - 核心生成邏輯
- `utils/lightingPromptGenerator.test.ts` - 測試套件
- `LIGHTING_PARAMETER_DRIVEN_SYSTEM.md` - 本文件

### 修改檔案
- `utils/lightingFormatters.ts` - 整合新系統
- `utils/promptAssembly.ts` - 加入產品模式偵測

### 未修改檔案（向後兼容）
- `components/lighting/LightingPresetGrid.tsx` - UI 組件無需修改
- `components/sections/OpticsSection.tsx` - 使用方式不變
- `constants.tsx` - STUDIO_SETUPS 保持不變（僅作為 UI 顯示用）

---

## 下一步建議

1. **測試整合**：在實際 UI 中測試新系統的運作
2. **視覺反饋**：考慮在 UI 上顯示當前模式（Perfect Match / Style Inheritance）
3. **使用者教育**：可以在 UI 上加入提示，說明系統的智能檢測機制
4. **擴展 Preset**：根據需求新增更多專業燈光 Preset

---

**重構完成日期**：2026-02-04
**測試狀態**：✅ 全部通過 (11/11)
**向後兼容性**：✅ 完全兼容
