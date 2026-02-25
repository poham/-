# 元素配置標註功能 (Element Placement Feature)

## 功能概述

在「攝影設定 04」的萬用構圖工具中，新增了元素配置標註功能，讓使用者可以精確標記畫面中各個元素的位置。

## 使用方式

1. **新增元素**：點擊「+ 新增元素」按鈕
2. **命名元素**：輸入元素名稱（例如：頭部、左手、右手、Logo、產品）
3. **選擇位置**：點擊元素標籤後，在構圖網格上點擊位置
4. **管理元素**：可以隨時刪除或重新定位元素

## 資料結構

```typescript
interface ElementPlacement {
  id: string;
  elementName: string;  // "頭部", "左手", "Logo" 等
  position: string;     // "top_center_region", "bottom_left_intersection" 等
}
```

## Prompt 輸出範例

```
element placement: head at upper center area, left hand at lower left area, right hand at lower right area
```

## 技術實作

- 資料儲存在 `camera.composition.elementPlacements` 陣列中
- 視覺翻譯透過 `translatePosition()` 函數將位置代碼轉換為自然語言
- 整合到最終 prompt 的 composition 區段中
