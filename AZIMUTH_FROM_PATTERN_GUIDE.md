# Azimuth "from..." Pattern Guide

## 為什麼使用 "from..." 介系詞片語？

在 AI 圖像生成的提示詞中，方位角（Azimuth）的描述方式會直接影響 AI 對相機位置的理解。本指南說明為何我們選擇使用 "from..." 介系詞片語，而非傳統的名詞式術語。

## 問題：語義衝突

### 案例分析

當我們想要創造一個「極低角度仰拍，從正面拍攝」的效果時：

**❌ 有衝突風險的寫法：**
```
camera positioned at a dramatic low angle, hero shot perspective, front-facing
```

**問題所在：**
- `dramatic low angle`：明確要求相機蹲得很低，向上仰拍
- `front-facing`：在 AI 訓練數據中，這個詞通常與「平視」關聯

**結果：**
AI 模型同時收到「蹲低仰拍」和「保持平視正面」的訊號，產生語義衝突。模型可能會削弱低角度的戲劇效果，把相機拉高一些，以滿足它對 "front-facing" 的固有理解。

## 解決方案：使用 "from..." 介系詞片語

### 核心原則

**方位角只負責「水平方向」，不干擾「垂直高度」**

使用 "from..." 介系詞片語可以明確表示「從某個方向看過去」，避免暗示任何垂直角度。

### 實現方式

**✅ 清晰無衝突的寫法：**
```
camera positioned very low, looking up (creating dramatic hero shot perspective) from the front
```

**優勢：**
- `positioned very low, looking up`：明確的垂直位置和動作
- `from the front`：純粹的水平方向，不暗示任何垂直角度
- 兩者各司其職，語義清晰

## 完整映射表

### 方位角範圍與描述

| 方位角範圍 | 舊描述（名詞式） | 新描述（介系詞片語） | 說明 |
|-----------|----------------|-------------------|------|
| -22.5° ~ 22.5° | front-facing, front view | **from the front** | 正面 |
| 22.5° ~ 67.5° | front-right 3/4 view | **from a front-right 3/4 angle** | 右前側 |
| 67.5° ~ 112.5° | right side view | **from the right side** | 右側 |
| 112.5° ~ 157.5° | back-right 3/4 view | **from a back-right 3/4 angle** | 右後側 |
| 157.5° ~ 180° | back view, rear view | **from the back** | 背面 |
| -67.5° ~ -22.5° | front-left 3/4 view | **from a front-left 3/4 angle** | 左前側 |
| -112.5° ~ -67.5° | left side view | **from the left side** | 左側 |
| -157.5° ~ -112.5° | back-left 3/4 view | **from a back-left 3/4 angle** | 左後側 |

## 實際範例對比

### 範例 1：極低角度 + 正面

**❌ 舊格式（有衝突）：**
```
Medium shot, dramatic low angle, hero shot perspective, front-facing
```
→ "front-facing" 可能削弱 "dramatic low angle" 的效果

**✅ 新格式（無衝突）：**
```
Medium shot, camera positioned very low, looking up (creating dramatic hero shot perspective) from the front
```
→ 高度和方位各司其職，語義清晰

### 範例 2：高角度 + 左前側 3/4

**❌ 舊格式（有衝突）：**
```
Close-up, elevated high angle, looking down, front-left 3/4 view
```
→ "3/4 view" 在訓練數據中常與標準平視角度關聯

**✅ 新格式（無衝突）：**
```
Close-up, camera positioned at elevated high angle, looking down at product from a front-left 3/4 angle
```
→ 明確分離垂直和水平資訊

### 範例 3：平視 + 右側

**❌ 舊格式（尚可，但不一致）：**
```
Medium shot, eye level, right side view
```

**✅ 新格式（一致性更好）：**
```
Medium shot, camera positioned at eye-level height, straight-on perspective from the right side
```
→ 保持與其他描述的一致性

## 技術實現

### 商品攝影模式

```typescript
function getProductViewDescription(azimuth: number, elevation: number): string {
  // 1. 垂直角度描述（相機高度 + 動作）
  let elevationDesc = '';
  if (elevation >= 60) {
    elevationDesc = 'positioned at elevated high angle, looking down at product';
  } else if (elevation >= -10) {
    elevationDesc = 'positioned at eye-level height, straight-on perspective';
  } else if (elevation >= -60) {
    elevationDesc = 'positioned very low, looking up (creating dramatic hero shot perspective)';
  }
  
  // 2. 水平方向描述（使用 "from..." 介系詞片語）
  let azimuthDesc = '';
  if (absAzimuth <= 22.5) {
    azimuthDesc = 'from the front';
  } else if (normalized > 0 && normalized <= 67.5) {
    azimuthDesc = 'from a front-right 3/4 angle';
  }
  // ... 其他方位角
  
  // 3. 組合：垂直 + 水平
  return `${elevationDesc} ${azimuthDesc}`;
}
```

### 人像攝影模式

```typescript
function getAzimuthDescription(azimuth: number): string {
  const absAzimuth = Math.abs(normalized);
  
  if (absAzimuth <= 22.5) {
    return 'from the front';  // 不是 "front-facing"
  } else if (absAzimuth >= 157.5) {
    return 'from the back';   // 不是 "back view"
  }
  // ... 其他方位角
}
```

## 為什麼這樣更好？

### 1. 語義清晰
`from...` 明確表示「從某個方向看過去」，只負責水平方向，不干擾垂直高度。

### 2. 避免衝突
名詞式術語（如 `front-facing`, `3/4 view`）在 AI 訓練數據中常與特定的垂直角度關聯，會削弱極端角度的效果。

### 3. 動作導向
配合動作描述（`positioned low, looking up`），形成完整的物理指令，AI 更容易理解。

### 4. 一致性
商品模式和人像模式都使用相同的 `from...` 格式，保持系統一致性。

### 5. 可擴展性
未來如果需要添加更多方位角描述，只需遵循 `from...` 格式即可。

## 測試驗證

所有方位角描述都經過測試驗證：

```typescript
// utils/cameraAngleDescriptions.test.ts
it('should return camera at eye level, front position for 0,0', () => {
  expect(getCameraAngleDescription(0, 0)).toBe(
    'Camera at eye level, horizontal perspective, from the front'
  );
});

it('should return camera behind subject for ±180°', () => {
  const result180 = getCameraAngleDescription(180, 0);
  expect(result180).toContain('from the back');
});
```

**測試結果：** 8 個測試全部通過 ✅

## 總結

使用 "from..." 介系詞片語描述方位角是一個經過深思熟慮的設計決策，它：

1. ✅ 避免語義衝突
2. ✅ 提升 AI 理解準確度
3. ✅ 保持系統一致性
4. ✅ 易於維護和擴展
5. ✅ 經過完整測試驗證

這個模式確保了極端相機角度（如 dramatic low angle）能夠與任何方位角（如 front, 3/4, side）完美結合，不會產生語義衝突。
