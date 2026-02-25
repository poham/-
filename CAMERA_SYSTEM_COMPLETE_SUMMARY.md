# Camera System Complete Summary

## 完成日期
2026-01-28

## 完成項目總覽

本次更新完成了攝影機系統的三個重要改進：

### 1. ✅ 取景尺度順序調整
將 `SHOT_TYPES` 從「最緊」到「最寬」重新排列：
1. 微距 (Macro Shot)
2. 極致特寫 (Extreme Close-up / ECU)
3. 特寫/肩上 (Close-up / CU)
4. 中特寫/胸上 (Bust Shot)
5. 中景/腰上 (Chest Shot)
6. 中遠景/膝上 (Knee Shot)
7. 遠景/全身 (Full Body)
8. 大遠景 (Very Long Shot / VLS)
9. 極遠景 (Extreme Long Shot / XLS)

### 2. ✅ Slot System 結構化重構
實現了清晰的 4-Slot 提示詞組裝系統：

**Slot 1: 鏡頭景別 (Shot Scale)**
- 人像：`Face filling frame, from chin to forehead`
- 商品：`Close-up, product details prominent, tight framing`

**Slot 2: 相機位置與角度 (Camera Position)**
- 使用 `camera positioned at` 前綴
- 人像：`camera positioned at Camera at high angle, looking down`
- 商品：`camera positioned at an elevated high angle, looking down at product, front-facing`

**Slot 3: 鏡頭光學特性 (Lens Optics)**
- 使用 `using` 前綴
- 範例：`using Standard lens perspective, zero distortion, rectilinear projection, neutral spatial rendering`

**Slot 4: 構圖規則與景深 (Composition Extras)**
- 構圖規則：`using rule of thirds grid`
- 景深效果：`creating Shallow depth of field, soft background blur, subject separation`
- 元素配置：`element placement: Logo at upper right power point`

### 3. ✅ 純光學術語系統
移除主觀描述（如「人眼視角」），改用專業攝影光學術語：

#### 焦距映射表

| 焦距 | 舊描述 | 新描述 |
|------|--------|--------|
| 8mm | Extreme fisheye distortion | **Fisheye lens perspective**, extreme barrel distortion, 180-degree field of view, spherical projection |
| 14mm | Wide angle lens | **Ultra-wide-angle lens perspective**, pronounced barrel distortion, exaggerated spatial depth |
| 24mm | Wide angle lens | **Wide-angle lens perspective**, noticeable barrel distortion, expanded spatial depth |
| 35mm | Natural human eye view ❌ | **Moderate wide-angle lens perspective**, slight barrel distortion, natural spatial relationships |
| 50mm | Natural human eye view ❌ | **Standard lens perspective**, zero distortion, rectilinear projection, neutral spatial rendering |
| 85mm | Portrait lens | **Portrait telephoto lens perspective**, moderate compression, subject-background separation |
| 135mm | Portrait lens | **Medium telephoto lens perspective**, strong compression, flattened depth planes |
| 200mm | Telephoto lens | **Super telephoto lens perspective**, extreme compression, collapsed spatial depth |

#### 禁用術語
❌ 不再使用：
- "Human eye view"
- "Natural view"
- "Like human perception"
- "Normal perspective"

✅ 改用：
- "Standard lens perspective"
- "Zero distortion"
- "Rectilinear projection"
- "Neutral spatial rendering"

### 4. ✅ 取景模式切換系統
新增手動模式切換功能，支援商品/人像模式強制覆蓋：

**UI 控制**（位於 CameraSection）：
- 🤖 **自動模式**（藍色）：根據主體類型自動判斷
- 📦 **商品模式**（橘色）：強制使用商品攝影術語
- 👤 **人像模式**（紫色）：強制使用身體部位描述

**實現邏輯**：
```typescript
// types.ts
interface CameraConfig {
  framingMode?: 'auto' | 'product' | 'portrait';  // 預設 'auto'
}

// visualTranslators.ts
function determineProductMode(framingMode: string | undefined, subjectType: string): boolean {
  if (framingMode === 'product') return true;
  if (framingMode === 'portrait') return false;
  // framingMode === 'auto' or undefined
  return isProductPhotography(subjectType);
}
```

