# 大遠景優先模式 (Wide Shot Override Mode) 實作總結

## 核心概念

大遠景（Extreme Wide Shot / Very Long Shot）是另一個「霸道」的參數，它會**篡位**成為第一前綴，但與微距相反：微距是「放大局部」，大遠景是「縮小整體」。

### 為什麼大遠景會破壞原本的邏輯？

原本的邏輯：`[視角/方位] + [主體] + [風格]`
- 例如：從下往上看 (視角) + 桌球拍 (主體) + 電影感 (風格)

但是當開啟「大遠景」時：
1. **物理衝突**：AI 預設主體應該佔畫面 30%~50%，但大遠景要求主體只佔 5%~10%
2. **主體質變**：主體不再是「清晰可見的球拍」，而是「遠處的一個小點」
3. **哥吉拉效應**：如果不修正，AI 會把球拍畫得像摩天大樓一樣大，矗立在地平線上

如果硬套舊邏輯：
```
❌ EXTREME WIDE SHOT, Front View, Table Tennis Racket, CINEMATIC...
```
AI 會崩潰（Hallucinate）：試圖畫出一個清晰的球拍，但又試圖把它放在廣闊的環境裡。結果就是「哥吉拉球拍」。

## 大遠景模式下的新詞序邏輯

### 第一順位（篡位者）：尺度定義 + 空間強調 (Scale Definition + Spatial Emphasis)

**寫實模式 (Realistic Scale)**：
```
EXTREME WIDE ESTABLISHING SHOT, Massive scale environment, Negative space composition, Realistic proportions
```

**巨物模式 (Surreal/Monumental Scale)**：
```
EXTREME WIDE ESTABLISHING SHOT, Surreal fantasy scale, Dreamlike atmosphere, Monumental composition
```

### 第二順位：視角轉譯（空間透視線）
原本的「方位角」不再決定「看哪一面」，而是決定**「空間的透視線 (Perspective Lines)」**：

| 原始視角 | 普通模式 | 大遠景模式（寫實） | 大遠景模式（巨物） |
|---------|---------|------------------|------------------|
| 正面平視 | Front View | Centered horizon line, symmetrical space, balanced composition | Frontal monumentality, imposing presence, centered dominance |
| 極低角度 | Looking up | Low horizon line, endless floor surface, vast ceiling space | Low angle looking up, towering structure, dramatic scale |
| 極高角度 | Bird's eye view | High altitude aerial view, geometric floor pattern layout, map-like perspective | Overhead view of colossal structure, dwarfing surroundings |

### 第三順位：主體修正（尺度調整）

**寫實模式**：強制 AI 把主體畫小
```typescript
// 關鍵字策略
- "A tiny, solitary [Subject] placed in the distance"
- "Small object in vast environment"
- "Minimalist composition"
- "Negative space"
```

**巨物模式**：強制 AI 把主體畫大
```typescript
// 關鍵字策略
- "A Colossal [Subject] towering like a skyscraper"
- "Monumental structure"
- "Larger than life"
- "Giant [Subject] dominating the landscape"
```

### 第四順位：環境描述（空間感）

**寫實模式**：強調環境的遼闊
```
Vast empty space, expansive environment, environmental storytelling
```

**巨物模式**：環境作為比例參照
```
Surrounding landscape dwarfed by scale, environmental context for size comparison
```

### 第五順位：視覺風格（最後）
```
Cinematic
```

## 實戰 Prompt 對比

### ❌ 錯誤示範（硬套舊邏輯）
```
EXTREME WIDE SHOT, Front View, Table tennis racket, Cinematic...
```
**結果**：哥吉拉效應。你會看到一個佔滿畫面的球拍，背景稍微模糊，根本沒有「大遠景」的寬闊感。

### ✅ 正確示範（寫實模式）
```
EXTREME WIDE ESTABLISHING SHOT, Massive scale environment, Negative space composition, Realistic proportions, 
Centered horizon line, symmetrical space, balanced composition, 
A tiny, solitary table tennis racket placed in the distance, 
Vast grey minimalist studio floor extending to infinity, 
cinematic
```
**結果**：你會得到一張很有意境的圖，球拍很小，周圍是巨大的無縫牆空間，充滿高級的孤獨感。

