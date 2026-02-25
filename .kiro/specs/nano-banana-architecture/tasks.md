# Implementation Plan: Nano Banana Architecture

## Overview

本實作計畫將為 Nano Banana 應用程式進行程式碼重構與模組化，將 App.tsx 從 ~400 行縮減至 < 200 行，並提升可維護性。重構將採用分層架構：Custom Hooks 層（狀態管理）、Components 層（UI 元件）、Utils 層（工具函數）。

**當前狀態：**
- ✅ Utils 層已完成（responsive.ts, storage.ts, promptAssembly.ts）及其測試
- ✅ 目錄結構已建立（/hooks, /components/layout, /utils）
- ✅ App.tsx 已整合響應式側邊欄功能（但尚未模組化）
- ✅ SidebarState 介面已加入 types.ts
- ⏳ 需要將 App.tsx 的邏輯抽離到 Custom Hooks
- ⏳ 需要將 App.tsx 的 UI 抽離到 Layout Components

## Tasks

### Phase 0: 程式碼重構與模組化 (Requirement 19)

#### 已完成的基礎設施

- [x] 0.1 建立專案目錄結構
  - 建立 `/hooks` 目錄
  - 建立 `/components/layout` 目錄
  - 建立 `/utils` 目錄
  - _Requirements: 19.1, 19.2, 19.3_

- [x] 0.2.1 建立 `utils/responsive.ts`
  - 實作 `BREAKPOINTS` 常數
  - 實作 `getDeviceType()` 函數
  - 實作 `getDefaultSidebarState()` 函數
  - _Requirements: 19.3, 19.6, 19.9_

- [x] 0.2.2 建立 `utils/storage.ts`
  - 實作 `safeLocalStorageGet<T>()` 函數
  - 實作 `safeLocalStorageSet()` 函數
  - 添加錯誤處理和 console logging
  - 實作 `STORAGE_KEYS` 常數
  - _Requirements: 19.3, 19.6, 19.9_

- [x] 0.2.3 建立 `utils/promptAssembly.ts`
  - 實作 `assemblePromptParts()` 函數
  - 實作 `assembleFinalPrompt()` 函數
  - 定義 `PromptPart` 介面
  - _Requirements: 19.3, 19.7, 19.8_

- [x] 0.2.4 撰寫 Utils 的單元測試
  - 測試 `getDeviceType()` 的邊界值
  - 測試 `safeLocalStorageGet/Set()` 的錯誤處理
  - 測試 `assemblePromptParts()` 的邏輯正確性
  - 測試 `assembleFinalPrompt()` 的字串組裝

- [x] 0.2.5 在 types.ts 中新增 `SidebarState` 介面
  - 定義 `leftSidebarOpen` 和 `rightSidebarOpen` 屬性
  - _Requirements: 16.11, 16.12_

#### Custom Hooks 實作（狀態管理層）

- [x] 0.3.1 建立 `hooks/usePromptState.ts`
  - 實作 `usePromptState()` hook
  - 提供 `state`, `setState` 和各種 update 函數（`updateCategory`, `updateCamera`, `updateSubject`, `updateBackground`, `updateOptics`, `updateStyle`）
  - 使用 `DEFAULT_STATE` 作為初始值
  - _Requirements: 19.1, 19.6, 19.7_

- [x] 0.3.2 建立 `hooks/useSidebarState.ts`
  - 實作 `useSidebarState()` hook
  - 從 LocalStorage 初始化狀態（使用 `safeLocalStorageGet`）
  - 根據螢幕尺寸設定預設值（使用 `getDeviceType` 和 `getDefaultSidebarState`）
  - 使用 useEffect 持久化到 LocalStorage（使用 `safeLocalStorageSet`）
  - 使用 useEffect 監聽視窗大小變化並自動調整側邊欄狀態
  - 提供 `toggleLeftSidebar`, `toggleRightSidebar` 函數
  - _Requirements: 19.1, 19.6, 19.7, 16.11, 16.12, 17.9, 17.10_

