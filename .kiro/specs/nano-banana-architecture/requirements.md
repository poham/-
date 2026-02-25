# Requirements Document

## Introduction

Nano Banana 是一個專業級的電影攝影提示詞產生器與影像生成工具，專為 AI Studio 設計。它透過結構化的工作流程，將複雜的攝影概念分解為可控制的模組化參數，讓使用者能夠創建高度精確、專業級的影像生成提示詞。

## Glossary

- **System**: Nano Banana 應用程式
- **User**: 使用 Nano Banana 的攝影師、產品設計師、創意總監或 AI 藝術家
- **Prompt_State**: 包含所有攝影參數的完整配置狀態
- **Preset**: 預先配置好的攝影設定組合
- **Navigation_Sidebar**: 左側導航欄，顯示工作流程步驟
- **Main_Content_Area**: 中間主要配置區，顯示參數編輯介面
- **Protocol_Deck**: 右側即時協定面板，顯示當前配置的提示詞預覽
- **Custom_Tags**: 使用者自定義的標籤集合
- **Gemini_API**: Google Gemini 2.5 Flash Image 模型的 API 服務

## Requirements

### Requirement 1: 模組化工作流程導航

**User Story:** 作為使用者，我想要透過清晰的步驟式導航來配置攝影參數，以便系統化地建立完整的影像提示詞。

#### Acceptance Criteria

1. WHEN 使用者開啟應用程式 THEN THE System SHALL 顯示包含 9 個主要步驟的側邊導航欄
2. WHEN 使用者點擊任一導航項目 THEN THE System SHALL 切換到對應的配置區段並高亮顯示當前步驟
3. THE System SHALL 為每個步驟提供視覺化的步驟編號（00-07 及 SET）
4. THE System SHALL 在側邊欄顯示每個步驟的中文名稱和英文識別碼
5. WHEN 使用者選擇某個步驟 THEN THE System SHALL 在右側顯示該步驟的即時協定預覽

### Requirement 2: 預設集管理系統

**User Story:** 作為使用者，我想要瀏覽和載入專業策劃的預設集，以便快速開始創作或學習專業攝影設定。

#### Acceptance Criteria

1. WHEN 使用者進入預設集藝廊 THEN THE System SHALL 顯示所有可用的預設集系列
2. THE System SHALL 將預設集組織為主題系列（特殊視角、極簡奢華、高端雜誌風、爆炸炸雞、飲品藝術）
3. WHEN 使用者點擊某個系列 THEN THE System SHALL 展開該系列並顯示所有包含的預設項目
4. WHEN 使用者選擇某個預設項目 THEN THE System SHALL 載入該預設的完整配置並跳轉到導出頁面
5. THE System SHALL 為每個預設顯示縮圖預覽、名稱、描述和長寬比資訊

### Requirement 3: 使用者自定義預設集

**User Story:** 作為使用者，我想要儲存和管理我自己的預設集，以便重複使用我喜歡的配置。

#### Acceptance Criteria

1. WHEN 使用者點擊「儲存目前設定」按鈕 THEN THE System SHALL 提示使用者輸入預設集名稱
2. WHEN 使用者提供名稱並確認 THEN THE System SHALL 將當前完整配置儲存為新的使用者預設集
3. THE System SHALL 將使用者預設集持久化到 LocalStorage
4. WHEN 使用者重新載入應用程式 THEN THE System SHALL 從 LocalStorage 恢復使用者預設集
5. WHEN 使用者點擊刪除按鈕 THEN THE System SHALL 提示確認並從列表中移除該預設集

### Requirement 4: 美學核心選擇

**User Story:** 作為使用者，我想要選擇影像的核心美學風格，以便定義整體的視覺方向。

#### Acceptance Criteria

1. THE System SHALL 提供 8 種預定義的美學類別選項
2. THE System SHALL 包含以下類別：電影感、商業產品攝影、商業人像、生活風格、空靈氛圍、超寫實、動漫風格、特殊創意視角
3. WHEN 使用者選擇某個類別 THEN THE System SHALL 更新 Prompt_State 的 category 欄位
4. THE System SHALL 以視覺化卡片形式呈現所有類別選項
5. WHEN 某個類別被選中 THEN THE System SHALL 以藍色高亮顯示該卡片

### Requirement 5: 主體細節配置

**User Story:** 作為使用者，我想要詳細描述影像的主體，以便精確控制主要拍攝對象的特徵。

