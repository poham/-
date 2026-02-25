# Requirements Document: Camera Optics System

## Introduction

Camera Optics System 是 Nano Banana 的核心模組之一，負責處理所有與相機攝影設定、構圖設定、取景控制相關的配置。此系統提供專業級的鏡頭焦距選擇、景深控制、構圖網格、取景視覺化，以及豐富的相機角度管理功能。對應於 CameraSection 元件。

## Glossary

- **System**: Camera Optics System 相機光學系統
- **User**: 使用 Nano Banana 的攝影師、創意總監或 AI 藝術家
- **CameraConfig**: 包含所有相機參數的配置物件
- **OpticsConfig**: 包含光圈（景深）參數的配置物件
- **Shot_Type**: 拍攝類型（極致特寫、特寫、中景、遠景等）
- **Camera_Angle**: 相機角度（水平、鳥瞰、蟲視、高角度、低角度等）
- **Aspect_Ratio**: 畫面寬高比（1:1、4:3、16:9 等）
- **Focal_Length**: 鏡頭焦距（8mm 魚眼到 200mm 特寫）
- **Aperture**: 光圈值（f/1.2 到 f/22）
- **Composition_Rule**: 構圖規則（三分法、黃金比例、居中、引導線）
- **Alignment**: 焦點對齊位置（9 個區域 + 4 個交叉點）
- **Visual_Y_Offset**: 垂直校準偏移量（-50% 到 +50%）
- **Roll**: 相機滾轉角度（-45° 到 +45°）
- **Custom_Angle_Tags**: 使用者自定義的相機角度標籤
- **Framing_Visualizer**: 即時觀景窗模擬元件
- **Composition_Grid**: 萬用構圖工具元件
- **DOF_Visualizer**: 景深視覺化元件
- **Lens_FOV**: 鏡頭視野與物理變形視覺化元件

## Requirements

### Requirement 1: 取景尺度選擇

**User Story:** 作為使用者，我想要選擇拍攝的取景尺度，以便定義主體在畫面中的大小和範圍。

#### Acceptance Criteria

1. THE System SHALL 提供至少 8 種預定義的拍攝類型選項
2. THE System SHALL 包含以下類型：極致特寫 (ECU)、特寫 (CU)、中特寫 (MCU)、中景 (MS)、中遠景 (MLS)、遠景 (LS)、全身、微距
3. THE System SHALL 以下拉選單形式呈現所有選項
4. WHEN 使用者選擇某個類型 THEN THE System SHALL 更新 shotType 參數
5. THE System SHALL 在選單中顯示中文名稱和英文縮寫
6. THE System SHALL 即時更新 FramingVisualizer 以反映選擇的取景尺度

### Requirement 2: 相機角度與高度配置

**User Story:** 作為使用者，我想要精確控制相機的拍攝角度和高度，以便創造不同的視覺效果和情緒。

#### Acceptance Criteria

1. THE System SHALL 提供一個文字輸入欄位用於自由描述相機角度
2. THE System SHALL 在輸入欄位顯示佔位符範例（如："Looking up, Drone view..."）
3. THE System SHALL 提供至少 3 個預定義的角度標籤組（高度、位置、風格與傾斜）
4. THE System SHALL 為每個標籤組顯示至少 5 個預設標籤選項
5. WHEN 使用者點擊預設標籤 THEN THE System SHALL 將該標籤附加到角度描述文字的末尾（以逗號分隔）
6. WHEN 標籤已存在於描述中 THEN THE System SHALL 防止重複添加
7. THE System SHALL 以視覺化方式區分已選擇和未選擇的標籤（顏色、邊框）
8. THE System SHALL 提供「重置協定」按鈕以清空角度描述

### Requirement 3: 自定義相機角度標籤管理

**User Story:** 作為使用者，我想要創建和管理我自己的相機角度標籤，以便擴展預設選項並建立個人化的標籤庫。

#### Acceptance Criteria

