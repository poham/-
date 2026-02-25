# 鏡頭-角度相容性系統設計文檔

## 1. 系統架構概覽

### 1.1 核心設計原則

1. **非侵入性**: 在現有 `visualTranslators.ts` 基礎上擴展，不破壞現有邏輯
2. **分層設計**: 規則定義、檢查邏輯、UI 顯示三層分離
3. **可擴展性**: 易於新增新的相容性規則
4. **效能優先**: 使用快取機制，避免重複計算

### 1.2 系統流程圖

```
使用者輸入 (Camera Config)
    ↓
相容性檢查器 (Compatibility Checker)
    ↓
衝突檢測 (Conflict Detection)
    ↓
自動修正 (Auto Correction)
    ↓
優先級排序 (Priority Sorting)
    ↓
Prompt 組裝 (Prompt Assembly)
    ↓
輸出到 Protocol Deck
```

## 2. 資料結構設計

### 2.1 類型定義 (types.ts 擴展)


```typescript
// 優先級層級
export enum PromptPriorityLevel {
  SPECIAL_OPTICS = 1,      // 特殊光學（魚眼、微距）
  EXTREME_DISTANCE = 2,    // 極端距離（大遠景）
  PHYSICAL_ANGLE = 3,      // 物理視角（蟲視、鳥瞰）
  LENS_FOCAL = 4,          // 鏡頭焦段（長焦、廣角）
  SUBJECT_STYLE = 5        // 主體與風格
}

// 警告類型
export enum WarningType {
  CONFLICT = 'conflict',        // 物理衝突（紅色）
  SUBOPTIMAL = 'suboptimal',    // 效果不佳（橘色）
  SUGGESTION = 'suggestion'     // 建議（藍色）
}

// 相容性警告
export interface CompatibilityWarning {
  type: WarningType;
  message: string;
  suggestion?: string;
  affectedParams: string[];
}

// 相容性檢查結果
export interface CompatibilityCheckResult {
  isCompatible: boolean;
  warnings: CompatibilityWarning[];
  autoCorrections: AutoCorrection[];
  priorityOrder: PromptPriorityLevel[];
}

// 自動修正
export interface AutoCorrection {
  action: 'add' | 'remove' | 'replace';
  target: string;
  value?: string;
  reason: string;
}

// 鏡頭類型檢測
export type LensType = 'fisheye' | 'wide' | 'normal' | 'telephoto' | 'macro';

// 角度類型檢測
export type AngleType = 'worms-eye' | 'low' | 'eye-level' | 'high' | 'birds-eye';
```



### 2.2 相容性規則定義 (constants/compatibilityRules.ts)

```typescript
// 鏡頭檢測規則
export const LENS_DETECTION_RULES = {
  fisheye: ['fisheye', '魚眼', '8mm', '10mm'],
  wide: ['wide angle', '廣角', '14mm', '16mm', '18mm', '24mm'],
  normal: ['35mm', '50mm', 'normal', '標準'],
  telephoto: ['telephoto', '長焦', '85mm', '100mm', '135mm', '200mm'],
  macro: ['macro', '微距', 'extreme close']
};

// 角度檢測規則（基於 elevation）
export const ANGLE_DETECTION_RULES = {
  'worms-eye': (elevation: number) => elevation < -45,
  'low': (elevation: number) => elevation >= -45 && elevation < -15,
  'eye-level': (elevation: number) => elevation >= -15 && elevation <= 15,
  'high': (elevation: number) => elevation > 15 && elevation <= 60,
  'birds-eye': (elevation: number) => elevation > 60
};

// 魚眼相容性規則
export const FISHEYE_RULES = {
  mustAdd: [
    'centered composition',
    'distorted edges',
    'sphere projection'
  ],
  mustRemove: [
    'architectural',
    'straight lines',
    'zero distortion',
    'perspective correction'
  ],
  conflicts: [
    {
      condition: 'architectural',
      warning: '魚眼鏡頭會產生嚴重變形，不適合建築攝影',
      type: WarningType.CONFLICT
    }
  ]
};
```