### 5. ✅ 方位角描述使用介系詞片語（"from..." Pattern）

**問題背景**：
當極端的相機高度指令（如 `dramatic low angle`）與名詞式的方位角術語（如 `front-facing`, `3/4 view`）結合時，會產生語義衝突。AI 模型在訓練數據中學習到 `front-facing` 通常隱含「平視」的視角，這會削弱 `low angle` 的戲劇效果。

**解決方案**：
使用介系詞片語 `from...` 來描述方位角，避免與高度指令產生語義衝突。

**實現細節**：

#### 商品攝影模式（Product Mode）
```typescript
// 舊格式（有衝突風險）
"dramatic low angle, hero shot perspective, front-facing"
"elevated high angle, looking down, 3/4 view"

// 新格式（使用 "from..." 介系詞片語）
"positioned very low, looking up from the front"
"positioned at elevated high angle, looking down at product from a front-right 3/4 angle"
```

#### 人像攝影模式（Portrait Mode）
```typescript
// 方位角描述也統一使用 "from..." 格式
"Camera at eye level, horizontal perspective, from the front"
"Camera at low angle, looking up, from a front-left 3/4 angle"
"Camera at high angle, looking down, from the right side"
```

#### 方位角映射表

| 方位角範圍 | 舊描述（名詞式） | 新描述（介系詞片語） |
|-----------|----------------|-------------------|
| -22.5° ~ 22.5° | front-facing, front view | **from the front** |
| 22.5° ~ 67.5° | front-right 3/4 view | **from a front-right 3/4 angle** |
| 67.5° ~ 112.5° | right side view | **from the right side** |
| 112.5° ~ 157.5° | back-right 3/4 view | **from a back-right 3/4 angle** |
| 157.5° ~ 180° | back view, rear view | **from the back** |
| -67.5° ~ -22.5° | front-left 3/4 view | **from a front-left 3/4 angle** |
| -112.5° ~ -67.5° | left side view | **from the left side** |
| -157.5° ~ -112.5° | back-left 3/4 view | **from a back-left 3/4 angle** |

**為什麼這樣更好？**

1. **語義清晰**：`from...` 明確表示「從某個方向看過去」，只負責水平方向，不干擾垂直高度
2. **避免衝突**：名詞式術語（如 `front-facing`）在 AI 訓練數據中常與「平視」關聯，會削弱極端角度的效果
3. **動作導向**：配合動作描述（`positioned low, looking up`），形成完整的物理指令
4. **一致性**：商品模式和人像模式都使用相同的 `from...` 格式

**範例對比**：

```
❌ 有衝突風險：
"camera positioned at a dramatic low angle, hero shot perspective, front-facing"
→ AI 可能因為 "front-facing" 而削弱 "low angle" 的效果

✅ 清晰無衝突：
"camera positioned very low, looking up (creating dramatic hero shot perspective) from the front"
→ 高度和方位各司其職，語義清晰
```

## 輸出範例對比

### 商品攝影（50mm 標準鏡頭，高角度，正面）

**舊格式（有語義衝突風險）：**
```
Medium shot from High angle view, looking down at product, front-facing using Natural human eye view creating shallow DOF
```

**新格式（使用 "from..." 介系詞片語）：**
```
Medium shot, product fully visible, balanced composition, camera positioned at an elevated high angle, looking down at product from the front, using Standard lens perspective, zero distortion, rectilinear projection, neutral spatial rendering, creating Shallow depth of field, soft background blur, subject separation
```

### 商品攝影（35mm 廣角鏡頭，極低角度，左前側 3/4）

**舊格式（語義衝突嚴重）：**
```
Medium shot from Dramatic low angle, hero shot perspective, front-left 3/4 view using Wide angle lens creating shallow DOF
```
❌ 問題：`front-left 3/4 view` 暗示平視角度，與 `dramatic low angle` 產生衝突

**新格式（清晰無衝突）：**
```
Medium shot, product fully visible, balanced composition, camera positioned very low, looking up (creating dramatic hero shot perspective) from a front-left 3/4 angle, using Moderate wide-angle lens perspective, slight barrel distortion, natural spatial relationships, creating Shallow depth of field, soft background blur, subject separation
```
✅ 優勢：高度和方位各司其職，語義清晰