#### Acceptance Criteria

1. THE System SHALL 提供主體類型、描述、關鍵特徵、視角方向的輸入欄位
2. THE System SHALL 提供預定義的材質標籤組（絲綢、皮革、碳纖維等）
3. THE System SHALL 提供預定義的視角方向選項（正面、3/4 側面、側面、背面、俯視）
4. WHEN 使用者輸入自定義標籤 THEN THE System SHALL 將其加入到自定義標籤集合
5. THE System SHALL 將自定義主體標籤持久化到 LocalStorage

### Requirement 6: 場景空間設定

**User Story:** 作為使用者，我想要配置拍攝場景和背景環境，以便控制主體所處的空間氛圍。

#### Acceptance Criteria

1. THE System SHALL 提供場景描述和環境類型的輸入欄位
2. THE System SHALL 提供背景顏色選擇器
3. THE System SHALL 提供預定義的環境標籤組（攝影棚、自然、城市）
4. WHEN 使用者選擇背景顏色 THEN THE System SHALL 更新 Prompt_State 的 background.bgColor 欄位
5. THE System SHALL 將自定義背景標籤持久化到 LocalStorage

### Requirement 7: 攝影設定控制

**User Story:** 作為使用者，我想要精確控制相機參數和構圖設定，以便定義影像的技術規格。

#### Acceptance Criteria

1. THE System SHALL 提供鏡頭類型選擇（8mm 魚眼到 200mm 特寫）
2. THE System SHALL 提供拍攝類型選擇（極致特寫、特寫、中景、遠景、全身、微距）
3. THE System SHALL 提供相機角度選擇（水平、鳥瞰、蟲視、高角度、低角度等）
4. THE System SHALL 提供長寬比選擇（1:1、4:3、3:4、16:9、9:16）
5. THE System SHALL 提供相機傾斜角度滑桿（-45° 到 +45°）
6. THE System SHALL 提供光圈值選擇（景深控制）
7. THE System SHALL 提供構圖規則選擇（三分法、黃金比例、居中、引導線）
8. THE System SHALL 提供焦點對齊位置選擇（9 個區域 + 4 個交叉點）

### Requirement 8: 進階燈光物理系統

**User Story:** 作為使用者，我想要使用專業的攝影棚燈光設定，以便創建電影級的光影效果。

#### Acceptance Criteria

1. THE System SHALL 提供進階燈光系統的開關切換
2. WHEN 進階燈光啟用 THEN THE System SHALL 顯示完整的三點照明控制
3. THE System SHALL 提供 10 種預定義的攝影棚燈光設定（林布蘭光、蝴蝶光、側光、環形光等）
4. THE System SHALL 為主光提供顏色、強度、旋轉角度的控制
5. THE System SHALL 為補光提供顏色和強度的控制
6. THE System SHALL 為輪廓光提供顏色和強度的控制
7. THE System SHALL 提供全域氛圍選擇（高調商業、黑色電影、空靈等）
8. WHEN 進階燈光停用 THEN THE System SHALL 在導出時省略所有燈光參數

### Requirement 9: 風格與後製處理

**User Story:** 作為使用者，我想要選擇後製風格和底片模擬效果，以便為影像添加藝術化處理。

#### Acceptance Criteria

1. THE System SHALL 提供多選的後製處理標籤（超精細、光線追蹤、電影顆粒等）
2. THE System SHALL 提供底片風格選擇（Kodak Portra 400、Fujifilm Superia、Ilford HP5 Plus 等）
3. THE System SHALL 提供顆粒強度選擇（Low、Medium、High）
4. THE System SHALL 提供暗角效果的開關切換
5. WHEN 使用者選擇多個後製標籤 THEN THE System SHALL 將它們加入到 style.postProcessing 陣列

### Requirement 10: 即時協定預覽面板

**User Story:** 作為使用者，我想要即時看到當前配置生成的提示詞，以便了解最終輸出的內容。

#### Acceptance Criteria

1. THE System SHALL 在右側面板持續顯示即時組裝的提示詞
2. THE System SHALL 將提示詞分為多個標記區段（THEME、SUBJECT、SCENE、OPTICS、COMPOSITION、MOOD、LIGHTING、PROCESSING）
3. WHEN 使用者修改任何參數 THEN THE System SHALL 立即更新對應的提示詞區段
4. THE System SHALL 在面板底部顯示核心元數據（長寬比、鏡頭、傾斜角度）
5. THE System SHALL 提供「複製字串」按鈕以複製完整提示詞到剪貼簿

