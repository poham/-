import { readFileSync, writeFileSync } from 'fs';

// 讀取文件（使用 UTF-8 編碼）
const content = readFileSync('presets.ts', 'utf-8');

// 執行替換
let fixed = content;

// 替換所有的 category: CategoryType.XXX 為對應的 style
fixed = fixed.replace(/category: CategoryType\.SpecialPOV,/g, "style: { ...DEFAULT_STATE.style, visualStyle: 'Conceptual (概念藝術)' },");
fixed = fixed.replace(/category: CategoryType\.Anime,/g, "style: { ...DEFAULT_STATE.style, visualStyle: 'Anime (動漫風格)' },");
fixed = fixed.replace(/category: CategoryType\.Product,/g, "style: { ...DEFAULT_STATE.style, visualStyle: 'Commercial (商業攝影)' },");

// 寫回文件
writeFileSync('presets.ts', fixed, 'utf-8');

console.log('Fixed presets.ts successfully!');