// 長焦相容性規則
export const TELEPHOTO_RULES = {
  mustAdd: [
    'compressed perspective',
    'flat distinct layers',
    'zero distortion'
  ],
  mustRemove: [
    'dynamic perspective',
    'foreshortening',
    'wide angle',
    'exaggerated depth'
  ],
  specialCombinations: [
    {
      angle: 'worms-eye',
      warning: '長焦 + 蟲視會削弱仰角張力，產生「狙擊手視角」',
      type: WarningType.SUBOPTIMAL,
      suggestion: '建議切換為廣角鏡頭以增強透視感',
      autoAdd: ['flattened perspective', 'isometric-like low angle']
    },
    {
      angle: 'birds-eye',
      warning: '長焦 + 鳥瞰會產生「衛星地圖視角」',
      type: WarningType.SUGGESTION,
      suggestion: '適合 SimCity 風格的遊戲圖',
      autoAdd: ['graphic composition', 'map-like perspective']
    }
  ]
};

// 廣角相容性規則
export const WIDE_ANGLE_RULES = {
  mustAdd: [
    'dynamic perspective',
    'foreshortening',
    'exaggerated depth'
  ],
  mustRemove: [
    'compressed perspective',
    'flat layers',
    'zero distortion'
  ],
  recommendations: [
    {
      angle: 'worms-eye',
      message: '廣角 + 蟲視 = 最佳英雄感與張力',
      type: WarningType.SUGGESTION
    }
  ]
};
```



// 微距特殊規則
export const MACRO_RULES = {
  angleTranslation: {
    'eye-level': 'flat lay macro, texture pattern scan',
    'low': 'macro landscape, raking light showing surface relief, mountains of texture',
    'high': 'top-down macro view, flat texture pattern, knolling-style arrangement'
  },
  depthOfField: {
    default: [
      'razor thin DoF',
      'millimeter-thin focus plane',
      'background completely dissolved'
    ],
    deepFocus: [
      'f/22 aperture',
      'deep depth of field',
      'focus stacking',
      'entire subject in focus'
    ]
  }
};

// 優先級排序規則
export const PRIORITY_SORTING_RULES = {
  [PromptPriorityLevel.SPECIAL_OPTICS]: [
    'EXTREME MACRO',
    'FISHEYE LENS',
    'MICROSCOPIC VIEW'
  ],
  [PromptPriorityLevel.EXTREME_DISTANCE]: [
    'EXTREME WIDE SHOT',
    'ESTABLISHING SHOT'
  ],
  [PromptPriorityLevel.PHYSICAL_ANGLE]: [
    'WORM\'S EYE',
    'BIRD\'S EYE',
    'OVERHEAD'
  ],
  [PromptPriorityLevel.LENS_FOCAL]: [
    'telephoto',
    'wide angle',
    '35mm'
  ],
  [PromptPriorityLevel.SUBJECT_STYLE]: [
    'subject',
    'cinematic',
    'lighting'
  ]
};
```



## 3. 核心函數設計

### 3.1 鏡頭類型檢測 (utils/lensAngleCompatibility.ts)

```typescript
/**
 * 檢測鏡頭類型
 * @param focalLength - 焦距字串（如 "35mm", "Telephoto"）
 * @param shotType - 取景類型（用於檢測微距）
 * @returns 鏡頭類型
 */
export function detectLensType(
  focalLength: string, 
  shotType: string
): LensType {
  const lensLower = focalLength.toLowerCase();
  const shotLower = shotType.toLowerCase();
  
  // 優先檢測特殊鏡頭
  if (shotLower.includes('macro') || shotLower.includes('微距')) {
    return 'macro';
  }
  
  for (const [type, keywords] of Object.entries(LENS_DETECTION_RULES)) {
    if (keywords.some(keyword => lensLower.includes(keyword.toLowerCase()))) {
      return type as LensType;
    }
  }
  
  return 'normal';
}

/**
 * 檢測角度類型
 * @param elevation - 仰角（-90 到 90）
 * @returns 角度類型
 */
export function detectAngleType(elevation: number): AngleType {
  for (const [type, checkFn] of Object.entries(ANGLE_DETECTION_RULES)) {
    if (checkFn(elevation)) {
      return type as AngleType;
    }
  }
  return 'eye-level';
}
```



