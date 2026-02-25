# Requirements Document: Studio Lighting System

## Introduction

Studio Lighting System 是 Nano Banana 的核心模組之一，負責處理所有與燈光物理、情緒氛圍、攝影棚設定相關的參數配置。此系統提供專業級的三點照明控制、互動式光源旋轉、即時視覺化預覽，以及豐富的情緒標籤管理功能。對應於 OpticsSection 元件。

## Glossary

- **System**: Studio Lighting System 攝影棚燈光系統
- **User**: 使用 Nano Banana 的攝影師、創意總監或 AI 藝術家
- **OpticsConfig**: 包含所有光學參數的配置物件
- **Three_Point_Lighting**: 三點照明系統（主光 Key、補光 Fill、輪廓光 Rim）
- **Mood_Tags**: 預定義的情緒氛圍標籤集合
- **Studio_Setup**: 預定義的專業攝影棚燈光配置（林布蘭光、蝴蝶光等）
- **Light_Rotation**: 主光源的旋轉角度（0-360°）
- **Active_Layer**: 當前正在編輯的光源層（key/fill/rim/ambient）
- **Custom_Mood_Tags**: 使用者自定義的情緒標籤
- **Portrait_Visualizer**: 人像燈光即時預覽元件
- **Advanced_Lighting_Mode**: 進階燈光系統的啟用狀態

## Requirements

### Requirement 1: 情緒與氛圍描述系統

**User Story:** 作為使用者，我想要透過文字和標籤來定義影像的整體情緒氛圍，以便精確控制影像的感覺和風格。

#### Acceptance Criteria

1. THE System SHALL 提供一個多行文字輸入區域用於自由描述情緒氛圍
2. THE System SHALL 在文字區域顯示佔位符範例（如："Ethereal Dreamy, Moody Noir, Vibrant Commercial..."）
3. THE System SHALL 提供至少 3 個預定義的情緒標籤組（商業與簡潔、電影與氛圍、藝術與夢幻）
4. THE System SHALL 為每個標籤組顯示至少 6 個預設標籤選項
5. WHEN 使用者點擊預設標籤 THEN THE System SHALL 將該標籤附加到情緒描述文字的末尾（以逗號分隔）
6. WHEN 標籤已存在於描述中 THEN THE System SHALL 防止重複添加
7. THE System SHALL 以視覺化方式區分已選擇和未選擇的標籤（顏色、邊框）

### Requirement 2: 自定義情緒標籤管理

**User Story:** 作為使用者，我想要創建和管理我自己的情緒標籤，以便擴展預設選項並建立個人化的標籤庫。

#### Acceptance Criteria

1. THE System SHALL 提供一個輸入欄位用於新增自定義情緒標籤
2. THE System SHALL 提供一個「新增」按鈕以確認添加標籤
3. WHEN 使用者輸入標籤並按下 Enter 或點擊新增按鈕 THEN THE System SHALL 將標籤加入到自定義標籤集合
4. WHEN 標籤已存在於自定義集合中 THEN THE System SHALL 防止重複添加
5. THE System SHALL 在獨立區域顯示所有自定義標籤（標題為「我的專屬情緒」）
6. THE System SHALL 為每個自定義標籤提供刪除按鈕（hover 時顯示）
7. WHEN 使用者點擊自定義標籤 THEN THE System SHALL 將其附加到情緒描述文字
8. THE System SHALL 將自定義情緒標籤持久化到 LocalStorage
9. WHEN 使用者重新載入應用程式 THEN THE System SHALL 從 LocalStorage 恢復自定義標籤

### Requirement 3: 進階燈光系統開關

**User Story:** 作為使用者，我想要能夠啟用或停用進階燈光系統，以便在簡單模式和專業模式之間切換。

#### Acceptance Criteria

1. THE System SHALL 提供一個切換開關（toggle switch）用於啟用/停用進階燈光
2. THE System SHALL 在開關旁顯示標籤「啟動專業佈光系統」和英文副標題「Studio Master Control」
3. THE System SHALL 提供視覺指示器顯示開關狀態（顏色、位置、發光效果）
4. WHEN 進階燈光停用 THEN THE System SHALL 將所有燈光控制區域設為不可互動（降低透明度、灰階、pointer-events-none）
5. WHEN 進階燈光啟用 THEN THE System SHALL 恢復所有燈光控制區域的完整互動性
6. THE System SHALL 在開關狀態變更時提供平滑的過渡動畫（1 秒）
7. WHEN 進階燈光停用 THEN THE System SHALL 在提示詞導出時省略所有燈光參數

