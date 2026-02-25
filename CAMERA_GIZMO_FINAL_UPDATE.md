# Camera Gizmo 最終優化

## 改進總結

根據使用者回饋，將 Azimuth 控制從 0-360° 改為 -180° to +180°，讓操作更直覺。

## 核心改變

### Azimuth 方位角範圍調整

**之前（0-360°）：**
- 0° = 正面
- 90° = 右側
- 180° = 背面
- 270° = 左側
- 360° = 回到正面（重複）

**現在（-180° to +180°）：**
- 0° = 正面（中央位置）
- +90° = 右側
- +180° = 背面
- -90° = 左側
- -180° = 背面（與 +180° 相同）

### 優勢

1. **更直覺的中心點**：0° 在滑桿中央，代表正面視角
2. **對稱性**：左右對稱，正負值清楚表示方向
3. **符合數學慣例**：與極座標系統一致
4. **避免重複**：不會有 0° 和 360° 重複的困惑

## 視覺設計

### 圓圈恢復正常視角
- 紅色圈（Azimuth）：水平橢圓，顯示左右旋轉
- 藍色圈（Elevation）：垂直圓，顯示上下移動
- 綠色圈（輔助）：對角參考線
- 黃色點 + 箭頭：攝影機位置和視線方向

### 滑桿標籤
```
Left (-180°) ←→ Front (0°) ←→ Right (+180°)
```

提示文字：「0° 為正面，±180° 為背面（左右兩端相同位置）」

## 技術實作

### 球面座標計算
```typescript
// Azimuth 範圍：-180° to +180°
const azimuthRad = (azimuth * Math.PI) / 180;
const cameraX = center + radius * Math.cos(elevationRad) * Math.sin(azimuthRad);
```

### 方向描述邏輯
```typescript
function getAzimuthDescription(azimuth: number): string {
  let normalized = azimuth;
  while (normalized > 180) normalized -= 360;
  while (normalized < -180) normalized += 360;
  
  const absAzimuth = Math.abs(normalized);
  
  if (absAzimuth <= 22.5) return 'Front View';
  if (absAzimuth >= 157.5) return 'Back View';
  
  if (normalized > 0) {
    // 正值 = 右側
    if (normalized <= 67.5) return 'Front-Right Quarter';
    if (normalized <= 112.5) return 'Right Side';
    return 'Back-Right Quarter';
  } else {
    // 負值 = 左側
    if (normalized >= -67.5) return 'Front-Left Quarter';
    if (normalized >= -112.5) return 'Left Side';
    return 'Back-Left Quarter';
  }
}
```

## 測試結果

✅ 8 個測試全部通過
- 0° 正確返回 Front View
- ±180° 都正確返回 Back View
- 正值（右側）描述正確
- 負值（左側）描述正確
- Elevation 描述正確
- 顏色主題正確

## 使用範例

### 正面視角
```typescript
cameraAzimuth: 0
cameraElevation: 0
// 輸出: "Eye Level, Front View"
```

### 右側高角度
```typescript
cameraAzimuth: 90
cameraElevation: 45
// 輸出: "High Angle, Right Side"
```

### 背面（左側到達）
```typescript
cameraAzimuth: -180
cameraElevation: 0
// 輸出: "Eye Level, Back View"
```

### 背面（右側到達）
```typescript
cameraAzimuth: 180
cameraElevation: 0
// 輸出: "Eye Level, Back View"
```

## 使用者體驗提升

✅ 滑桿中央為正面，符合直覺
✅ 左右對稱，方向清晰
✅ ±180° 都是背面，邏輯一致
✅ 數值顯示正負號，方向明確
✅ 圓圈視角正常，立體感清晰
