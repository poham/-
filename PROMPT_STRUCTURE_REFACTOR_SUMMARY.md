# Prompt Structure Refactor Summary

## 目標
重構 prompt 組裝邏輯，確保與 AI 圖像生成模型（如 Nano Banana Pro）溝通時：
1. **無歧義**：避免顏色互染、角度混淆
2. **結構清晰**：人類和 AI 都能一目了然
3. **語意精確**：每個描述都有明確的歸屬

---

## 新的 Prompt 結構

### 完整格式
```
[Camera Setup + DOF] of [Subject + Orientation] in [Environment + BG Color] lit by [Lighting + Light Color] with [Mood], rendered in [Style]. --ar [Ratio]
```

### 實際範例
```
A waist-up shot from eye-level perspective using portrait lens and rule of thirds grid creating shallow depth of field, 
of perfume bottle in frosted glass and gold cap, facing front, featuring gold cap detail, 
in minimalist studio environment with soft light gray background, 
lit by strong key light from upper side angle in warm orange-red tone, 
with soft cinematic mood, rendered in hyper-detailed, ray tracing style. --ar 1:1
```

---

## 關鍵改進

### 1. **景深移到 Camera Setup**
**之前**：
```
"with side lighting, shallow depth of field, soft mood"
```
- ❌ 景深夾在燈光和氛圍之間
- ❌ 容易被忽略或誤解為燈光效果

**之後**：
```
"A waist-up shot using portrait lens creating shallow depth of field"
```
- ✅ 明確是鏡頭造成的光學效果
- ✅ 與 shot type, lens 放在一起，語意清晰

---

### 2. **顏色明確標註所屬**
**之前**：
```
"in minimalist studio, background: Soft light gray, with Strong light, Vivid orange-red"
```
- ❌ "Soft light gray" 和 "Vivid orange-red" 太接近
- ❌ AI 可能混淆：灰色背景 vs 橘紅色燈光

**之後**：
```
"in minimalist studio with soft light gray background, 
lit by strong key light in warm orange-red tone"
```
- ✅ "gray background" → 明確是背景色
- ✅ "orange-red tone" → 明確是燈光色
- ✅ 用 "lit by" 清楚分隔兩個區段

---

### 3. **角度明確區分**
**之前**：
```
"eye-level perspective of perfume bottle facing front with side lighting from upper angle"
```
- ❌ 三種角度混在一起：攝影機、主體、燈光

**之後**：
```
"from eye-level perspective (camera)
of perfume bottle, facing front (subject)
lit by key light from upper side angle (light)"
```
- ✅ Camera: "from eye-level perspective"
- ✅ Subject: "facing front"
- ✅ Light: "from upper side angle"
- ✅ 每個角度都有明確的主詞

---

### 4. **連接詞優化**
**之前**：
```
"with Strong light with Side lighting with shallow depth of field"
```
- ❌ 重複的 "with"，語法不順

**之後**：
```
"creating shallow depth of field (camera)
lit by strong key light (lighting)
with soft cinematic mood (atmosphere)"
```
- ✅ 使用不同的連接詞：creating, lit by, with
- ✅ 每個連接詞都有明確的語意

---

### 5. **材質描述改進**
**之前**：
```
"perfume bottle (frosted glass, gold cap)"
```
- ❌ 括號容易被 AI 忽略

**之後**：
```
"perfume bottle in frosted glass and gold cap"
```
- ✅ 使用 "in" 和 "and" 連接材質
- ✅ 更自然的英文語法

---

## Protocol Deck 顯示改進

### 新的分類標籤
1. **THEME** - 主題類型
2. **CAMERA SETUP & OPTICS** - 攝影機設定 + 景深（明確是鏡頭效果）
3. **SUBJECT DETAILS** - 主體細節 + 朝向
4. **ENVIRONMENT** - 環境 + 背景顏色（明確標註背景色）
5. **LIGHTING SETUP** - 燈光設定（明確標註燈光色）
6. **MOOD** - 氛圍
7. **RENDERING STYLE** - 渲染風格與後製

### Core Metadata 顯示
- Aspect Ratio
- Lens
- **Aperture** ← 新增！
- Roll

---

## AI-Ready JSON 改進

### 之前
```json
{
  "composition": "A waist-up shot, eye-level, portrait lens",
  "subject": "perfume bottle (frosted glass)",
  "environment": "minimalist studio, background: Soft light gray",
  "lighting": "Strong light, Side lighting, Vivid orange-red, shallow depth of field"
}
```

### 之後
```json
{
  "composition": "A waist-up shot from eye-level perspective using portrait lens creating shallow depth of field",
  "subject": "perfume bottle in frosted glass and gold cap, facing front",
  "environment": "minimalist studio environment with soft light gray background",
  "lighting": "strong key light from upper side angle in warm orange-red tone"
}
```

---

## 避免的問題

### ❌ 顏色互染
- **問題**：紅蘋果 + 藍色背景 → 全身紅調或藍調
- **解決**：明確標註 "red apple" vs "blue background" vs "warm light tone"

### ❌ 角度混淆
- **問題**：主體旋轉 45° + 攝影機旋轉 -45° → 分不清誰轉了
- **解決**：明確主詞 "from eye-level perspective" vs "facing front"

### ❌ 景深誤解
- **問題**：景深放在燈光區段 → AI 以為是燈光效果
- **解決**：景深放在 camera setup → 明確是鏡頭效果

### ❌ 重複連接詞
- **問題**："with...with...with..." → 語法不順
- **解決**：使用不同連接詞 "creating", "lit by", "with", "rendered in"

---

## 測試建議

### 測試案例 1：顏色分離
```
紅色主體 + 藍色背景 + 黃色燈光
→ "red apple in blue studio background lit by warm yellow key light"
```

### 測試案例 2：角度清晰
```
主體正面 + 攝影機俯視 + 燈光側面
→ "from high angle perspective of subject facing front lit by side light"
```

### 測試案例 3：景深效果
```
微距 + f/2.8 → "Macro shot creating extremely shallow depth of field"
遠景 + f/11 → "Long shot creating deep depth of field"
```

---

## 結論

新的結構確保：
1. ✅ **AI 不會產生誤會**：每個描述都有明確的歸屬和語意
2. ✅ **人類閱讀清晰**：分段明確，一目了然
3. ✅ **無顏色互染**：背景色、主體色、燈光色都明確標註
4. ✅ **無角度混淆**：攝影機、主體、燈光的角度都有明確主詞
5. ✅ **語法流暢**：使用不同的連接詞，避免重複

這個結構已經過深思熟慮，專門針對 AI 圖像生成模型的理解方式優化，確保生成的圖像符合預期。
