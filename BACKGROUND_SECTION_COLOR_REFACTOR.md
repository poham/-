# Background Section - Color Management System

## 日期
2026-01-28

## 變更歷史

### Version 3: 顏色管理系統（當前版本）✨
**實作時間**: 2026-01-28

**新功能**：
- ✅ 預設顏色庫（8 個常用顏色）
- ✅ 自訂顏色管理（可新增、編輯、刪除）
- ✅ 點擊顏色插入描述到 textarea
- ✅ 雙擊顏色選擇後可編輯
- ✅ LocalStorage 持久化儲存
- ✅ 視覺化顏色選擇器

**互動流程**：
1. **插入顏色**：點擊顏色按鈕 → 顏色描述插入到 textarea
2. **編輯顏色**：雙擊顏色按鈕 → 選中該顏色 → 調整顏色選擇器 → 點擊「更新」
3. **新增顏色**：調整顏色選擇器 → 點擊「+ 新增」→ 加入自訂顏色庫
4. **刪除顏色**：Hover 自訂顏色 → 點擊右上角 × 按鈕

**預設顏色**：
- `#FFFFFF` - Pure white
- `#000000` - Pure black
- `#94A3B8` - Soft gray
- `#3B82F6` - Vibrant blue
- `#10B981` - Fresh green
- `#EF4444` - Bold red
- `#F59E0B` - Warm orange
- `#8B5CF6` - Rich purple

**備份位置**: `BackgroundSection.tsx.backup2`

---

### Version 2: 顏色輔助工具（已棄用）
**實作時間**: 2026-01-28
- 顏色選擇器 + 新增按鈕
- 點擊新增後插入顏色描述
- **備份位置**: `BackgroundSection.tsx.backup`

### Version 1: 原始版本（已棄用）
**實作時間**: 2026-01-28 之前
- `bgColor` 直接儲存在 state
- 自動添加到 prompt 組裝
- 只支援單一背景色

---

## 技術實作細節

### State 管理
```tsx
const [selectedColor, setSelectedColor] = useState('#1e293b');
const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
const [customColors, setCustomColors] = useState<string[]>([]);
```

### LocalStorage 持久化
```tsx
// 載入
useEffect(() => {
  const saved = localStorage.getItem('nanoBanana_customColors');
  if (saved) setCustomColors(JSON.parse(saved));
}, []);

// 儲存
useEffect(() => {
  localStorage.setItem('nanoBanana_customColors', JSON.stringify(customColors));
}, [customColors]);
```

### 核心函數
- `handleColorClick(color)` - 點擊顏色插入描述
- `handleSelectColor(index, color)` - 雙擊選擇顏色進行編輯
- `handleUpdateColor()` - 更新選中的自訂顏色
- `handleAddColor()` - 新增顏色到自訂庫
- `handleRemoveColor(index, e)` - 刪除自訂顏色

### UI 特性
- 預設顏色：不可刪除，可雙擊選擇
- 自訂顏色：可刪除（hover 顯示 × 按鈕），可雙擊編輯
- 選中狀態：紫色邊框 + ring 效果
- 白色顏色：額外的內邊框以提高可見度

---

## 使用範例

### 情境 1：插入單一顏色
1. 點擊 `#FFFFFF` (Pure white)
2. Textarea 插入 "Pure white"
3. 手動編輯為 "Pure white background"

### 情境 2：插入多個顏色
1. 點擊 `#3B82F6` (Vibrant blue) → 插入 "Vibrant blue"
2. 點擊 `#FFFFFF` (Pure white) → 插入 ", Pure white"
3. 手動編輯為 "Vibrant blue on left side, Pure white on right side"

### 情境 3：新增自訂顏色
1. 調整顏色選擇器到 `#FF6B9D`
2. 點擊「+ 新增」
3. 新顏色出現在顏色庫中
4. 點擊該顏色 → 插入 "Soft pink"

### 情境 4：編輯自訂顏色
1. 雙擊自訂顏色（例如 `#FF6B9D`）
2. 顏色被選中（紫色邊框）
3. 調整顏色選擇器到 `#FF1493`
4. 點擊「更新」
5. 顏色庫中的顏色更新

---

## 如果需要回滾

### 回滾到 Version 2（顏色輔助工具）
```powershell
Copy-Item "components/sections/BackgroundSection.tsx.backup" "components/sections/BackgroundSection.tsx" -Force
```

### 回滾到 Version 1（原始版本）
需要手動還原：
1. 移除顏色管理相關 state 和函數
2. 還原 `visualTranslators.ts` 中的 bgColor 處理邏輯
3. 還原 UI 為簡單的顏色選擇器

---

## 測試檢查清單
- [ ] 點擊預設顏色插入描述
- [ ] 點擊自訂顏色插入描述
- [ ] 雙擊預設顏色選擇（但不能編輯）
- [ ] 雙擊自訂顏色選擇並編輯
- [ ] 新增自訂顏色
- [ ] 刪除自訂顏色
- [ ] LocalStorage 持久化
- [ ] 顏色翻譯正確（例如 #FFFFFF → "Pure white"）
- [ ] Textarea 自動 focus 和游標定位
- [ ] 白色顏色的可見度（內邊框）
- [ ] Hover 效果和動畫
- [ ] 選中狀態視覺回饋

---

## 相關檔案
- `components/sections/BackgroundSection.tsx` - 主要實作
- `utils/visualTranslators.ts` - 顏色翻譯邏輯（`translateColorHex` 函數）
- `components/sections/BackgroundSection.tsx.backup` - Version 2 備份
- `components/sections/BackgroundSection.tsx.backup2` - Version 3 備份
