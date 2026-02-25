# 微距優先模式 (Macro Override Mode) 實作總結

## 核心概念

極度微距是一個「霸道」的參數，它會**篡位**成為第一前綴，徹底改變詞序邏輯和主體定義。

### 為什麼微距會破壞原本的邏輯？

原本的邏輯：`[視角/方位] + [主體] + [風格]`
- 例如：從下往上看 (視角) + 桌球拍 (主體) + 電影感 (風格)

但是當開啟「極度微距」時：
1. **物理衝突**：你不可能同時「從下往上看全貌」又「極度微距」
2. **主體質變**：主體不再是「桌球拍」，而是「亞麻的纖維」或「木頭的毛細孔」

如果硬套舊邏輯：
```
❌ EXTREME WORM'S EYE VIEW, Front View, Table Tennis Racket, EXTREME MACRO LENS...
```
AI 會崩潰（Hallucinate）：試圖畫出一支完整的球拍，但又試圖把它塞進微距鏡頭裡。

## 微距模式下的新詞序邏輯

### 第一順位（篡位者）：尺度定義 (Scale Definition)
```
EXTREME MACRO CLOSE-UP, 1:1 MACRO DETAIL, MICROSCOPIC VIEW
```

### 第二順位：視角轉譯（光影與起伏）
原本的「方位角」不再決定「看哪一面」，而是決定**「紋理的起伏方向」**：

| 原始視角 | 普通模式 | 微距模式 |
|---------|---------|---------|
| 正面平視 | Front View | Flat lay detail, texture fills the frame, straight-on focus |
| 極低角度 | Looking up | Raking light from below, exhibiting surface relief, mountain-like texture landscape |
| 極高角度 | Bird's eye view | Top-down macro view, flat texture pattern, knolling-style arrangement |

### 第三順位：主體聚焦（材質細節）
強制 AI 忽略「整體」，只看「局部」：

| 材質 | 微距描述 |
|------|---------|
| Linen (亞麻) | Rough linen weave pattern, visible fiber texture, fabric grain structure |
| Wood (木材) | Wood grain pores, cellular structure, natural fiber lines |
| Metal (金屬) | Metal surface micro-scratches, machining marks, reflective texture |
| Glass (玻璃) | Glass surface imperfections, micro-bubbles, transparent texture |
| Leather (皮革) | Leather grain texture, pore detail, natural surface irregularities |

### 第四順位：景深效果
微距必然極淺：
```
Depth of field falls off rapidly, millimeter-thin focus plane, background completely dissolved
```

### 第五順位：視覺風格（最後）
```
Cinematic
```

## 實戰 Prompt 對比

### ❌ 錯誤示範（硬套舊邏輯）
```
EXTREME WORM'S EYE VIEW, Front View, Table tennis racket, Macro lens, Cinematic...
```
**結果**：AI 困惑，可能會畫一個很遠的球拍，或是畫一個巨大的球拍但細節不夠。

### ✅ 正確示範（微距優先邏輯）
```
EXTREME MACRO CLOSE-UP, 1:1 MACRO DETAIL, MICROSCOPIC VIEW, 
raking light from below, exhibiting surface relief, mountain-like texture landscape, dramatic shadows across fibers, 
depth of field falls off rapidly, millimeter-thin focus plane, background completely dissolved, 
cinematic
```
**結果**：你會得到一張極度震撼的、像山脈一樣的布料纖維特寫。

## 實作細節

### 1. 微距模式檢測
```typescript
function isMacroMode(shotType: string): boolean {
  const shotLower = shotType.toLowerCase();
  return shotLower.includes('macro') || 
         shotLower.includes('微距') || 
         shotLower.includes('極致特寫') ||
         shotLower.includes('extreme close');
}
```

### 2. 視角轉譯函數
```typescript
function translateMacroAngle(azimuth: number, elevation: number): string {
  // 微距模式下，視角決定「光線如何呈現質感」
  if (absElevation <= 10 && absAzimuth <= 15) {
    return 'flat lay detail, texture fills the frame, straight-on focus';
  } else if (elevation < -30) {
    return 'raking light from below, exhibiting surface relief, mountain-like texture landscape';
  }
  // ... 更多轉譯邏輯
}
```

### 3. 主體修正函數
```typescript
function translateMacroSubject(subjectType: string, materials: string[]): string {
  // 根據材質類型，生成微距專用的紋理描述
  if (materials.includes('linen')) {
    return 'rough linen weave pattern, visible fiber texture, fabric grain structure';
  }
  // ... 更多材質映射
}
```

