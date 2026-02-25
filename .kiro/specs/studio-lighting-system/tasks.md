# Implementation Plan: Studio Lighting System

## Overview

本實作計劃將 Studio Lighting System 的設計轉換為可執行的開發任務。重點在於改善 PortraitLightingVisualizer 的視覺效果、優化光源旋轉控制器的互動體驗，以及確保所有功能都有完整的測試覆蓋。

## Tasks

- [x] 1. 改善 PortraitLightingVisualizer 視覺效果
  - 使用 SVG Filters 和 CSS Blend Modes 創造更真實的光影效果
  - 實作多層光源混合（主光/補光/輪廓光/環境光）
  - 針對不同 studio setup 優化陰影遮罩
  - _Requirements: 11.6, 11.7, 11.8, 11.9, 11.11_

- [x] 1.1 為 PortraitLightingVisualizer 編寫視覺回歸測試

  - 使用 Playwright 截圖對比不同 studio setup 的視覺效果
  - **Property 11: 視覺化即時更新**
  - **Validates: Requirements 11.11**

- [x] 2. 優化光源旋轉控制器
  - 加入角度刻度標記和方向標籤
  - 改善拖曳互動的視覺回饋
  - 加入光源軌跡線提示
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_

- [x] 2.1 編寫光源旋轉邏輯的單元測試

  - 測試角度計算和標準化
  - 測試拖曳事件處理
  - _Requirements: 5.6_

- [ ]* 2.2 編寫角度標準化的屬性測試
  - **Property 7: 光源角度標準化**
  - **Validates: Requirements 5.6, 17.3**

- [ ] 3. 實作情緒標籤管理功能
  - 確保標籤附加邏輯正確（去重、逗號分隔）
  - 實作自定義標籤的新增和刪除
  - 整合 LocalStorage 持久化
  - _Requirements: 1.5, 1.6, 2.2, 2.3, 2.6, 2.7, 2.8, 2.9_

- [ ]* 3.1 編寫情緒標籤附加的屬性測試
  - **Property 1: 情緒標籤附加與去重**
  - **Validates: Requirements 1.5, 1.6**

- [ ]* 3.2 編寫自定義標籤管理的屬性測試
  - **Property 2: 自定義標籤管理與去重**
  - **Validates: Requirements 2.2, 2.3, 17.1, 17.2**

- [ ]* 3.3 編寫自定義標籤持久化的屬性測試
  - **Property 3: 自定義標籤持久化 Round-Trip**
  - **Validates: Requirements 2.8, 2.9**

- [ ] 4. 完善進階燈光系統開關邏輯
  - 確保停用時所有控制區域不可互動
  - 實作視覺化的停用狀態（透明度、灰階）
  - 確保導出時正確省略燈光參數
  - _Requirements: 3.4, 3.5, 3.6, 3.7_

- [ ]* 4.1 編寫進階燈光停用的屬性測試
  - **Property 4: 進階燈光停用時的互動禁用**
  - **Validates: Requirements 3.4**

- [ ]* 4.2 編寫進階燈光導出省略的屬性測試
  - **Property 5: 進階燈光停用時的導出省略**
  - **Validates: Requirements 3.7**

- [ ] 5. 實作攝影棚預設選擇功能
  - 確保點擊預設時同步更新 studioSetup 和 lightRotation
  - 實作預設卡片的視覺高亮
  - 確保進階燈光停用時預設不可選
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [ ]* 5.1 編寫攝影棚預設選擇的屬性測試
  - **Property 6: 攝影棚預設選擇同步更新**
  - **Validates: Requirements 4.5**

- [ ] 6. 實作光源層級控制系統
  - 實作四個光源層級的標籤頁切換
  - 為每個層級實作對應的控制面板（顏色 + 強度）
  - 確保切換時有淡入動畫
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.1-7.7, 8.1-8.8, 9.1-9.8, 10.1-10.5_

- [ ]* 6.1 編寫光源參數即時更新的屬性測試
  - **Property 9: 光源參數即時更新**
  - **Validates: Requirements 7.5, 7.6, 13.3**

- [ ]* 6.2 編寫光源強度範圍限制的屬性測試
  - **Property 10: 光源強度範圍限制**
  - **Validates: Requirements 17.4**

- [ ] 7. Checkpoint - 確保所有測試通過
  - 執行所有單元測試和屬性測試
  - 檢查視覺回歸測試結果
  - 如有問題請向使用者報告

- [ ] 8. 實作響應式佈局適配
  - 確保桌面、平板、手機上的佈局正確
  - 調整攝影棚預設網格的列數
  - 確保觸控裝置上的互動元素大小適當
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

- [ ]* 8.1 編寫響應式佈局的整合測試
  - 測試不同螢幕尺寸下的佈局
  - 測試觸控互動

- [ ] 9. 實作無障礙性支援
  - 為所有互動元素加入 ARIA 屬性
  - 實作鍵盤導航支援
  - 確保顏色對比度符合 WCAG AA 標準
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

- [ ]* 9.1 編寫無障礙性測試
  - 測試鍵盤導航
  - 測試 ARIA 屬性
  - 使用 axe-core 檢查無障礙性問題

- [ ] 10. 效能優化
  - 為 PortraitLightingVisualizer 加入 React.memo
  - 為事件處理函數加入 useCallback
  - 確保動畫使用 CSS transforms
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

- [ ]* 10.1 編寫效能測試
  - 測試重新渲染次數
  - 測試動畫幀率

- [ ] 11. 最終整合測試
  - 測試完整的使用者流程（情緒標籤選擇、預設選擇、光源調整）
  - 測試 LocalStorage 持久化
  - 測試錯誤處理和邊界情況
  - _Requirements: All_

- [ ] 12. Final checkpoint - 確保所有測試通過
  - 執行完整的測試套件
  - 檢查程式碼覆蓋率
  - 如有問題請向使用者報告

## Notes

- 任務標記 `*` 的為可選測試任務，可以跳過以加快 MVP 開發
- 每個任務都參考了具體的需求編號以確保可追溯性
- 屬性測試使用 fast-check 庫，每個測試至少 100 次迭代
- Checkpoint 任務確保增量驗證，及早發現問題
