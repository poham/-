# Visual Style Priority Solution - 視覺風格優先級解決方案

## 問題場景

```
用戶選擇：
- 鏡頭：8mm 魚眼
- 視覺風格：Sin City style
- 燈光：林布蘭光 (Rembrandt)
```

**問題：誰先誰後？**

## 答案：需要建立新的優先級層級

### 目前的優先級系統（5 層）

```typescript
enum PromptPriorityLevel {
  SPECIAL_OPTICS = 1,      // 特殊光學（魚眼、微距）
  EXTREME_DISTANCE = 2,    // 極端距離（大遠景）
  PHYSICAL_ANGLE = 3,      // 物理視角（蟲視、鳥瞰）
  LENS_FOCAL = 4,          // 鏡頭焦段（長焦、廣角）
  SUBJECT_STYLE = 5        // 主體與風格
}
```

### 問題：視覺風格應該放在哪裡？

#### 方案 A：視覺風格放在最前面（第 0 層）❌

```
[Sin City style] → [Fisheye lens] → [Rembrandt lighting] → [Subject]
```

**問題**：
- Sin City 的核心是「高對比黑白」，但魚眼會產生「球面扭曲」
- 如果 Sin City 優先，AI 可能會忽略魚眼的物理特性
- 結果：得到一張「直線的」Sin City 風格照片，而不是「扭曲的」魚眼照片

#### 方案 B：視覺風格放在最後面（第 6 層）❌

```
[Fisheye lens] → [Rembrandt lighting] → [Subject] → [Sin City style]
```

**問題**：
- 魚眼和林布蘭光都設定好了，但 Sin City 的「黑白高對比」會被稀釋
- AI 可能會產生「彩色的魚眼照片」，然後只是「有點像 Sin City」
- 結果：風格不夠強烈

#### 方案 C：根據風格類型動態調整優先級 ✅

**核心概念**：視覺風格分為兩類

1. **全局風格（Global Style）**：影響整體色彩、對比、氛圍
   - 例如：Sin City, Film Noir, Cyberpunk, Wes Anderson
   - **優先級：第 0 層（最高）**
   - 原因：這些風格會影響所有其他元素的呈現方式

2. **局部風格（Local Style）**：影響渲染品質、後製效果
   - 例如：Hyper-Realistic, Commercial Photography, Editorial
   - **優先級：第 6 層（最低）**
   - 原因：這些風格是在物理設定完成後的「後製」

### 新的優先級系統（7 層）

```typescript
enum PromptPriorityLevel {
  GLOBAL_STYLE = 0,        // 全局風格（Sin City, Film Noir, Cyberpunk）
  SPECIAL_OPTICS = 1,      // 特殊光學（魚眼、微距）
  EXTREME_DISTANCE = 2,    // 極端距離（大遠景）
  PHYSICAL_ANGLE = 3,      // 物理視角（蟲視、鳥瞰）
  LENS_FOCAL = 4,          // 鏡頭焦段（長焦、廣角）
  LIGHTING = 5,            // 燈光設定（林布蘭光、蝴蝶光）
  SUBJECT_STYLE = 6,       // 主體描述
  LOCAL_STYLE = 7          // 局部風格（Hyper-Realistic, Commercial）
}
```

## 實際案例分析

### 案例 1：魚眼 + Sin City + 林布蘭光

```
輸入：
- 鏡頭：8mm 魚眼
- 視覺風格：Sin City style
- 燈光：林布蘭光 (Rembrandt)
- 主體：Detective in trench coat

輸出順序：
[Sin City style, high contrast black and white, graphic novel aesthetic] →
[Fisheye lens perspective, extreme barrel distortion, 180-degree field of view] →
[Rembrandt lighting, triangle catchlight on cheek, dramatic chiaroscuro] →
[Detective in trench coat, noir atmosphere]

解釋：
1. Sin City 先定義「黑白高對比」的全局色調
2. 魚眼定義「球面扭曲」的空間變形
3. 林布蘭光在「黑白」和「扭曲」的基礎上打光
4. 主體在所有設定完成後呈現
```

### 案例 2：魚眼 + Wes Anderson + 平光

```
輸入：
- 鏡頭：8mm 魚眼
- 視覺風格：Wes Anderson style
- 燈光：平光 (Flat)
- 主體：Symmetrical hotel lobby

輸出順序：
[Wes Anderson style, pastel color palette, symmetrical composition, whimsical aesthetic] →
[Fisheye lens perspective, extreme barrel distortion, centered composition] →
[Flat lighting, even illumination, minimal shadows] →
[Symmetrical hotel lobby, vintage decor]

解釋：
1. Wes Anderson 先定義「粉彩色調」和「對稱美學」
2. 魚眼的「球面扭曲」會讓對稱構圖更有趣
3. 平光確保色彩均勻，沒有戲劇性陰影
4. 主體在所有設定完成後呈現
```