1. THE System SHALL 提供一個輸入欄位用於新增自定義角度標籤
2. THE System SHALL 提供一個「新增」按鈕以確認添加標籤
3. WHEN 使用者輸入標籤並按下 Enter 或點擊新增按鈕 THEN THE System SHALL 將標籤加入到自定義標籤集合
4. WHEN 標籤已存在於自定義集合中 THEN THE System SHALL 防止重複添加
5. THE System SHALL 在獨立區域顯示所有自定義標籤（標題為「我的自定義角度」）
6. THE System SHALL 為每個自定義標籤提供刪除按鈕（hover 時顯示）
7. WHEN 使用者點擊自定義標籤 THEN THE System SHALL 將其附加到角度描述文字
8. THE System SHALL 將自定義角度標籤持久化到 LocalStorage
9. WHEN 使用者重新載入應用程式 THEN THE System SHALL 從 LocalStorage 恢復自定義標籤

### Requirement 4: 畫面寬高比選擇

**User Story:** 作為使用者，我想要選擇影像的寬高比，以便適配不同的輸出平台和創意需求。

#### Acceptance Criteria

1. THE System SHALL 提供 5 種預定義的寬高比選項
2. THE System SHALL 包含以下比例：1:1、4:3、3:4、16:9、9:16
3. THE System SHALL 以網格按鈕形式呈現所有選項（5 列）
4. WHEN 使用者點擊某個比例 THEN THE System SHALL 更新 aspectRatio 參數
5. WHEN 某個比例被選中 THEN THE System SHALL 以藍色高亮顯示該按鈕
6. THE System SHALL 即時更新所有視覺化元件以反映新的寬高比

### Requirement 5: 垂直校準控制

**User Story:** 作為使用者，我想要微調主體在畫面中的垂直位置，以便精確控制構圖。

#### Acceptance Criteria

1. THE System SHALL 提供一個滑桿用於調整垂直偏移量（範圍 -50% 到 +50%）
2. THE System SHALL 在滑桿旁顯示當前偏移量數值（格式：「XX%」）
3. THE System SHALL 提供一個「ZERO」按鈕以快速重置為 0
4. WHEN 使用者拖曳滑桿 THEN THE System SHALL 即時更新 visualYOffset 參數
5. WHEN 使用者點擊 ZERO 按鈕 THEN THE System SHALL 將偏移量重置為 0
6. THE System SHALL 即時更新 FramingVisualizer 以反映垂直位置變化
7. THE System SHALL 顯示標籤「垂直校準」

### Requirement 6: 相機滾轉角度控制

**User Story:** 作為使用者，我想要控制相機的滾轉角度，以便創造荷蘭式傾斜或其他創意效果。

#### Acceptance Criteria

1. THE System SHALL 提供一個滑桿用於調整滾轉角度（範圍 -45° 到 +45°）
2. THE System SHALL 在滑桿旁顯示當前角度數值（格式：「XX°」）
3. THE System SHALL 提供一個「ZERO」按鈕以快速重置為 0°
4. WHEN 使用者拖曳滑桿 THEN THE System SHALL 即時更新 roll 參數
5. WHEN 使用者點擊 ZERO 按鈕 THEN THE System SHALL 將角度重置為 0°
6. THE System SHALL 即時更新 FramingVisualizer 以反映旋轉效果
7. WHEN roll 非 0 THEN THE System SHALL 以橙色高亮顯示數值
8. THE System SHALL 顯示標籤「滾轉 (Roll)」

### Requirement 7: 鏡頭焦距選擇與視野控制

**User Story:** 作為使用者，我想要選擇不同的鏡頭焦距，以便控制視野範圍和透視變形效果。

#### Acceptance Criteria

1. THE System SHALL 提供至少 8 種預定義的鏡頭焦距選項
2. THE System SHALL 包含以下焦距：8mm 魚眼、14mm 超廣角、24mm 移軸、35mm 街拍、50mm 標準、85mm 人像、135mm 長焦、200mm 特寫
3. THE System SHALL 以滑桿形式呈現焦距選擇器
4. THE System SHALL 在滑桿下方顯示所有焦距標籤
5. WHEN 使用者拖曳滑桿 THEN THE System SHALL 更新 lens 參數
6. THE System SHALL 即時更新 LensFOV 視覺化元件以反映視野變化
7. WHEN 當前焦距被選中 THEN THE System SHALL 以藍色高亮顯示該焦距標籤

