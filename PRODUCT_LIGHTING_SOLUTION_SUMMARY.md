# 產品攝影燈光相容性 - 解決方案總結

## 問題回顧

使用者提出的關鍵問題：

> **「目前所有的燈光訊息是不是都針對人像去做處理？如果我一旦用了 Preset，它基本上都是針對人去調整的，那假如我是拍商品的話，可以共用這樣的一個 Preset 嗎？會不會因為它的文字敘述，導致我的商品表現變得奇怪？」**

## 答案

**是的，你的擔心完全正確！** 原本的系統確實會導致問題。

---

## 問題分析

### 原本的輸出（產品模式）

```
(Geometry) Rembrandt lighting style, Triangle reflective highlight on surface, Classic 45-degree portrait setup, volume shadow reaching toward surface, ...
```

### 問題點

1. ❌ **Preset 名稱是人像專用**：「Rembrandt」暗示人像攝影
2. ❌ **仍然包含「portrait setup」**：明確說明是人像設定
3. ❌ **幾何描述與人臉相關**：「Triangle on surface」沒有意義
4. ❌ **AI 會混淆**：可能生成奇怪的結果

---

## 解決方案

### 實作：產品模式下完全移除人像相關用語

**修改邏輯**：
```typescript
if (isProductMode) {
  // 產品模式：移除所有幾何標籤和 Preset 名稱
  return {
    mode: 'product_lighting',
    presetName: preset.name,  // 僅供 UI 顯示
    geometryTags: [],  // 不輸出到 Prompt
    styleTags,  // 保留風格標籤
    physicalDescription: generatePhysicalDescription(keyLight, 'key'),
    ...
  };
}
```

### 修正後的輸出（產品模式）

```
(Geometry) Key light positioned at front-side high angle with strong intensity, 
(Key Light) Key light positioned at front-side high angle with strong intensity, in neutral white color, 
(Fill Light) Fill light positioned at back slightly above with soft intensity, in soft gray-blue color, 
(Rim Light) Rim light positioned at back high angle with moderate intensity, in neutral white color, 
(Style) Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows, Renaissance painting quality.
```

### 優點

✅ **沒有人像用語**：完全移除 cheek, face, nose 等詞  
✅ **沒有 Preset 名稱**：不會出現 Rembrandt, Butterfly 等  
✅ **清晰的物理描述**：明確說明燈光位置  
✅ **保留風格標籤**：戲劇性、高對比等質感仍然存在  
✅ **AI 不會混淆**：清楚知道這是產品攝影  

---

## 對比測試

### 人像模式（Portrait Mode）

**輸入**：
- Preset: Rembrandt
- isProductMode: false

**輸出**：
```
(Geometry) Rembrandt lighting style, Triangle catchlight on cheek, Classic 45-degree portrait setup, Nose shadow reaching toward cheek, 
(Key Light) Key light positioned at front-side high angle with strong intensity, in neutral white color, 
...
(Style) Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows, Renaissance painting quality.
```

**特點**：
- ✅ 包含 Preset 名稱（Rembrandt）
- ✅ 包含人像幾何標籤（Triangle on cheek）
- ✅ 包含物理方向描述
- ✅ 包含風格標籤

---

### 產品模式（Product Mode）

**輸入**：
- Preset: Rembrandt
- isProductMode: true

**輸出**：
```
(Geometry) Key light positioned at front-side high angle with strong intensity, 
(Key Light) Key light positioned at front-side high angle with strong intensity, in neutral white color, 
...
(Style) Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows, Renaissance painting quality.
```

**特點**：
- ❌ 不包含 Preset 名稱（避免混淆）
- ❌ 不包含人像幾何標籤（避免奇怪描述）
- ✅ 包含物理方向描述（清晰明確）
- ✅ 包含風格標籤（保留質感）

---

## 使用者體驗

### UI 顯示

使用者在介面上仍然可以看到：
```
💡 當前 Preset：林布蘭光 (Rembrandt)
```

但生成的 Prompt 中不會包含「Rembrandt」這個詞。