### 人像攝影（85mm 人像鏡頭，正面平視）

**舊格式：**
```
Face filling frame from Eye Level, front position using Portrait lens creating shallow DOF
```

**新格式：**
```
Face filling frame, from chin to forehead, camera positioned at Camera at eye level, horizontal perspective, from the front, using Portrait telephoto lens perspective, moderate compression, subject-background separation, flattering facial proportions, using rule of thirds grid, creating Shallow depth of field, face sharp with soft background, portrait separation, professional look
```

## 測試覆蓋

### 新增測試文件
1. **`utils/focalLength.test.ts`** (12 tests) ✅
   - 驗證所有焦距的純光學術語
   - 確保不包含主觀描述
   - 測試邊界情況

2. **`utils/framingMode.test.ts`** (11 tests) ✅
   - 自動模式偵測
   - 手動模式覆蓋
   - 商品/人像角度描述差異
   - 邊界情況處理

3. **`utils/cameraAngleDescriptions.test.ts`** (8 tests) ✅
   - 驗證 "from..." 介系詞片語格式
   - 測試所有方位角範圍
   - 測試極端仰角描述
   - 顏色和提示文字驗證

4. **`utils/visualTranslators.test.ts`** (18 tests) ✅
   - 位置翻譯
   - 相機滾轉翻譯
   - 角度正規化

**總計：49 個測試全部通過** ✅

## 文件更新

1. **`SLOT_SYSTEM_IMPLEMENTATION.md`** - Slot System 實現指南
2. **`OPTICAL_TERMINOLOGY_GUIDE.md`** - 光學術語完整指南
3. **`CAMERA_SYSTEM_COMPLETE_SUMMARY.md`** - 本文件

## 技術實現位置

### 核心文件
- `utils/visualTranslators.ts` - 主要翻譯邏輯
- `utils/cameraAngleDescriptions.ts` - 角度描述邏輯（包含 "from..." 介系詞片語實現）
- `types.ts` - 類型定義（新增 `framingMode`）
- `constants.tsx` - 常數定義（調整 `SHOT_TYPES` 順序）
- `components/sections/CameraSection.tsx` - UI 控制介面

### 測試文件
- `utils/focalLength.test.ts` - 光學術語測試
- `utils/framingMode.test.ts` - 取景模式測試
- `utils/cameraAngleDescriptions.test.ts` - 方位角描述測試（驗證 "from..." 格式）
- `utils/visualTranslators.test.ts` - 翻譯邏輯測試

### 關鍵實現細節

#### "from..." 介系詞片語實現
位於 `utils/cameraAngleDescriptions.ts`：

```typescript
// 商品攝影模式
function getProductViewDescription(azimuth: number, elevation: number): string {
  // 垂直角度：使用動作描述
  let elevationDesc = 'positioned very low, looking up';
  
  // 水平方向：使用 "from..." 介系詞片語
  let azimuthDesc = 'from a front-left 3/4 angle';
  
  return `${elevationDesc} ${azimuthDesc}`;
}

// 人像攝影模式
function getAzimuthDescription(azimuth: number): string {
  if (absAzimuth <= 22.5) {
    return 'from the front';  // 不是 "front-facing"
  }
  // ... 其他方位角
}
```

## 向後兼容性

✅ 完全向後兼容：
- 舊的預設資料會自動使用新格式
- `framingMode` 為可選欄位，預設為 `'auto'`
- 所有現有功能保持正常運作

## 優勢總結

1. **清晰的語義分離**：Slot System 確保攝影機位置和鏡頭特性不會混淆
2. **專業術語**：使用業界標準光學術語，提升 AI 理解準確度
3. **避免語義衝突**：使用 "from..." 介系詞片語描述方位角，避免與極端高度指令產生衝突
4. **靈活控制**：支援自動偵測和手動覆蓋，適應各種拍攝需求
5. **完整測試**：49 個測試確保系統穩定性
6. **易於維護**：結構化設計，每個 Slot 可獨立修改

## 下一步建議

1. 考慮為其他焦距範圍（如 16mm, 28mm, 70mm, 105mm）添加更精確的描述
2. 可以為特殊鏡頭類型（移軸鏡頭、微距鏡頭）添加專門的光學術語
3. 考慮添加鏡頭畸變校正的描述選項