### Requirement 11: 影像生成整合

**User Story:** 作為使用者，我想要使用配置好的提示詞直接生成影像，以便立即看到視覺化結果。

#### Acceptance Criteria

1. WHEN 使用者點擊「執行最終渲染」按鈕 THEN THE System SHALL 呼叫 Gemini_API 生成影像
2. THE System SHALL 在生成過程中顯示載入動畫和狀態訊息
3. WHEN 影像生成完成 THEN THE System SHALL 顯示生成的影像
4. THE System SHALL 提供下載按鈕以儲存生成的影像
5. THE System SHALL 將使用者選擇的長寬比傳遞給 Gemini_API

### Requirement 12: 配置匯出與匯入

**User Story:** 作為使用者，我想要匯出和匯入完整的配置 JSON，以便分享設定或在不同裝置間同步。

#### Acceptance Criteria

1. THE System SHALL 在導出區段顯示當前配置的 JSON 表示
2. THE System SHALL 在匯出時移除視覺輔助參數（visualYOffset）
3. WHEN 相機傾斜角度為 0 THEN THE System SHALL 保持數字格式
4. WHEN 相機傾斜角度非 0 THEN THE System SHALL 轉換為完整術語描述
5. WHEN 進階燈光停用 THEN THE System SHALL 在 JSON 中省略所有燈光參數
6. THE System SHALL 提供「複製 JSON」按鈕以複製配置到剪貼簿
7. THE System SHALL 提供文字區域以貼上外部 JSON 配置
8. WHEN 使用者貼上有效的 JSON 並點擊同步 THEN THE System SHALL 載入該配置並更新所有參數
9. WHEN 使用者貼上無效的 JSON THEN THE System SHALL 顯示錯誤訊息

### Requirement 13: 系統設定管理

**User Story:** 作為使用者，我想要匯出和匯入我的自定義標籤和預設集，以便備份或遷移我的個人資料。

#### Acceptance Criteria

1. THE System SHALL 在設定區段提供匯出功能
2. WHEN 使用者點擊匯出 THEN THE System SHALL 生成包含所有自定義標籤和使用者預設集的 JSON
3. THE System SHALL 提供匯入功能以載入先前匯出的資料
4. WHEN 使用者匯入資料 THEN THE System SHALL 驗證 JSON 格式並更新 LocalStorage
5. WHEN 匯入成功 THEN THE System SHALL 自動跳轉到預設集藝廊頁面

### Requirement 14: 自定義標籤管理

**User Story:** 作為使用者，我想要在各個區段添加和管理自定義標籤，以便擴展預定義選項。

#### Acceptance Criteria

1. THE System SHALL 在主體、背景、相機角度、氛圍、風格區段提供自定義標籤輸入
2. WHEN 使用者輸入新標籤並按下 Enter THEN THE System SHALL 將標籤加入到對應的自定義標籤集合
3. THE System SHALL 為每個自定義標籤提供刪除按鈕
4. THE System SHALL 將所有自定義標籤持久化到 LocalStorage（按類別分組）
5. WHEN 使用者重新載入應用程式 THEN THE System SHALL 從 LocalStorage 恢復所有自定義標籤

### Requirement 15: 視覺化輔助工具

**User Story:** 作為使用者，我想要看到視覺化的構圖和光學效果預覽，以便更好地理解參數的影響。

#### Acceptance Criteria

1. THE System SHALL 在相機區段提供構圖網格視覺化（三分法、黃金比例）
2. THE System SHALL 提供景深視覺化以展示光圈效果
3. THE System SHALL 提供取景視覺化以展示拍攝類型
4. THE System SHALL 提供鏡頭視野視覺化以展示焦距效果
5. THE System SHALL 在燈光區段提供人像燈光設定視覺化

### Requirement 16: 響應式設計與側欄收合

**User Story:** 作為使用者，我想要在不同裝置上使用應用程式，並能夠收合側邊欄以獲得更大的工作空間，以便在桌面、平板和行動裝置上都能舒適地操作。

#### Acceptance Criteria

