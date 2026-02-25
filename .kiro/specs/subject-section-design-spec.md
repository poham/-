# Subject Section Design Specification (01 定義主體物件)

## 概述

本文件定義「01 定義主體物件」Section 的完整設計規範，作為所有其他 Section 的設計標準。

---

## 視覺層級系統

### Headline (主標題)
**用途**: Section 的主要標題
- **範例**: "定義主體物件"
- **字體大小**: `text-[32px]`
- **字重**: `font-black`
- **顏色**: `text-white`
- **行高**: `leading-tight`
- **間距**: `mb-3`

### Description (副標題/描述文字)
**用途**: Section 的說明文字
- **範例**: "描述你要拍攝的主體，包含物件類別、特徵和觀看角度。"
- **字體大小**: `text-[15px]`
- **字重**: `font-normal`
- **顏色**: `text-slate-400`
- **行高**: `leading-relaxed`

### Field Label (欄位標籤)
**用途**: 輸入框或 textarea 的標籤
- **範例**: "物件類別"、"主體描述"
- **字體大小**: `text-[16px]`
- **字重**: `font-black`
- **顏色**: `text-white`
- **大小寫**: `uppercase`
- **字距**: `tracking-[0.15em]`
- **間距**: `ml-2`

### Section Title (區塊標題)
**用途**: 特徵庫、旋轉主體等區塊的標題
- **範例**: "特徵庫"、"旋轉主體"、"材質"、"時尚穿著"
- **字體大小**: `text-[18px]` (特徵庫主標題) / `text-[15px]` (子分類標題)
- **字重**: `font-black`
- **顏色**: `text-slate-300`
- **大小寫**: `uppercase`
- **字距**: `tracking-widest`
- **裝飾**: `border-l-4 border-step-subject/30 pl-4`

### Preset Button Text (預設按鈕文字)
**用途**: 可點擊的 Preset 標籤按鈕
- **範例**: "+ 絲綢"、"+ 正面"、"+ 水珠"
- **字體大小**: `text-[16px]`
- **字重**: `font-bold`
- **顏色**: `text-white`
- **Hover 顏色**: `hover:text-emerald-200`

### Input/Textarea Text (輸入文字)
**用途**: 使用者輸入的文字
- **字體大小**: `text-xl` (約 20px)
- **字重**: `font-bold` (input) / `font-medium` (textarea)
- **顏色**: `text-white` (input) / `text-slate-200` (textarea)
- **Placeholder 顏色**: `placeholder-slate-400`

---

## 間距規範

### Container Padding (容器內距)
- **大型容器** (特徵庫): `p-5`
- **輸入框**: `p-4`
- **Textarea**: `p-4`

### Container Spacing (容器間距)
- **Section 內主要區塊間距**: `space-y-12`
- **特徵庫內區塊間距**: `space-y-6`
- **子分類區塊間距**: `space-y-4`

### Button Spacing (按鈕間距)
- **按鈕 padding**: `px-5 py-2.5`
- **按鈕之間間距**: `gap-2`

### Form Element Spacing (表單元素間距)
- **Label 與 Input 間距**: `space-y-4`
- **表單元素之間**: `gap-3`

---

## 圓角規範

### Border Radius (圓角大小)
- **大型容器**: `rounded-xl` (12px)
- **輸入框/按鈕**: `rounded-lg` (8px)
- **數字徽章**: `rounded-[32px]`

---

## 顏色系統

### 主題色 (Subject Theme)
- **主色**: `step-subject` (emerald green)
- **淺色**: `step-subject-light`
- **深色**: `step-subject-dark`

### 背景色
- **主背景**: `bg-slate-950`
- **容器背景**: `bg-slate-900/30`
- **按鈕背景**: `bg-slate-800`

### 邊框色
- **主邊框**: `border-white`
- **次要邊框**: `border-slate-800`
- **按鈕邊框**: `border-slate-700`
- **主題邊框**: `border-step-subject/20`

### 文字色
- **主文字**: `text-white`
- **次要文字**: `text-slate-400`
- **標題文字**: `text-slate-300`
- **主題色文字**: `text-step-subject-light`

---

## 互動狀態

### Focus State (聚焦狀態)
- **輸入框**: `focus:ring-2 focus:ring-step-subject/50 focus:border-step-subject`
- **按鈕**: `focus:ring-1 focus:ring-step-subject`

### Hover State (懸停狀態)
- **輸入框**: `hover:border-step-subject/30`
- **按鈕**: `hover:bg-step-subject/20 hover:border-step-subject hover:text-emerald-200`

### Active State (點擊狀態)
- **按鈕**: `active:scale-95`

---

## 組件結構