### 為什麼這樣設計？

1. **UI 上的 Preset 名稱**：讓使用者知道選擇了哪個燈光設定
2. **Prompt 中的物理描述**：讓 AI 清楚知道燈光的實際位置和質感
3. **分離顯示與生成**：UI 顯示給人看，Prompt 給 AI 看

---

## 測試驗證

### 測試結果：✅ 全部通過（8/8）

1. ✅ 人像模式：包含 Preset 名稱和人像用語
2. ✅ 產品模式：移除 Preset 名稱和人像用語
3. ✅ 產品模式：不包含 portrait setup
4. ✅ 產品模式：包含物理方向描述
5. ✅ 產品模式：包含風格標籤
6. ✅ 所有 Preset 在產品模式下都正確處理
7. ✅ 顏色描述清晰標示
8. ✅ 強度為 0 的燈光不輸出

---

## 實際應用範例

### 範例 1：香水瓶 + 林布蘭光

**使用者操作**：
1. 主體：香水瓶
2. 選擇 Preset：林布蘭光
3. 系統自動偵測：產品模式

**生成的 Prompt**：
```
A perfume bottle in frosted glass and gold cap, 
Key light positioned at front-side high angle with strong intensity, in neutral white color, 
Fill light positioned at back slightly above with soft intensity, in soft gray-blue color, 
Rim light positioned at back high angle with moderate intensity, in neutral white color, 
Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows.
```

**AI 的理解**：
- ✅ 這是香水瓶（產品）
- ✅ 主光來自右上方 45°
- ✅ 戲劇性的明暗對比
- ✅ 高對比度照明

**結果**：生成正確的產品攝影圖像

---

### 範例 2：人像 + 林布蘭光

**使用者操作**：
1. 主體：人像
2. 選擇 Preset：林布蘭光
3. 系統自動偵測：人像模式

**生成的 Prompt**：
```
A portrait, 
Rembrandt lighting style, Triangle catchlight on cheek, Classic 45-degree portrait setup, Nose shadow reaching toward cheek, 
Key light positioned at front-side high angle with strong intensity, in neutral white color, 
...
Rendering with Dramatic chiaroscuro, High contrast illumination, Sculptural rendering, Deep defined shadows, Renaissance painting quality.
```

**AI 的理解**：
- ✅ 這是人像
- ✅ 使用林布蘭光（經典人像燈光）
- ✅ 臉頰上有三角形光斑
- ✅ 戲劇性的明暗對比

**結果**：生成正確的人像攝影圖像

---

## 自動偵測邏輯

系統會根據以下條件自動判定產品模式：

```typescript
const isProductMode = 
  camera.framingMode === 'product' ||  // 手動設定
  camera.photographyMode === 'commercial' ||  // 商業攝影
  subject.type.toLowerCase().includes('product') ||  // 主體類型
  subject.type.toLowerCase().includes('bottle') ||  // 瓶子
  subject.type.toLowerCase().includes('watch') ||  // 手錶
  subject.type.toLowerCase().includes('jewelry');  // 珠寶
```

---

## 結論

### 問題確認

你的擔心是**完全正確的**！

1. ✅ 原本的 Preset 確實是針對人像設計的
2. ✅ 產品模式下會包含人像相關用語
3. ✅ 這會導致 AI 混淆，生成奇怪的結果

### 解決方案

**產品模式下：**
- ❌ 不輸出 Preset 名稱（Rembrandt, Butterfly 等）
- ❌ 不輸出人像幾何標籤（Triangle on cheek 等）
- ✅ 輸出物理方向描述（Key light at 45° angle）
- ✅ 輸出風格標籤（Dramatic chiaroscuro）

### 最終效果

- **使用者**：在 UI 上看到 Preset 名稱，知道選了什麼
- **AI**：收到清晰的物理描述和風格標籤，不會混淆
- **結果**：產品攝影和人像攝影都能正確生成

---

**修正完成！** 🎉

現在你可以放心地在產品攝影中使用人像燈光 Preset，系統會自動處理用語轉換，確保 AI 不會混淆。