### 3.2 相容性檢查核心函數

```typescript
/**
 * 執行完整的相容性檢查
 * @param state - 完整的 PromptState
 * @returns 檢查結果，包含警告和自動修正
 */
export function checkCompatibility(
  state: PromptState
): CompatibilityCheckResult {
  const lensType = detectLensType(state.camera.lens, state.camera.shotType);
  const angleType = detectAngleType(state.camera.cameraElevation ?? 0);
  
  const warnings: CompatibilityWarning[] = [];
  const autoCorrections: AutoCorrection[] = [];
  
  // 檢查魚眼相容性
  if (lensType === 'fisheye') {
    const fisheyeResult = checkFisheyeCompatibility(state, angleType);
    warnings.push(...fisheyeResult.warnings);
    autoCorrections.push(...fisheyeResult.corrections);
  }
  
  // 檢查長焦相容性
  if (lensType === 'telephoto') {
    const telephotoResult = checkTelephotoCompatibility(state, angleType);
    warnings.push(...telephotoResult.warnings);
    autoCorrections.push(...telephotoResult.corrections);
  }
  
  // 檢查廣角相容性
  if (lensType === 'wide') {
    const wideResult = checkWideAngleCompatibility(state, angleType);
    warnings.push(...wideResult.warnings);
    autoCorrections.push(...wideResult.corrections);
  }
  
  // 檢查微距特殊邏輯
  if (lensType === 'macro') {
    const macroResult = checkMacroCompatibility(state, angleType);
    warnings.push(...macroResult.warnings);
    autoCorrections.push(...macroResult.corrections);
  }
  
  return {
    isCompatible: warnings.filter(w => w.type === WarningType.CONFLICT).length === 0,
    warnings,
    autoCorrections,
    priorityOrder: determinePriorityOrder(lensType, state)
  };
}
```



### 3.3 魚眼相容性檢查

```typescript
function checkFisheyeCompatibility(
  state: PromptState,
  angleType: AngleType
): { warnings: CompatibilityWarning[]; corrections: AutoCorrection[] } {
  const warnings: CompatibilityWarning[] = [];
  const corrections: AutoCorrection[] = [];
  
  // 檢查衝突關鍵字
  const promptText = JSON.stringify(state).toLowerCase();
  
  FISHEYE_RULES.conflicts.forEach(conflict => {
    if (promptText.includes(conflict.condition)) {
      warnings.push({
        type: conflict.type,
        message: conflict.warning,
        affectedParams: ['lens', 'style']
      });
      
      // 自動移除衝突關鍵字
      corrections.push({
        action: 'remove',
        target: conflict.condition,
        reason: '魚眼鏡頭與此參數物理衝突'
      });
    }
  });
  
  // 自動添加必要關鍵字
  FISHEYE_RULES.mustAdd.forEach(keyword => {
    corrections.push({
      action: 'add',
      target: 'composition',
      value: keyword,
      reason: '魚眼鏡頭必須包含此特性'
    });
  });
  
  // 推薦組合提示
  if (angleType === 'worms-eye' || angleType === 'birds-eye') {
    warnings.push({
      type: WarningType.SUGGESTION,
      message: `魚眼 + ${angleType === 'worms-eye' ? '蟲視' : '鳥瞰'} = 極具張力的視覺效果`,
      suggestion: '這是推薦的組合，無需調整',
      affectedParams: ['lens', 'angle']
    });
  }
  
  return { warnings, corrections };
}
```



### 3.4 長焦相容性檢查