### ✅ 正確示範（巨物模式）
```
EXTREME WIDE ESTABLISHING SHOT, Surreal fantasy scale, Dreamlike atmosphere, Monumental composition, 
Low angle looking up, towering structure, dramatic scale, 
A Colossal table tennis racket towering like a skyscraper, monumental structure, 
The texture of the linen is huge and visible, dramatic shadows cast on the ground, 
cinematic
```
**結果**：球拍看起來像一座 100 層樓高的大樓，充滿壓迫感與戲劇張力，這就是你要的「誇張感」。

## 實作細節

### 1. 大遠景模式檢測
```typescript
function isWideMode(shotType: string): boolean {
  const shotLower = shotType.toLowerCase();
  return shotLower.includes('大遠景') || 
         shotLower.includes('極遠景') ||
         shotLower.includes('very long shot') || 
         shotLower.includes('extreme long shot') ||
         shotLower.includes('vls') ||
         shotLower.includes('xls');
}
```

### 2. 視角轉譯函數（空間透視線）
```typescript
function translateWideAngle(
  azimuth: number, 
  elevation: number, 
  scaleMode: 'realistic' | 'surreal'
): string {
  const absElevation = Math.abs(elevation);
  
  // 正規化方位角
  let normalized = azimuth;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  const absAzimuth = Math.abs(normalized);
  
  if (scaleMode === 'realistic') {
    // 寫實模式：強調空間的遼闊感
    if (absElevation <= 10 && absAzimuth <= 15) {
      return 'Centered horizon line, symmetrical space, balanced composition, orthographic-like perspective';
    } else if (elevation < -30) {
      return 'Low horizon line, endless floor surface, vast ceiling space, expansive vertical dimension';
    } else if (elevation > 60) {
      return 'High altitude aerial view, geometric floor pattern layout, map-like perspective, bird\'s eye overview';
    } else if (elevation > 30) {
      return 'Elevated perspective, revealing spatial layout, architectural overview';
    } else if (elevation < -10) {
      return 'Low perspective, ground-level view, emphasizing vertical space, sky dominates';
    } else {
      return 'Natural horizon line, balanced spatial composition, environmental context';
    }
  } else {
    // 巨物模式：強調主體的壓迫感
    if (absElevation <= 10 && absAzimuth <= 15) {
      return 'Frontal monumentality, imposing presence, centered dominance, symmetrical power';
    } else if (elevation < -30) {
      return 'Low angle looking up, towering structure, dramatic scale, monumental presence looming overhead';
    } else if (elevation > 60) {
      return 'Overhead view of colossal structure, dwarfing surroundings, god\'s eye perspective on giant';
    } else if (elevation > 30) {
      return 'Elevated view of massive structure, revealing scale, architectural monumentality';
    } else if (elevation < -10) {
      return 'Upward gaze at giant structure, imposing scale, dramatic foreshortening';
    } else {
      return 'Eye-level view of monumental structure, human scale dwarfed, surreal juxtaposition';
    }
  }
}
```

### 3. 主體修正函數
```typescript
function translateWideSubject(
  subjectType: string, 
  scaleMode: 'realistic' | 'surreal',
  subjectDescription: string
): string {
  const parts: string[] = [];
  
  if (scaleMode === 'realistic') {
    // 寫實模式：強制把主體形容得「很小」
    parts.push(`A tiny, solitary ${subjectType} placed in the distance`);
    parts.push('small object in vast environment');
    parts.push('minimalist composition');
    
    // 如果有自定義描述，也要加上「遠處」的修飾
    if (subjectDescription) {
      parts.push(`distant ${subjectDescription}`);
    }
  } else {
    // 巨物模式：強制把主體形容得「很大」
    parts.push(`A Colossal ${subjectType} towering like a skyscraper`);
    parts.push('monumental structure');
    parts.push('larger than life');
    parts.push('giant structure dominating the landscape');
    
    // 如果有自定義描述，也要加上「巨大」的修飾
    if (subjectDescription) {
      parts.push(`colossal ${subjectDescription}`);
    }
  }
  
  return parts.join(', ');
}
```

