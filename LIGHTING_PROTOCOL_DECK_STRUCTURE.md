# Lighting Protocol Deck 結構化顯示實作

## 概述

本次更新為 Protocol Deck 的燈光部分實作了結構化顯示，與攝影機部分的呈現方式保持一致，讓使用者能夠更清楚地理解燈光設定。

## 問題背景

之前的 Protocol Deck 中：
- **攝影機部分**：已經做了很好的結構化分類（POV MODE、CAMERA POSITION、LENS OPTICS、SHOT TYPE、DEPTH OF FIELD、COMPOSITION RULE）
- **燈光部分**：只是一整串文字，使用者難以快速理解各個燈光的設定

重置後，使用者無法快速掌握當前的燈光配置。

## 解決方案

### 1. 新增結構化燈光資訊介面

在 `utils/lightingPromptGenerator.ts` 中新增：

```typescript
export interface StructuredLightingInfo {
  presetName?: string;    // Preset 名稱（僅在 Perfect Match 時）
  geometry?: string;      // 幾何描述或物理位置
  keyLight?: string;      // 主光設定
  fillLight?: string;     // 補光設定
  rimLight?: string;      // 輪廓光設定
  style?: string;         // 風格描述
}

export function generateStructuredLightingInfo(
  keyLight: LightSource,
  fillLight: LightSource,
  rimLight: LightSource,
  selectedPresetId: string,
  isProductMode: boolean = false
): StructuredLightingInfo
```

### 2. 更新翻譯介面

在 `utils/visualTranslators.ts` 的 `TranslatedPromptComponents` 介面中新增：

```typescript
/** Detailed lighting breakdown */
lightingDetailed?: {
  presetName?: string;        // Preset 名稱（僅在 Perfect Match 時）
  geometry?: string;          // 幾何描述或物理位置
  keyLight?: string;          // 主光設定
  fillLight?: string;         // 補光設定
  rimLight?: string;          // 輪廓光設定
  style?: string;             // 風格描述
};
```

### 3. Protocol Deck 顯示邏輯

在 `components/layout/ProtocolDeck.tsx` 中，燈光部分現在會根據是否有結構化資訊來決定顯示方式：

#### 有結構化資訊時（進階燈光模式）

顯示為多個子區塊：

1. **LIGHTING STYLE** (黃色) - Preset 名稱（如 "Rembrandt Lighting"）
2. **LIGHTING GEOMETRY** (黃色) - 幾何描述（如 "Triangle Catch Lighting on Cheek, Classic, 45° Portrait Setup"）
3. **KEY LIGHT** (琥珀色) - 主光設定（位置 + 顏色 + 光質）
4. **FILL LIGHT** (琥珀色) - 補光設定（如果強度 > 0）
5. **RIM LIGHT** (琥珀色) - 輪廓光設定（如果強度 > 0）
6. **LIGHTING STYLE** (黃色) - 風格描述（如 "Rendering with Soft flattering illumination"）

#### 沒有結構化資訊時（舊系統）

顯示為單一區塊：
- **LIGHTING SETUP** (黃色) - 完整的燈光描述

## 顏色系統

- **黃色 (Yellow)** - 用於 Preset 名稱、幾何描述、風格描述
- **琥珀色 (Amber)** - 用於個別燈光（Key Light、Fill Light、Rim Light）

這樣的顏色區分讓使用者能夠快速識別：
- 整體燈光風格（黃色）
- 個別燈光設定（琥珀色）

## 使用範例

### 範例 1：Rembrandt Lighting（Perfect Match）

```
LIGHTING STYLE
Rembrandt Lighting

LIGHTING GEOMETRY
Triangle Catch Lighting on Cheek, Classic, 45° Portrait Setup, Nose Shadow Reaching Toward Cheek

KEY LIGHT
Key light positioned at front-left slightly above with strong intensity, in neutral white color

FILL LIGHT
Fill light positioned at front-right eye-level with soft intensity, in neutral white color

LIGHTING STYLE
Rendering with Soft flattering illumination, Even facial modeling
```

### 範例 2：自訂燈光（Style Inheritance）

```
LIGHTING GEOMETRY
Key light positioned at left side high angle with moderate intensity

KEY LIGHT
Key light positioned at left side high angle with moderate intensity, in warm white color, soft diffused quality

FILL LIGHT
Fill light positioned at front-right slightly below with subtle intensity, in cool white color

LIGHTING STYLE
Rendering with Dramatic chiaroscuro, Strong shadow depth
```

## 優點

1. **清晰度提升**：使用者可以一眼看出每個燈光的設定
2. **重置後易理解**：即使重置，也能快速掌握當前配置
3. **一致性**：與攝影機部分的呈現方式保持一致
4. **教學價值**：新手可以學習專業燈光設定的結構
5. **除錯友善**：開發者和使用者都能快速定位問題

## 技術細節

- 使用 `generateStructuredLightingInfo` 函數從燈光參數生成結構化資訊
- 在 `translatePromptState` 中同時生成線性和結構化兩種格式
- Protocol Deck 根據 `lightingDetailed` 是否存在來決定顯示方式
- 完全向後兼容：舊系統（沒有 Preset）仍然正常運作

## 未來擴展

可以考慮在「結構化視圖」中也加入燈光的詳細分解，類似攝影機的「物理空間設定」和「光學成像效果」。
