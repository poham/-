# 中文 Prompt 可行性分析

## 問題背景

使用者提問：為什麼 Nano Banana 生成的英文 prompt 結構清晰且有效，但如果改成中文可能會有問題？

## 核心原因：AI 模型的訓練語料偏向英文

### 1. 訓練數據來源

主流 AI 圖像生成模型（Midjourney、Stable Diffusion、DALL-E）的訓練數據主要來自：

- **英文網路內容**：Flickr、Unsplash、Getty Images 等圖庫的英文標註
- **英文攝影教學**：大量的英文攝影教程、器材評測
- **英文專業術語**：攝影行業標準術語（ISO、aperture、bokeh 等）
- **英文圖文配對**：數億張圖片與英文描述的配對數據

中文內容在訓練數據中的比例遠低於英文，導致模型對中文攝影術語的「視覺理解」較弱。

### 2. 語言理解深度差異

| 層面 | 英文 | 中文 |
|------|------|------|
| 詞彙覆蓋 | 模型見過大量「eye level shot」配對的圖片 | 模型很少見過「視線水平拍攝」的圖文配對 |
| 語義精確度 | `50mm lens` = 自然透視 | `50mm 鏡頭` 可能只是字面翻譯 |
| 術語標準化 | 攝影術語高度標準化 | 中文術語有多種翻譯版本 |
| 視覺關聯 | 深度理解視覺含義 | 可能只是表面翻譯 |

## 實際範例對比

### 範例 1：相機角度

#### 英文 Prompt（推薦）
```
Camera positioned at eye level shot, neutral elevation, facing from the front view
```

**模型理解：**
- `eye level` → 視線高度的大量圖片記憶
- `neutral elevation` → 0° 仰角的視覺效果
- `front view` → 正面拍攝的構圖模式

#### 中文 Prompt（可能問題）
```
相機位於視線水平拍攝，中性仰角，從正面視角面對
```

**可能問題：**
- 「視線水平拍攝」- 模型訓練時很少見過這個詞
- 「中性仰角」- 語義模糊，可能被理解為「沒有角度」或「普通角度」
- 「從正面視角面對」- 語法結構與英文不同，模型可能困惑

### 範例 2：鏡頭光學

#### 英文 Prompt（推薦）
```
using 50mm standard lens with natural perspective, shallow depth of field
```

**模型理解：**
- `50mm standard lens` → 標準視角的視覺效果
- `natural perspective` → 無變形的透視
- `shallow depth of field` → 背景模糊的大量圖片記憶

#### 中文 Prompt（可能問題）
```
使用 50mm 標準鏡頭與自然透視，淺景深
```

**可能問題：**
- 「標準鏡頭」- 可能被理解為「普通鏡頭」而非特定焦段
- 「自然透視」- 模型可能不理解這與鏡頭焦段的關係
- 「淺景深」- 雖然是標準術語，但模型見過的中文配對較少

### 範例 3：燈光設定

#### 英文 Prompt（推薦）
```
Rembrandt lighting, triangle catch light on cheek, 45-degree key light from front-left
```

**模型理解：**
- `Rembrandt lighting` → 經典人像打光的大量圖片記憶
- `triangle catch light` → 臉頰三角形補光的視覺特徵
- `45-degree key light` → 精確的燈光角度

#### 中文 Prompt（可能問題）
```
林布蘭打光，臉頰三角形補光，45 度主光從左前方
```

**可能問題：**
- 「林布蘭打光」- 翻譯版本不統一（也有人說「倫勃朗」）
- 「臉頰三角形補光」- 語義不夠精確
- 「左前方」- 方位描述可能不夠標準化

## 中文 Prompt 的實際效果預測

### 可能有效的情況

1. **通用描述詞**：
   - ✅ 「一位老人」（an elderly man）
   - ✅ 「紅色背景」（red background）
   - ✅ 「柔和光線」（soft lighting）

2. **簡單構圖**：
   - ✅ 「特寫」（close-up）
   - ✅ 「全身照」（full body shot）

### 可能失效的情況

