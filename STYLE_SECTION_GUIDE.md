# Style Section 使用指南與設計理念

## 問題 1：視覺風格 (Visual Style) 現在已修復

**問題**：選擇視覺風格後，Live Protocol Deck 沒有顯示。

**解決方案**：已修復 `visualTranslators.ts`，現在 `visualStyle` 會正確出現在最終 prompt 的開頭。

**輸出範例**：
```
Cinematic (電影感), Hyper-detailed, Ray Tracing style
```

---

## 問題 2：藝術後製協定 (Processing Tags) 的衝突問題

### 你的疑問
> 如果選擇 Anime (動漫風格)，又勾選 Ray Tracing (光線追蹤)，會不會奇怪？

### 設計理念

**不會奇怪，這是刻意設計的靈活性！**

#### 為什麼允許混搭？

1. **視覺風格 ≠ 渲染技術**
   - `Anime (動漫風格)` = 美學方向（扁平色彩、線條風格、日式構圖）
   - `Ray Tracing (光線追蹤)` = 渲染技術（真實光影、反射、折射）
   
2. **現代 AI 可以理解混合風格**
   - "Anime style with ray tracing" = 動漫美學 + 真實光影
   - 結果：保留動漫的色彩和線條，但有真實的光影效果
   - 類似《蜘蛛人：新宇宙》的風格化 + 高品質渲染

3. **實際應用場景**
   ```
   Anime (動漫風格) + Ray Tracing + Hyper-detailed
   = 高品質動漫渲染，適合商業插畫、遊戲宣傳圖
   
   Cinematic (電影感) + UE5 Render + Lumen GI
   = 電影級 CG 渲染，適合概念藝術、電影前期視覺
   
   Commercial (商業攝影) + Film Grain + Soft Vignette
   = 復古商業攝影風格，適合品牌形象照
   ```

#### 建議的組合邏輯

**動漫風格 (Anime)**：
- ✅ 適合：Hyper-detailed, 8k Resolution, Soft Vignette
- ⚠️ 謹慎：Ray Tracing（會讓動漫變得太真實）
- ❌ 避免：Film Grain（動漫通常是數位乾淨的）

**電影感 (Cinematic)**：
- ✅ 適合：Ray Tracing, Anamorphic Lens Flare, Film Grain, Lumen GI
- ✅ 適合：UE5 Render（電影級渲染）
- ⚠️ 謹慎：Tilt-Shift Miniature（會破壞電影感）

**超寫實 (Hyper-Realistic)**：
- ✅ 適合：Ray Tracing, Hyper-detailed, 8k Resolution
- ✅ 適合：Perspective Correction（保持真實感）
- ❌ 避免：Fisheye Distortion（會破壞寫實感）

**商業攝影 (Commercial)**：
- ✅ 適合：Hyper-detailed, Perspective Correction, Straight Vertical Lines
- ⚠️ 謹慎：Film Grain（除非要復古風格）
- ❌ 避免：Anamorphic Lens Flare（太電影化）

---

## 問題 3：底片模擬 (Film Simulation)

### (a) 底片模擬的差別與衝突

#### 各底片的特性

1. **Kodak Portra 400**
   - 特性：溫暖膚色、柔和對比、自然色彩
   - 適合：人像、生活風格、溫馨場景
   - 衝突：與 Anime 風格衝突（動漫不需要膚色校正）

2. **Fujifilm Superia**
   - 特性：鮮豔色彩、高飽和度、日系風格
   - 適合：街拍、旅遊、日常記錄
   - 衝突：與 Hyper-Realistic 衝突（太鮮豔不真實）

3. **Ilford HP5 Plus (黑白)**
   - 特性：高對比黑白、顆粒感、經典質感
   - 適合：藝術攝影、紀實、復古風格
   - 衝突：與任何彩色風格衝突（會變黑白）

4. **Cinestill 800T**
   - 特性：霓虹光暈、電影感、夜景氛圍
   - 適合：夜景、城市、賽博龐克
   - 衝突：與 Commercial 衝突（太藝術化）

5. **Polaroid SX-70 (拍立得)**
   - 特性：柔焦、褪色感、復古色調
   - 適合：懷舊、溫馨、個人記錄
   - 衝突：與 Hyper-detailed 衝突（拍立得不清晰）

6. **Technicolor V3 (特藝彩色)**
   - 特性：飽和色彩、經典電影感、復古好萊塢
   - 適合：電影風格、復古商業、戲劇化場景
   - 衝突：與 Anime 衝突（色彩邏輯不同）

#### 底片 vs 視覺風格的衝突矩陣

