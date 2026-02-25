# 方位角 Slider 方向修正

## 問題描述

原本的方位角 slider 行為不直覺：
- Slider 往右移動 → 數值增加 → 燈光往左移動（逆時針）
- Slider 往左移動 → 數值減少 → 燈光往右移動（順時針）

這與使用者的直覺相反。

## 解決方案

反轉 slider 的方向映射，讓操作更直覺：
- Slider 往右移動 → 燈光往右移動（順時針）
- Slider 往左移動 → 燈光往左移動（逆時針）

## 技術實作

### 1. 反轉 Slider 值到 Azimuth 的映射

在 `handleAzimuthChange` 函式中：

```typescript
const handleAzimuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!onConfigChange || activeLight === 'ambient') return;
  
  // 反轉 slider 方向：slider 往右 = 燈光往右
  const sliderValue = parseInt(e.target.value);
  const azimuth = (360 - sliderValue) % 360;
  
  // ... 更新對應的光源
};
```

### 2. 更新 Slider 的顯示值

Slider 的 `value` 屬性也需要反轉：

```typescript
<input
  type="range"
  min="0"
  max="360"
  value={(360 - currentLight.azimuth) % 360}  // 反轉顯示
  onChange={handleAzimuthChange}
  // ...
/>
```

### 3. 更新進度條背景

進度條的漸層背景也需要使用反轉後的值：

```typescript
background: `linear-gradient(to right, 
  #1e293b 0%, 
  ${currentLight.color} ${((360 - currentLight.azimuth) % 360 / 360) * 100}%, 
  #1e293b ${((360 - currentLight.azimuth) % 360 / 360) * 100}%)`
```

### 4. 更新方向標籤

因為方向反轉了，標籤也需要對應調整：

```typescript
<div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1 px-1">
  <span>0° 後</span>
  <span>90° 左</span>  {/* 原本是 "90° 右" */}
  <span className="text-blue-400">180° 前</span>
  <span>270° 右</span>  {/* 原本是 "270° 左" */}
</div>
```

## 座標系統說明

系統使用的座標定義（從攝影機正視角度）：
- **0°** = 正後方
- **90°** = 右側（現在 slider 在 270 位置）
- **180°** = 正前方
- **270°** = 左側（現在 slider 在 90 位置）

## 使用者體驗改善

### 修正前
```
Slider 位置 0 → Azimuth 0° → 燈光在後方
Slider 位置 90 → Azimuth 90° → 燈光在右側
Slider 位置 180 → Azimuth 180° → 燈光在前方
Slider 位置 270 → Azimuth 270° → 燈光在左側
```

當從前方（180°）開始，往右拉 slider：
- 180° → 190° → 200° → ... → 270°（左側）❌ 不直覺

### 修正後
```
Slider 位置 0 → Azimuth 360° (0°) → 燈光在後方
Slider 位置 90 → Azimuth 270° → 燈光在左側
Slider 位置 180 → Azimuth 180° → 燈光在前方
Slider 位置 270 → Azimuth 90° → 燈光在右側
```

當從前方（180°）開始，往右拉 slider：
- 180° → 170° → 160° → ... → 90°（右側）✅ 直覺

## 影響範圍

- ✅ Key Light（主光）
- ✅ Fill Light（補光）
- ✅ Rim Light（輪廓光）
- ✅ 視覺化器中的光源位置顯示
- ✅ 進度條顏色漸層
- ✅ 方向標籤文字

## 測試建議

1. 將燈光設定在正前方（180°）
2. 往右拉 slider，確認燈光往右移動
3. 往左拉 slider，確認燈光往左移動
4. 測試所有三個光源（Key、Fill、Rim）
5. 確認數值顯示與實際位置一致

## 檔案變更

- ✅ `components/visuals/PortraitLightingVisualizer.tsx`
  - 修改 `handleAzimuthChange` 函式
  - 修改 slider 的 `value` 屬性
  - 修改進度條背景計算
  - 更新方向標籤文字
