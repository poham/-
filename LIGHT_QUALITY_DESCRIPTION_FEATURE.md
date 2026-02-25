# 光質描述功能 (Light Quality Description)

## 功能概述

新增了可自訂的「光質描述」欄位，讓使用者能夠更精確地控制每個光源的視覺表現特質，特別是色彩飽和度和光線強度的描述。

## 問題背景

在之前的系統中：
- 當不使用 Preset 時，style 標籤會自動移除
- 即使調整很強的 intensity，顏色表現仍然微弱
- 缺乏直接描述光源表現特質的方式

## 解決方案

### 1. 新增 `styleDescription` 欄位

在 `LightSource` interface 中新增可選欄位：

```typescript
export interface LightSource {
  azimuth: number;
  elevation: number;
  color: string;
  intensity: number;
  styleDescription?: string;  // 新增：自訂光質描述
}
```

### 2. 光質描述 Presets

在 `constants.tsx` 中新增 10 個預設選項：

```typescript
export const LIGHT_QUALITY_PRESETS = [
  { name: '強烈飽和', description: 'vivid saturated illumination, rich color depth, intense chromatic presence' },
  { name: '柔和擴散', description: 'soft diffused glow, gentle color wash, subtle tonal presence' },
  { name: '戲劇性對比', description: 'dramatic high-contrast lighting, bold color saturation, striking visual impact' },
  { name: '自然真實', description: 'natural realistic lighting, authentic color rendering, true-to-life illumination' },
  { name: '電影感', description: 'cinematic color grading, film-like saturation, professional color depth' },
  { name: '霓虹強光', description: 'neon-bright illumination, hyper-saturated colors, electric color intensity' },
  { name: '柔焦夢幻', description: 'soft-focus ethereal glow, dreamy color diffusion, gentle luminous quality' },
  { name: '高飽和度', description: 'highly saturated color cast, vibrant chromatic intensity, bold color presence' },
  { name: '微妙色調', description: 'subtle color tint, delicate chromatic nuance, refined tonal quality' },
  { name: '強烈色彩', description: 'powerful color projection, dominant chromatic influence, assertive color presence' }
];
```

### 3. UI 更新

在 `LightSourcePanel` 和 `RimLightPanel` 中新增：

- **顯示/隱藏 Presets 按鈕**：切換預設選項的顯示
- **Preset 網格**：2 欄網格顯示 10 個預設選項
- **可編輯 Textarea**：讓使用者自由輸入或編輯描述
- **提示文字**：說明此欄位的用途

UI 遵循專案的間距規範：
- Textarea: `p-4`, `h-24`
- Preset 按鈕: `p-3`
- 字體大小: `text-[13px]` (textarea), `text-[12px]` (preset 標題), `text-[10px]` (preset 描述)

### 4. Prompt 生成整合

在 `lightingPromptGenerator.ts` 的 `assembleLightingPromptString` 函式中：

```typescript
// Key Light
if (keyLight.styleDescription && keyLight.styleDescription.trim()) {
  keyLightParts.push(keyLight.styleDescription.trim());
}

// Fill Light
if (fillLight.styleDescription && fillLight.styleDescription.trim()) {
  fillLightParts.push(fillLight.styleDescription.trim());
}

// Rim Light
if (rimLight.styleDescription && rimLight.styleDescription.trim()) {
  rimLightParts.push(rimLight.styleDescription.trim());
}
```

## 使用方式

### 方法 1：使用 Presets

1. 點擊「顯示預設」按鈕
2. 從 10 個預設選項中選擇一個
3. 描述會自動填入 textarea

### 方法 2：自訂輸入

1. 直接在 textarea 中輸入自訂描述
2. 可以使用英文描述光的表現特質
3. 例如：`intense vibrant glow, highly saturated colors`

### 方法 3：混合使用

1. 先選擇一個 Preset 作為基礎
2. 再手動編輯 textarea 內容進行微調

## Prompt 輸出範例

### 無自訂描述

```
(Key Light) Key light positioned at front-right slightly above with strong intensity, in warm white color
```

### 有自訂描述

```
(Key Light) Key light positioned at front-right slightly above with strong intensity, in warm white color, vivid saturated illumination, rich color depth, intense chromatic presence
```

## 技術細節

- **向後兼容**：`styleDescription` 為可選欄位，不影響現有預設
- **空值處理**：只有當描述存在且非空白時才會加入 Prompt
- **Trim 處理**：自動移除前後空白
- **獨立控制**：每個光源（Key、Fill、Rim）都有獨立的描述欄位

## 檔案變更清單

- ✅ `types.ts` - 新增 `styleDescription` 欄位
- ✅ `constants.tsx` - 新增 `LIGHT_QUALITY_PRESETS`
- ✅ `components/lighting/LightSourcePanel.tsx` - 新增 UI 控制
- ✅ `components/lighting/RimLightPanel.tsx` - 新增 UI 控制
- ✅ `utils/lightingPromptGenerator.ts` - 整合到 Prompt 生成

## 測試建議

1. 測試不同 Preset 的效果
2. 測試自訂輸入
3. 測試空白描述（應該不影響 Prompt）
4. 測試與現有 Preset 系統的相容性
5. 測試在產品模式和人像模式下的表現
