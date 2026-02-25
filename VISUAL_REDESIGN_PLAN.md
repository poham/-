# Nano Banana 視覺重設計方案

## 🎯 目標
**功能 100% 保留，只改變視覺呈現和佈局方式**

特別保護：
- ✅ 攝影設定系統（Camera3DGizmo, 角度計算, 取景模式）
- ✅ 燈光物理系統（DualAxisController, 3點燈光, 燈光計算）
- ✅ 所有視覺化控制器的邏輯
- ✅ 提示詞組裝和翻譯層
- ✅ 狀態管理和數據流

---

## 📱 響應式設計策略

### 電腦版 (≥1024px)
```
┌─────────────────────────────────────────────────────┐
│  [Logo]  [導航標籤]              [預覽切換] [複製]  │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────────────┐  ┌─────────────────────┐  │
│  │                     │  │                     │  │
│  │   主要內容區域      │  │   即時預覽面板      │  │
│  │   (Section)         │  │   (Protocol Deck)   │  │
│  │                     │  │                     │  │
│  └─────────────────────┘  └─────────────────────┘  │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### 手機版 (<1024px)
```
┌─────────────────────┐
│ [☰] Logo    [預覽] │  ← 頂部工具列
├─────────────────────┤
│                     │
│   主要內容區域      │  ← 全寬顯示
│   (Section)         │
│                     │
│                     │
└─────────────────────┘
│                     │
│ [底部導航標籤列]    │  ← 固定底部
└─────────────────────┘
```

---

## 🎨 新視覺設計系統

### 色彩方案（保持深色主題 + 每步驟專屬顏色）

#### ✅ 保留現有的步驟顏色系統
```css
/* 背景色 */
--bg-primary: #0a0e1a;      /* 更深的背景 */
--bg-secondary: #141824;    /* 卡片背景 */
--bg-tertiary: #1e2433;     /* 懸停背景 */

/* 步驟專屬顏色（保留） */
--step-00-presets: #3b82f6;   /* 藍色 - 藝廊預設 */
--step-01-subject: #3b82f6;   /* 藍色 - 主體細節 */
--step-02-scene: #6366f1;     /* 靛藍色 - 場景空間 */
--step-03-camera: #3b82f6;    /* 藍色 - 攝影設定 */
--step-04-light: #eab308;     /* 黃色 - 燈光物理 */
--step-05-style: #a855f7;     /* 紫色 - 模擬風格 */
--step-06-export: #3b82f6;    /* 藍色 - 協定導出 */
--step-settings: #64748b;     /* 灰色 - 系統設定 */

/* 通用強調色 */
--accent-primary: #3b82f6;    /* 藍色 */
--accent-secondary: #f97316;  /* 橙色 */
--accent-success: #10b981;    /* 綠色 */
--accent-warning: #f59e0b;    /* 黃色 */

/* 文字顏色（加大對比度，更清晰） */
--text-primary: #ffffff;      /* 純白 - 主標題 */
--text-secondary: #e2e8f0;    /* 淺灰 - 正文（從 #94a3b8 提升） */
--text-tertiary: #94a3b8;     /* 中灰 - 提示文字（從 #64748b 提升） */
--text-muted: #64748b;        /* 深灰 - 次要提示 */

/* 邊框 */
--border: #1e293b;            /* 邊框 */
--border-hover: #334155;      /* 懸停邊框 */
```

### 圓角系統（更現代，不那麼圓）
```
大容器：rounded-2xl (16px)  ← 從 64px 降低
中容器：rounded-xl (12px)   ← 從 48px 降低
小元素：rounded-lg (8px)    ← 從 32px 降低
按鈕：rounded-md (6px)      ← 從 12px 降低
```

### 陰影系統（增加深度）
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);
--shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3); /* 藍色光暈 */
```

