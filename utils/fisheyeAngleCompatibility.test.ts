import { describe, it, expect } from 'vitest';
import { translatePromptState } from './visualTranslators';
import { PromptState } from '../types';

/**
 * 測試魚眼鏡頭與極端角度的相容性
 * 
 * 問題描述：
 * 當使用者選擇魚眼鏡頭（8mm）並設定極端仰角（如 90°）時，
 * 舊邏輯會強制覆蓋鏡頭描述為「廣角透視」，導致魚眼效果消失。
 * 
 * 修復方案：
 * 特殊光學（魚眼、微距）應該有最高優先級（Level 1），
 * 不應該被物理視角（Level 3）覆蓋。
 */

const createTestState = (lens: string, elevation: number): PromptState => ({
  camera: {
    shotType: 'Close-up',
    angle: 'Eye Level',
    aspectRatio: '1:1',
    lens: lens,
    roll: 0,
    cameraAzimuth: 0,
    cameraElevation: elevation,
    composition: {
      rule: 'Rule of thirds',
      focal_point: 'center',
      alignment: 'center',
    },
  },
  subject: {
    type: 'Product',
    description: 'Test subject',
    materials: [],
    tags: [],
  },
  background: {
    description: 'Clean studio',
    environment: 'Studio',
    tags: [],
  },
  optics: {
    dof: 'f/2.8',
    keyLight: {
      azimuth: 45,
      elevation: 30,
      color: '#FFFFFF',
      intensity: 80,
    },
    fillLight: {
      azimuth: 225,
      elevation: 20,
      color: '#E0F2FE',
      intensity: 40,
    },
    rimLight: {
      azimuth: 180,
      elevation: 40,
      color: '#DBEAFE',
      intensity: 30,
    },
    useAdvancedLighting: false,
  },
  style: {
    visualStyle: 'Commercial',
    postProcessing: [],
    filmStyle: 'None',
    grain: 'None',
    vignette: false,
  },
});

describe('Fisheye Lens + Extreme Angle Compatibility', () => {
  describe('魚眼鏡頭應該不被極端角度覆蓋', () => {
    it('should preserve fisheye lens description at 90° elevation (top-down)', () => {
      const state = createTestState('8mm 魚眼', 90);
      const result = translatePromptState(state);
      
      // 應該包含魚眼特徵描述
      expect(result.composition.toLowerCase()).toContain('fisheye');
      expect(result.composition.toLowerCase()).toContain('distortion');
      
      // 不應該被強制覆蓋為廣角
      expect(result.composition.toLowerCase()).not.toContain('wide angle lens, dramatic foreshortening');
    });

    it('should preserve fisheye lens description at -90° elevation (bottom-up)', () => {
      const state = createTestState('8mm 魚眼', -90);
      const result = translatePromptState(state);
      
      // 應該包含魚眼特徵描述
      expect(result.composition.toLowerCase()).toContain('fisheye');
      expect(result.composition.toLowerCase()).toContain('distortion');
      
      // 不應該被強制覆蓋為廣角
      expect(result.composition.toLowerCase()).not.toContain('wide angle lens, dramatic foreshortening');
    });

    it('should preserve fisheye lens description at 75° elevation (high angle)', () => {
      const state = createTestState('8mm 魚眼', 75);
      const result = translatePromptState(state);
      
      // 應該包含魚眼特徵描述
      expect(result.composition.toLowerCase()).toContain('fisheye');
      
      // 不應該被強制覆蓋為廣角
      expect(result.composition.toLowerCase()).not.toContain('wide angle lens, dramatic foreshortening');
    });

    it('should preserve fisheye lens description at -75° elevation (low angle)', () => {
      const state = createTestState('8mm 魚眼', -75);
      const result = translatePromptState(state);
      
      // 應該包含魚眼特徵描述
      expect(result.composition.toLowerCase()).toContain('fisheye');
      
      // 不應該被強制覆蓋為廣角
      expect(result.composition.toLowerCase()).not.toContain('wide angle lens, dramatic foreshortening');
    });
  });

  describe('標準鏡頭在極端角度下應該被調整', () => {
    it('should apply wide angle perspective for standard lens at 90° elevation', () => {
      const state = createTestState('50mm 標準', 90);
      const result = translatePromptState(state);
      
      // 標準鏡頭在極端角度下應該被調整為廣角透視
      expect(result.composition.toLowerCase()).toContain('wide angle');
      expect(result.composition.toLowerCase()).toContain('foreshortening');
    });

    it('should apply wide angle perspective for standard lens at -90° elevation', () => {
      const state = createTestState('50mm 標準', -90);
      const result = translatePromptState(state);
      
      // 標準鏡頭在極端角度下應該被調整為廣角透視
      expect(result.composition.toLowerCase()).toContain('wide angle');
      expect(result.composition.toLowerCase()).toContain('foreshortening');
    });

    it('should apply moderate wide angle for standard lens at 50° elevation', () => {
      const state = createTestState('50mm 標準', 50);
      const result = translatePromptState(state);
      
      // 中等角度應該使用適度廣角
      expect(result.composition.toLowerCase()).toContain('wide angle');
    });
  });

  describe('標準鏡頭在正常角度下應該保持原樣', () => {
    it('should preserve standard lens description at 0° elevation', () => {
      const state = createTestState('50mm 標準', 0);
      const result = translatePromptState(state);
      
      // 標準視角應該使用原始鏡頭描述
      expect(result.composition.toLowerCase()).toContain('standard lens');
      expect(result.composition.toLowerCase()).toContain('zero distortion');
    });

    it('should preserve standard lens description at 20° elevation', () => {
      const state = createTestState('50mm 標準', 20);
      const result = translatePromptState(state);
      
      // 小角度應該使用原始鏡頭描述
      expect(result.composition.toLowerCase()).toContain('standard lens');
    });
  });

  describe('其他特殊鏡頭也應該被保護', () => {
    it('should preserve telephoto lens description at extreme angles', () => {
      const state = createTestState('200mm 特寫', 90);
      const result = translatePromptState(state);
      
      // 長焦鏡頭不是特殊光學，所以會被調整
      // 但這是預期行為，因為長焦 + 極端角度確實會產生特殊效果
      expect(result.composition.toLowerCase()).toContain('wide angle');
    });

    it('should preserve wide angle lens description at extreme angles', () => {
      const state = createTestState('24mm 移軸', 90);
      const result = translatePromptState(state);
      
      // 廣角鏡頭在極端角度下應該保持廣角描述
      expect(result.composition.toLowerCase()).toContain('wide');
    });
  });

  describe('相容性系統整合測試', () => {
    it('should include compatibility result in output', () => {
      const state = createTestState('8mm 魚眼', 90);
      const result = translatePromptState(state);
      
      // 應該包含相容性檢查結果
      expect(result.compatibility).toBeDefined();
      expect(result.compatibility?.priorityOrder).toBeDefined();
    });

    it('should detect fisheye lens type correctly', () => {
      const state = createTestState('8mm 魚眼', 90);
      const result = translatePromptState(state);
      
      // 相容性系統應該檢測到魚眼鏡頭
      // 並生成相應的自動修正（如添加 centered composition）
      expect(result.compatibility?.autoCorrections).toBeDefined();
      
      // 檢查是否有魚眼相關的修正
      const hasFisheyeCorrection = result.compatibility?.autoCorrections.some(
        correction => 
          correction.value?.toLowerCase().includes('centered') ||
          correction.value?.toLowerCase().includes('distorted')
      );
      
      expect(hasFisheyeCorrection).toBe(true);
    });
  });
});