### Requirement 8: 光圈值選擇與景深控制

**User Story:** 作為使用者，我想要控制光圈值，以便調整景深效果和背景模糊程度。

#### Acceptance Criteria

1. THE System SHALL 提供至少 10 種預定義的光圈值選項
2. THE System SHALL 包含以下光圈：f/1.2、f/1.4、f/1.8、f/2.8、f/4、f/5.6、f/8、f/11、f/16、f/22
3. THE System SHALL 以滑桿形式呈現光圈選擇器
4. THE System SHALL 在滑桿上方顯示當前光圈值（大字體、等寬字型）
5. WHEN 使用者拖曳滑桿 THEN THE System SHALL 更新 opticsConfig.dof 參數
6. THE System SHALL 即時更新 DOFVisualizer 以反映景深變化
7. THE System SHALL 顯示標籤「物理景深光圈 (Aperture)」

### Requirement 9: 構圖網格與焦點對齊

**User Story:** 作為使用者，我想要使用構圖網格來精確定位主體，以便遵循專業的構圖規則。

#### Acceptance Criteria

1. THE System SHALL 提供一個互動式構圖網格（3x3 九宮格）
2. THE System SHALL 提供 9 個區域對齊選項（top_left_region 到 bottom_right_region）
3. THE System SHALL 提供 4 個交叉點對齊選項（四個三分法交叉點）
4. THE System SHALL 在網格上顯示三分法參考線（淡色）
5. WHEN 使用者點擊某個區域 THEN THE System SHALL 更新 composition.alignment 參數
6. WHEN 使用者點擊某個交叉點 THEN THE System SHALL 更新 composition.alignment 參數
7. WHEN 某個位置被選中 THEN THE System SHALL 以藍色高亮顯示該區域或交叉點
8. THE System SHALL 在網格上方顯示當前對齊位置名稱
9. THE System SHALL 根據當前 aspectRatio 動態調整網格尺寸
10. THE System SHALL 在網格四角顯示取景框標記

### Requirement 10: 即時觀景窗視覺化

**User Story:** 作為使用者，我想要看到即時的觀景窗模擬，以便理解不同參數對取景效果的影響。

#### Acceptance Criteria

1. THE System SHALL 顯示 FramingVisualizer 元件
2. THE System SHALL 在視覺化器中渲染一個人形輪廓（SVG）
3. THE System SHALL 根據當前 shotType 動態調整人形的縮放比例和位置
4. THE System SHALL 根據 visualYOffset 調整人形的垂直位置
5. THE System SHALL 根據 roll 旋轉整個取景畫面
6. THE System SHALL 根據 aspectRatio 動態調整取景框尺寸
7. THE System SHALL 在取景框內顯示三分法參考線（淡色）
8. THE System SHALL 在取景框中心顯示焦點指示器（脈動圓圈）
9. THE System SHALL 在視覺化器上方顯示當前放大倍率（MAG: X.Xx）
10. WHEN roll 非 0 THEN THE System SHALL 顯示滾轉角度標籤（ROLL: XX°）
11. THE System SHALL 在視覺化器下方顯示當前 shotType 名稱
12. THE System SHALL 在視覺化器左上角顯示錄製指示器（紅點 + REC）
13. WHEN 任何相機參數變更 THEN THE System SHALL 以平滑過渡動畫更新視覺化（700ms）

### Requirement 11: 景深視覺化

**User Story:** 作為使用者，我想要看到景深效果的視覺化預覽，以便理解不同光圈值對焦點範圍的影響。

#### Acceptance Criteria