### 字體系統（更清晰易讀）
```
/* 字體大小（手機和電腦都清晰） */
主標題：text-3xl (30px) md:text-4xl (36px)  ← 保持大標題
區塊標題：text-lg (18px) md:text-xl (20px)  ← 從 text-[14px] 提升
正文：text-base (16px)                       ← 從 text-[13px] 提升
標籤：text-sm (14px)                         ← 從 text-[11px] 提升
提示文字：text-sm (14px)                     ← 從 text-[11px] 提升
小文字：text-xs (12px)                       ← 從 text-[9px] 提升

/* 字體粗細（保持清晰） */
標題：font-bold (700)      ← 從 font-black (900) 降低
正文：font-semibold (600)  ← 從 font-bold (700) 降低
標籤：font-semibold (600)  ← 從 font-black (900) 降低
大小寫：保持 uppercase，但減少 tracking

/* 行高（提升可讀性） */
標題：leading-tight (1.25)
正文：leading-relaxed (1.625)
提示：leading-normal (1.5)
```

---

## 📐 新佈局結構

### 電腦版佈局
```tsx
<div className="flex flex-col h-screen">
  {/* 頂部導航列 */}
  <header className="h-16 border-b">
    <nav className="flex items-center gap-8">
      <Logo />
      <TabButtons /> {/* 水平標籤 */}
      <Spacer />
      <ViewToggle />
      <CopyButton />
    </nav>
  </header>
  
  {/* 主要內容區 */}
  <main className="flex-1 flex overflow-hidden">
    {/* 左側：內容區 (60%) */}
    <section className="flex-1 overflow-y-auto p-8">
      <SectionContent />
    </section>
    
    {/* 右側：預覽面板 (40%) */}
    <aside className="w-[40%] border-l overflow-y-auto">
      <ProtocolDeck />
    </aside>
  </main>
</div>
```

### 手機版佈局
```tsx
<div className="flex flex-col h-screen">
  {/* 頂部工具列 */}
  <header className="h-14 border-b">
    <MenuButton />
    <Logo />
    <PreviewButton />
  </header>
  
  {/* 主要內容區（全寬） */}
  <main className="flex-1 overflow-y-auto p-4">
    <SectionContent />
  </main>
  
  {/* 底部導航標籤 */}
  <nav className="h-16 border-t">
    <TabButtons /> {/* 圖標 + 文字 */}
  </nav>
  
  {/* 預覽面板（抽屜） */}
  <Drawer isOpen={previewOpen}>
    <ProtocolDeck />
  </Drawer>
</div>
```

---

## 🎛️ 組件視覺更新

### 1. 導航系統

#### 電腦版：頂部標籤
```tsx
// 從垂直大數字 → 水平標籤
<button className={`
  px-6 py-3 rounded-lg font-semibold
  ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}
`}>
  <span className="text-sm">📷</span>
  <span>攝影設定</span>
</button>
```

#### 手機版：底部圖標導航
```tsx
<button className="flex flex-col items-center gap-1">
  <span className="text-2xl">📷</span>
  <span className="text-xs">攝影</span>
</button>
```

### 2. 視覺化控制器（保持功能，改外觀）

#### Camera3DGizmo
```tsx
// 保持：雙軸控制邏輯
// 改變：
- 圓形 → 更扁平的圓形
- 陰影 → 更柔和的陰影
- 顏色 → 使用新色彩系統
- 大小 → 稍微縮小（從 400px → 320px）
```

#### DualAxisController
```tsx
// 保持：Azimuth/Elevation 計算
// 改變：
- 雙圓環 → 更細的線條
- 控制點 → 更小的圓點
- 顏色 → 藍色/橙色漸層
```

#### FramingVisualizer
```tsx
// 保持：取景框比例計算
// 改變：
- 人形圖 → 更簡潔的線條
- 邊框 → 虛線改為實線
- 背景 → 更深的背景色
```

### 3. 輸入控制

#### 按鈕網格
```tsx
// 從：大圓角 + 粗體
<button className="py-8 rounded-[2rem] font-black">

// 改為：中圓角 + 中粗體
<button className="py-4 rounded-lg font-semibold shadow-md hover:shadow-lg">
```