1. THE System SHALL 在桌面裝置上顯示完整的三欄佈局（導航側邊欄、主要配置區、即時協定面板）
2. THE System SHALL 在行動裝置上調整側邊欄為精簡模式（僅顯示步驟編號）
3. THE System SHALL 在行動裝置上將主要內容和協定面板改為垂直堆疊
4. THE System SHALL 確保所有互動元素在觸控裝置上可用
5. THE System SHALL 在小螢幕上隱藏部分裝飾性文字以節省空間
6. WHEN 使用者在平板或手機上瀏覽 THEN THE System SHALL 提供收合左側導航欄的功能
7. WHEN 使用者在平板或手機上瀏覽 THEN THE System SHALL 提供收合右側協定面板的功能
8. WHEN 左側導航欄被收合 THEN THE System SHALL 顯示漢堡選單按鈕以重新開啟導航
9. WHEN 右側協定面板被收合 THEN THE System SHALL 顯示預覽按鈕以重新開啟面板
10. WHEN 兩側欄位都被收合 THEN THE System SHALL 將主要配置區擴展至全寬以最大化可用空間
11. THE System SHALL 記住使用者的側欄收合偏好設定（使用 LocalStorage）
12. WHEN 使用者重新載入應用程式 THEN THE System SHALL 恢復先前的側欄顯示狀態

### Requirement 17: 側欄收合互動體驗

**User Story:** 作為使用者，我想要流暢的側欄收合動畫和直覺的控制按鈕，以便輕鬆切換工作模式。

#### Acceptance Criteria

1. WHEN 使用者點擊收合按鈕 THEN THE System SHALL 以平滑動畫收合對應的側欄
2. THE System SHALL 在收合動畫期間保持主要配置區的內容可見
3. WHEN Navigation_Sidebar 收合 THEN THE System SHALL 在主要配置區左上角顯示固定的漢堡選單按鈕
4. WHEN Protocol_Deck 收合 THEN THE System SHALL 在主要配置區右上角顯示固定的預覽按鈕
5. WHEN 使用者點擊漢堡選單按鈕 THEN THE System SHALL 以覆蓋層（overlay）方式顯示 Navigation_Sidebar
6. WHEN 使用者點擊預覽按鈕 THEN THE System SHALL 以滑入動畫顯示 Protocol_Deck
7. WHEN 覆蓋層導航欄開啟時，使用者點擊背景遮罩 THEN THE System SHALL 關閉導航欄
8. THE System SHALL 在平板裝置上預設收合 Protocol_Deck 以優先顯示配置區
9. THE System SHALL 在手機裝置上預設收合兩側欄位以最大化主要內容區
10. WHEN 使用者從手機切換到平板或桌面 THEN THE System SHALL 根據螢幕尺寸自動調整側欄顯示狀態

### Requirement 18: 資料持久化

**User Story:** 作為使用者，我想要我的自定義資料被自動儲存，以便下次使用時不會遺失。

#### Acceptance Criteria

1. THE System SHALL 使用 LocalStorage 作為持久化儲存機制
2. THE System SHALL 在自定義標籤變更時自動儲存到 LocalStorage
3. THE System SHALL 在使用者預設集變更時自動儲存到 LocalStorage
4. WHEN 應用程式初始化 THEN THE System SHALL 從 LocalStorage 載入自定義標籤
5. WHEN 應用程式初始化 THEN THE System SHALL 從 LocalStorage 載入使用者預設集

### Requirement 19: 程式碼模組化與可維護性

**User Story:** 作為開發者，我想要將 App.tsx 的程式碼模組化，以便提升可維護性、降低檔案大小，並改善 AI 輔助開發的效率。

#### Acceptance Criteria

1. THE System SHALL 將狀態管理邏輯抽離到獨立的 Custom Hooks
2. THE System SHALL 將佈局元件（導航欄、協定面板）抽離到獨立的元件檔案
3. THE System SHALL 將工具函數（響應式判斷、提示詞組裝、LocalStorage 操作）抽離到 utils 目錄
4. THE System SHALL 確保 App.tsx 主檔案不超過 200 行程式碼
5. WHEN 程式碼重構完成 THEN THE System SHALL 保持所有現有功能正常運作（行為不變）
6. THE System SHALL 為新建立的 hooks 和 utils 提供 TypeScript 型別定義
7. THE System SHALL 確保所有模組都有清晰的單一職責（Single Responsibility Principle）
8. WHEN 開發者需要修改特定功能 THEN THE System SHALL 讓相關程式碼集中在單一模組中
9. THE System SHALL 使用一致的命名慣例（hooks 使用 `use` 前綴，utils 使用動詞開頭）
10. THE System SHALL 確保模組之間的依賴關係清晰且最小化