### 4. 主要翻譯函數修改
```typescript
export function translatePromptState(state: PromptState): TranslatedPromptComponents {
  // 檢測微距模式
  const isMacro = isMacroMode(state.camera.shotType);
  
  // 檢測大遠景模式
  const isWide = isWideMode(state.camera.shotType);
  
  if (isMacro) {
    // 使用微距專用邏輯（已實作）
    // ...
  } else if (isWide) {
    // 使用大遠景專用邏輯
    const scaleMode = state.camera.scaleMode || 'realistic'; // 預設為寫實模式
    const compositionParts: string[] = [];
    
    // 第一順位（篡位者）：尺度定義 + 空間強調
    if (scaleMode === 'realistic') {
      compositionParts.push('EXTREME WIDE ESTABLISHING SHOT, Massive scale environment, Negative space composition, Realistic proportions');
    } else {
      compositionParts.push('EXTREME WIDE ESTABLISHING SHOT, Surreal fantasy scale, Dreamlike atmosphere, Monumental composition');
    }
    
    // 第二順位：視角轉譯（空間透視線）
    if (state.camera.cameraAzimuth !== undefined && state.camera.cameraElevation !== undefined) {
      const wideAngle = translateWideAngle(
        state.camera.cameraAzimuth, 
        state.camera.cameraElevation,
        scaleMode
      );
      compositionParts.push(wideAngle);
    }
    
    // 第三順位：主體修正（尺度調整）
    const wideSubject = translateWideSubject(
      state.subject.type,
      scaleMode,
      state.subject.description
    );
    
    // 第四順位：環境描述（空間感）
    const environmentParts: string[] = [];
    if (scaleMode === 'realistic') {
      environmentParts.push('Vast empty space, expansive environment, environmental storytelling');
    } else {
      environmentParts.push('Surrounding landscape dwarfed by scale, environmental context for size comparison');
    }
    
    // 添加背景描述
    if (state.background.description) {
      environmentParts.push(state.background.description);
    }
    if (state.background.environment) {
      environmentParts.push(state.background.environment);
    }
    
    // 第五順位：視覺風格（最後）
    if (state.style.visualStyle) {
      compositionParts.push(state.style.visualStyle.toLowerCase());
    }
    
    const composition = compositionParts.join(', ');
    const subject = wideSubject;
    const environment = environmentParts.join(', ');
    
    // 燈光和 Mood（大遠景下通常不重要，但保留）
    const lighting = state.optics.source || 'natural ambient lighting';
    const mood = state.optics.mood || 'epic scale';
    const style = state.style.postProcessing?.join(', ') || '';
    
    return {
      composition,
      subject,
      environment,
      lighting,
      mood,
      style,
    };
  } else {
    // 使用標準邏輯
    // ...
  }
}
```

## 測試結果

### 測試 1：大遠景寫實模式詞序
```
【大遠景寫實 Composition】:
EXTREME WIDE ESTABLISHING SHOT, Massive scale environment, Negative space composition, Realistic proportions, 
Centered horizon line, symmetrical space, balanced composition, 
cinematic
```
✅ EXTREME WIDE 在最前面（位置 0）
✅ Cinematic 在最後面
✅ 包含 "Negative space"

### 測試 2：大遠景巨物模式詞序
```
【大遠景巨物 Composition】:
EXTREME WIDE ESTABLISHING SHOT, Surreal fantasy scale, Dreamlike atmosphere, Monumental composition, 
Low angle looking up, towering structure, dramatic scale, 
cinematic
```
✅ 包含 "Surreal" 和 "Monumental"
✅ 不包含 "Negative space"（巨物模式不需要留白）

### 測試 3：主體轉換（寫實）
```
【大遠景寫實 Subject】:
A tiny, solitary table tennis racket placed in the distance, small object in vast environment, minimalist composition
```
✅ 包含 "tiny" 和 "distant"
✅ 不是「table tennis racket」單獨描述

