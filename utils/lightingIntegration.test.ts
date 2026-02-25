import { describe, it, expect } from 'vitest';
import { formatLightingSection } from './lightingFormatters';
import { LightSource } from '../types';

/**
 * 整合測試：驗證新舊系統不會產生衝突
 * 
 * 測試目標：
 * 1. Preset 模式下，不會出現 translateLightDirection 的輸出
 * 2. 手動模式下，不會出現 Preset 名稱
 * 3. Perfect Match 和 Style Inheritance 的正確切換
 */
describe('Lighting System Integration Tests', () => {
  
  // ========================================
  // Test 1: Preset 模式 - Perfect Match
  // ========================================
  describe('Preset Mode - Perfect Match', () => {
    it('should output Preset name and NOT physical direction description', () => {
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
      
      const result = formatLightingSection(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',  // Preset ID
        undefined,    // promptTags (不再使用)
        false         // isProductMode
      );
      
      // 應該包含 Preset 名稱
      expect(result).toContain('Rembrandt lighting style');
      
      // 不應該包含物理方向描述（來自 translateLightDirection）
      expect(result).not.toContain('Side lighting from upper angle');
      expect(result).not.toContain('dimensional shadows');
      
      // 應該包含風格標籤
      expect(result).toContain('Dramatic chiaroscuro');
    });
  });
  
  // ========================================
  // Test 2: Preset 模式 - Style Inheritance
  // ========================================
  describe('Preset Mode - Style Inheritance', () => {
    it('should output physical description and NOT Preset name when angle deviates', () => {
      const keyLight: LightSource = {
        azimuth: 80,  // 偏離 35°，超過容許誤差
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
      
      const result = formatLightingSection(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        undefined,
        false
      );
      
      // 不應該包含 Preset 名稱（因為角度已經不符合）
      expect(result).not.toContain('Rembrandt lighting style');
      
      // 應該包含物理描述（來自新系統的 generatePhysicalDescription）
      expect(result).toContain('Key light positioned at');
      
      // 應該包含風格標籤（保留）
      expect(result).toContain('Dramatic chiaroscuro');
    });
  });
  
  // ========================================
  // Test 3: 手動模式
  // ========================================
  describe('Manual Mode', () => {
    it('should output physical direction description and NOT Preset name', () => {
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
      
      const result = formatLightingSection(
        keyLight,
        fillLight,
        rimLight,
        'manual',  // 手動模式
        undefined,
        false
      );
      
      // 不應該包含 Preset 名稱
      expect(result).not.toContain('Rembrandt lighting style');
      expect(result).not.toContain('Butterfly lighting');
      expect(result).not.toContain('Split lighting');
      
      // 應該包含物理方向描述（來自舊系統的 translateLightDirection）
      // 注意：手動模式下使用舊系統的 formatLightSourceForPrompt
      expect(result.length).toBeGreaterThan(0);
    });
  });
  
  // ========================================
  // Test 4: 不同 Preset 的切換
  // ========================================
  describe('Different Presets', () => {
    it('should output correct Preset name for Butterfly', () => {
      const keyLight: LightSource = {
        azimuth: 0,
        elevation: 50,
        color: '#ffffff',
        intensity: 90
      };
      
      const fillLight: LightSource = {
        azimuth: 180,
        elevation: -20,
        color: '#e0e7ff',
        intensity: 30
      };
      
      const rimLight: LightSource = {
        azimuth: 180,
        elevation: 40,
        color: '#ffffff',
        intensity: 40
      };
      
      const result = formatLightingSection(
        keyLight,
        fillLight,
        rimLight,
        'butterfly',
        undefined,
        false
      );
      
      expect(result).toContain('Butterfly lighting');
      expect(result).not.toContain('Rembrandt');
      expect(result).not.toContain('Split');
    });
    
    it('should output correct Preset name for Split', () => {
      const keyLight: LightSource = {
        azimuth: 90,
        elevation: 0,
        color: '#ffffff',
        intensity: 95
      };
      
      const fillLight: LightSource = {
        azimuth: 0,
        elevation: 0,
        color: '#cbd5e1',
        intensity: 0
      };
      
      const rimLight: LightSource = {
        azimuth: 270,
        elevation: 0,
        color: '#ffffff',
        intensity: 0
      };
      
      const result = formatLightingSection(
        keyLight,
        fillLight,
        rimLight,
        'split',
        undefined,
        false
      );
      
      expect(result).toContain('Split lighting');
      expect(result).not.toContain('Rembrandt');
      expect(result).not.toContain('Butterfly');
    });
  });
  
  // ========================================
  // Test 5: 產品模式的用語轉換
  // ========================================
  describe('Product Mode Mapping', () => {
    it('should replace portrait terms with product terms in Preset mode', () => {
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
      
      const result = formatLightingSection(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        undefined,
        true  // 產品模式
      );
      
      // 產品模式下，應該移除所有幾何標籤（包括 Preset 名稱）
      expect(result).not.toContain('Rembrandt');
      expect(result).not.toContain('Triangle');
      expect(result).not.toContain('cheek');
      expect(result).not.toContain('catchlight on cheek');
      
      // 應該包含物理描述和風格標籤
      expect(result).toContain('Key light positioned');
      expect(result).toContain('Dramatic chiaroscuro');
    });
  });
  
  // ========================================
  // Test 6: 顏色描述的清晰度
  // ========================================
  describe('Color Description Clarity', () => {
    it('should clearly label light color to avoid confusion with background', () => {
      const keyLight: LightSource = {
        azimuth: 45,
        elevation: 40,
        color: '#ff6b35',  // 暖橘色
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
      
      const result = formatLightingSection(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        undefined,
        false
      );
      
      // 應該明確標示顏色屬於燈光
      expect(result).toContain('Key Light');
      expect(result).toContain('warm orange');
      
      // 不應該只說 "orange" 而不說明是燈光顏色
      // （這會與背景顏色混淆）
    });
  });
  
  // ========================================
  // Test 7: Fallback 機制
  // ========================================
  describe('Fallback Mechanism', () => {
    it('should fallback to legacy format if Preset ID is invalid', () => {
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
      
      const result = formatLightingSection(
        keyLight,
        fillLight,
        rimLight,
        'invalid_preset_id',  // 無效的 Preset ID
        undefined,
        false
      );
      
      // 應該有輸出（fallback 到舊格式）
      expect(result.length).toBeGreaterThan(0);
      
      // 不應該包含任何 Preset 名稱
      expect(result).not.toContain('Rembrandt');
      expect(result).not.toContain('Butterfly');
      expect(result).not.toContain('Split');
    });
  });
});