```typescript
function checkTelephotoCompatibility(
  state: PromptState,
  angleType: AngleType
): { warnings: CompatibilityWarning[]; corrections: AutoCorrection[] } {
  const warnings: CompatibilityWarning[] = [];
  const corrections: AutoCorrection[] = [];
  
  // 自動移除衝突關鍵字
  TELEPHOTO_RULES.mustRemove.forEach(keyword => {
    corrections.push({
      action: 'remove',
      target: keyword,
      reason: '長焦鏡頭會產生壓縮透視，與此關鍵字衝突'
    });
  });
  
  // 自動添加必要關鍵字
  TELEPHOTO_RULES.mustAdd.forEach(keyword => {
    corrections.push({
      action: 'add',
      target: 'lens_description',
      value: keyword,
      reason: '長焦鏡頭的特性描述'
    });
  });
  
  // 檢查特殊組合
  const specialCombo = TELEPHOTO_RULES.specialCombinations.find(
    combo => combo.angle === angleType
  );
  
  if (specialCombo) {
    warnings.push({
      type: specialCombo.type,
      message: specialCombo.warning,
      suggestion: specialCombo.suggestion,
      affectedParams: ['lens', 'angle']
    });
    
    // 自動添加補償關鍵字
    specialCombo.autoAdd.forEach(keyword => {
      corrections.push({
        action: 'add',
        target: 'angle_description',
        value: keyword,
        reason: '補償長焦 + 極端角度的視覺效果'
      });
    });
  }
  
  return { warnings, corrections };
}
```



### 3.5 微距特殊邏輯

```typescript
function checkMacroCompatibility(
  state: PromptState,
  angleType: AngleType
): { warnings: CompatibilityWarning[]; corrections: AutoCorrection[] } {
  const warnings: CompatibilityWarning[] = [];
  const corrections: AutoCorrection[] = [];
  
  // 角度轉譯
  const angleTranslation = MACRO_RULES.angleTranslation[angleType];
  if (angleTranslation) {
    corrections.push({
      action: 'replace',
      target: 'angle_description',
      value: angleTranslation,
      reason: '微距模式下，角度描述轉換為光影與質感起伏'
    });
  }
  
  // 景深處理
  const wantsDeepFocus = state.optics.dof && 
    (state.optics.dof === 'f/16' || state.optics.dof === 'f/22');
  
  if (wantsDeepFocus) {
    // 使用者想要深景深
    MACRO_RULES.depthOfField.deepFocus.forEach(keyword => {
      corrections.push({
        action: 'add',
        target: 'depth_of_field',
        value: keyword,
        reason: '微距深景深需要焦點合成技術'
      });
    });
    
    warnings.push({
      type: WarningType.SUGGESTION,
      message: '微距模式下，深景深需要「焦點合成」技術',
      suggestion: '已自動添加 Focus stacking 關鍵字',
      affectedParams: ['dof', 'lens']
    });
  } else {
    // 預設淺景深
    MACRO_RULES.depthOfField.default.forEach(keyword => {
      corrections.push({
        action: 'add',
        target: 'depth_of_field',
        value: keyword,
        reason: '微距模式的物理特性'
      });
    });
  }
  
  return { warnings, corrections };
}
```



### 3.6 優先級排序

```typescript
/**
 * 決定 Prompt 組件的優先級順序
 * @param lensType - 鏡頭類型
 * @param state - 完整狀態
 * @returns 優先級順序陣列
 */
function determinePriorityOrder(
  lensType: LensType,
  state: PromptState
): PromptPriorityLevel[] {
  const order: PromptPriorityLevel[] = [];
  
  // Level 1: 特殊光學（魚眼、微距）
  if (lensType === 'fisheye' || lensType === 'macro') {
    order.push(PromptPriorityLevel.SPECIAL_OPTICS);
  }
  
  // Level 2: 極端距離（大遠景）
  if (isWideMode(state.camera.shotType)) {
    order.push(PromptPriorityLevel.EXTREME_DISTANCE);
  }
  
  // Level 3: 物理視角
  order.push(PromptPriorityLevel.PHYSICAL_ANGLE);
  
  // Level 4: 鏡頭焦段
  order.push(PromptPriorityLevel.LENS_FOCAL);
  
  // Level 5: 主體與風格
  order.push(PromptPriorityLevel.SUBJECT_STYLE);
  
  return order;
}

/**
 * 應用優先級排序到 Prompt 組件
 * @param components - 原始 Prompt 組件
 * @param priorityOrder - 優先級順序
 * @returns 排序後的 Prompt 組件
 */
export function applyPrioritySorting(
  components: string[],
  priorityOrder: PromptPriorityLevel[]
): string[] {
  const sorted: string[] = [];
  
  priorityOrder.forEach(level => {
    const keywords = PRIORITY_SORTING_RULES[level];
    components.forEach(component => {
      if (keywords.some(keyword => 
        component.toLowerCase().includes(keyword.toLowerCase())
      )) {
        sorted.push(component);
      }
    });
  });
  
  // 添加未匹配的組件（保持原順序）
  components.forEach(component => {
    if (!sorted.includes(component)) {
      sorted.push(component);
    }
  });
  
  return sorted;
}
```



