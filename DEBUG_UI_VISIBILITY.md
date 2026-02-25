# UI 可見性調試指南

## 🔍 檢查清單

### 1. 確認 studioSetup 是 'manual'
黃色圓圈和 slider 只在 `studioSetup === 'manual'` 時顯示。

**檢查方法：**
- 在瀏覽器開發者工具中打開 React DevTools
- 找到 `PortraitLightingVisualizer` 組件
- 檢查 props 中的 `config.studioSetup` 值

**解決方法：**
- 在 OpticsSection 中，拖曳任何光源控制器會自動設置為 'manual'
- 或者手動點擊任何預設後再調整，會切換到 'manual' 模式

### 2. 確認 onConfigChange prop 存在
控制器需要 `onConfigChange` prop 才能顯示。

**檢查方法：**
```typescript
// 在 OpticsSection.tsx 中
<PortraitLightingVisualizer 
  config={migratedConfig} 
  onConfigChange={onChange}  // ← 確認這行存在
/>
```

### 3. 檢查 z-index 層級

當前的層級設置：
```
z-index: 5  - 人臉球體
z-index: 10 - 前方的光源箭頭
z-index: 20 - 黃色圓圈和控制器
z-index: 25 - Status Labels 和 Intensity Indicators
```

### 4. 檢查 CSS 是否載入

確認 `PortraitLightingVisualizer.css` 已被正確 import：
```typescript
import './PortraitLightingVisualizer.css';
```

## 🐛 常見問題

### 問題 1: 看不到黃色圓圈
**可能原因：**
- `studioSetup` 不是 'manual'
- `onConfigChange` prop 未傳遞

**解決方法：**
1. 打開瀏覽器控制台
2. 輸入以下代碼檢查：
```javascript
// 檢查是否有黃色圓圈元素
document.querySelector('svg circle[stroke="#fbbf24"]')
```

### 問題 2: 看不到黃色圓點
**可能原因：**
- 圓點位置計算錯誤
- z-index 被其他元素覆蓋

**解決方法：**
1. 檢查圓點元素是否存在：
```javascript
document.querySelector('.bg-yellow-400.rounded-full')
```

2. 檢查圓點的位置：
```javascript
const dot = document.querySelector('.bg-yellow-400.rounded-full');
console.log(dot.style.left, dot.style.top);
```

### 問題 3: 看不到 Slider
**可能原因：**
- `studioSetup` 不是 'manual'
- Slider 在視覺化器容器外面

**解決方法：**
1. 檢查 Slider 元素：
```javascript
document.querySelector('.elevation-slider')
```

2. 確認 Slider 的父容器可見

## 🎨 臨時調試樣式

如果還是看不到，可以臨時添加以下樣式來高亮顯示：

```css
/* 在瀏覽器開發者工具的 Console 中執行 */
const style = document.createElement('style');
style.textContent = `
  /* 黃色圓圈 */
  svg circle[stroke="#fbbf24"] {
    stroke: #fbbf24 !important;
    stroke-width: 5px !important;
    opacity: 1 !important;
  }
  
  /* 黃色圓點 */
  .bg-yellow-400.rounded-full {
    background: #fbbf24 !important;
    width: 40px !important;
    height: 40px !important;
    z-index: 9999 !important;
    opacity: 1 !important;
  }
  
  /* Slider */
  .elevation-slider {
    background: red !important;
    height: 20px !important;
  }
`;
document.head.appendChild(style);
```

## 📊 預期的 DOM 結構

```html
<div class="relative h-72 w-full bg-slate-950 ...">
  <!-- 人臉球體 (z-index: 5) -->
  <div style="z-index: 5">
    <svg>...</svg>
  </div>
  
  <!-- 黃色圓圈控制器 (z-index: 20) -->
  <div style="z-index: 20">
    <!-- SVG 圓圈和十字線 -->
    <svg>
      <circle stroke="#fbbf24" .../>
      <line stroke="#60a5fa" .../>
    </svg>
    
    <!-- 可拖曳的黃色圓點 -->
    <div class="absolute w-full h-full pointer-events-auto cursor-pointer">
      <div class="absolute w-8 h-8 bg-yellow-400 rounded-full ..."></div>
    </div>
  </div>
  
  <!-- Status Labels (z-index: 25) -->
  <div style="z-index: 25">...</div>
</div>

<!-- Slider (在視覺化器外面) -->
<div class="space-y-3">
  <input type="range" class="elevation-slider" .../>
</div>
```

## 🔧 快速修復

如果以上都檢查過了還是看不到，試試這個快速修復：

1. **強制顯示黃色圓圈**
```typescript
// 在 PortraitLightingVisualizer.tsx 中
// 將條件改為：
{(studioSetup === 'manual' || true) && onConfigChange && (
```

2. **增加圓圈大小**
```typescript
// 將 w-[90%] h-[90%] 改為 w-full h-full
<svg className="absolute w-full h-full pointer-events-none" viewBox="0 0 200 200">
```

3. **增加圓點大小**
```typescript
// 將 w-8 h-8 改為 w-12 h-12
<div className="absolute w-12 h-12 bg-yellow-400 rounded-full ...">
```

## 📸 截圖對比

**應該看到的：**
- ✅ 黃色圓圈軌道（粗線）
- ✅ 藍色十字虛線
- ✅ 黃色圓點（可拖曳）
- ✅ 下方的黃色 Slider

**如果看不到：**
- ❌ 只看到人臉球體
- ❌ 沒有任何黃色元素
- ❌ Slider 不存在

## 💡 最後的建議

1. 清除瀏覽器緩存並重新載入
2. 確認 Vite 開發伺服器正在運行
3. 檢查瀏覽器控制台是否有錯誤訊息
4. 嘗試切換到不同的預設，然後再切換回 'manual' 模式