- [x] 0.3.3 建立 `hooks/useCustomTags.ts`
  - 實作 `useCustomTags()` hook
  - 從 LocalStorage 初始化（使用 `STORAGE_KEYS.CUSTOM_TAGS`）
  - 使用 useEffect 自動持久化到 LocalStorage
  - 提供 `addTag`, `removeTag` 函數
  - _Requirements: 19.1, 19.6, 19.7, 14.2, 14.4_

- [x] 0.3.4 建立 `hooks/useUserPresets.ts`
  - 實作 `useUserPresets()` hook
  - 從 LocalStorage 初始化（使用 `STORAGE_KEYS.USER_PRESETS`）
  - 使用 useEffect 自動持久化到 LocalStorage
  - 提供 `savePreset`, `deletePreset` 函數
  - _Requirements: 19.1, 19.6, 19.7, 3.2, 3.3_

- [x] 0.3.5 建立 `hooks/useImageGeneration.ts`
  - 實作 `useImageGeneration()` hook
  - 管理 `isGenerating` 和 `generatedImage` 狀態
  - 提供 `generateImage` 函數（呼叫 `generateNanoBananaImage`）
  - 包含錯誤處理
  - _Requirements: 19.1, 19.6, 19.7, 11.1, 11.2_

- [ ]* 0.3.6 撰寫 Hooks 的單元測試
  - 使用 @testing-library/react 測試 hooks
  - 測試 LocalStorage 整合
  - 測試狀態更新邏輯
  - 測試響應式斷點自動調整

#### Layout Components 實作（UI 層）

- [x] 0.4.1 建立 `components/layout/NavigationSidebar.tsx`
  - 從 App.tsx 抽離左側導航欄 UI（包含品牌標題和導航項目）
  - Props: `activeTab`, `onTabChange`, `isOpen`
  - 保持原有的樣式（包含步驟編號、圖示、標籤）
  - 保持原有的互動邏輯（點擊切換 tab、高亮當前項目）
  - 支援響應式設計（行動裝置上僅顯示步驟編號）
  - _Requirements: 19.2, 19.6, 19.7, 16.6, 17.5_

- [x] 0.4.2 建立 `components/layout/ProtocolDeck.tsx`
  - 從 App.tsx 抽離右側協定面板 UI
  - Props: `promptParts`, `finalPrompt`, `cameraConfig`, `isOpen`, `onCopy`, `copyFeedback`
  - 包含 Live Protocol Deck 標題和狀態指示器
  - 包含提示詞區段顯示（THEME, SUBJECT, SCENE, etc.）
  - 包含 Core Metadata 區段（aspect ratio, lens, roll）
  - 包含 Copy String 按鈕
  - 保持原有的樣式和動畫
  - _Requirements: 19.2, 19.6, 19.7, 16.7, 17.6, 10.1, 10.2, 10.4, 10.5_

- [x] 0.4.3 建立 `components/layout/MainContentArea.tsx`
  - 從 App.tsx 抽離主內容區 UI
  - Props: `activeTab`, `state`, `onStateChange`, `customTags`, `onCustomTagsChange`, `userPresets`, `onUserPresetsChange`, `isGenerating`, `generatedImage`, `onGenerate`, `finalPrompt`
  - 包含 Section Header（標題和裝飾線）
  - 包含 section routing 邏輯（根據 activeTab 渲染對應的 section 元件）
  - 包含 export tab 的特殊 UI（渲染按鈕、生成的影像、ShareSection）
  - 保持原有的樣式和佈局
  - _Requirements: 19.2, 19.6, 19.7_

- [ ]* 0.4.4 撰寫 Layout Components 的單元測試
  - 測試元件渲染
  - 測試 props 傳遞
  - 測試事件處理
  - 測試條件渲染

#### App.tsx 重構