### 4. 主要翻譯函數修改
```typescript
export function translatePromptState(state: PromptState): TranslatedPromptComponents {
  // 檢測微距模式
  const isMacro = isMacroMode(state.camera.shotType);
  
  if (isMacro) {
    // 使用微距專用邏輯
    // 1. EXTREME MACRO 置頂
    // 2. 視角轉譯
    // 3. 主體修正
    // 4. 景深強制極淺
    // 5. 風格最後
  } else {
    // 使用標準邏輯
  }
}
```

## 測試結果

### 測試 1：微距模式詞序
```
【微距模式 Composition】:
extreme macro close-up, 1:1 macro detail, microscopic view, 
flat lay detail, texture fills the frame, straight-on focus, orthographic-like perspective, 
depth of field falls off rapidly, millimeter-thin focus plane, background completely dissolved, 
cinematic
```
✅ EXTREME MACRO 在最前面（位置 0）
✅ Cinematic 在最後面

### 測試 2：低角度轉譯
```
【微距低角度 Composition】:
extreme macro close-up, 1:1 macro detail, microscopic view, 
raking light from below, exhibiting surface relief, mountain-like texture landscape, dramatic shadows across fibers, 
depth of field falls off rapidly, millimeter-thin focus plane, background completely dissolved
```
✅ 包含「raking light」（側掠光）
✅ 不包含「looking up」（普通模式的低角度）

### 測試 3：主體轉換
```
【微距模式 Subject】:
rough linen weave pattern, visible fiber texture, fabric grain structure, 
wood grain pores, cellular structure, natural fiber lines
```
✅ 聚焦於材質紋理
✅ 不是「table tennis racket」整體描述

### 測試 4：景深描述
```
depth of field falls off rapidly, millimeter-thin focus plane, background completely dissolved
```
✅ 描述為極淺景深

### 測試 5：非微距模式
```
【標準模式 Composition】:
camera positioned at eye level shot, neutral elevation facing from the front view, 
using standard lens perspective, zero distortion, rectilinear projection, neutral spatial rendering, 
head and shoulders portrait, upper chest visible, 
using rule of thirds grid, creating shallow depth of field, face sharp with soft background, portrait separation, professional look, 
cinematic
```
✅ 使用標準詞序邏輯
✅ 不包含微距關鍵詞

## 支援的材質類型

### 布料類
- Linen (亞麻)
- Cotton (棉)
- Silk (絲)
- Leather (皮革)

### 木材類
- Wood (木材)

### 金屬類
- Metal (金屬)
- Gold (金)
- Silver (銀)

### 玻璃/陶瓷類
- Glass (玻璃)
- Ceramic (陶瓷)

### 其他
- Plastic (塑膠)
- Stone (石材)
- Marble (大理石)
- Paper (紙張)
- Food (食物)

## 影響範圍

### 受益場景
1. **產品攝影**：展示材質細節（布料、木材、金屬）
2. **食物攝影**：展示食材紋理（麵包氣孔、肉類纖維）
3. **珠寶攝影**：展示寶石切面、金屬拋光
4. **科學攝影**：展示微觀結構、細胞組織

### 技術優勢
- 避免 AI 混淆「整體」與「局部」
- 強制 AI 聚焦於紋理細節
- 自動應用正確的景深描述
- 視角語義轉換（從「看哪一面」到「光線方向」）

## 後續建議

1. **UI 提示**：當使用者選擇微距模式時，顯示提示：「微距模式已啟動：視角將轉換為紋理照明方向」
2. **材質建議**：在微距模式下，自動建議使用者填寫材質資訊
3. **預覽優化**：在視覺化預覽中，顯示「紋理起伏」而非「整體視角」
4. **預設集**：創建微距專用的預設集（布料紋理、木材紋理、金屬表面等）

## 總結

微距優先模式成功實作了「霸道參數」的邏輯：
- ✅ 篡位詞序（EXTREME MACRO 置頂）
- ✅ 視角轉譯（從「看哪一面」到「光線方向」）
- ✅ 主體修正（從「整體」到「局部材質」）
- ✅ 景深強制（極淺景深）
- ✅ 測試通過（5/5 tests passed）

現在 NanoBanana 可以通吃「史詩級大景」和「顯微鏡級細節」，而且邏輯不會打架！