### Requirement 4: 攝影棚預設選擇

**User Story:** 作為使用者，我想要從專業策劃的攝影棚燈光預設中選擇，以便快速應用經典的燈光設定。

#### Acceptance Criteria

1. THE System SHALL 提供至少 10 種預定義的攝影棚燈光設定
2. THE System SHALL 包含以下預設：林布蘭光、蝴蝶光、側光/分割光、環形光、輪廓光/背光、貝殼光、寬光、窄光、平光、高調光
3. THE System SHALL 以網格佈局顯示所有預設（桌面 5 列、平板 2 列）
4. THE System SHALL 為每個預設顯示中文名稱、英文名稱、簡短描述
5. WHEN 使用者點擊某個預設 THEN THE System SHALL 更新 studioSetup 和 lightRotation 參數
6. WHEN 某個預設被選中 THEN THE System SHALL 以藍色高亮顯示該預設卡片
7. WHEN 進階燈光停用 THEN THE System SHALL 防止預設選擇互動

### Requirement 5: 互動式光源旋轉控制

**User Story:** 作為使用者，我想要透過拖曳操作來旋轉主光源，以便直覺地調整光線方向。

#### Acceptance Criteria

1. THE System SHALL 提供一個圓形的互動式旋轉控制器（直徑至少 176px）
2. THE System SHALL 在控制器中心顯示「DRAG LIGHT」提示文字
3. THE System SHALL 在控制器上顯示一個代表光源的黃色圓點
4. WHEN 使用者在控制器上按下滑鼠 THEN THE System SHALL 開始追蹤滑鼠移動
5. WHEN 滑鼠移動時 THEN THE System SHALL 計算相對於控制器中心的角度
6. THE System SHALL 將計算出的角度標準化為 0-360° 範圍
7. THE System SHALL 即時更新 lightRotation 參數並旋轉光源圓點
8. WHEN 使用者釋放滑鼠 THEN THE System SHALL 停止追蹤移動
9. THE System SHALL 在控制器下方顯示當前旋轉角度（格式：「光源旋轉角度: XXX°」）
10. WHEN 使用者透過拖曳改變角度 THEN THE System SHALL 將 studioSetup 設為 'manual'
11. WHEN 進階燈光停用 THEN THE System SHALL 防止旋轉互動

### Requirement 6: 光源層級切換系統

**User Story:** 作為使用者，我想要在不同的光源層級之間切換，以便分別編輯主光、補光、輪廓光和環境光。

#### Acceptance Criteria

1. THE System SHALL 提供 4 個光源層級選項：主光（Key）、補光（Fill）、輪廓光（Rim）、環境光（Ambient）
2. THE System SHALL 以標籤頁（tab）形式呈現層級選擇器
3. THE System SHALL 為每個標籤顯示中文和英文名稱
4. WHEN 使用者點擊某個標籤 THEN THE System SHALL 切換到對應的光源編輯面板
5. THE System SHALL 以視覺化方式高亮顯示當前選中的標籤（背景色、陰影）
6. THE System SHALL 在切換層級時提供淡入動畫（fade-in, 500ms）
7. THE System SHALL 確保每次只有一個層級處於活動狀態

### Requirement 7: 主光（Key Light）控制

**User Story:** 作為使用者，我想要精確控制主光的顏色和強度，以便定義影像的主要光源特性。

#### Acceptance Criteria

1. THE System SHALL 提供一個顏色選擇器用於設定主光顏色
2. THE System SHALL 在顏色選擇器旁顯示當前顏色的十六進位值（大字體、等寬字型）
3. THE System SHALL 提供一個滑桿用於調整主光強度（範圍 0-100%）
4. THE System SHALL 在滑桿上方顯示當前強度數值（格式：「XX%」）
5. WHEN 使用者改變顏色 THEN THE System SHALL 即時更新 lightColor 參數
6. WHEN 使用者拖曳滑桿 THEN THE System SHALL 即時更新 lightIntensity 參數
7. THE System SHALL 顯示標籤「主光強度 (Key Intensity)」和「Key Light Tint」

### Requirement 8: 補光（Fill Light）控制

**User Story:** 作為使用者，我想要控制補光的顏色和強度，以便軟化陰影並減少對比度。

#### Acceptance Criteria

