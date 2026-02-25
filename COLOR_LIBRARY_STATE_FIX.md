# 顏色庫狀態管理修復

## 問題描述

在「場景空間」的「環景標籤庫」中，使用者新增的自訂顏色在切換到其他頁面後會消失。

## 根本原因

顏色庫使用了 **local component state** (`useState`)，而不是全域狀態管理：

```typescript
// ❌ 錯誤的實作方式
const [customColors, setCustomColors] = useState<string[]>([]);
```

這導致：
1. 顏色資料只存在於 `BackgroundSection` 元件內部
2. 切換頁面時元件被卸載（unmount），狀態丟失
3. 回到頁面時元件重新掛載（mount），狀態重新初始化
4. 雖然有 LocalStorage 讀寫，但因 React 生命週期問題，狀態仍會丟失

## 解決方案

將顏色庫整合到全域的 `customTags` 狀態管理系統中。

### 修改內容

#### 1. 擴充 `CustomTags` 介面 (types.ts)

```typescript
export interface CustomTags {
  subject: string[];
  background: string[];
  cameraAngle: string[];
  mood: string[];
  style: string[];
  colors: string[]; // ✅ 新增：自訂顏色庫（hex 格式）
}
```

#### 2. 更新 `useCustomTags` hook (hooks/useCustomTags.ts)

- 在預設值中加入 `colors: []`
- 新增舊版資料遷移邏輯，自動將 `nanoBanana_customColors` 遷移到新結構

```typescript
// 遷移舊版顏色資料（如果存在）
if (loadedTags.colors.length === 0) {
  try {
    const oldColors = localStorage.getItem('nanoBanana_customColors');
    if (oldColors) {
      const parsedColors = JSON.parse(oldColors) as string[];
      loadedTags.colors = parsedColors;
      localStorage.removeItem('nanoBanana_customColors');
      console.log('✅ 已遷移舊版顏色資料到新結構');
    }
  } catch (error) {
    console.error('遷移舊版顏色資料時發生錯誤:', error);
  }
}
```

#### 3. 重構 `BackgroundSection` (components/sections/BackgroundSection.tsx)

**更新 Props 介面：**
```typescript
interface BackgroundSectionProps {
  state: any;
  customTags: any; // ✅ 改為完整的 CustomTags 物件（而非只有 string[]）
  setCustomTags: (tags: any) => void; // ✅ 改為完整的 setCustomTags 函數
  onChange: (updater: any) => void;
}
```

**移除：**
- `const [customColors, setCustomColors] = useState<string[]>([]);`
- 兩個 `useEffect` (LocalStorage 讀寫邏輯)

**更新：**
- 所有 `customColors` 引用改為 `customTags.colors`
- 所有 `setCustomColors` 改為 `setCustomTags({ ...customTags, colors: ... })`
- 所有 `customTags` (舊的 string[]) 改為 `customTags.background`
- 所有 `setCustomTags` (舊的設定 string[]) 改為 `setCustomTags({ ...customTags, background: ... })`

#### 4. 更新 `MainContentArea` (components/layout/MainContentArea.tsx)

**修改前：**
```typescript
<BackgroundSection 
  state={state.background} 
  customTags={customTags.background}  // ❌ 只傳遞 string[]
  setCustomTags={(tags) => onCustomTagsChange({...customTags, background: tags})} 
  onChange={(bg) => onStateChange({...state, background: bg})} 
/>
```

**修改後：**
```typescript
<BackgroundSection 
  state={state.background} 
  customTags={customTags}  // ✅ 傳遞完整的 CustomTags 物件
  setCustomTags={onCustomTagsChange}  // ✅ 傳遞完整的 setCustomTags 函數
  onChange={(bg) => onStateChange({...state, background: bg})} 
/>
```

## 修改檔案清單

- ✅ `types.ts` - 擴充 CustomTags 介面
- ✅ `hooks/useCustomTags.ts` - 更新預設值 + 資料遷移 + 向後相容檢查
- ✅ `components/sections/BackgroundSection.tsx` - 更新 props 介面，移除 local state，使用全域狀態
- ✅ `components/layout/MainContentArea.tsx` - 傳遞完整的 customTags 物件而非只有 background 陣列

## 測試驗證

### 測試步驟

1. 開啟「場景空間」
2. 在「顏色庫」中選擇一個顏色並點擊「+ 新增」
3. 切換到其他頁面（如「攝影設定」）
4. 再切換回「場景空間」
5. ✅ 確認自訂顏色仍然存在

### 舊資料遷移測試

1. 如果使用者之前有儲存過顏色（在 `nanoBanana_customColors` key 中）
2. 第一次載入新版本時，會自動遷移到 `banana_custom_tags.colors`
3. 舊的 `nanoBanana_customColors` key 會被自動清除

## 其他標籤是否有同樣問題？

**否**。其他標籤（subject, background, cameraAngle, mood, style）都正確使用了全域的 `customTags` 狀態管理，不會有這個問題。

只有顏色庫因為歷史原因使用了獨立的 local state，現在已經修復並統一到全域狀態管理系統中。

## 架構改進

這次修復統一了所有自訂標籤的狀態管理方式：

```
App.tsx (useCustomTags hook)
  ↓
customTags: {
  subject: string[],
  background: string[],
  cameraAngle: string[],
  mood: string[],
  style: string[],
  colors: string[]  ← 新增
}
  ↓
透過 props 傳遞給各個 Section
  ↓
自動持久化到 LocalStorage (banana_custom_tags)
```

所有自訂資料現在都集中在一個地方管理，確保狀態一致性和持久性。