## 4. 整合到 visualTranslators.ts

### 4.1 修改 translatePromptState 函數

```typescript
export function translatePromptState(state: PromptState): TranslatedPromptComponents {
  // 步驟 1: 執行相容性檢查
  const compatibilityResult = checkCompatibility(state);
  
  // 步驟 2: 應用自動修正
  const correctedState = applyAutoCorrections(state, compatibilityResult.autoCorrections);
  
  // 步驟 3: 執行原有的翻譯邏輯（使用修正後的 state）
  const components = translatePromptStateOriginal(correctedState);
  
  // 步驟 4: 應用優先級排序
  const sortedComposition = applyPrioritySorting(
    components.composition.split(', '),
    compatibilityResult.priorityOrder
  ).join(', ');
  
  return {
    ...components,
    composition: sortedComposition,
    // 附加相容性資訊（供 UI 使用）
    _compatibility: compatibilityResult
  };
}

/**
 * 應用自動修正到 state
 */
function applyAutoCorrections(
  state: PromptState,
  corrections: AutoCorrection[]
): PromptState {
  let correctedState = { ...state };
  
  corrections.forEach(correction => {
    switch (correction.action) {
      case 'add':
        // 添加關鍵字到對應位置
        break;
      case 'remove':
        // 移除衝突關鍵字
        break;
      case 'replace':
        // 替換描述
        break;
    }
  });
  
  return correctedState;
}
```



## 5. UI 整合設計

### 5.1 Camera Section 警告顯示

在 `CameraSection.tsx` 的鏡頭選擇器下方添加警告區塊：

```tsx
{/* 相容性警告顯示 */}
{compatibilityWarnings.length > 0 && (
  <div className="space-y-3 mt-4">
    {compatibilityWarnings.map((warning, index) => (
      <div
        key={index}
        className={`p-4 rounded-xl border-2 ${
          warning.type === 'conflict'
            ? 'bg-red-500/15 border-red-400/50'
            : warning.type === 'suboptimal'
            ? 'bg-orange-500/15 border-orange-400/50'
            : 'bg-blue-500/15 border-blue-400/50'
        }`}
      >
        <p className="text-[14px] font-black mb-2">
          {warning.type === 'conflict' ? '⚠️ 衝突警告' : 
           warning.type === 'suboptimal' ? '⚡ 效果提示' : 
           '💡 建議'}
        </p>
        <p className="text-[13px] text-slate-300 leading-relaxed">
          {warning.message}
        </p>
        {warning.suggestion && (
          <p className="text-[12px] text-slate-400 mt-2">
            建議：{warning.suggestion}
          </p>
        )}
      </div>
    ))}
  </div>
)}
```

### 5.2 微距模式焦點合成選項

在光圈控制下方添加焦點合成開關（僅微距模式顯示）：

