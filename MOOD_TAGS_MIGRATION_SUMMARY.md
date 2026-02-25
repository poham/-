# 情緒標籤遷移總結

## 📋 重構目標

將「情緒與大氣描述」（MoodTagsSection）從 **OpticsSection（燈光物理）** 移動到 **StyleSection（模擬風格）**，使功能定位更加合理。

## 🎯 重構原因

### 問題分析

1. **MOOD_TAGS 的內容性質**
   - 商業與簡潔：高調商業、極簡主義、奢華、乾淨俐落、產品英雄照、鮮豔
   - 電影與氛圍：黑色電影、陰鬱黑暗、戲劇性對比、史詩感、憂鬱、賽博龐克
   - 藝術與夢幻：空靈、超現實、柔和夢境、復古、粉彩流行、朦朧氛圍

2. **這些標籤描述的是**
   - ✅ 整體視覺風格和情緒氛圍
   - ✅ 藝術性、情緒性的描述
   - ❌ 不是物理燈光的技術參數

3. **OpticsSection 應該專注於**
   - 三點式燈光的物理位置（方位角、仰角）
   - 光源強度和顏色
   - 專業攝影棚佈光技術（林布蘭光、蝴蝶光等）
   - 技術性、物理性的燈光控制

4. **StyleSection 更適合**
   - 視覺風格選擇（電影感、超寫實、商業攝影等）
   - 情緒與大氣描述（黑色電影、賽博龐克、空靈等）
   - 底片模擬和後製效果標籤
   - 藝術性、情緒性的風格描述

## 📝 Prompt 組裝順序

根據 `assembleFinalPrompt()` 的邏輯：

```
1. VISUAL STYLE (視覺風格) ← 總綱領，放最前面
2. Camera Setup + DOF (相機設定)
3. Subject Details (主體描述)
4. Environment (環境背景)
5. Lighting (燈光)
6. Mood (情緒) ← 在這裡！
7. Style/Processing (後製風格)
8. --ar (長寬比)
```

### 三層結構的意義

1. **視覺風格（VISUAL_STYLES）**：宏觀方向，單選，強制性引導
   - 例如：選「電影感」→ AI 會往電影攝影的方向思考
   - 可以不選，讓 AI 根據其他參數自由發揮

2. **情緒標籤（MOOD_TAGS）**：中觀氛圍，多選，補充細節
   - 例如：加上「黑色電影、陰鬱黑暗」→ 進一步細化電影感的類型

3. **後製標籤（STYLE_TAG_GROUPS）**：微觀技術，多選，渲染品質
   - 例如：加上「光線追蹤、電影顆粒」→ 技術層面的質感

## 🔧 實施的修改

### 1. OpticsSection.tsx
- ❌ 移除 `MoodTagsSection` 組件
- ❌ 移除 `customTags` 和 `setCustomTags` props
- ❌ 移除 `handleMoodChange` 和 `handleCustomTagsChange` 函數
- ✅ 簡化為純粹的燈光物理控制

### 2. StyleSection.tsx
- ✅ 新增 `MoodTagsSection` 組件
- ✅ 新增 `moodCustomTags` 和 `setMoodCustomTags` props
- ✅ 在「視覺風格」和「藝術後製協定」之間插入「情緒與大氣描述」

### 3. MainContentArea.tsx
- ✅ 更新 OpticsSection 的 props（移除 customTags 相關）
- ✅ 更新 StyleSection 的 props（新增 moodCustomTags 相關）

### 4. types.ts
- ✅ 在 `StyleConfig` 中新增 `mood: string` 欄位
- ✅ 從 `OpticsConfig` 的註解中說明 mood 已移到 StyleConfig

### 5. constants.tsx
- ✅ 更新 `DEFAULT_STATE`：
  - `optics.mood` 改為空字串（保持向後兼容）
  - `style.mood` 設為預設值 `'柔和電影感 (soft_cinematic)'`

### 6. utils/promptAssembly.ts
- ✅ 更新 MOOD 區段：從 `migratedOptics.mood` 改為 `style.mood`
- ✅ 更新 fallback：從 `state.optics.mood` 改為 `state.style.mood`

### 7. utils/visualTranslators.ts
- ✅ 更新所有 `state.optics.mood` 為 `state.style.mood`（共 4 處）

## ✅ 驗證結果

所有修改已通過 TypeScript 診斷檢查，沒有語法錯誤或類型錯誤。

## 📊 新的 StyleSection 結構

```
StyleSection 結構：

┌─────────────────────────────────────┐
│ 1. 視覺風格（單選，8 選 1）          │
│    電影感、超寫實、商業攝影...       │
│    → Prompt 最前面，總綱領           │
├─────────────────────────────────────┤
│ 2. 情緒與大氣描述（多選 + 自由輸入） │
│    商業與簡潔、電影與氛圍、藝術夢幻 │
│    → 補充氛圍細節                    │
├─────────────────────────────────────┤
│ 3. 藝術後製協定（多選技術標籤）      │
│    渲染品質、光學效果、後製處理...   │
│    → 技術性渲染品質                  │
└─────────────────────────────────────┘
```

## 🎉 重構完成

「情緒與大氣描述」現在位於更合理的位置，使得：
- OpticsSection 專注於物理燈光控制
- StyleSection 整合所有風格、情緒、後製相關的設定
- Prompt 組裝邏輯更加清晰和合理
