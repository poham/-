# Optical Terminology Guide

## 概述

本指南定義了 Nano Banana 中使用的純光學術語系統，用於描述鏡頭焦距特性。我們避免使用主觀描述（如「人眼視角」），而是使用專業攝影光學術語。

## 設計原則

1. **純光學術語**：使用專業攝影術語，避免主觀比喻
2. **精確描述**：明確說明光學特性（變形、壓縮、視野）
3. **AI 友好**：使用 AI 圖像生成模型能理解的標準術語

## 焦距映射表

### 8mm - Fisheye (魚眼)
```
Fisheye lens perspective, extreme barrel distortion, 180-degree field of view, spherical projection
```
**特性：**
- 極端桶形變形
- 180度視野
- 球面投影

---

### 14mm - Ultra-wide-angle (超廣角)
```
Ultra-wide-angle lens perspective, pronounced barrel distortion, exaggerated spatial depth, dramatic foreground emphasis
```
**特性：**
- 明顯桶形變形
- 誇張的空間深度
- 戲劇性的前景強調

---

### 18-24mm - Wide-angle (廣角)
```
Wide-angle lens perspective, noticeable barrel distortion, expanded spatial depth, environmental context
```
**特性：**
- 可見的桶形變形
- 擴展的空間深度
- 環境脈絡感

---

### 28-35mm - Moderate wide-angle (中度廣角)
```
Moderate wide-angle lens perspective, slight barrel distortion, natural spatial relationships, documentary style
```
**特性：**
- 輕微桶形變形
- 自然的空間關係
- 紀實風格

---

### 40-50mm - Standard lens (標準鏡頭)
```
Standard lens perspective, zero distortion, rectilinear projection, neutral spatial rendering
```
**特性：**
- 零變形
- 直線投影
- 中性空間呈現

**注意：** 不再使用「人眼視角」等主觀描述

---

### 55-70mm - Short telephoto (短焦段長焦)
```
Short telephoto lens perspective, minimal compression, slight subject isolation, flattering proportions
```
**特性：**
- 最小壓縮感
- 輕微主體隔離
- 討喜的比例

---

### 85-105mm - Portrait telephoto (人像長焦)
```
Portrait telephoto lens perspective, moderate compression, subject-background separation, flattering facial proportions
```
**特性：**
- 中度壓縮感
- 主體背景分離
- 討喜的面部比例

---

### 135-180mm - Medium telephoto (中焦段長焦)
```
Medium telephoto lens perspective, strong compression, flattened depth planes, isolated subject
```
**特性：**
- 強烈壓縮感
- 扁平化的深度層次
- 隔離的主體

---

### 200mm+ - Super telephoto (超長焦)
```
Super telephoto lens perspective, extreme compression, collapsed spatial depth, stacked background layers, narrow field of view
```
**特性：**
- 極端壓縮感
- 崩塌的空間深度
- 堆疊的背景層次
- 狹窄視野

---

## 禁用術語清單

以下術語已從系統中移除，因為它們過於主觀或模糊：

❌ **禁止使用：**
- "Human eye view" (人眼視角)
- "Natural view" (自然視角)
- "Like human perception" (類似人類感知)
- "Normal perspective" (正常透視)

✅ **改用：**
- "Standard lens perspective" (標準鏡頭透視)
- "Zero distortion" (零變形)
- "Rectilinear projection" (直線投影)
- "Neutral spatial rendering" (中性空間呈現)

## 光學特性關鍵詞

### 變形類型 (Distortion)
- **Barrel distortion** (桶形變形)：廣角鏡頭特性
- **Zero distortion** (零變形)：標準鏡頭特性
- **Rectilinear projection** (直線投影)：直線保持直線

### 壓縮效果 (Compression)
- **Minimal compression** (最小壓縮)：短焦段長焦
- **Moderate compression** (中度壓縮)：人像長焦
- **Strong compression** (強烈壓縮)：中焦段長焦
- **Extreme compression** (極端壓縮)：超長焦

### 空間深度 (Spatial Depth)
- **Exaggerated spatial depth** (誇張的空間深度)：超廣角
- **Expanded spatial depth** (擴展的空間深度)：廣角
- **Neutral spatial rendering** (中性空間呈現)：標準鏡頭
- **Flattened depth planes** (扁平化深度層次)：長焦
- **Collapsed spatial depth** (崩塌的空間深度)：超長焦

### 視野範圍 (Field of View)
- **180-degree field of view** (180度視野)：魚眼
- **Wide field of view** (寬廣視野)：廣角
- **Narrow field of view** (狹窄視野)：長焦

## 實現位置

- **主要函數**：`utils/visualTranslators.ts` 中的 `translateFocalLength()`
- **測試文件**：`utils/focalLength.test.ts`
- **常數定義**：`constants.tsx` 中的 `FOCAL_LENGTHS`

## 使用範例

### 商品攝影
```typescript
// 50mm 標準鏡頭
"Medium shot, product fully visible, balanced composition, 
camera positioned at eye-level height, straight-on perspective, front-facing, 
using Standard lens perspective, zero distortion, rectilinear projection, neutral spatial rendering"
```

### 人像攝影
```typescript
// 85mm 人像鏡頭
"Face filling frame, from chin to forehead, 
camera positioned at Camera at high angle, looking down, 
using Portrait telephoto lens perspective, moderate compression, subject-background separation, flattering facial proportions"
```

### 環境攝影
```typescript
// 24mm 廣角鏡頭
"Full body shot, head to toe, showing shoes, 
camera positioned at eye-level height, straight-on perspective, 
using Wide-angle lens perspective, noticeable barrel distortion, expanded spatial depth, environmental context"
```

## 測試驗證

所有焦距描述都經過測試驗證，確保：
1. ✅ 不包含「human eye」或「natural view」等主觀術語
2. ✅ 包含「lens perspective」或「projection」等專業術語
3. ✅ 準確描述光學特性（變形、壓縮、視野）

執行測試：
```bash
npm test -- focalLength.test.ts
```