### 1. Section Header (Section 標題區)
```tsx
<div className="flex items-center gap-6 mb-8">
  {/* 數字徽章 */}
  <div className="bg-gradient-to-br from-step-subject-light to-step-subject-dark text-white w-[140px] h-[140px] rounded-[32px] flex items-center justify-center font-black text-[64px] shadow-2xl">
    01
  </div>
  
  {/* 標題與描述 */}
  <div className="flex-1">
    <h3 className="text-[32px] font-black text-white leading-tight mb-3">
      定義主體物件
    </h3>
    <p className="text-[15px] text-slate-400 leading-relaxed">
      描述你要拍攝的主體，包含物件類別、特徵和觀看角度。
    </p>
  </div>
</div>
```

### 2. Input Field (輸入欄位)
```tsx
<div className="space-y-4">
  <label className="text-[16px] uppercase font-black text-white tracking-[0.15em] ml-2">
    物件類別
  </label>
  <input 
    type="text"
    placeholder="例如：時尚模特兒、和牛牛排、手錶..."
    className="w-full bg-slate-950 border border-white rounded-xl p-4 text-xl font-bold text-white focus:ring-2 focus:ring-step-subject/50 focus:border-step-subject outline-none transition-all hover:border-step-subject/30 placeholder-slate-400 shadow-inner"
  />
</div>
```

### 3. Textarea Field (文字區域)
```tsx
<div className="space-y-4">
  <label className="text-[16px] uppercase font-black text-white tracking-[0.15em] ml-2">
    主體描述
  </label>
  <textarea
    placeholder="例如：強烈眼神、融化質感、錶盤細節、絲綢質地、金屬光澤、木紋紋理..."
    className="w-full bg-slate-950 border border-white rounded-xl p-4 min-h-[200px] text-xl font-medium text-slate-200 focus:ring-2 focus:ring-step-subject/50 focus:border-step-subject outline-none transition-all placeholder-slate-400 leading-relaxed shadow-inner hover:border-step-subject/30 resize-y"
  />
</div>
```

### 4. Feature Library Container (特徵庫容器)
```tsx
<div className="bg-slate-900/30 p-5 rounded-xl border border-slate-800 space-y-6">
  {/* 主標題 */}
  <div className="flex items-center gap-4">
    <span className="w-12 h-px bg-step-subject/30" />
    <label className="text-[18px] uppercase font-black text-slate-300 tracking-widest">
      特徵庫
    </label>
  </div>
  
  {/* 內容區塊 */}
  <div className="space-y-4">
    <p className="text-[15px] font-black text-slate-300 uppercase tracking-widest border-l-4 border-step-subject/30 pl-4">
      旋轉主體
    </p>
    <div className="flex flex-wrap gap-2">
      {/* Preset 按鈕 */}
    </div>
  </div>
</div>
```

### 5. Preset Button (預設按鈕)
```tsx
<button
  className="px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-[16px] font-bold text-white hover:bg-step-subject/20 hover:border-step-subject hover:text-emerald-200 transition-all active:scale-95 shadow-sm"
>
  + 正面
</button>
```

---

## 響應式設計

### 手機/平板模式 (< 1500px)
- 底部導航欄顯示
- 主內容區域底部 padding: `pb-32 sm:pb-36 md:pb-40`

### 桌面模式 (≥ 1500px)
- 底部導航欄隱藏
- 主內容區域底部 padding: `pb-12`

---

## 動畫效果

### 進場動畫
```tsx
className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
```

### 過渡效果
- 所有互動元素: `transition-all`
- 按鈕點擊: `active:scale-95`

---

## 無障礙設計

### Focus Indicators (聚焦指示器)
- 所有互動元素都有明確的 focus ring
- 使用 `outline-none` 時必須提供替代的 focus 樣式

### Color Contrast (顏色對比)
- 主文字 (white) 與背景 (slate-950) 對比度 > 7:1
- 次要文字 (slate-400) 與背景對比度 > 4.5:1

---

## 實施檢查清單

在實施其他 Section 時，請確認：

- [ ] Headline 使用 `text-[32px] font-black text-white`
- [ ] Description 使用 `text-[15px] text-slate-400`
- [ ] Field Label 使用 `text-[16px] uppercase font-black text-white`
- [ ] Section Title (主) 使用 `text-[18px] font-black text-slate-300`
- [ ] Section Title (子) 使用 `text-[15px] font-black text-slate-300`
- [ ] Preset Button 使用 `text-[16px] font-bold text-white`
- [ ] Container padding 為 `p-5`
- [ ] Input/Textarea padding 為 `p-4`
- [ ] Button padding 為 `px-5 py-2.5`
- [ ] 圓角使用 `rounded-xl` (容器) 或 `rounded-lg` (按鈕)
- [ ] 間距符合規範 (space-y-12, space-y-6, space-y-4, gap-2)
- [ ] 所有互動元素有 hover 和 focus 狀態
- [ ] 顏色使用主題色系統

---

## 範例截圖參考

請參考 `components/sections/SubjectSection.tsx` 的當前實作作為視覺標準。

---

## 版本歷史

- **v1.0** (2025-01-30): 初始版本，基於 SubjectSection 的當前實作建立設計規範
