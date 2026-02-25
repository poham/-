/**
 * Product Photography Camera Angle Tests
 * 
 * 驗證商品攝影的攝影機角度描述是否正確
 */

import { describe, it, expect } from 'vitest';
import { getCameraAngleDescription } from './cameraAngleDescriptions';
import { translateShotType } from './visualTranslators';

describe('Product Photography Camera Angles', () => {
  describe('Top-down views (商品俯視)', () => {
    it('should describe flat lay for 90° elevation', () => {
      const result = getCameraAngleDescription(0, 90, true);
      expect(result).toContain('Flat lay');
      expect(result).toContain('top-down view');
    });

    it('should describe high angle for 60° elevation', () => {
      const result = getCameraAngleDescription(0, 60, true);
      expect(result).toContain('High angle view');
      expect(result).toContain('looking down');
    });
  });

  describe('Eye-level views (商品平視)', () => {
    it('should describe straight-on perspective for 0° elevation', () => {
      const result = getCameraAngleDescription(0, 0, true);
      expect(result).toContain('Eye-level view');
      expect(result).toContain('straight-on perspective');
    });

    it('should describe 3/4 view for 45° azimuth', () => {
      const result = getCameraAngleDescription(45, 0, true);
      expect(result).toContain('front-right quarter turn');
      expect(result).toContain('3/4 view');
    });
  });

  describe('Low angle views (商品仰視)', () => {
    it('should describe hero shot for -45° elevation', () => {
      const result = getCameraAngleDescription(0, -45, true);
      expect(result).toContain('Dramatic low angle');
      expect(result).toContain('hero shot');
    });
  });

  describe('Product orientation (商品朝向)', () => {
    it('should describe front-facing for 0° azimuth', () => {
      const result = getCameraAngleDescription(0, 0, true);
      expect(result).toContain('front-facing');
      expect(result).toContain('centered composition');
    });

    it('should describe side profile for 90° azimuth', () => {
      const result = getCameraAngleDescription(90, 0, true);
      expect(result).toContain('right side profile');
      expect(result).toContain('90-degree turn');
    });

    it('should describe back view for 180° azimuth', () => {
      const result = getCameraAngleDescription(180, 0, true);
      expect(result).toContain('back view');
      expect(result).toContain('rear perspective');
    });
  });

  describe('Comparison: Product vs Portrait (商品 vs 人像)', () => {
    it('should use different language for products vs portraits', () => {
      const productDesc = getCameraAngleDescription(0, 45, true);
      const portraitDesc = getCameraAngleDescription(0, 45, false);
      
      // 商品描述應該關注「物體呈現」
      expect(productDesc).toContain('view');
      
      // 人像描述應該關注「攝影機位置」
      expect(portraitDesc).toContain('Camera');
    });

    it('should describe flat lay for products but bird\'s eye for portraits', () => {
      const productDesc = getCameraAngleDescription(0, 90, true);
      const portraitDesc = getCameraAngleDescription(0, 90, false);
      
      expect(productDesc).toContain('Flat lay');
      expect(portraitDesc).toContain('bird\'s eye');
    });
  });
});

describe('Product Photography Shot Types (取景尺度)', () => {
  describe('Product shot type translations (商品取景)', () => {
    it('should translate close-up for products without body parts', () => {
      const result = translateShotType('特寫/肩上 (Close-up / CU)', '白色 Lacoste 香水瓶');
      expect(result).not.toContain('shoulder');
      expect(result).not.toContain('face');
      expect(result).toContain('Close-up');
      expect(result).toContain('product');
    });

    it('should translate medium shot for products', () => {
      const result = translateShotType('中景/腰上 (Chest Shot)', '亞麻紋理桌球拍');
      expect(result).not.toContain('waist');
      expect(result).not.toContain('chest');
      expect(result).toContain('Medium shot');
      expect(result).toContain('product');
    });

    it('should translate bust shot for products', () => {
      const result = translateShotType('中特寫/胸上 (Bust Shot)', '金黃炸雞腿');
      expect(result).not.toContain('bust');
      expect(result).not.toContain('shoulder');
      expect(result).toContain('Medium close-up');
      expect(result).toContain('product');
    });

    it('should translate full body for products', () => {
      const result = translateShotType('遠景/全身 (Full Body)', '消光奶油罐');
      expect(result).not.toContain('body');
      expect(result).not.toContain('head to toe');
      expect(result).toContain('Full product view');
    });

    it('should translate top-down for products', () => {
      const result = translateShotType('頂視 / 俯視 (Top-Down)', 'Sprite 玻璃瓶');
      expect(result).toContain('Flat lay');
      expect(result).toContain('top-down view');
    });
  });

  describe('Portrait shot type translations (人像取景)', () => {
    it('should translate close-up for portraits with body parts', () => {
      const result = translateShotType('特寫/肩上 (Close-up / CU)', '時尚模特兒');
      expect(result).toContain('Face');
      expect(result).toContain('frame');
    });

    it('should translate bust shot for portraits', () => {
      const result = translateShotType('中特寫/胸上 (Bust Shot)', '商務人士');
      expect(result).toContain('Head and shoulders');
      expect(result).toContain('chest');
    });

    it('should translate full body for portraits', () => {
      const result = translateShotType('遠景/全身 (Full Body)', '舞者');
      expect(result).toContain('Full body');
      expect(result).toContain('head to toe');
    });
  });

  describe('Food photography detection (食物攝影偵測)', () => {
    it('should detect chicken as product', () => {
      const result = translateShotType('特寫/肩上 (Close-up / CU)', '金黃炸雞腿');
      expect(result).not.toContain('shoulder');
      expect(result).toContain('product');
    });

    it('should detect beverage as product', () => {
      const result = translateShotType('中特寫/胸上 (Bust Shot)', '香草奶油拿鐵');
      expect(result).not.toContain('bust');
      expect(result).toContain('product');
    });
  });
});