#### 滑桿控制
```tsx
// 從：簡單滑桿
<input type="range" className="accent-blue-500" />

// 改為：帶數值顯示的滑桿
<div className="flex items-center gap-4">
  <input type="range" />
  <span className="font-mono text-sm">{value}</span>
</div>
```

---

## 📦 實作計劃

### Phase 1: 設計系統基礎 (1-2 小時)
1. ✅ 創建新的 CSS 變數系統
2. ✅ 更新 `index.css` 全局樣式
3. ✅ 更新 `tailwind.config.js` 配置
4. ✅ 創建設計 token 文件

### Phase 2: 佈局重構 (2-3 小時)
1. ✅ 重構 `App.tsx` - 新佈局結構
2. ✅ 創建新的 `TopNavigation.tsx` 組件
3. ✅ 創建新的 `BottomNavigation.tsx` 組件（手機）
4. ✅ 更新 `MainContentArea.tsx` - 移除側邊欄邏輯
5. ✅ 更新 `ProtocolDeck.tsx` - 適應新佈局

### Phase 3: 組件視覺更新 (3-4 小時)
1. ✅ 更新所有 Section 組件的樣式
2. ✅ 更新視覺化控制器外觀（保持邏輯）
3. ✅ 更新按鈕、輸入框樣式
4. ✅ 更新卡片、容器樣式

### Phase 4: 響應式優化 (1-2 小時)
1. ✅ 測試電腦版佈局
2. ✅ 測試手機版佈局
3. ✅ 調整斷點和間距
4. ✅ 優化觸控體驗

### Phase 5: 測試與調整 (1 小時)
1. ✅ 功能測試（確保所有功能正常）
2. ✅ 視覺測試（確保設計一致）
3. ✅ 性能測試（確保無性能問題）

---

## 🔒 功能保護清單

### 必須保持不變的部分

#### 攝影設定系統
- ✅ `Camera3DGizmo.tsx` - 雙軸控制邏輯
- ✅ `cameraAngleDescriptions.ts` - 角度計算
- ✅ `visualTranslators.ts` - 焦距翻譯
- ✅ `framingMode` - 取景模式切換
- ✅ `roll` - 滾轉計算
- ✅ Slot System - 4-Slot 組裝

#### 燈光物理系統
- ✅ `DualAxisController.tsx` - 雙軸控制邏輯
- ✅ `lightingCalculations.ts` - 3D 位置計算
- ✅ `lightingFormatters.ts` - 燈光格式化
- ✅ `PortraitLightingVisualizer.tsx` - 燈光視覺化
- ✅ 3 點燈光系統（Key/Fill/Rim）
- ✅ 預設燈光方案

#### 其他核心功能
- ✅ `usePromptState` - 狀態管理
- ✅ `promptAssembly.ts` - 提示詞組裝
- ✅ `translateColorHex` - 顏色翻譯
- ✅ LocalStorage 持久化
- ✅ 預設系統

---

## 🎨 視覺參考

### 靈感來源
1. **Linear App** - 簡潔的頂部導航
2. **Figma** - 側邊面板設計
3. **Vercel Dashboard** - 卡片式佈局
4. **Framer** - 流暢的動畫
5. **Raycast** - 現代的深色主題

### 設計原則
- ✅ 扁平化，但有深度（陰影）
- ✅ 清晰的視覺層次
- ✅ 一致的間距系統
- ✅ 流暢的動畫過渡
- ✅ 觸控友好（手機版）

---

## 📝 下一步

請確認以下問題：

1. **色彩方案**：你喜歡 A（科技藍）、B（紫色）還是 C（綠色）？
2. **導航位置**：電腦版用頂部標籤可以嗎？
3. **手機版導航**：底部固定導航可以嗎？
4. **圓角大小**：從超大圓角改為中等圓角可以嗎？
5. **字體粗細**：從超粗體改為中粗體可以嗎？

確認後我們就開始實作！🚀