| 底片 / 視覺風格 | Cinematic | Hyper-Realistic | Commercial | Anime | Ethereal |
|----------------|-----------|-----------------|------------|-------|----------|
| Kodak Portra   | ✅ 完美    | ⚠️ 可用         | ✅ 完美    | ❌ 衝突 | ✅ 完美  |
| Fujifilm       | ⚠️ 可用   | ❌ 衝突         | ⚠️ 可用    | ✅ 完美 | ⚠️ 可用  |
| Ilford HP5     | ✅ 完美    | ✅ 完美         | ❌ 衝突    | ❌ 衝突 | ✅ 完美  |
| Cinestill 800T | ✅ 完美    | ⚠️ 可用         | ❌ 衝突    | ⚠️ 可用 | ✅ 完美  |
| Polaroid SX-70 | ⚠️ 可用   | ❌ 衝突         | ❌ 衝突    | ⚠️ 可用 | ✅ 完美  |
| Technicolor V3 | ✅ 完美    | ❌ 衝突         | ⚠️ 可用    | ❌ 衝突 | ⚠️ 可用  |

### (b) 顆粒感強度 (Grain Intensity) 的控制

**目前實作**：
- None / Low / Medium / Heavy 四個等級
- 已經有控制功能（按鈕選擇）

**作用方式**：
```
None   → 無顆粒，數位乾淨
Low    → 微顆粒，35mm 底片質感
Medium → 明顯顆粒，400 ISO 底片
Heavy  → 粗顆粒，3200 ISO 或推沖效果
```

**與底片模擬的關係**：
- 底片模擬 = 色彩特性 + 預設顆粒
- Grain 控制 = 額外調整顆粒強度
- 兩者可以疊加使用

**範例**：
```
Kodak Portra 400 + Low Grain
= 柔和色調 + 輕微顆粒（經典底片感）

Ilford HP5 Plus + Heavy Grain
= 黑白 + 粗顆粒（街頭紀實風格）

None (Digital Core) + None Grain
= 完全數位乾淨（商業產品攝影）
```

### (c) 鏡頭暗角 (Lens Vignette) 的作用

**目前實作**：
- Toggle 開關（開/關）
- 已經有作用

**視覺效果**：
```
Vignette ON  → 邊角變暗，視覺聚焦中心
Vignette OFF → 均勻亮度，無暗角
```

**適用場景**：

✅ **適合開啟暗角**：
- 人像攝影（聚焦臉部）
- 電影感場景（戲劇化）
- 復古風格（老鏡頭效果）
- 情緒攝影（憂鬱、懷舊）

❌ **不適合開啟暗角**：
- 商業產品攝影（需要均勻光線）
- 建築攝影（邊角也要清晰）
- 平面設計用途（需要乾淨背景）
- 科技產品（現代感）

**技術說明**：
- Vignette 會在 prompt 中加入 "lens vignette" 描述
- AI 會理解為「鏡頭自然暗角效果」
- 類似使用大光圈鏡頭或老鏡頭的效果

---

## 最佳實踐建議

### 1. 電影感商業攝影
```
Visual Style: Cinematic (電影感)
Processing: Hyper-detailed, Ray Tracing, Anamorphic Lens Flare
Film: Kodak Portra 400
Grain: Low
Vignette: ON
```

### 2. 超寫實產品攝影
```
Visual Style: Hyper-Realistic (超寫實)
Processing: Hyper-detailed, Ray Tracing, Perspective Correction
Film: None (Digital Core)
Grain: None
Vignette: OFF
```

### 3. 日系動漫風格
```
Visual Style: Anime (動漫風格)
Processing: Hyper-detailed, 8k Resolution
Film: Fujifilm Superia
Grain: None
Vignette: OFF
```

### 4. 復古編輯攝影
```
Visual Style: Editorial (編輯攝影)
Processing: Film Grain, Soft Vignette
Film: Cinestill 800T
Grain: Medium
Vignette: ON
```

### 5. 空靈藝術攝影
```
Visual Style: Ethereal (空靈氛圍)
Processing: Soft Vignette, Lumen Global Illumination
Film: Polaroid SX-70
Grain: Low
Vignette: ON
```

---

## 總結

1. **視覺風格已修復** - 現在會正確顯示在 Live Protocol Deck
2. **混搭是允許的** - 但要理解每個選項的特性
3. **底片模擬有特定風格** - 選擇時考慮與視覺風格的搭配
4. **顆粒感可以控制** - 四個等級已實作
5. **暗角效果有作用** - 適合人像和電影感，不適合商業產品

建議在 UI 中加入「推薦組合」提示，幫助使用者快速選擇合適的設定！
