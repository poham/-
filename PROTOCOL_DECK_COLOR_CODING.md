# Protocol Deck 顏色編碼系統

## 概述

為了提升非英語系國家使用者的閱讀體驗，我們在 Live Protocol Deck 中實作了顏色編碼系統，使用不同的亮色系來區分提示詞的不同區段。

## 問題背景

在 Protocol Deck 中，提示詞包含多個區段（攝影機角度、鏡頭、景深、主體、環境、燈光等），這些內容全部以白色文字顯示，對於非英語系使用者來說，閱讀起來非常困難，難以快速識別不同的區段。

## 解決方案

使用顏色編碼系統，為每個區段分配不同的顏色，讓使用者能夠一眼識別當前閱讀的是哪個部分。

## 顏色映射表

| 區段 | 顏色 | 語義 | 範例內容 |
|------|------|------|---------|
| **THEME** | 紫色 (Purple) | 整體風格 | Sin City, Film Noir, Cyberpunk |
| **CAMERA SETUP & OPTICS** | 藍色 (Blue) | 相機物理 | camera positioned at..., using standard lens... |
| **SUBJECT DETAILS** | 綠色 (Green) | 主體內容 | elderly man, in leather jacket, facing front |
| **ENVIRONMENT** | 青色 (Cyan) | 場景空間 | in dark alley, urban environment |
| **LIGHTING SETUP** | 黃色 (Yellow) | 光線照明 | lit by Rembrandt lighting, dramatic chiaroscuro |
| **MOOD** | 粉色 (Pink) | 情緒氣氛 | moody atmosphere, tense feeling |
| **RENDERING STYLE** | 橙色 (Orange) | 渲染風格 | rendered in hyper-realistic style, ray tracing |

## 顏色選擇原則

1. **高對比度**：所有顏色都使用亮色系（`-100` 和 `-400` 色階），確保在深色背景上清晰可見
2. **語義關聯**：
   - 藍色 → 相機（冷靜、技術）
   - 綠色 → 主體（生命、內容）
   - 青色 → 環境（空間、氛圍）
   - 黃色 → 燈光（光線、照明）
   - 粉色 → 情緒（感性、氛圍）
   - 橙色 → 風格（創意、渲染）
3. **易於區分**：選擇色相差異明顯的顏色，避免混淆

## 實作細節

### 資料結構

```typescript
const categorizedParts: { label: string; text: string; color: string }[] = [
  { 
    label: 'CAMERA SETUP & OPTICS', 
    text: 'camera positioned at eye level frontal view, using standard lens perspective...',
    color: 'blue'
  },
  // ... 其他區段
];
```

### 顏色映射函數

```typescript
const getColorClasses = (color: string) => {
  const colorMap: Record<string, { label: string; text: string; line: string }> = {
    blue: {
      label: 'text-blue-400',      // 標籤顏色
      text: 'text-blue-100',       // 內容顏色（較淺）
      line: 'bg-blue-500/50'       // 分隔線顏色
    },
    // ... 其他顏色
  };
  return colorMap[color] || colorMap.blue;
};
```

### UI 渲染

```tsx
{categorizedParts.map((part, idx) => {
  const colors = getColorClasses(part.color);
  return (
    <div key={part.label} className="space-y-2">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-px ${colors.line}`} />
        <p className={`text-[11px] font-black ${colors.label} uppercase tracking-[0.3em]`}>
          {part.label}
        </p>
      </div>
      <p className={`text-2xl font-black ${colors.text} leading-relaxed tracking-tight`}>
        {part.text}
      </p>
    </div>
  );
})}
```

## 視覺效果

### 修改前（單一白色）

```
CAMERA SETUP & OPTICS
camera positioned at eye level frontal view, using standard lens perspective...

SUBJECT DETAILS
elderly man, in leather jacket, facing front...

ENVIRONMENT
in dark alley, urban environment...
```

所有文字都是白色，難以區分區段。

### 修改後（顏色編碼）

```
CAMERA SETUP & OPTICS (藍色)
camera positioned at eye level frontal view, using standard lens perspective... (淺藍色)

SUBJECT DETAILS (綠色)
elderly man, in leather jacket, facing front... (淺綠色)

ENVIRONMENT (青色)
in dark alley, urban environment... (淺青色)
```

每個區段都有獨特的顏色，一眼就能識別。

## 額外改進

### 移除冗餘顯示

同時移除了 CameraSection 中的冗餘顯示：

1. **移除標題旁的角度描述**：原本在「拍攝角度與高度」標題旁顯示當前角度（如 "Eye Level Frontal View"）和重置按鈕
2. **移除底部的視覺提示**：原本在 3D Gizmo 下方顯示的 `angleHint`（如 "水平視角，正面拍攝..."）

這些資訊在 Live Protocol Deck 中已經完整顯示，移除後可以：
- 減少視覺噪音
- 避免資訊重複
- 讓使用者專注於右側的 Protocol Deck

## 使用者體驗提升

1. **快速掃描**：使用者可以透過顏色快速定位到想要查看的區段
2. **降低認知負擔**：不需要仔細閱讀標籤，顏色本身就能傳達資訊
3. **提升可讀性**：顏色區分讓長篇提示詞更容易閱讀和理解
4. **國際化友善**：即使不懂英文，也能透過顏色理解結構

## 未來擴展

可以考慮的擴展方向：

1. **顏色圖例**：在 Protocol Deck 頂部加入顏色圖例，說明每個顏色代表的意義
2. **自訂顏色**：允許使用者自訂顏色方案（如色盲友善模式）
3. **顏色強度調整**：根據區段的重要性調整顏色的飽和度
4. **動畫效果**：當使用者修改某個區段時，該區段的顏色可以閃爍或高亮

## 相關檔案

- `components/layout/ProtocolDeck.tsx`：Protocol Deck 主要實作
- `components/sections/CameraSection.tsx`：移除冗餘顯示
- `utils/visualTranslators.ts`：提示詞翻譯邏輯

## 結論

顏色編碼系統大幅提升了 Protocol Deck 的可讀性，特別是對於非英語系使用者。透過視覺化的方式區分不同區段，讓使用者能夠更快速、更直覺地理解提示詞的結構和內容。
