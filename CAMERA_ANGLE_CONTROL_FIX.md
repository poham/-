# Camera Angle Control 問題修復指南

## 問題描述

使用者報告了兩個相關問題：

### 問題 1：魚眼鏡頭被極端角度覆蓋 ✅ 已修復
**現象**：當仰角設定為 90° 時，魚眼鏡頭（8mm）的效果會消失，被強制替換為「廣角透視」。

**原因**：`visualTranslators.ts` 中的舊邏輯在 `elevation > 60°` 時會強制覆蓋鏡頭描述。

**修復**：添加特殊光學檢測，讓魚眼和微距鏡頭不被角度覆蓋。

```typescript
// 檢查是否為特殊光學（魚眼、微距）
const isSpecialOptics = lensLower.includes('魚眼') || 
                       lensLower.includes('fisheye') || 
                       lensLower.includes('8mm') ||
                       isMacro;

if (isSpecialOptics) {
  // 特殊光學優先：不被角度覆蓋
  lensOpticsDesc = translateFocalLength(state.camera.lens);
}
```

**測試結果**：13/13 測試通過 ✅

---

### 問題 2：快速預設角度後無法控制 ⚠️ 需要進一步調查

**現象**：使用「快速預設角度」按鈕後，3D Gizmo 或滑桿似乎無法再控制攝影機角度。

**可能原因**：

#### 原因 A：useEffect 依賴陣列不完整
`CameraSection.tsx` 中的 `useEffect` 可能造成狀態同步問題：

```typescript
useEffect(() => {
  const azimuth = config.cameraAzimuth ?? 0;
  const elevation = config.cameraElevation ?? 0;
  const description = getCameraAngleDescription(azimuth, elevation);
  
  if (description !== config.angle) {
    onChange({ ...config, angle: description });
  }
}, [config.cameraAzimuth, config.cameraElevation]); // ⚠️ 缺少 onChange, config.angle
```

**問題**：
1. 缺少 `onChange` 在依賴陣列中（雖然通常不需要，但可能導致閉包問題）
2. 缺少 `config.angle` 在依賴陣列中（可能導致不必要的更新）
3. 每次角度改變都會觸發 `onChange`，可能造成性能問題

#### 原因 B：快速預設角度按鈕的事件處理
快速預設角度按鈕的 `onClick` 處理可能有問題：

```typescript
onClick={(e) => {
  e.preventDefault();
  e.stopPropagation();
  onChange({ 
    ...config, 
    cameraAzimuth: preset.azimuth,
    cameraElevation: preset.elevation
  });
}}
```

**可能問題**：
- `e.stopPropagation()` 可能阻止了某些事件傳播
- 狀態更新可能沒有正確觸發重新渲染

#### 原因 C：3D Gizmo 或滑桿的狀態綁定
`Camera3DGizmo` 組件可能沒有正確接收更新後的 `azimuth` 和 `elevation` 值。

---

## 建議的修復方案

### 方案 1：優化 useEffect（推薦）

移除 `useEffect`，改為在 `handleAzimuthChange` 和 `handleElevationChange` 中同步更新角度描述：

```typescript
const handleAzimuthChange = (value: number) => {
  const newDescription = getCameraAngleDescription(value, config.cameraElevation ?? 0);
  onChange({ 
    ...config, 
    cameraAzimuth: value,
    angle: newDescription 
  });
};

const handleElevationChange = (value: number) => {
  const newDescription = getCameraAngleDescription(config.cameraAzimuth ?? 0, value);
  onChange({ 
    ...config, 
    cameraElevation: value,
    angle: newDescription 
  });
};
```

**優點**：
- 避免 `useEffect` 的副作用
- 狀態更新更加明確和可預測
- 減少不必要的重新渲染

**缺點**：
- 需要在兩個地方更新角度描述（但可以提取為共用函數）

---

### 方案 2：修復 useEffect 依賴陣列

添加缺少的依賴，並使用 `useCallback` 包裝 `onChange`：

```typescript
const handleAngleUpdate = useCallback(() => {
  const azimuth = config.cameraAzimuth ?? 0;
  const elevation = config.cameraElevation ?? 0;
  const description = getCameraAngleDescription(azimuth, elevation);
  
  if (description !== config.angle) {
    onChange({ ...config, angle: description });
  }
}, [config.cameraAzimuth, config.cameraElevation, config.angle, onChange]);

useEffect(() => {
  handleAngleUpdate();
}, [handleAngleUpdate]);
```

