# 攝影機角度系統重構

## 改進概述

將攝影機角度控制從「文字標籤選擇」改為「數值化 3D Gizmo 控制」，提供更直觀和精確的操作體驗。

## 主要改進

### 1. 3D Gizmo 視覺化控制器

**新增組件：** `Camera3DGizmo.tsx`

**特色：**
- 球面座標系統視覺化
- 紅色圈：Azimuth（方位角，水平旋轉 0-360°）
- 藍色圈：Elevation（仰角，垂直角度 -90° to 90°）
- 綠色圈：輔助參考線
- 黃色點：攝影機位置
- 黃色箭頭：視線方向（指向中心主體）
- 灰色點：主體位置（中心）

**操作方式：**
- 拖動 Azimuth 滑桿：沿著紅色圈移動攝影機（水平旋轉）
- 拖動 Elevation 滑桿：沿著藍色圈移動攝影機（上下移動）
- 即時顯示當前角度數值和描述

### 2. 角度描述模組化

**新增模組：** `utils/cameraAngleDescriptions.ts`

**功能：**
- `getCameraAngleDescription()`: 將數值轉換為自然語言描述
- `getCameraAngleHint()`: 提供視覺效果提示
- `getCameraAngleColor()`: 根據角度類型返回顏色主題

**優勢：**
- 分離描述邏輯，保持組件簡潔
- 易於維護和擴展
- 完整的單元測試覆蓋

### 3. 資料結構更新

**types.ts 新增欄位：**
```typescript
interface CameraConfig {
  // ... 現有欄位
  cameraAzimuth?: number;   // 方位角 0-360°
  cameraElevation?: number; // 仰角 -90° to 90°
}
```

**向後兼容：**
- 保留 `angle` 文字欄位
- 自動從數值生成描述
- 舊的 preset 仍可正常載入

## 技術實作

### 球面座標轉換

```typescript
const azimuthRad = (azimuth * Math.PI) / 180;
const elevationRad = (elevation * Math.PI) / 180;

const cameraX = center + radius * Math.cos(elevationRad) * Math.sin(azimuthRad);
const cameraY = center - radius * Math.sin(elevationRad);
```

### 角度描述映射

- **Elevation 範圍：**
  - 80° ~ 90°: Bird's Eye View
  - 60° ~ 80°: Extreme High Angle
  - 30° ~ 60°: High Angle
  - -10° ~ 10°: Eye Level
  - -60° ~ -30°: Low Angle
  - -90° ~ -80°: Worm's Eye View

- **Azimuth 範圍：**
  - 0° (±22.5°): Front View
  - 90° (±22.5°): Right Side
  - 180° (±22.5°): Back View
  - 270° (±22.5°): Left Side

## 移除的功能

- ❌ 預設角度標籤按鈕（CAMERA_ANGLE_TAGS）
- ❌ 多選角度組合功能
- ❌ 舊的 CameraPositionVisualizer 組件

## 保留的功能

- ✅ 自定義角度標籤（作為補充說明）
- ✅ Roll 角度控制（傾斜）
- ✅ 向後兼容舊的文字描述

## 使用體驗提升

**之前：**
- 需要點擊多個標籤組合角度
- 無法精確控制角度
- 視覺化不直觀
- UI 顯示混亂（多選時）

**現在：**
- 拖動滑桿精確控制
- 3D 視覺化清晰直觀
- 即時顯示角度描述
- 自動生成 prompt 描述
