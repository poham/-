# 大遠景優先模式實作總結

## 實作日期
2025-01-XX

## 核心問題：哥吉拉效應 (The Godzilla Effect)

當使用者選擇「大遠景」但沒有修正主體描述時，AI 會陷入兩難：
- **指令 A**：畫面要很廣闊（看到天際線）
- **指令 B**：要清楚看到主體（如桌球拍）

AI 的錯誤解決方案：把桌球拍畫得像摩天大樓一樣大，矗立在廣闊的地平線上。

## 解決方案：環境優先模式 (Environment Override Mode)

類似微距模式的「霸道參數」邏輯，大遠景模式會篡位詞序，並提供兩種尺度選擇：

### 1. 寫實模式 (Realistic Scale)
- 主體微小化
- 強調環境遼闊
- 適合：極簡、孤獨感、空間感

### 2. 巨物模式 (Surreal/Monumental Scale)
- 主體巨大化
- 超現實震撼
- 適合：戲劇性、概念藝術

## 實作內容

### 1. 類型定義 (types.ts)
```typescript
export interface CameraConfig {
  // ... 其他欄位
  scaleMode?: 'realistic' | 'surreal';  // 新增：尺度模式
}
```

### 2. 翻譯邏輯 (utils/visualTranslators.ts)

#### 新增函數：
- `isWideMode()`: 檢測是否為大遠景模式
- `translateWideAngle()`: 視角轉譯（空間透視線）
- `translateWideSubject()`: 主體修正（微小化/巨大化）

#### 詞序邏輯：
```
[1. EXTREME WIDE SHOT 篡位 + 尺度定義] → 
[2. 視角轉譯（空間透視線）] → 
[3. 主體降級（微小化/巨大化）] → 
[4. 環境強調] → 
[5. 視覺風格（最後）]
```

#### 範例輸出（寫實模式）：
```
EXTREME WIDE ESTABLISHING SHOT, massive scale environment, negative space composition, realistic proportions, 
centered horizon line, symmetrical space, balanced composition, 
a tiny, solitary table tennis racket placed in the distance, small object in vast environment, 
vast empty space, expansive environment, 
cinematic
```

#### 範例輸出（巨物模式）：
```
EXTREME WIDE ESTABLISHING SHOT, surreal fantasy scale, dreamlike atmosphere, monumental composition, 
low angle looking up, towering structure, dramatic scale, 
a colossal table tennis racket towering like a skyscraper, monumental structure, 
surrounding landscape dwarfed by scale, 
cinematic
```

### 3. UI 控制 (components/sections/CameraSection.tsx)

在 `FramingVisualizer` 後面增加條件式的尺度選擇器：

```tsx
{(config.shotType === '大遠景' || config.shotType === '極遠景') && (
  <div className="mt-4 p-5 bg-orange-500/10 border border-orange-500/30 rounded-2xl">
    <div className="flex items-start gap-3 mb-4">
      <div className="text-orange-400 text-[20px]">⚠️</div>
      <div>
        <p className="text-[13px] font-bold text-orange-300 mb-1">
          大遠景模式：請選擇尺度邏輯
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          大遠景會改變主體在畫面中的比例，請選擇你想要的效果
        </p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      <button onClick={() => handleChange('scaleMode', 'realistic')}>
        🏞️ 寫實比例
      </button>
      <button onClick={() => handleChange('scaleMode', 'surreal')}>
        🗿 巨物模式
      </button>
    </div>
  </div>
)}
```

### 4. 智能警告 (components/sections/SubjectSection.tsx)

在主體描述 textarea 上方增加條件式警告：

```tsx
{cameraConfig && 
 (cameraConfig.shotType === '大遠景' || cameraConfig.shotType === '極遠景') && 
 (cameraConfig.scaleMode === 'realistic' || !cameraConfig.scaleMode) && (
  <div className="mb-3 p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
    <p className="text-[11px] text-slate-400 leading-relaxed">
      💡 <span className="text-blue-300 font-bold">寫實大遠景模式</span>：
      主體會在畫面中顯得很小，細節描述（如文字、紋理）可能不會被 AI 呈現。
      建議簡化主體描述，專注於「形狀」和「顏色」。
    </p>
  </div>
)}
```