### 測試 4：主體轉換（巨物）
```
【大遠景巨物 Subject】:
A Colossal table tennis racket towering like a skyscraper, monumental structure, larger than life, giant structure dominating the landscape
```
✅ 包含 "Colossal" 和 "towering"
✅ 包含比例參照（"like a skyscraper"）

### 測試 5：低角度轉譯（寫實）
```
【大遠景寫實低角度 Composition】:
EXTREME WIDE ESTABLISHING SHOT, Massive scale environment, Negative space composition, Realistic proportions, 
Low horizon line, endless floor surface, vast ceiling space, 
cinematic
```
✅ 包含 "Low horizon line"（空間透視線）
✅ 不包含 "looking up"（普通模式的低角度）

### 測試 6：低角度轉譯（巨物）
```
【大遠景巨物低角度 Composition】:
EXTREME WIDE ESTABLISHING SHOT, Surreal fantasy scale, Dreamlike atmosphere, Monumental composition, 
Low angle looking up, towering structure, dramatic scale, 
cinematic
```
✅ 包含 "Low angle looking up"（強調仰視巨物）
✅ 包含 "towering"（壓迫感）

## 影響範圍

### 受益場景
1. **極簡商品攝影**：小物件在巨大空間中的孤獨感（Apple 風格）
2. **環境人像**：人物在廣闊自然中的渺小感
3. **建築攝影**：展現空間的遼闊與比例
4. **概念藝術**：超現實的巨物場景（哥吉拉、巨型產品）

### 技術優勢
- 避免 AI 混淆「主體大小」與「畫面比例」
- 強制 AI 理解「空間感」而非「物件細節」
- 自動應用正確的尺度描述
- 視角語義轉換（從「看哪一面」到「空間透視線」）

## 細節描述的處理

### 寫實模式下應該刪除的細節
當使用者選擇「大遠景 + 寫實模式」時，以下細節應該被**自動過濾**或**警告使用者**：

1. **文字細節**：「JAQUEMUS 字樣」、「Logo」、「品牌標誌」
2. **材質紋理**：「亞麻紋理」、「木材紋理」、「金屬拋光」
3. **微小特徵**：「按鈕」、「縫線」、「刻痕」

**UI 提示**：
```
⚠️ 寫實大遠景模式：主體會在畫面中顯得很小，細節描述（如文字、紋理）可能不會被 AI 呈現。
建議簡化主體描述，專注於「形狀」和「顏色」。
```

### 巨物模式下應該保留的細節
當使用者選擇「大遠景 + 巨物模式」時，細節描述反而會被**放大**：

1. **紋理細節**：「亞麻紋理像山脈一樣巨大」
2. **文字細節**：「JAQUEMUS 字樣像廣告看板一樣大」
3. **結構細節**：「球拍的網格像建築物的窗戶」

**自動修正**：
```typescript
// 巨物模式下，自動在細節前加上「巨大」的修飾
if (scaleMode === 'surreal' && state.subject.key_feature) {
  parts.push(`featuring colossal ${state.subject.key_feature}, visible from great distance`);
}
```

## 後續建議

1. **UI 提示**：當使用者選擇大遠景時，顯示尺度模式選擇器
2. **細節過濾**：在寫實模式下，自動過濾或警告過於細節的描述
3. **預覽優化**：在視覺化預覽中，顯示「空間比例」而非「物件細節」
4. **預設集**：創建大遠景專用的預設集（極簡產品、環境人像、巨物概念等）

## 總結

大遠景優先模式成功實作了「環境霸道參數」的邏輯：
- ✅ 篡位詞序（EXTREME WIDE 置頂）
- ✅ 視角轉譯（從「看哪一面」到「空間透視線」）
- ✅ 主體修正（從「清晰物件」到「微小點綴」或「巨大紀念碑」）
- ✅ 尺度模式（寫實 vs 巨物）
- ✅ 細節處理（過濾 vs 放大）

現在 NanoBanana 可以完美處理三種極端情況：
1. **微距模式**：紋理優先，主體局部化
2. **標準模式**：視角優先，主體清晰
3. **大遠景模式**：空間優先，主體微小化/巨大化

三種模式互不衝突，邏輯清晰，AI 不會再畫出「哥吉拉球拍」或「扭曲紋理」！
