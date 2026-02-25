# 新的光源控制 UI 改進

## 🎯 設計理念

根據用戶反饋，原本的雙圓圈控制器不夠直覺。新的設計將控制整合到視覺化器中，讓用戶可以直接在預覽畫面上操作。

## ✨ 新功能

### 1. 黃色圓圈方位角控制
- **位置**：在「人像光影動態預覽」視覺化器中
- **功能**：黃色圓圈上的黃色圓點可以拖曳
- **控制**：直接控制光源的方位角 (Azimuth 0-360°)
- **視覺**：
  - 黃色圓圈軌道
  - 藍色虛線十字（垂直和水平中心線）
  - 可拖曳的黃色圓點（帶白色邊框和發光效果）

### 2. 黃色 Slider 仰角控制
- **位置**：視覺化器下方
- **功能**：水平滑桿控制仰角
- **控制**：以藍色虛線（垂直中心線）為軸心旋轉
- **範圍**：-90° (向下) 到 +90° (向上)
- **視覺**：
  - 黃色滑桿軌道
  - 中心線標記（0°）
  - 刻度標記（-90°, 0°, +90°）
  - 大型黃色圓形拖曳點

### 3. 深度感知的箭頭顯示
- **前方光源** (z >= 0)：實線箭頭，完全可見
- **後方光源** (z < 0)：虛線箭頭，半透明
- **目的**：清楚顯示光源是在物體前方還是後方

## 🗑️ 移除的元件

- ❌ `DualAxisController` 雙圓圈控制器
- ❌ 獨立的方位角和仰角控制面板

## 📐 UI 佈局

```
┌─────────────────────────────────────────┐
│  人像光影動態預覽 (Live Engine)          │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │     ╭─────────────────╮           │  │
│  │    ╱       ┊         ╲  ●        │  │ ← 黃色圓點（可拖曳）
│  │   │        ┊          │           │  │
│  │   │   ────●────       │           │  │ ← 藍色十字線
│  │   │        ┊          │           │  │
│  │    ╲       ┊         ╱            │  │
│  │     ╰─────────────────╯           │  │
│  │         (人臉球體)                 │  │
│  └───────────────────────────────────┘  │
│                                         │
│  仰角 Elevation              45°        │
│  ├─────────────●──────────────┤        │ ← 黃色 Slider
│  -90°          0°           +90°       │
└─────────────────────────────────────────┘
```

## 🎨 視覺設計細節

### 黃色圓圈
- 顏色：`#fbbf24` (黃色)
- 線寬：3px
- 大小：視覺化器的 90%

### 藍色十字線
- 顏色：`#60a5fa` (藍色)
- 樣式：虛線 (6px 實線, 6px 間隔)
- 線寬：2px

### 黃色圓點
- 大小：32px × 32px
- 顏色：`#fbbf24` (黃色)
- 邊框：4px 白色
- 陰影：`0 0 20px rgba(251, 191, 36, 0.8)`
- Hover 效果：放大 1.1 倍，陰影增強

### Slider
- 軌道高度：12px
- 圓點大小：32px × 32px
- 顏色漸變：左側灰色 → 當前位置黃色 → 右側灰色

## 🔧 技術實作

### 新增的 Props
```typescript
interface PortraitLightingVisualizerProps {
  config: OpticsConfig;
  onConfigChange?: (config: OpticsConfig) => void; // 新增
}
```

### 事件處理
```typescript
// 方位角拖曳
handleAzimuthDrag(e, 'key' | 'fill' | 'rim')

// 仰角 Slider
handleElevationChange(e, 'key' | 'fill' | 'rim')
```

### 位置計算
```typescript
// 計算黃色圓點在圓圈上的位置
const getAzimuthDotPosition = (azimuth: number) => {
  const radius = 45; // 百分比
  const angleRad = (azimuth - 90) * Math.PI / 180;
  return {
    x: 50 + Math.cos(angleRad) * radius,
    y: 50 + Math.sin(angleRad) * radius
  };
};
```

## 📝 使用說明

### 控制主光源 (Key Light)
1. **調整方位角**：拖曳黃色圓圈上的黃色圓點
2. **調整仰角**：拖曳視覺化器下方的黃色 slider
3. **調整顏色和強度**：在右側面板的「主光 KEY」標籤中

### 控制補光 (Fill Light)
1. 切換到「補光 FILL」標籤
2. 調整顏色和強度
3. 方位角和仰角控制與主光相同（未來可擴展為獨立控制）

### 控制輪廓光 (Rim Light)
1. 切換到「輪廓 RIM」標籤
2. 調整顏色和強度
3. 仰角使用 slider 控制
4. 方位角自動鎖定在主光源背後

## 🚀 優勢

1. **更直覺**：直接在視覺化器上操作，所見即所得
2. **更簡潔**：減少 UI 元素，降低認知負擔
3. **更精確**：Slider 提供精確的數值控制
4. **更清晰**：深度感知的箭頭顯示讓光源位置一目了然

## 🔄 向後兼容

- 保留所有原有的資料結構
- `migrateOpticsConfig()` 確保舊資料正常運作
- 如果 `onConfigChange` 未提供，控制器不會顯示（只顯示預覽）

## 📦 相關文件

- `components/visuals/PortraitLightingVisualizer.tsx` - 主要視覺化器
- `components/visuals/PortraitLightingVisualizer.css` - Slider 樣式
- `components/lighting/LightSourcePanel.tsx` - 簡化的光源面板
- `components/lighting/RimLightPanel.tsx` - 簡化的輪廓光面板
- `components/sections/OpticsSection.tsx` - 整合新控制器

## 🎯 下一步

1. 測試新的拖曳控制是否流暢
2. 確認 Slider 的精確度
3. 考慮是否需要為 Fill Light 添加獨立的黃色圓點
4. 優化視覺回饋（例如：拖曳時的動畫效果）