### 5. 測試 (utils/wideShot.test.ts)

創建 7 個測試案例，全部通過 ✅：

1. ✅ 大遠景寫實模式：EXTREME WIDE 應該篡位到最前面
2. ✅ 大遠景巨物模式：應該包含 Surreal 和 Monumental 關鍵詞
3. ✅ 大遠景寫實模式：主體應該轉換為「微小」描述
4. ✅ 大遠景巨物模式：主體應該轉換為「巨大」描述
5. ✅ 大遠景寫實模式：低角度應該轉譯為「低地平線」
6. ✅ 大遠景巨物模式：低角度應該轉譯為「仰視巨物」
7. ✅ 非大遠景模式：應該使用標準詞序邏輯

## 視角轉譯對照表

### 寫實模式（強調空間）

| 原始視角 | 轉譯描述 |
|---------|---------|
| 正面平視 | Centered horizon line, symmetrical space, balanced composition |
| 極低角度 | Low horizon line, endless floor surface, vast ceiling space |
| 極高角度 | High altitude aerial view, geometric floor pattern layout, bird's eye overview |

### 巨物模式（強調壓迫感）

| 原始視角 | 轉譯描述 |
|---------|---------|
| 正面平視 | Frontal monumentality, imposing presence, centered dominance |
| 極低角度 | Low angle looking up, towering structure, dramatic scale, monumental presence looming overhead |
| 極高角度 | Overhead view of colossal structure, dwarfing surroundings, god's eye perspective on giant |

## 三種模式對比

現在 NanoBanana 可以完美處理三種極端情況：

| 模式 | 詞序優先 | 主體處理 | 適用場景 |
|------|---------|---------|---------|
| **微距模式** | EXTREME MACRO 置頂 | 局部材質化 | 紋理細節、產品特寫 |
| **標準模式** | Camera positioned at | 清晰完整 | 一般攝影、人像、商品 |
| **大遠景模式** | EXTREME WIDE 置頂 | 微小化/巨大化 | 極簡空間、概念藝術 |

## 技術優勢

1. ✅ **避免哥吉拉效應**：AI 不會把小物件畫成巨物
2. ✅ **語義轉換**：從「看哪一面」到「空間透視線」
3. ✅ **智能提示**：自動警告使用者簡化細節描述
4. ✅ **雙模式支援**：寫實與超現實兩種風格
5. ✅ **測試覆蓋**：7 個測試案例確保邏輯正確

## 使用者體驗流程

1. 使用者在 Camera Section 選擇「大遠景」或「極遠景」
2. 自動彈出尺度模式選擇器（橘色警告框）
3. 使用者選擇「寫實比例」或「巨物模式」
4. 切換到 Subject Section 時，看到智能警告（僅寫實模式）
5. Live Protocol Deck 即時顯示正確的詞序和描述

## 後續優化建議

1. **預設集**：創建大遠景專用的預設集
   - 極簡產品攝影
   - 環境人像
   - 巨物概念藝術

2. **視覺化預覽**：在 FramingVisualizer 中顯示尺度比例

3. **材質過濾**：在寫實模式下，自動過濾過於細節的材質描述

4. **快捷切換**：在 Protocol Deck 顯示尺度模式狀態指示器

## 文檔

- ✅ `WIDE_SHOT_OVERRIDE_MODE.md`: 完整的技術文檔
- ✅ `utils/wideShot.test.ts`: 測試案例
- ✅ `WIDE_SHOT_IMPLEMENTATION_SUMMARY.md`: 本文檔

## 結論

大遠景優先模式成功實作，與微距模式形成完美對稱：
- 微距：放大局部，紋理優先
- 大遠景：縮小整體，空間優先

兩種模式都使用「霸道參數」邏輯，篡位詞序，避免 AI 混淆。NanoBanana 現在可以通吃「顯微鏡級細節」和「史詩級大景」，而且邏輯不會打架！🎉