1. THE System SHALL 提供一個顏色選擇器用於設定補光顏色
2. THE System SHALL 在顏色選擇器旁顯示當前顏色的十六進位值
3. THE System SHALL 提供一個滑桿用於調整補光強度（範圍 0-100%）
4. THE System SHALL 在滑桿上方顯示當前強度數值
5. WHEN 使用者改變顏色 THEN THE System SHALL 即時更新 fillLightColor 參數
6. WHEN 使用者拖曳滑桿 THEN THE System SHALL 即時更新 fillLightIntensity 參數
7. THE System SHALL 顯示說明文字「用於軟化陰影，減少主光產生的對比度」
8. THE System SHALL 顯示標籤「補光強度 (Fill Intensity)」和「Fill Light Tint」

### Requirement 9: 輪廓光（Rim Light）控制

**User Story:** 作為使用者，我想要控制輪廓光的顏色和強度，以便在主體邊緣產生高光並使其從背景分離。

#### Acceptance Criteria

1. THE System SHALL 提供一個顏色選擇器用於設定輪廓光顏色
2. THE System SHALL 在顏色選擇器旁顯示當前顏色的十六進位值
3. THE System SHALL 提供一個滑桿用於調整輪廓光強度（範圍 0-100%）
4. THE System SHALL 在滑桿上方顯示當前強度數值
5. WHEN 使用者改變顏色 THEN THE System SHALL 即時更新 rimLightColor 參數
6. WHEN 使用者拖曳滑桿 THEN THE System SHALL 即時更新 rimLightIntensity 參數
7. THE System SHALL 顯示說明文字「在主體邊緣產生高光，使其從背景分離」
8. THE System SHALL 顯示標籤「輪廓光強度 (Rim Intensity)」和「Rim Light Tint」

### Requirement 10: 環境光（Ambient Light）控制

**User Story:** 作為使用者，我想要設定環境反射光的色調，以便影響陰影處與全域氛圍的微光顏色。

#### Acceptance Criteria

1. THE System SHALL 提供一個大型顏色選擇器用於設定環境光顏色（高度至少 160px）
2. THE System SHALL 在選擇器上方顯示標籤「環境反射光色調 (Ambient Tone)」
3. THE System SHALL 在選擇器下方顯示說明文字「影響陰影處與全域氛圍的微光顏色」
4. WHEN 使用者改變顏色 THEN THE System SHALL 即時更新 ambientColor 參數
5. THE System SHALL 在 hover 時提供輕微的縮放效果（scale 1.02）

### Requirement 11: 人像燈光即時視覺化

**User Story:** 作為使用者，我想要看到燈光設定的即時視覺化預覽，以便理解不同參數對人像光影的影響。

#### Acceptance Criteria

1. THE System SHALL 顯示 PortraitLightingVisualizer 元件
2. THE System SHALL 在視覺化器中渲染一個人臉輪廓（SVG）
3. THE System SHALL 根據當前 studioSetup 應用對應的陰影遮罩
4. THE System SHALL 根據 lightRotation 動態調整光源方向
5. THE System SHALL 根據 lightColor 和 lightIntensity 渲染主光效果
6. THE System SHALL 根據 fillLightColor 和 fillLightIntensity 渲染補光效果
7. THE System SHALL 根據 rimLightColor 和 rimLightIntensity 渲染輪廓光效果
8. THE System SHALL 根據 ambientColor 渲染環境光底色
9. THE System SHALL 在視覺化器上方顯示當前 studioSetup 名稱
10. THE System SHALL 在視覺化器下方顯示技術說明文字（補光和輪廓光的當前強度）
11. WHEN 任何攝影設定變更 THEN THE System SHALL 以平滑過渡動畫更新視覺化（700ms）

### Requirement 12: 響應式佈局適配

**User Story:** 作為使用者，我想要在不同裝置上都能舒適地使用攝影設定系統，以便在桌面、平板和手機上都有良好的體驗。

#### Acceptance Criteria

1. THE System SHALL 在桌面裝置（≥1500px）上以雙欄佈局顯示（視覺化器 + 控制面板）
2. THE System SHALL 在平板裝置（768px-1499px）上以單欄堆疊佈局顯示
3. THE System SHALL 在手機裝置（<768px）上以單欄堆疊佈局顯示
4. THE System SHALL 在桌面上以 5 列網格顯示攝影棚預設
5. THE System SHALL 在平板和手機上以 2 列網格顯示攝影棚預設
6. THE System SHALL 確保所有互動元素在觸控裝置上可用（最小觸控目標 44x44px）
7. THE System SHALL 在小螢幕上調整字體大小和間距以保持可讀性