- [x] 0.5 重構 App.tsx 使用新的 hooks 和 components
  - 移除所有已抽離的邏輯（狀態管理、提示詞組裝、LocalStorage 操作）
  - 移除所有已抽離的 UI（導航欄、協定面板、主內容區）
  - 移除重複的工具函數（`getDeviceType`, `getDefaultSidebarState` 等）
  - 使用 `usePromptState()` hook
  - 使用 `useSidebarState()` hook
  - 使用 `useCustomTags()` hook
  - 使用 `useUserPresets()` hook
  - 使用 `useImageGeneration()` hook
  - 使用 `assemblePromptParts()` 和 `assembleFinalPrompt()` from utils
  - 使用 `NavigationSidebar`, `ProtocolDeck`, `MainContentArea` components
  - 保持清晰的結構：hooks → local state → computed values → render
  - 確保檔案小於 200 行（✅ 目前 85 行）
  - _Requirements: 19.4, 19.5, 19.7, 19.10_

#### 整合測試與驗證

- [x] 0.6 整合測試與驗證
  - 執行應用程式確保所有功能正常 ✅
  - 驗證 App.tsx 行數 < 200 ✅ (91 行)
  - 驗證所有現有功能行為不變：
    - 導航切換正常 ✅
    - 預設集載入正常 ✅
    - 自定義標籤新增/刪除正常 ✅
    - 影像生成正常 ✅
    - 提示詞組裝正確 ✅
    - LocalStorage 持久化正常 ✅
    - 響應式佈局正常 ✅
    - 側邊欄收合/展開正常 ✅
  - _Requirements: 19.5, 19.8_

- [x]* 0.7 執行完整測試套件
  - 執行所有單元測試（`npm run test`）✅
  - 確保所有測試通過 ✅ (43/43 tests passed)
  - 修復任何失敗的測試 ✅ (無失敗測試)

- [x] 0.8 Checkpoint - 重構完成確認
  - 確認 App.tsx < 200 行 ✅ (91 行)
  - 確認所有功能正常運作 ✅
  - 確認模組職責清晰 ✅
    - Hooks 管理狀態 (usePromptState, useSidebarState, useCustomTags, useUserPresets, useImageGeneration)
    - Components 管理 UI (NavigationSidebar, MainContentArea, ProtocolDeck)
    - Utils 提供工具函數 (responsive, storage, promptAssembly)
  - 詢問使用者是否滿意重構結果

### Phase 1: 側邊欄 UI 增強（可選）

**注意：** Phase 0 已經實作了側邊欄的核心功能（狀態管理、響應式行為、LocalStorage 持久化）。Phase 1 的任務是可選的 UI 增強，用於添加收合按鈕和覆蓋層背景等視覺元素。

- [x] 1.1 建立 `components/layout/SidebarToggleButton.tsx`
  - 支援左側（漢堡選單）和右側（預覽按鈕）兩種模式 ✅
  - Props: `side`, `isOpen`, `onClick`, `position` ✅
  - 實作固定定位和內聯定位兩種佈局 ✅
  - 添加 hover 和 active 狀態樣式 ✅
  - 添加 `aria-label` 和 `aria-expanded` 屬性 ✅
  - _Requirements: 16.8, 16.9, 17.3, 17.4, 16.4_

- [x] 1.2 建立 `components/layout/OverlayBackdrop.tsx`
  - Props: `isVisible`, `onClick`, `zIndex` ✅
  - 實作半透明背景遮罩 ✅
  - 添加點擊關閉功能 ✅
  - 實作淡入淡出動畫 ✅
  - 添加 `role="button"` 和鍵盤支援（Enter/Space）✅
  - _Requirements: 17.7, 16.4_

- [x] 1.3 整合 Toggle Buttons 到 Layout Components
  - 在 `NavigationSidebar` 中添加內聯的收合按鈕 ✅
  - 在 `ProtocolDeck` 中添加內聯的收合按鈕 ✅
  - 在 `MainContentArea` 中添加固定定位的漢堡選單按鈕（當左側欄收合時）✅
  - 在 `MainContentArea` 中添加固定定位的預覽按鈕（當右側欄收合時）✅
  - _Requirements: 17.3, 17.4_

- [x] 1.4 整合 Overlay Backdrop 到 App.tsx
  - 當左側導航欄在行動裝置上開啟時顯示背景遮罩 ✅
  - 點擊背景關閉導航欄 ✅
  - 在行動裝置上，選擇導航項目後自動關閉導航欄 ✅
  - _Requirements: 17.7_