```tsx
{isMacroMode && (
  <div className="mt-4 p-4 bg-slate-900/40 rounded-xl border border-slate-800">
    <div className="flex items-center justify-between mb-3">
      <label className="text-[14px] font-black text-white">
        焦點合成模式
      </label>
      <button
        onClick={() => toggleFocusStacking()}
        className={`px-4 py-2 rounded-lg font-black text-[13px] ${
          focusStacking
            ? 'bg-green-600 text-white'
            : 'bg-slate-700 text-slate-400'
        }`}
      >
        {focusStacking ? '已啟用' : '已關閉'}
      </button>
    </div>
    <p className="text-[12px] text-slate-400 leading-relaxed">
      微距模式預設景深極淺。啟用焦點合成可看清更多細節。
    </p>
  </div>
)}
```



### 5.3 Protocol Deck 優化顯示

在 `ProtocolDeck.tsx` 中顯示相容性分析：

```tsx
{/* 相容性分析區塊 */}
{compatibilityResult && (
  <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
    <h4 className="text-[14px] font-black text-step-camera-light uppercase tracking-widest">
      相容性分析
    </h4>
    
    {/* 優先級層級顯示 */}
    <div className="space-y-2">
      <p className="text-[12px] text-slate-400">Prompt 優先級順序：</p>
      <div className="flex flex-wrap gap-2">
        {compatibilityResult.priorityOrder.map((level, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-step-camera/10 text-step-camera-light text-[11px] font-black rounded-lg border border-step-camera/20"
          >
            Level {level}
          </span>
        ))}
      </div>
    </div>
    
    {/* 自動修正顯示 */}
    {compatibilityResult.autoCorrections.length > 0 && (
      <div className="space-y-2">
        <p className="text-[12px] text-slate-400">自動修正：</p>
        <div className="space-y-1">
          {compatibilityResult.autoCorrections.map((correction, index) => (
            <div
              key={index}
              className="text-[11px] text-slate-300 flex items-start gap-2"
            >
              <span className={`${
                correction.action === 'add' ? 'text-green-400' :
                correction.action === 'remove' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {correction.action === 'add' ? '+ 添加' :
                 correction.action === 'remove' ? '- 移除' :
                 '↔ 替換'}
              </span>
              <span>{correction.value || correction.target}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}
```



## 6. 測試策略

### 6.1 單元測試 (utils/lensAngleCompatibility.test.ts)

```typescript
describe('Lens-Angle Compatibility System', () => {
  describe('Lens Type Detection', () => {
    it('should detect fisheye lens', () => {
      expect(detectLensType('Fisheye 8mm', '')).toBe('fisheye');
    });
    
    it('should detect telephoto lens', () => {
      expect(detectLensType('200mm', '')).toBe('telephoto');
    });
    
    it('should detect macro from shot type', () => {
      expect(detectLensType('50mm', 'Extreme Macro')).toBe('macro');
    });
  });
  
  describe('Angle Type Detection', () => {
    it('should detect worms-eye view', () => {
      expect(detectAngleType(-60)).toBe('worms-eye');
    });
    
    it('should detect birds-eye view', () => {
      expect(detectAngleType(75)).toBe('birds-eye');
    });
  });
  
  describe('Fisheye Compatibility', () => {
    it('should add centered composition', () => {
      const state = createMockState({ lens: 'Fisheye' });
      const result = checkCompatibility(state);
      
      expect(result.autoCorrections).toContainEqual(
        expect.objectContaining({
          action: 'add',
          value: 'centered composition'
        })
      );
    });
    
    it('should remove architectural keywords', () => {
      const state = createMockState({ 
        lens: 'Fisheye',
        style: { visualStyle: 'architectural' }
      });
      const result = checkCompatibility(state);
      
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          type: WarningType.CONFLICT
        })
      );
    });
  });
  
  describe('Telephoto Compatibility', () => {
    it('should warn about telephoto + worms-eye', () => {
      const state = createMockState({ 
        lens: 'Telephoto 200mm',
        elevation: -60
      });
      const result = checkCompatibility(state);
      
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          type: WarningType.SUBOPTIMAL,
          message: expect.stringContaining('狙擊手視角')
        })
      );
    });
  });
  
  describe('Macro Compatibility', () => {
    it('should translate angle to texture description', () => {
      const state = createMockState({ 
        shotType: 'Extreme Macro',
        elevation: -30
      });
      const result = checkCompatibility(state);
      
      expect(result.autoCorrections).toContainEqual(
        expect.objectContaining({
          action: 'replace',
          value: expect.stringContaining('raking light')
        })
      );
    });
    
    it('should add focus stacking for deep DOF', () => {
      const state = createMockState({ 
        shotType: 'Extreme Macro',
        dof: 'f/22'
      });
      const result = checkCompatibility(state);
      
      expect(result.autoCorrections).toContainEqual(
        expect.objectContaining({
          value: expect.stringContaining('focus stacking')
        })
      );
    });
  });
  
  describe('Priority Sorting', () => {
    it('should place special optics first', () => {
      const components = [
        'cinematic',
        'FISHEYE LENS',
        'subject',
        'wide angle'
      ];
      const order = [
        PromptPriorityLevel.SPECIAL_OPTICS,
        PromptPriorityLevel.LENS_FOCAL,
        PromptPriorityLevel.SUBJECT_STYLE
      ];
      
      const sorted = applyPrioritySorting(components, order);
      
      expect(sorted[0]).toContain('FISHEYE');
    });
  });
});
```



## 7. 效能優化

### 7.1 快取機制

```typescript
// 快取相容性檢查結果
const compatibilityCache = new Map<string, CompatibilityCheckResult>();