**優點**：
- 保持原有的 `useEffect` 結構
- 依賴陣列完整

**缺點**：
- 更複雜
- 可能仍然有性能問題

---

### 方案 3：移除自動同步，改為手動觸發

完全移除 `useEffect`，只在必要時更新角度描述（例如在 Prompt 生成時）：

```typescript
// 移除 useEffect

// 在 visualTranslators.ts 中自動生成角度描述
// 不需要在 UI 中同步
```

**優點**：
- 最簡單
- 避免所有狀態同步問題

**缺點**：
- UI 中的角度描述標籤可能不會即時更新
- 需要在其他地方（如 Protocol Deck）生成描述

---

## 調試步驟

如果問題仍然存在，請按照以下步驟調試：

### 步驟 1：檢查狀態更新
在 `handleAzimuthChange` 和 `handleElevationChange` 中添加 `console.log`：

```typescript
const handleAzimuthChange = (value: number) => {
  console.log('Azimuth changed:', value);
  onChange({ ...config, cameraAzimuth: value });
};

const handleElevationChange = (value: number) => {
  console.log('Elevation changed:', value);
  onChange({ ...config, cameraElevation: value });
};
```

### 步驟 2：檢查 3D Gizmo 接收的 props
在 `Camera3DGizmo` 組件中添加 `console.log`：

```typescript
useEffect(() => {
  console.log('Gizmo received azimuth:', azimuth);
  console.log('Gizmo received elevation:', elevation);
}, [azimuth, elevation]);
```

### 步驟 3：檢查快速預設角度按鈕
在按鈕的 `onClick` 中添加 `console.log`：

```typescript
onClick={(e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log('Preset clicked:', preset.name, preset.azimuth, preset.elevation);
  onChange({ 
    ...config, 
    cameraAzimuth: preset.azimuth,
    cameraElevation: preset.elevation
  });
}}
```

### 步驟 4：檢查 useEffect 觸發次數
在 `useEffect` 中添加計數器：

```typescript
const renderCount = useRef(0);

useEffect(() => {
  renderCount.current += 1;
  console.log('useEffect triggered:', renderCount.current);
  console.log('Current azimuth:', config.cameraAzimuth);
  console.log('Current elevation:', config.cameraElevation);
  
  // ... 原有邏輯
}, [config.cameraAzimuth, config.cameraElevation]);
```

---

## 測試計劃

### 測試案例 1：魚眼 + 極端角度
1. 選擇「8mm 魚眼」鏡頭
2. 將仰角調整到 90°
3. 檢查 Protocol Deck 中的 Prompt
4. **預期結果**：應該包含 "Fisheye lens perspective, extreme barrel distortion"

### 測試案例 2：快速預設角度
1. 點擊「正面」預設角度（0°, 0°）
2. 使用 3D Gizmo 調整到其他角度
3. 再次點擊「正面」預設角度
4. **預期結果**：角度應該回到 0°, 0°

### 測試案例 3：手動調整後使用預設
1. 使用 3D Gizmo 調整到任意角度
2. 點擊「鳥瞰」預設角度（0°, 90°）
3. 再使用 3D Gizmo 調整
4. **預期結果**：應該能夠正常調整

---

## 相關檔案

- `utils/visualTranslators.ts` - 已修復魚眼優先級問題 ✅
- `components/sections/CameraSection.tsx` - 需要檢查狀態同步 ⚠️
- `components/visuals/Camera3DGizmo.tsx` - 需要檢查 props 接收 ⚠️
- `utils/cameraAngleDescriptions.ts` - 角度描述生成函數
- `utils/fisheyeAngleCompatibility.test.ts` - 魚眼相容性測試 ✅

---

## 總結

**已修復**：
- ✅ 魚眼鏡頭在極端角度下不再被覆蓋
- ✅ 特殊光學（魚眼、微距）有最高優先級
- ✅ 13 個測試全部通過

**待調查**：
- ⚠️ 快速預設角度後無法控制的問題
- ⚠️ 可能的 `useEffect` 狀態同步問題
- ⚠️ 需要進一步的用戶測試和調試

**建議**：
- 優先實施方案 1（移除 `useEffect`，改為同步更新）
- 添加調試日誌來定位問題
- 進行完整的用戶測試