1. **專業攝影術語**：
   - ❌ 「視線水平拍攝」（eye level shot）
   - ❌ 「中性仰角」（neutral elevation）
   - ❌ 「自然透視」（natural perspective）

2. **精確技術參數**：
   - ❌ 「50mm 標準鏡頭」（50mm standard lens）
   - ❌ 「f/2.8 光圈」（f/2.8 aperture）
   - ❌ 「三分法構圖」（rule of thirds）

3. **複雜燈光設定**：
   - ❌ 「林布蘭打光」（Rembrandt lighting）
   - ❌ 「蝴蝶光」（Butterfly lighting）
   - ❌ 「三點式打光」（3-point lighting）

## 混合策略：中英混用

### 推薦做法

保留**技術術語**用英文，**描述性內容**可用中文：

```
一位穿著皮夾克的老人 (elderly man in leather jacket),
camera positioned at eye level shot,
using 50mm standard lens,
Rembrandt lighting,
在黑暗的巷子裡 (in dark alley),
moody atmosphere
```

### 為什麼這樣有效？

1. **技術術語**（英文）：模型有深度理解
2. **描述內容**（中文）：模型也能理解基本語義
3. **混合使用**：發揮兩種語言的優勢

## 實驗建議

如果要測試中文 prompt 的效果，可以進行以下實驗：

### 實驗 1：純英文 vs 純中文

**純英文：**
```
Camera positioned at eye level shot, neutral elevation, facing from the front view,
using 50mm standard lens with natural perspective,
medium shot framing subject from waist up,
Rembrandt lighting with soft shadows
```

**純中文：**
```
相機位於視線水平拍攝，中性仰角，從正面視角面對，
使用 50mm 標準鏡頭與自然透視，
中景構圖從腰部以上取景主體，
林布蘭打光與柔和陰影
```

**預測結果：** 純英文效果明顯更好

### 實驗 2：中英混用

**策略 A（技術術語保留英文）：**
```
一位老人穿著皮夾克，
camera positioned at eye level shot,
using 50mm standard lens,
medium shot,
Rembrandt lighting,
在黑暗的巷子裡，
moody atmosphere
```

**預測結果：** 效果接近純英文，且更易讀

### 實驗 3：不同模型的中文支援

| 模型 | 中文支援程度 | 建議策略 |
|------|-------------|---------|
| Midjourney | 中等 | 中英混用 |
| Stable Diffusion | 較弱 | 優先英文 |
| DALL-E 3 | 較好 | 可嘗試純中文 |
| 國產模型（如文心一格） | 較好 | 可使用純中文 |

## 結論

### 為什麼 Nano Banana 使用英文？

1. **通用性**：適用於所有主流 AI 圖像生成平台
2. **精確性**：英文攝影術語有明確的視覺對應
3. **效果保證**：模型對英文的理解深度遠超中文
4. **標準化**：英文攝影術語全球統一

### 如果要支援中文？

可以考慮以下方案：

1. **雙語輸出**：同時生成英文和中文版本
2. **中英混用**：技術術語保留英文，描述用中文
3. **模型選擇**：針對不同模型提供不同語言策略
4. **使用者選項**：讓使用者選擇輸出語言

### 最佳實踐

對於追求最佳圖像生成效果的使用者：
- ✅ **推薦**：使用純英文 prompt（Nano Banana 當前策略）
- ⚠️ **可嘗試**：中英混用（技術術語英文 + 描述中文）
- ❌ **不推薦**：純中文 prompt（除非使用中文優化的模型）

## 技術實作考量

如果未來要加入中文支援，需要：

1. **建立中英對照表**：所有攝影術語的標準翻譯
2. **語言切換選項**：UI 中加入語言選擇
3. **混合模式**：智能判斷哪些詞保留英文
4. **模型適配**：根據目標平台調整語言策略
5. **效果測試**：大量測試不同語言組合的效果

## 參考資料

- [Midjourney 官方文件](https://docs.midjourney.com/) - 建議使用英文
- [Stable Diffusion 社群](https://stability.ai/) - 英文效果最佳
- [DALL-E 3 研究](https://openai.com/dall-e-3) - 多語言支援改進中