### 案例 3：標準鏡頭 + Hyper-Realistic + 林布蘭光

```
輸入：
- 鏡頭：50mm 標準
- 視覺風格：Hyper-Realistic
- 燈光：林布蘭光 (Rembrandt)
- 主體：Portrait of elderly man

輸出順序：
[Standard lens perspective, zero distortion, rectilinear projection] →
[Rembrandt lighting, triangle catchlight on cheek, dramatic chiaroscuro] →
[Portrait of elderly man, weathered skin, deep wrinkles] →
[Hyper-realistic rendering, ultra-sharp detail, ray tracing]

解釋：
1. 標準鏡頭定義「無變形」的透視
2. 林布蘭光定義「戲劇性」的光影
3. 主體描述
4. Hyper-Realistic 放在最後，作為「後製」指令
```

## 視覺風格分類表

### 全局風格（Global Style）- 優先級 0

這些風格會影響整體色彩、對比、氛圍，必須放在最前面：

| 風格名稱 | 核心特徵 | 為什麼是全局 |
|---------|---------|-------------|
| Sin City | 黑白高對比、圖像小說美學 | 定義整體色調（黑白） |
| Film Noir | 低調照明、陰影、悲觀氛圍 | 定義整體氛圍（黑暗） |
| Cyberpunk | 霓虹色、未來感、反烏托邦 | 定義整體色調（霓虹） |
| Blade Runner | 賽博龐克 + 雨夜 + 霓虹 | 定義整體氛圍（未來黑暗） |
| Wes Anderson | 粉彩色調、對稱構圖、復古 | 定義整體色調（粉彩） |
| Vaporwave | 粉紫色調、80年代復古、夢幻 | 定義整體色調（粉紫） |
| Steampunk | 蒸汽時代、銅色調、機械感 | 定義整體色調（銅色） |
| Art Nouveau | 有機曲線、裝飾性、自然元素 | 定義整體美學（曲線） |

### 局部風格（Local Style）- 優先級 7

這些風格是「後製」指令，放在最後面：

| 風格名稱 | 核心特徵 | 為什麼是局部 |
|---------|---------|-------------|
| Hyper-Realistic | 超精細、光線追蹤、真實感 | 渲染品質指令 |
| Commercial Photography | 乾淨、專業、產品導向 | 攝影類型指令 |
| Editorial Photography | 時尚、雜誌風格、高級感 | 攝影類型指令 |
| Fashion Photography | 時尚、模特兒、服裝焦點 | 攝影類型指令 |
| Product Photography | 產品焦點、乾淨背景、細節 | 攝影類型指令 |
| Conceptual Art | 概念性、藝術性、抽象 | 藝術類型指令 |
| Anime Style | 動漫風格、手繪感、誇張 | 渲染風格指令 |
| Ethereal | 空靈、夢幻、柔和 | 氛圍指令（不影響色調） |

## 實作計畫

### 1. 更新 `types.ts`

```typescript
export enum PromptPriorityLevel {
  GLOBAL_STYLE = 0,        // 新增
  SPECIAL_OPTICS = 1,
  EXTREME_DISTANCE = 2,
  PHYSICAL_ANGLE = 3,
  LENS_FOCAL = 4,
  LIGHTING = 5,            // 新增
  SUBJECT_STYLE = 6,
  LOCAL_STYLE = 7          // 新增
}
```

### 2. 更新 `constants.tsx`

```typescript
// 分類視覺風格
export const GLOBAL_VISUAL_STYLES = [
  'Sin City',
  'Film Noir',
  'Cyberpunk',
  'Blade Runner',
  'Wes Anderson',
  'Vaporwave',
  'Steampunk',
  'Art Nouveau'
];

export const LOCAL_VISUAL_STYLES = [
  'Hyper-Realistic',
  'Commercial Photography',
  'Editorial Photography',
  'Fashion Photography',
  'Product Photography',
  'Conceptual Art',
  'Anime Style',
  'Ethereal'
];

export const VISUAL_STYLES = [
  ...GLOBAL_VISUAL_STYLES,
  ...LOCAL_VISUAL_STYLES
];
```

### 3. 更新 `constants/compatibilityRules.ts`