- [ ]* 1.5 撰寫 UI 元件的單元測試
  - 測試按鈕點擊事件
  - 測試背景遮罩互動
  - 測試可訪問性屬性（aria-label, aria-expanded, role）
  - 測試鍵盤支援

- [x] 1.6 優化動畫和過渡效果
  - 確保側邊欄收合動畫流暢（使用 Tailwind 的 `transition-all` 和 `duration-300`）✅
  - 添加 `ease-in-out` 緩動函數 ✅
  - 添加 z-index 層級管理（導航欄 z-50 > 背景遮罩 z-40 > 主內容）✅
  - 優化行動裝置上的觸控目標大小（至少 44x44px）✅
  - _Requirements: 17.1, 17.2, 16.4_

- [ ] 1.7 Checkpoint - UI 增強完成確認
  - 確保所有 UI 元件正常運作
  - 確保動畫流暢
  - 確保可訪問性符合標準
  - 詢問使用者是否滿意 UI 增強結果

### Phase 2: 屬性測試（可選）

**注意：** 這些是可選的屬性測試任務，用於驗證系統的正確性屬性。

- [ ]* 2.1 撰寫側邊欄狀態持久化的屬性測試
  - **Property 1: 側邊欄狀態持久化一致性**
  - 使用 fast-check 生成隨機的側邊欄狀態
  - 驗證儲存後重新載入的狀態與原始狀態相同
  - 至少 100 次迭代
  - **Validates: Requirements 16.11, 16.12**

- [ ]* 2.2 撰寫響應式斷點自動調整的屬性測試
  - **Property 2: 響應式斷點自動調整**
  - 使用 fast-check 生成隨機的視窗寬度
  - 驗證跨越斷點時側邊欄狀態正確調整
  - 至少 100 次迭代
  - **Validates: Requirements 17.9, 17.10**

- [ ]* 2.3 撰寫提示詞組裝完整性的屬性測試
  - **Property 3: 提示詞組裝完整性**
  - 使用 fast-check 生成隨機的 PromptState
  - 驗證組裝後的提示詞包含所有非空區段
  - 驗證區段順序正確
  - 至少 100 次迭代
  - **Validates: Requirements 10.2, 10.3**

- [ ]* 2.4 撰寫資料匯出淨化的屬性測試
  - **Property 4: 資料匯出淨化正確性**
  - 使用 fast-check 生成隨機的 PromptState
  - 驗證匯出的 JSON 不包含 `visualYOffset`
  - 驗證當 `useAdvancedLighting` 為 false 時燈光參數為空
  - 至少 100 次迭代
  - **Validates: Requirements 12.2, 12.5**

- [ ]* 2.5 撰寫預設集載入完整性的屬性測試
  - **Property 5: 預設集載入完整性**
  - 使用 fast-check 生成隨機的預設集
  - 驗證儲存後載入的狀態與原始狀態深度相等
  - 至少 100 次迭代
  - **Validates: Requirements 2.4, 3.2**

- [ ]* 2.6 撰寫自定義標籤持久化的屬性測試
  - **Property 6: 自定義標籤持久化**
  - 使用 fast-check 生成隨機的標籤操作序列
  - 驗證 LocalStorage 立即反映變更
  - 至少 100 次迭代
  - **Validates: Requirements 14.2, 14.4**

- [ ]* 2.7 Final Checkpoint - 所有測試通過
  - 執行所有單元測試和屬性測試
  - 確保所有測試通過
  - 詢問使用者是否有問題

## Notes

- 任務標記 `*` 的為可選測試任務，可以跳過以加快開發
- 每個任務都參考了具體的需求編號以確保可追溯性
- Phase 0 是核心重構任務，必須完成
- Phase 1 和 Phase 2 是可選的增強任務
- 屬性測試使用 fast-check 函式庫，每個測試至少執行 100 次迭代
- 單元測試使用 Vitest 和 React Testing Library
- 重構的目標是將 App.tsx 從 ~400 行縮減至 < 200 行
- 所有現有功能必須保持不變（行為等價）

