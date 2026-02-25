# 預設集縮圖指南

## 已完成的設定

✅ 型別定義已更新（`types.ts` - 添加 `thumbnail?: string` 欄位）
✅ 所有 preset 已添加縮圖路徑
✅ 資料夾結構已建立

## 需要準備的縮圖檔案

### 建議規格
- **尺寸**: 600x600px（正方形）
- **格式**: WebP（最佳壓縮）或 PNG
- **檔案大小**: 每張控制在 50-100KB

### 檔案清單

#### 📁 特殊視角系列 (Special POV)
放置位置: `public/preset-thumbnails/special-pov/`

- `pov-1.webp` - 名流與麥當勞叔叔
- `pov-2.webp` - 動漫大亂鬥魚眼自拍
- `pov-3.webp` - 螞蟻視角商務巨塔

#### 📁 極簡奢華系列 (Luxury Products)
放置位置: `public/preset-thumbnails/luxury-products/`

- `lux-1.webp` - Jaquemus 桌球組
- `lux-2.webp` - Tiffany & Co. 鐵鎚
- `lux-3.webp` - The North Face 開瓶器
- `lux-4.webp` - Cadillac 摩卡壺

#### 📁 高端雜誌風系列 (Editorial Layouts)
放置位置: `public/preset-thumbnails/editorial-layouts/`

- `ed-1.webp` - Lacoste 網球紅土
- `ed-2.webp` - Sprite 夏日泳池
- `ed-3.webp` - Hermes 沙漠沙丘
- `ed-4.webp` - Nivea 亞麻生活

#### 📁 美食攝影系列 (Food Photography)
放置位置: `public/preset-thumbnails/food-photography/`

炸雞系列:
- `chk-1.webp` - 塔塔醬爆發
- `chk-2.webp` - 白松露頂級炸雞
- `chk-3.webp` - 煙燻起司瀑布
- `chk-4.webp` - 味噌鮮味美學

飲品系列:
- `bev-1.webp` - 香草奶油拿鐵

## 如何測試

1. 將縮圖檔案放入對應資料夾
2. 啟動開發伺服器: `npm run dev`
3. 進入預設集藝廊 (Preset Gallery)
4. 檢查縮圖是否正確顯示

## 備註

- 如果某個 preset 沒有縮圖，系統會自動顯示基於配置的動態預覽（使用背景色和光線顏色）
- 縮圖路徑可以隨時修改，只需編輯 `presets.ts` 中對應的 `thumbnail` 欄位
- 系列封面圖（`coverImage`）目前使用 `/images/covers/G0X.jpg`，如需更換也可以修改
