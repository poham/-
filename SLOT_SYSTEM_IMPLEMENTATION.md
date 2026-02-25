# Slot System Implementation

## 概述

為了避免攝影機位置和主體資訊混淆，我們實現了結構化的 Slot System，確保提示詞的各個部分按照邏輯順序組裝。

## Slot 結構

```
[Slot 1: 鏡頭景別] + [Slot 2: 相機位置與角度] + [Slot 3: 鏡頭光學特性] + [Slot 4: 構圖規則與景深]
```

### Slot 1: 鏡頭景別 (Shot Scale)
描述取景範圍，例如：
- 人像模式：`Face filling frame, from chin to forehead`
- 商品模式：`Close-up, product details prominent, tight framing`

### Slot 2: 相機實體位置與角度 (Camera Position & Angle)
使用 `camera positioned at` 前綴，明確說明相機的物理位置：
- 人像模式：`camera positioned at Camera at high angle, looking down`
- 商品模式：`camera positioned at an elevated high angle, looking down at product, front-facing`

### Slot 3: 鏡頭光學特性 (Lens Optics / FOV)
使用 `using` 前綴，描述鏡頭特性：
- `using Natural human eye view, zero distortion, standard perspective`
- `using Wide angle lens, dynamic perspective, barrel distortion, expansive view`

### Slot 4: 構圖規則與景深效果 (Composition Extras)
包含構圖規則、景深效果、元素配置：
- `using rule of thirds grid`
- `creating Shallow depth of field, soft background blur, subject separation`
- `element placement: Logo at upper right power point`

## 輸出範例

### 商品攝影範例
**輸入參數：**
- Shot Type: 中景/腰上 (Chest Shot)
- Azimuth: 45° (3/4 Side View)
- Elevation: 60° (High Angle)
- Lens: 50mm 標準
- Framing Mode: Product

**輸出：**
```
Medium shot, product fully visible, balanced composition, camera positioned at an elevated high angle, looking down at product, front-right 3/4 view, using Natural human eye view, zero distortion, standard perspective, creating Shallow depth of field, soft background blur, subject separation
```

### 人像攝影範例
**輸入參數：**
- Shot Type: 特寫/肩上 (Close-up / CU)
- Azimuth: 0° (Front)
- Elevation: 30° (Slightly High)
- Lens: 85mm 人像
- Framing Mode: Portrait

**輸出：**
```
Face filling frame, from chin to forehead, camera positioned at Camera at high angle, looking down, using Portrait lens, subtle compression, flattering perspective, subject isolation, using rule of thirds grid, creating Shallow depth of field, face sharp with soft background, portrait separation, professional look
```

## 優勢

1. **清晰的語義分離**：每個 Slot 有明確的職責，不會混淆
2. **一致的前綴**：使用 `camera positioned at` 和 `using` 前綴，讓 AI 更容易理解
3. **邏輯順序**：從大到小（景別 → 位置 → 光學 → 細節）
4. **易於維護**：每個 Slot 可以獨立修改和測試

## 實現位置

- **主要邏輯**：`utils/visualTranslators.ts` 中的 `translatePromptState()` 函數
- **角度描述**：`utils/cameraAngleDescriptions.ts` 中的 `getCameraAngleDescription()` 和 `getProductViewDescription()`
- **測試**：`utils/framingMode.test.ts`

## 向後兼容

系統完全向後兼容，舊的預設資料會自動使用新的 Slot System 格式輸出。