export function checkCompatibilityWithCache(
  state: PromptState
): CompatibilityCheckResult {
  // 生成快取鍵（基於關鍵參數）
  const cacheKey = generateCacheKey(state);
  
  // 檢查快取
  if (compatibilityCache.has(cacheKey)) {
    return compatibilityCache.get(cacheKey)!;
  }
  
  // 執行檢查
  const result = checkCompatibility(state);
  
  // 儲存到快取
  compatibilityCache.set(cacheKey, result);
  
  return result;
}

function generateCacheKey(state: PromptState): string {
  return `${state.camera.lens}_${state.camera.shotType}_${state.camera.cameraElevation}_${state.optics.dof}`;
}
```

### 7.2 效能監控

```typescript
export function checkCompatibilityWithPerfMonitoring(
  state: PromptState
): CompatibilityCheckResult {
  const startTime = performance.now();
  
  const result = checkCompatibilityWithCache(state);
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // 如果超過 50ms，記錄警告
  if (duration > 50) {
    console.warn(`Compatibility check took ${duration}ms`);
  }
  
  return result;
}
```



## 8. 正確性屬性 (Correctness Properties)

### Property 1: 優先級順序正確性
**驗收標準 1.1**: 特殊光學永遠在最前面
- 當使用魚眼或微距時，相關關鍵字必須出現在 Prompt 的最開頭
- 測試方法：檢查 composition 字串的前 50 個字元

**驗收標準 1.2**: 優先級層級不重疊
- 每個關鍵字只能屬於一個優先級層級
- 測試方法：檢查 PRIORITY_SORTING_RULES 中沒有重複的關鍵字

### Property 2: 衝突檢測完整性
**驗收標準 2.1**: 所有物理衝突都被檢測
- 魚眼 + 建築視角 → 必須產生 CONFLICT 警告
- 長焦 + 動態透視 → 必須產生 CONFLICT 警告
- 測試方法：窮舉所有已知衝突組合

**驗收標準 2.2**: 衝突必須被自動修正
- 每個 CONFLICT 警告都應該有對應的 autoCorrection
- 測試方法：檢查 warnings 和 autoCorrections 的對應關係

### Property 3: 微距模式特殊邏輯
**驗收標準 3.1**: 角度轉譯正確性
- 微距 + 低角度 → 必須包含 "raking light"
- 微距 + 正視 → 必須包含 "flat lay"
- 測試方法：檢查轉譯後的 angle_description

**驗收標準 3.2**: 景深處理正確性
- 微距 + f/22 → 必須包含 "focus stacking"
- 微距 + f/1.8 → 必須包含 "razor thin DoF"
- 測試方法：檢查 depth_of_field 描述

### Property 4: 自動修正冪等性
**驗收標準 4.1**: 重複應用不改變結果
- 對同一個 state 多次執行 checkCompatibility，結果應該相同
- 測試方法：執行 3 次，比較結果

**驗收標準 4.2**: 修正後的 state 不再有衝突
- 應用 autoCorrections 後，再次檢查應該沒有 CONFLICT 警告
- 測試方法：apply → check → assert no conflicts



## 9. 實作檢查清單

### Phase 1: 核心邏輯實作
- [ ] 創建 `types.ts` 擴展（新增介面）
- [ ] 創建 `constants/compatibilityRules.ts`（規則定義）
- [ ] 創建 `utils/lensAngleCompatibility.ts`（核心函數）
- [ ] 實作 `detectLensType()`
- [ ] 實作 `detectAngleType()`
- [ ] 實作 `checkFisheyeCompatibility()`
- [ ] 實作 `checkTelephotoCompatibility()`
- [ ] 實作 `checkWideAngleCompatibility()`
- [ ] 實作 `checkMacroCompatibility()`
- [ ] 實作 `checkCompatibility()`（主函數）
- [ ] 實作 `applyPrioritySorting()`
- [ ] 實作 `applyAutoCorrections()`

### Phase 2: 整合到翻譯器
- [ ] 修改 `utils/visualTranslators.ts`
- [ ] 整合相容性檢查到 `translatePromptState()`
- [ ] 確保不破壞現有邏輯
- [ ] 測試微距模式相容性
- [ ] 測試大遠景模式相容性

### Phase 3: UI 整合
- [ ] 修改 `components/sections/CameraSection.tsx`
- [ ] 添加警告顯示區塊
- [ ] 添加焦點合成選項（微距模式）
- [ ] 修改 `components/layout/ProtocolDeck.tsx`
- [ ] 顯示優先級層級
- [ ] 顯示自動修正列表
- [ ] 顯示相容性警告

### Phase 4: 測試
- [ ] 創建 `utils/lensAngleCompatibility.test.ts`
- [ ] 測試鏡頭類型檢測
- [ ] 測試角度類型檢測
- [ ] 測試魚眼相容性
- [ ] 測試長焦相容性
- [ ] 測試廣角相容性
- [ ] 測試微距相容性
- [ ] 測試優先級排序
- [ ] 測試自動修正
- [ ] 測試正確性屬性

### Phase 5: 效能優化
- [ ] 實作快取機制
- [ ] 實作效能監控
- [ ] 測試效能（< 50ms）

### Phase 6: 文檔與部署
- [ ] 更新 README
- [ ] 創建使用者指南
- [ ] 執行完整測試套件
- [ ] 部署到生產環境

## 10. 風險緩解

### 風險 1: 過度干預使用者選擇
**緩解方案**: 
- 提供「專家模式」開關，允許關閉自動修正
- 在 UI 清楚標示哪些是自動修正
- 允許使用者手動覆蓋警告

### 風險 2: 效能影響
**緩解方案**:
- 使用快取機制
- 只在必要時執行檢查（state 改變時）
- 效能監控，確保 < 50ms

### 風險 3: 規則維護複雜度
**緩解方案**:
- 規則集中在 `compatibilityRules.ts`
- 使用 TypeScript 類型確保規則正確性
- 完整的測試覆蓋

## 11. 成功指標

1. **測試覆蓋率**: > 90%
2. **效能**: 相容性檢查 < 50ms
3. **使用者滿意度**: 專業攝影師評分 > 4.5/5
4. **錯誤率**: 不合理組合使用率降低 50%
5. **Prompt 品質**: AI 生成圖像品質提升 30%

## 12. 未來擴展

1. **機器學習優化**: 根據使用者反饋自動調整規則
2. **視覺效果預覽**: 即時顯示組合效果
3. **推薦系統**: 根據主體類型推薦最佳組合
4. **社群規則**: 允許使用者分享自定義規則
