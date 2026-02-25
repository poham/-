# 預設集藝廊封面功能

## 功能說明

系列封面現在會自動使用該系列內 preset 的縮圖，以旋轉排列的方式呈現，讓使用者可以快速預覽系列內的風格。

## 視覺設計

### 縮圖數量與排列

- **4 張縮圖**：四個角落分散排列，尺寸 160x160px
- **3 張縮圖**：三個位置排列，尺寸 160x160px
- **2 張縮圖**：對角線排列，尺寸 192x192px
- **1 張縮圖**：中心位置，尺寸 256x256px
- **0 張縮圖**：灰白色漸層背景（from-slate-700 via-slate-800 to-slate-900）

### 旋轉角度

每張縮圖都會逆時鐘旋轉，角度為：
- 第 1 張：-8°
- 第 2 張：+8°
- 第 3 張：-12°
- 第 4 張：+12°

### 位置分布

```
┌─────────────────────┐
│  [1]                │
│         [2]         │
│                     │
│  [3]         [4]    │
└─────────────────────┘
```

- 位置 1：top: 20%, left: 15%
- 位置 2：top: 35%, right: 20%
- 位置 3：bottom: 25%, left: 25%
- 位置 4：bottom: 20%, right: 15%

### 視覺效果

- 白色邊框：4px，20% 透明度
- 陰影：shadow-2xl
- Hover 效果：scale-110（放大 10%）
- 圓角：rounded-2xl
- 層級：z-index 由後到前遞減

## 技術實作

### SeriesCover 組件

```tsx
const SeriesCover = ({ series }: { series: PresetSeries }) => {
  // 自動收集系列中有縮圖的 preset（最多 4 張）
  const thumbnails = series.presets
    .filter(p => p.thumbnail && p.thumbnail.trim() !== '')
    .slice(0, 4)
    .map(p => p.thumbnail!);

  // 根據縮圖數量動態調整排列
  // ...
}
```

### 優點

1. **自動化**：不需要手動設定封面圖，系統自動從 preset 縮圖生成
2. **動態**：新增 preset 時，封面會自動更新
3. **視覺豐富**：旋轉排列讓封面更有設計感
4. **風格預覽**：使用者可以快速了解系列內的攝影風格
5. **降級處理**：沒有縮圖時使用優雅的漸層背景

## 使用方式

只需要確保 preset 有設定 `thumbnail` 欄位：

```typescript
{
  id: 'lux-1',
  name: 'TML mediagene 桌球組',
  thumbnail: '/preset-thumbnails/luxury-products/lux-1.webp',
  config: { ... }
}
```

系統會自動：
1. 收集該系列所有有縮圖的 preset
2. 選取前 4 張
3. 以旋轉排列方式呈現在封面上

## 未來優化建議

- 可以考慮添加更多排列模式（網格、圓形等）
- 可以讓使用者自訂封面顯示的 preset
- 可以添加更多動畫效果（視差、3D 翻轉等）