```typescript
export const PRIORITY_SORTING_RULES: Record<PromptPriorityLevel, string[]> = {
  [PromptPriorityLevel.GLOBAL_STYLE]: [
    'Sin City',
    'Film Noir',
    'Cyberpunk',
    'Blade Runner',
    'Wes Anderson',
    'Vaporwave',
    'Steampunk',
    'Art Nouveau'
  ],
  [PromptPriorityLevel.SPECIAL_OPTICS]: [
    'EXTREME MACRO',
    'FISHEYE LENS',
    'MICROSCOPIC VIEW',
    '1:1 MACRO DETAIL'
  ],
  [PromptPriorityLevel.EXTREME_DISTANCE]: [
    'EXTREME WIDE SHOT',
    'ESTABLISHING SHOT',
    'VERY LONG SHOT'
  ],
  [PromptPriorityLevel.PHYSICAL_ANGLE]: [
    'WORM\'S EYE',
    'BIRD\'S EYE',
    'OVERHEAD',
    'camera positioned at'
  ],
  [PromptPriorityLevel.LENS_FOCAL]: [
    'telephoto',
    'wide angle',
    '35mm',
    '50mm',
    'using'
  ],
  [PromptPriorityLevel.LIGHTING]: [
    'Rembrandt lighting',
    'Butterfly lighting',
    'Split lighting',
    'Loop lighting',
    'Rim lighting',
    'lit by'
  ],
  [PromptPriorityLevel.SUBJECT_STYLE]: [
    'subject',
    'of'
  ],
  [PromptPriorityLevel.LOCAL_STYLE]: [
    'Hyper-Realistic',
    'Commercial Photography',
    'Editorial Photography',
    'rendered in'
  ]
};
```

### 4. 更新 `utils/promptAssembly.ts`

```typescript
export function assembleFinalPrompt(state: PromptState): string {
  const translated = translatePromptState(state);
  const parts: string[] = [];
  
  // 檢查視覺風格類型
  const isGlobalStyle = GLOBAL_VISUAL_STYLES.includes(state.style.visualStyle);
  
  // ========================================
  // SECTION 0: Global Visual Style (如果有)
  // ========================================
  if (isGlobalStyle && translated.composition.includes(state.style.visualStyle)) {
    // 從 composition 中提取並移到最前面
    const styleDesc = extractStyleDescription(translated.composition, state.style.visualStyle);
    parts.push(styleDesc);
  }
  
  // ========================================
  // SECTION 1: Camera Setup (已包含特殊光學、角度、鏡頭)
  // ========================================
  if (translated.composition) {
    // 移除已經提取的 global style
    const compositionWithoutGlobalStyle = isGlobalStyle 
      ? removeStyleFromComposition(translated.composition, state.style.visualStyle)
      : translated.composition;
    parts.push(compositionWithoutGlobalStyle);
  }
  
  // ========================================
  // SECTION 2: Subject Details
  // ========================================
  if (translated.subject) {
    parts.push(`of ${translated.subject}`);
  }
  
  // ========================================
  // SECTION 3: Environment
  // ========================================
  if (translated.environment) {
    parts.push(`in ${translated.environment}`);
  }
  
  // ========================================
  // SECTION 4: Lighting
  // ========================================
  if (translated.lighting) {
    parts.push(`lit by ${translated.lighting}`);
  }
  
  // ========================================
  // SECTION 5: Mood + Local Style
  // ========================================
  const finalParts: string[] = [];
  if (translated.mood) {
    finalParts.push(`${translated.mood} mood`);
  }
  
  // Local Style 放在最後
  if (!isGlobalStyle && translated.style) {
    finalParts.push(`rendered in ${translated.style}`);
  }
  
  if (finalParts.length > 0) {
    parts.push(`with ${finalParts.join(', ')}`);
  }
  
  let prompt = parts.join(', ') + '.';
  
  if (state.camera.aspectRatio) {
    prompt += ` --ar ${state.camera.aspectRatio}`;
  }
  
  return prompt;
}
```

## 總結

**魚眼 + Sin City + 林布蘭光 的正確順序：**

```
[Sin City style] → [Fisheye lens] → [Rembrandt lighting] → [Subject]
```

**原因：**
1. Sin City 是**全局風格**，定義整體色調（黑白高對比）
2. 魚眼是**特殊光學**，定義空間變形（球面扭曲）
3. 林布蘭光是**燈光設定**，在黑白和扭曲的基礎上打光
4. 主體在所有設定完成後呈現

這樣 AI 才能正確理解：「用魚眼鏡頭拍攝一張 Sin City 風格的照片，並使用林布蘭光打光」！