### Requirement 13: 狀態同步與回調

**User Story:** 作為開發者，我想要確保 OpticsSection 的狀態變更能夠正確傳遞到父元件，以便整合到全域狀態管理中。

#### Acceptance Criteria

1. THE System SHALL 接收 config prop（類型：OpticsConfig）作為當前配置
2. THE System SHALL 接收 onChange callback 用於通知配置變更
3. WHEN 任何攝影設定變更 THEN THE System SHALL 呼叫 onChange 並傳遞完整的新 OpticsConfig
4. THE System SHALL 確保 onChange 呼叫時保持其他欄位不變（使用 spread operator）
5. THE System SHALL 接收 customTags prop（類型：string[]）作為自定義情緒標籤
6. THE System SHALL 接收 setCustomTags callback 用於更新自定義標籤
7. WHEN 使用者新增或刪除自定義標籤 THEN THE System SHALL 呼叫 setCustomTags 並傳遞新的標籤陣列

### Requirement 14: 動畫與過渡效果

**User Story:** 作為使用者，我想要流暢的動畫和過渡效果，以便獲得專業且愉悅的使用體驗。

#### Acceptance Criteria

1. THE System SHALL 在元件載入時提供淡入滑入動畫（fade-in slide-in-from-bottom, 700ms）
2. THE System SHALL 在切換光源層級時提供淡入動畫（500ms）
3. THE System SHALL 在旋轉光源時提供平滑的旋轉過渡（300ms）
4. THE System SHALL 在啟用/停用進階燈光時提供透明度和縮放過渡（1000ms）
5. THE System SHALL 在 hover 標籤按鈕時提供顏色和邊框過渡
6. THE System SHALL 在視覺化器更新時提供平滑的顏色和位置過渡（700ms）
7. THE System SHALL 確保所有動畫使用 ease-in-out 緩動函數

### Requirement 15: 無障礙性支援

**User Story:** 作為使用輔助技術的使用者，我想要能夠透過鍵盤和螢幕閱讀器使用攝影設定系統，以便無障礙地操作所有功能。

#### Acceptance Criteria

1. THE System SHALL 為所有互動元素提供適當的 focus 樣式
2. THE System SHALL 為顏色選擇器提供鍵盤導航支援
3. THE System SHALL 為滑桿提供鍵盤調整支援（方向鍵）
4. THE System SHALL 為標籤按鈕提供鍵盤啟動支援（Enter/Space）
5. THE System SHALL 確保顏色對比度符合 WCAG AA 標準（至少 4.5:1）
6. THE System SHALL 為視覺化元件提供替代文字說明
7. THE System SHALL 確保 Tab 鍵順序符合視覺順序

### Requirement 16: 效能優化

**User Story:** 作為使用者，我想要系統能夠流暢運行，即使在頻繁調整參數時也不會出現卡頓。

#### Acceptance Criteria

1. THE System SHALL 使用 React.memo 優化 PortraitLightingVisualizer 元件
2. THE System SHALL 使用 useCallback 優化事件處理函數
3. THE System SHALL 避免在拖曳旋轉時觸發不必要的重新渲染
4. THE System SHALL 確保滑桿調整時的更新頻率不超過 60fps
5. THE System SHALL 延遲載入大型視覺化資源（如果適用）
6. THE System SHALL 在進階燈光停用時跳過視覺化器的渲染更新

### Requirement 17: 錯誤處理與邊界情況

**User Story:** 作為使用者，我想要系統能夠優雅地處理錯誤和邊界情況，以便在異常情況下也能正常使用。

#### Acceptance Criteria

1. WHEN 使用者輸入空白標籤 THEN THE System SHALL 防止添加並忽略該操作
2. WHEN 使用者嘗試添加重複標籤 THEN THE System SHALL 防止添加並保持現有標籤
3. WHEN lightRotation 超出 0-360 範圍 THEN THE System SHALL 自動標準化為有效範圍
4. WHEN lightIntensity 超出 0-100 範圍 THEN THE System SHALL 限制在有效範圍內
5. WHEN config prop 為 undefined THEN THE System SHALL 使用預設值並記錄警告
6. WHEN onChange callback 未提供 THEN THE System SHALL 記錄錯誤但不崩潰
7. THE System SHALL 在 LocalStorage 操作失敗時提供降級方案（僅記憶體儲存）

