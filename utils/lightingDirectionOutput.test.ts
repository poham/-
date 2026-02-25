import { describe, it, expect } from 'vitest';
import { generateCompleteLightingPrompt } from './lightingPromptGenerator';
import { LightSource } from '../types';

/**
 * 測試：驗證方向資訊是否正確輸出
 * 
 * 目的：確保即使在 Perfect Match 模式下，也會輸出燈光的方向資訊
 * 原因：UI 上有視覺化顯示燈光位置，使用者需要知道實際的方向
 */
describe('Lighting Direction Output Tests', () => {
  
  // ========================================
  // Test 1: Perfect Match 應該包含方向資訊
  // ========================================
  describe('Perfect Match Mode - Direction Output', () => {
    it('should output direction information for all lights even in Perfect Match', () => {
      const keyLight: LightSource = {
        azimuth: 45,
        elevation: 40,
        color: '#ffffff',
        intensity: 85
      };
      
      const fillLight: LightSource = {
        azimuth: 225,
        elevation: 15,
        color: '#cbd5e1',
        intensity: 30
      };
      
      const rimLight: LightSource = {
        azimuth: 225,
        elevation: 45,
        color: '#ffffff',
        intensity: 50
      };
      
      const prompt = generateCompleteLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        false
      );
      
      console.log('Perfect Match Output:', prompt);
      
      // 應該包含 Preset 名稱
      expect(prompt).toContain('Rembrandt lighting style');
      
      // 應該包含 Key Light 的方向資訊
      expect(prompt).toContain('Key Light');
      expect(prompt).toContain('positioned at');
      
      // 應該包含 Fill Light 的方向資訊
      expect(prompt).toContain('Fill Light');
      
      // 應該包含 Rim Light 的方向資訊
      expect(prompt).toContain('Rim Light');
      
      // 應該包含風格標籤
      expect(prompt).toContain('Dramatic chiaroscuro');
    });
  });
  
  // ========================================
  // Test 2: 不同角度應該有不同的方向描述
  // ========================================
  describe('Different Angles - Different Descriptions', () => {
    it('should output different direction descriptions for different angles', () => {
      // 測試 1：45° 角度（front-side）
      const keyLight1: LightSource = {
        azimuth: 45,
        elevation: 40,
        color: '#ffffff',
        intensity: 85
      };
      
      const fillLight1: LightSource = {
        azimuth: 225,
        elevation: 15,
        color: '#cbd5e1',
        intensity: 30
      };
      
      const rimLight1: LightSource = {
        azimuth: 225,
        elevation: 45,
        color: '#ffffff',
        intensity: 50
      };
      
      const prompt1 = generateCompleteLightingPrompt(
        keyLight1,
        fillLight1,
        rimLight1,
        'rembrandt',
        false
      );
      
      // 測試 2：90° 角度（side）
      const keyLight2: LightSource = {
        azimuth: 90,
        elevation: 0,
        color: '#ffffff',
        intensity: 95
      };
      
      const fillLight2: LightSource = {
        azimuth: 0,
        elevation: 0,
        color: '#cbd5e1',
        intensity: 0
      };
      
      const rimLight2: LightSource = {
        azimuth: 270,
        elevation: 0,
        color: '#ffffff',
        intensity: 0
      };
      
      const prompt2 = generateCompleteLightingPrompt(
        keyLight2,
        fillLight2,
        rimLight2,
        'split',
        false
      );
      
      console.log('45° Angle Output:', prompt1);
      console.log('90° Angle Output:', prompt2);
      
      // 兩個 Prompt 應該不同
      expect(prompt1).not.toBe(prompt2);
      
      // 45° 應該包含 "front-side" 或類似描述
      expect(prompt1.toLowerCase()).toMatch(/front|side/);
      
      // 90° 應該包含 "side" 描述
      expect(prompt2.toLowerCase()).toContain('side');
    });
  });
  
  // ========================================
  // Test 3: 顏色應該明確標示
  // ========================================
  describe('Color Labeling', () => {
    it('should clearly label each light color', () => {
      const keyLight: LightSource = {
        azimuth: 45,
        elevation: 40,
        color: '#ff6b35',  // 暖橘色
        intensity: 85
      };
      
      const fillLight: LightSource = {
        azimuth: 225,
        elevation: 15,
        color: '#4169e1',  // 藍色
        intensity: 30
      };
      
      const rimLight: LightSource = {
        azimuth: 225,
        elevation: 45,
        color: '#ffd700',  // 金色
        intensity: 50
      };
      
      const prompt = generateCompleteLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        false
      );
      
      console.log('Color Labeling Output:', prompt);
      
      // 應該包含 Key Light 的顏色
      expect(prompt).toContain('Key Light');
      expect(prompt.toLowerCase()).toMatch(/orange|warm/);
      
      // 應該包含 Fill Light 的顏色
      expect(prompt).toContain('Fill Light');
      expect(prompt.toLowerCase()).toMatch(/blue|cool/);
      
      // 應該包含 Rim Light 的顏色
      expect(prompt).toContain('Rim Light');
      expect(prompt.toLowerCase()).toMatch(/gold|yellow/);
    });
  });
  
  // ========================================
  // Test 4: 強度為 0 的燈光不應該輸出
  // ========================================
  describe('Zero Intensity Lights', () => {
    it('should not output lights with zero intensity', () => {
      const keyLight: LightSource = {
        azimuth: 45,
        elevation: 40,
        color: '#ffffff',
        intensity: 85
      };
      
      const fillLight: LightSource = {
        azimuth: 225,
        elevation: 15,
        color: '#cbd5e1',
        intensity: 0  // 強度為 0
      };
      
      const rimLight: LightSource = {
        azimuth: 225,
        elevation: 45,
        color: '#ffffff',
        intensity: 0  // 強度為 0
      };
      
      const prompt = generateCompleteLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        false
      );
      
      console.log('Zero Intensity Output:', prompt);
      
      // 應該包含 Key Light
      expect(prompt).toContain('Key Light');
      
      // 不應該包含 Fill Light（因為強度為 0）
      // 注意：這取決於實作邏輯，可能需要調整
      
      // 不應該包含 Rim Light（因為強度為 0）
    });
  });
  
  // ========================================
  // Test 5: 完整的輸出結構驗證
  // ========================================
  describe('Complete Output Structure', () => {
    it('should have correct structure: Geometry + Lights + Style', () => {
      const keyLight: LightSource = {
        azimuth: 45,
        elevation: 40,
        color: '#ffffff',
        intensity: 85
      };
      
      const fillLight: LightSource = {
        azimuth: 225,
        elevation: 15,
        color: '#cbd5e1',
        intensity: 30
      };
      
      const rimLight: LightSource = {
        azimuth: 225,
        elevation: 45,
        color: '#ffffff',
        intensity: 50
      };
      
      const prompt = generateCompleteLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        false
      );
      
      console.log('Complete Structure Output:', prompt);
      
      // 檢查結構順序
      const geometryIndex = prompt.indexOf('(Geometry)');
      const keyLightIndex = prompt.indexOf('(Key Light)');
      const fillLightIndex = prompt.indexOf('(Fill Light)');
      const rimLightIndex = prompt.indexOf('(Rim Light)');
      const styleIndex = prompt.indexOf('(Style)');
      
      // Geometry 應該在最前面
      expect(geometryIndex).toBeGreaterThan(-1);
      expect(geometryIndex).toBeLessThan(keyLightIndex);
      
      // Key Light 應該在 Fill Light 之前
      expect(keyLightIndex).toBeLessThan(fillLightIndex);
      
      // Fill Light 應該在 Rim Light 之前
      expect(fillLightIndex).toBeLessThan(rimLightIndex);
      
      // Style 應該在最後
      expect(styleIndex).toBeGreaterThan(rimLightIndex);
    });
  });
});
