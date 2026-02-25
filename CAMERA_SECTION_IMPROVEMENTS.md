# 攝影設定 04 - 介面改進

## 改進項目

### 1. 攝影機位置與角度 3D 視覺化

**新增組件：** `CameraPositionVisualizer.tsx`

**功能特色：**
- 2D 圖示呈現 3D 攝影機位置
- 即時顯示攝影機相對於主體的位置
- 視覺化攝影機視線方向
- 高度指示器顯示攝影機垂直位置
- 支援 Roll 角度顯示

**支援的角度類型：**
- 水平視角 (Eye Level)
- 鳥瞰 (Bird's Eye)
- 蟲視 (Worm's Eye)
- 高角度 (High Angle)
- 低角度 (Low Angle)
- 仰視 (Looking Up)
- 俯視 (Looking Down)
- 地面視角 (Ground Level)
- 無人機視角 (Drone View)

### 2. 統一取景尺度參照標準

**修改組件：** `FramingVisualizer.tsx`

**核心改進：**
- 所有預覽統一以 1:1 (320x320px) 為參照標準
- 不同寬高比只改變裁切框範圍，不改變人物縮放
- 確保「超特寫」等設定在所有寬高比下呈現一致

**視覺設計：**
- 灰色虛線框：顯示 1:1 完整參照範圍
- 藍色實線框：顯示當前寬高比的實際拍攝範圍
- 三分法網格：僅在實際拍攝範圍內顯示
- 右上角標註：顯示參照標準和裁切狀態

**優勢：**
- 使用者可清楚看到不同寬高比的裁切效果
- 取景尺度保持一致，不會因寬高比改變而產生混淆
- 更直觀地理解構圖在不同格式下的呈現

## 技術實作

### CameraPositionVisualizer
```typescript
interface CameraPositionVisualizerProps {
  angle: string;
  roll: number;
}
```

- 解析角度關鍵字判斷攝影機位置
- 動態計算攝影機 X/Y 座標和旋轉角度
- SVG 視線指示線和視野範圍扇形
- 高度滑軌顯示垂直位置

### FramingVisualizer 改進
```typescript
const baseSize = 320; // 固定 1:1 參照尺寸
```

- 外層容器固定為 320x320px
- 內層裁切框根據寬高比調整高度
- 人物縮放和位置計算基於 1:1 標準
- 裁切框外的區域顯示為參照範圍