1. THE System SHALL 顯示 DOFVisualizer 元件
2. THE System SHALL 在視覺化器中渲染一個側視場景（前景、焦點平面、背景）
3. THE System SHALL 根據當前 aperture 動態調整景深範圍寬度
4. THE System SHALL 以藍色高亮區域表示清晰焦點範圍
5. THE System SHALL 在焦點平面上渲染一個清晰的球體
6. THE System SHALL 在前景和背景渲染模糊的球體
7. THE System SHALL 根據光圈值動態調整前景和背景的模糊程度
8. WHEN aperture 值較小（如 f/1.2）THEN THE System SHALL 顯示窄景深（約 8% 寬度）
9. WHEN aperture 值較大（如 f/22）THEN THE System SHALL 顯示寬景深（約 85% 寬度）
10. THE System SHALL 在景深範圍內顯示「DOF RANGE」標籤
11. THE System SHALL 在焦點平面顯示「清晰平面 (SHARP PLANE)」標籤
12. THE System SHALL 在底部顯示距離刻度標籤（近景、最佳焦點、無限遠）

### Requirement 12: 鏡頭視野與物理變形視覺化

**User Story:** 作為使用者，我想要看到不同焦距鏡頭的視野範圍和透視變形效果，以便理解鏡頭選擇對影像的影響。

#### Acceptance Criteria

1. THE System SHALL 顯示 LensFOV 元件
2. THE System SHALL 在視覺化器中渲染一個視野錐形圖（FOV cone）
3. THE System SHALL 根據當前 focalLength 動態調整視野角度
4. THE System SHALL 根據焦距計算並顯示透視變形率（-40% 到 +100%）
5. WHEN 焦距 ≤ 8mm THEN THE System SHALL 顯示魚眼變形效果（桶狀變形）
6. WHEN 焦距 = 50mm THEN THE System SHALL 顯示 0% 變形（物理標準）
7. WHEN 焦距 ≥ 135mm THEN THE System SHALL 顯示空間壓縮效果（負變形）
8. THE System SHALL 以橙色表示正變形（桶狀），藍色表示負變形（壓縮）
9. THE System SHALL 在視覺化器上方顯示當前焦距和鏡頭類型
10. THE System SHALL 在視覺化器中顯示相機圖示（魚眼鏡頭顯示特殊圖示）
11. THE System SHALL 顯示變形率進度條（中心為 0%）
12. THE System SHALL 提供焦距滑桿用於選擇鏡頭
13. THE System SHALL 在滑桿下方顯示所有焦距標籤（8mm 到 200mm）
14. WHEN 當前焦距被選中 THEN THE System SHALL 以藍色高亮顯示該焦距標籤
15. THE System SHALL 顯示鏡頭特性說明文字（根據焦距範圍）

### Requirement 13: 響應式佈局適配

**User Story:** 作為使用者，我想要在不同裝置上都能舒適地使用相機光學系統，以便在桌面、平板和手機上都有良好的體驗。

#### Acceptance Criteria

1. THE System SHALL 在桌面裝置（≥1500px）上以雙欄佈局顯示（左側控制 + 右側視覺化）
2. THE System SHALL 在平板裝置（768px-1499px）上以單欄堆疊佈局顯示
3. THE System SHALL 在手機裝置（<768px）上以單欄堆疊佈局顯示
4. THE System SHALL 在桌面上以 5 列網格顯示寬高比按鈕
5. THE System SHALL 在平板和手機上調整網格列數以適應螢幕寬度
6. THE System SHALL 確保所有互動元素在觸控裝置上可用（最小觸控目標 44x44px）
7. THE System SHALL 在小螢幕上調整字體大小和間距以保持可讀性

### Requirement 14: 狀態同步與回調

**User Story:** 作為開發者，我想要確保 CameraSection 的狀態變更能夠正確傳遞到父元件，以便整合到全域狀態管理中。

#### Acceptance Criteria

1. THE System SHALL 接收 config prop（類型：CameraConfig）作為當前相機配置
2. THE System SHALL 接收 opticsConfig prop（類型：OpticsConfig）作為當前光學配置
3. THE System SHALL 接收 onChange callback 用於通知相機配置變更
4. THE System SHALL 接收 onOpticsChange callback 用於通知光學配置變更
5. WHEN 任何相機參數變更 THEN THE System SHALL 呼叫 onChange 並傳遞完整的新 CameraConfig
6. WHEN 光圈值變更 THEN THE System SHALL 呼叫 onOpticsChange 並傳遞完整的新 OpticsConfig
7. THE System SHALL 確保回調呼叫時保持其他欄位不變（使用 spread operator）
8. THE System SHALL 接收 customTags prop（類型：string[]）作為自定義角度標籤
9. THE System SHALL 接收 setCustomTags callback 用於更新自定義標籤
10. WHEN 使用者新增或刪除自定義標籤 THEN THE System SHALL 呼叫 setCustomTags 並傳遞新的標籤陣列

