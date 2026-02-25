/**
 * Tests for Chinese Translation Module
 * 
 * 測試中文翻譯模組的功能
 */

import { describe, it, expect } from 'vitest';
import { translateToChineseUI, translateLabel, translateCategorizedParts } from './chineseTranslations';

describe('translateLabel', () => {
  it('should translate English labels to Chinese', () => {
    expect(translateLabel('THEME')).toBe('主題風格');
    expect(translateLabel('CAMERA POSITION')).toBe('攝影機位置');
    expect(translateLabel('LENS OPTICS')).toBe('鏡頭光學');
    expect(translateLabel('SHOT TYPE')).toBe('景別尺度');
    expect(translateLabel('DEPTH OF FIELD')).toBe('景深效果');
  });

  it('should return original label if no translation found', () => {
    expect(translateLabel('UNKNOWN_LABEL')).toBe('UNKNOWN_LABEL');
  });
});

describe('translateToChineseUI', () => {
  it('should translate camera positions', () => {
    expect(translateToChineseUI('camera positioned at eye-level')).toContain('攝影機位於');
    expect(translateToChineseUI('camera positioned at eye-level')).toContain('平視');
  });

  it('should translate lens types', () => {
    expect(translateToChineseUI('using standard lens perspective')).toContain('使用');
    expect(translateToChineseUI('using standard lens perspective')).toContain('標準鏡頭');
  });

  it('should translate shot types', () => {
    expect(translateToChineseUI('medium close-up')).toBe('中特寫');
    expect(translateToChineseUI('extreme close-up')).toBe('極致特寫');
    expect(translateToChineseUI('full body shot')).toBe('全身鏡頭');
  });

  it('should translate depth of field descriptions', () => {
    expect(translateToChineseUI('creating shallow depth of field')).toContain('創造');
    expect(translateToChineseUI('creating shallow depth of field')).toContain('淺景深');
    expect(translateToChineseUI('creamy bokeh')).toBe('奶油般的散景');
  });

  it('should translate composition rules', () => {
    expect(translateToChineseUI('using rule of thirds grid')).toBe('使用三分法構圖');
    expect(translateToChineseUI('using golden ratio composition')).toBe('使用黃金比例構圖');
  });

  it('should translate lighting terms', () => {
    expect(translateToChineseUI('natural lighting')).toBe('自然光');
    expect(translateToChineseUI('studio lighting')).toBe('攝影棚燈光');
    expect(translateToChineseUI('soft lighting')).toBe('柔光');
  });

  it('should handle complex sentences with multiple terms', () => {
    const input = 'camera positioned at high angle, using wide-angle lens, creating shallow depth of field';
    const output = translateToChineseUI(input);
    
    expect(output).toContain('攝影機位於');
    expect(output).toContain('高角度');
    expect(output).toContain('使用');
    expect(output).toContain('廣角鏡頭');
    expect(output).toContain('創造');
    expect(output).toContain('淺景深');
  });

  it('should be case-insensitive', () => {
    expect(translateToChineseUI('DRAMATIC LIGHTING')).toBe('戲劇性燈光');
    expect(translateToChineseUI('Dramatic Lighting')).toBe('戲劇性燈光');
    expect(translateToChineseUI('dramatic lighting')).toBe('戲劇性燈光');
  });

  it('should return original text if no translation found', () => {
    expect(translateToChineseUI('some unknown term')).toBe('some unknown term');
  });

  it('should handle empty strings', () => {
    expect(translateToChineseUI('')).toBe('');
  });
});

describe('translateCategorizedParts', () => {
  it('should translate all parts in the array', () => {
    const input = [
      { label: 'CAMERA POSITION', text: 'camera positioned at eye-level', color: 'blue' },
      { label: 'LENS OPTICS', text: 'using standard lens perspective', color: 'sky' },
      { label: 'SHOT TYPE', text: 'medium close-up', color: 'indigo' },
    ];

    const output = translateCategorizedParts(input);

    expect(output[0].label).toBe('攝影機位置');
    expect(output[0].text).toContain('攝影機位於');
    expect(output[0].text).toContain('平視');
    expect(output[0].color).toBe('blue');

    expect(output[1].label).toBe('鏡頭光學');
    expect(output[1].text).toContain('使用');
    expect(output[1].text).toContain('標準鏡頭');
    expect(output[1].color).toBe('sky');

    expect(output[2].label).toBe('景別尺度');
    expect(output[2].text).toBe('中特寫');
    expect(output[2].color).toBe('indigo');
  });

  it('should preserve color information', () => {
    const input = [
      { label: 'THEME', text: 'cinematic', color: 'purple' },
    ];

    const output = translateCategorizedParts(input);

    expect(output[0].color).toBe('purple');
  });

  it('should handle empty array', () => {
    const output = translateCategorizedParts([]);
    expect(output).toEqual([]);
  });
});

describe('Real-world examples', () => {
  it('should translate a complete camera position description', () => {
    const input = 'camera positioned at high angle, looking down, subject appears smaller';
    const output = translateToChineseUI(input);
    
    expect(output).toContain('攝影機位於');
    expect(output).toContain('高角度');
    expect(output).toContain('俯視');
    expect(output).toContain('主體顯得較小');
  });

  it('should translate a complete lens description', () => {
    const input = 'using wide-angle lens perspective, noticeable barrel distortion, expanded spatial depth';
    const output = translateToChineseUI(input);
    
    expect(output).toContain('使用');
    expect(output).toContain('廣角鏡頭');
    expect(output).toContain('透視');
    expect(output).toContain('可見桶狀變形');
    expect(output).toContain('擴展的空間深度');
  });

  it('should translate a complete DOF description', () => {
    const input = 'creating shallow depth of field, soft background blur, subject-background separation';
    const output = translateToChineseUI(input);
    
    expect(output).toContain('創造');
    expect(output).toContain('淺景深');
    expect(output).toContain('柔和的背景模糊');
    expect(output).toContain('主體背景分離');
  });

  it('should translate lighting descriptions', () => {
    const input = 'studio lighting, soft lighting, dramatic shadows, high contrast';
    const output = translateToChineseUI(input);
    
    expect(output).toContain('攝影棚燈光');
    expect(output).toContain('柔光');
    expect(output).toContain('戲劇性陰影');
    expect(output).toContain('高對比');
  });
});
