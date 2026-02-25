# Section 主題顏色應用指南

本文件說明如何為每個 Section 套用對應的主題顏色。

## 顏色主題定義

已在 `tailwind.config.js` 中定義以下主題顏色：

```javascript
'step-subject': {
  light: '#34d399',  // emerald-400
  DEFAULT: '#10b981', // emerald-500
  dark: '#059669',   // emerald-600
},
'step-scene': {
  light: '#818cf8',  // indigo-400
  DEFAULT: '#6366f1', // indigo-500
  dark: '#4f46e5',   // indigo-600
},
'step-camera': {
  light: '#38bdf8',  // sky-400
  DEFAULT: '#0ea5e9', // sky-500
  dark: '#0284c7',   // sky-600
},
'step-light': {
  light: '#fbbf24',  // amber-400
  DEFAULT: '#f59e0b', // amber-500
  dark: '#d97706',   // amber-600
},
'step-style': {
  light: '#c084fc',  // purple-400
  DEFAULT: '#a855f7', // purple-500
  dark: '#9333ea',   // purple-600
},
'step-export': {
  light: '#4ade80',  // green-400
  DEFAULT: '#22c55e', // green-500
  dark: '#16a34a',   // green-600
},
```

## 顏色替換規則

### 1. 主要按鈕（選中狀態）
```tsx
// 舊的
bg-blue-600 border-blue-400 shadow-blue-900/40

// 新的（以 Subject Section 為例）
bg-step-subject border-step-subject-light shadow-step-subject/40
```

### 2. Hover 狀態
```tsx
// 舊的
hover:bg-blue-600/20 hover:border-blue-500 hover:text-blue-200

// 新的
hover:bg-step-subject/20 hover:border-step-subject hover:text-emerald-200
```

### 3. Label 和標題
```tsx
// 舊的
text-orange-500

// 新的
text-step-subject
```

### 4. Focus 狀態（輸入框）
```tsx
// 舊的
focus:ring-orange-500/50 focus:border-orange-500

// 新的
focus:ring-step-subject/50 focus:border-step-subject
```

### 5. 裝飾線條
```tsx
// 舊的
bg-blue-500/30 或 border-blue-500/30

// 新的
bg-step-subject/30 或 border-step-subject/30
```

## 各 Section 應使用的主題

| Section | 主題變數 | 顏色 | 文字顏色變體 |
|---------|---------|------|------------|
| SubjectSection (01) | `step-subject` | Emerald 綠 | `emerald-200` |
| BackgroundSection (02) | `step-scene` | Indigo 靛藍 | `indigo-200` |
| CameraSection (03) | `step-camera` | Sky 天藍 | `sky-200` |
| OpticsSection (04) | `step-light` | Amber 琥珀 | `amber-200` |
| StyleSection (05) | `step-style` | Purple 紫 | `purple-200` |
| ShareSection (06) | `step-export` | Green 綠 | `green-200` |

## 需要替換的元素類型

1. **選項按鈕** - 如 Aspect Ratio、Shot Type 等
2. **標籤按鈕** - 如特徵庫、環境標籤等
3. **輸入框** - focus 和 hover 狀態
4. **Label 文字** - 欄位標題
5. **裝飾元素** - 分隔線、邊框等
6. **新增按鈕** - 如「＋ 新增」按鈕

## 實作範例

### SubjectSection (已完成) ✅
- 所有 `blue` 相關顏色 → `step-subject`
- 所有 `orange` 相關顏色 → `step-subject`
- 文字顏色使用 `emerald-200`

### BackgroundSection (待完成)
需要將以下顏色替換為 `step-scene` (Indigo)：
- `bg-blue-600` → `bg-step-scene`
- `border-blue-500` → `border-step-scene`
- `text-orange-500` → `text-step-scene`
- `hover:bg-blue-600/20` → `hover:bg-step-scene/20`
- 文字顏色使用 `indigo-200`

### CameraSection (待完成)
需要將顏色替換為 `step-camera` (Sky)：
- 所有按鈕和控制項
- 文字顏色使用 `sky-200`

### OpticsSection (待完成)
需要將顏色替換為 `step-light` (Amber)：
- 所有按鈕和控制項
- 文字顏色使用 `amber-200`

### StyleSection (待完成)
需要將顏色替換為 `step-style` (Purple)：
- 所有按鈕和控制項
- 文字顏色使用 `purple-200`

### ShareSection (待完成)
需要將顏色替換為 `step-export` (Green)：
- 複製按鈕等
- 文字顏色使用 `green-200`

## 注意事項

1. 保持一致性：同一個 Section 內的所有互動元素都應使用相同的主題顏色
2. 對比度：確保文字在背景上有足夠的對比度
3. Hover 狀態：使用 `/20` 透明度來創建柔和的 hover 效果
4. Shadow：陰影顏色也應該使用主題顏色（如 `shadow-step-subject/40`）