### Requirement 15: 動畫與過渡效果

**User Story:** 作為使用者，我想要流暢的動畫和過渡效果，以便獲得專業且愉悅的使用體驗。

#### Acceptance Criteria

1. THE System SHALL 在元件載入時提供淡入滑入動畫（fade-in slide-in-from-bottom, 700ms）
2. THE System SHALL 在視覺化器更新時提供平滑的縮放和位置過渡（700ms）
3. THE System SHALL 在滾轉角度變更時提供平滑的旋轉過渡（700ms）
4. THE System SHALL 在寬高比變更時提供平滑的尺寸過渡（500ms）
5. THE System SHALL 在 hover 按鈕時提供顏色和邊框過渡
6. THE System SHALL 在焦距變更時提供平滑的視野角度過渡（700ms）
7. THE System SHALL 在光圈變更時提供平滑的景深範圍過渡（700ms）
8. THE System SHALL 確保所有動畫使用 ease-in-out 緩動函數

### Requirement 16: 無障礙性支援

**User Story:** 作為使用輔助技術的使用者，我想要能夠透過鍵盤和螢幕閱讀器使用相機光學系統，以便無障礙地操作所有功能。

#### Acceptance Criteria

1. THE System SHALL 為所有互動元素提供適當的 focus 樣式
2. THE System SHALL 為下拉選單提供鍵盤導航支援（方向鍵）
3. THE System SHALL 為滑桿提供鍵盤調整支援（方向鍵）
4. THE System SHALL 為按鈕提供鍵盤啟動支援（Enter/Space）
5. THE System SHALL 確保顏色對比度符合 WCAG AA 標準（至少 4.5:1）
6. THE System SHALL 為視覺化元件提供替代文字說明
7. THE System SHALL 確保 Tab 鍵順序符合視覺順序

### Requirement 17: 效能優化

**User Story:** 作為使用者，我想要系統能夠流暢運行，即使在頻繁調整參數時也不會出現卡頓。

#### Acceptance Criteria

1. THE System SHALL 使用 React.memo 優化視覺化元件
2. THE System SHALL 使用 useCallback 優化事件處理函數
3. THE System SHALL 避免在拖曳滑桿時觸發不必要的重新渲染
4. THE System SHALL 確保滑桿調整時的更新頻率不超過 60fps
5. THE System SHALL 延遲載入大型視覺化資源（如果適用）
6. THE System SHALL 使用 CSS transforms 而非 position 屬性進行動畫

### Requirement 18: 錯誤處理與邊界情況

**User Story:** 作為使用者，我想要系統能夠優雅地處理錯誤和邊界情況，以便在異常情況下也能正常使用。

#### Acceptance Criteria

1. WHEN 使用者輸入空白標籤 THEN THE System SHALL 防止添加並忽略該操作
2. WHEN 使用者嘗試添加重複標籤 THEN THE System SHALL 防止添加並保持現有標籤
3. WHEN visualYOffset 超出 -50 到 50 範圍 THEN THE System SHALL 自動限制在有效範圍內
4. WHEN roll 超出 -45 到 45 範圍 THEN THE System SHALL 自動限制在有效範圍內
5. WHEN config prop 為 undefined THEN THE System SHALL 使用預設值並記錄警告
6. WHEN onChange callback 未提供 THEN THE System SHALL 記錄錯誤但不崩潰
7. THE System SHALL 在 LocalStorage 操作失敗時提供降級方案（僅記憶體儲存）
8. WHEN 無效的 shotType 或 lens 值傳入 THEN THE System SHALL 使用最接近的有效值

