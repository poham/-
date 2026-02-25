import { describe, it, expect } from 'vitest';
import { generateCompleteLightingPrompt } from './lightingPromptGenerator';
import { LightSource } from '../types';

/**
 * 測試：產品攝影模式的相容性
 * 
 * 目的：驗證人像燈光 Preset 是否適合用於產品攝影
 * 問題：Preset 名稱（如 Rembrandt）是否會讓 AI 誤以為是拍人像？
 */
describe('Product Photography Lighting Compatibility', () => {
  
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
  
  // ========================================
  // Test 1: 人像模式的輸出
  // ========================================
  describe('Portrait Mode Output', () => {
    it('should use portrait-specific terms', () => {
      const prompt = generateCompleteLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        false  // 人像模式
      );
      
      console.log('\n=== PORTRAIT MODE ===');
      console.log(prompt);
      console.log('=====================\n');
      
      // 應該包含人像用語
      expect(prompt.toLowerCase()).toMatch(/cheek|face|nose/);
      
      // 應該包含 Rembrandt 名稱
      expect(prompt).toContain('Rembrandt');
    });
  });
  
  // ========================================
  // Test 2: 產品模式的輸出
  // ========================================
  describe('Product Mode Output', () => {
    it('should remove portrait-specific terms and Preset names', () => {
      const prompt = generateCompleteLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        true  // 產品模式
      );
      
      console.log('\n=== PRODUCT MODE ===');
      console.log(prompt);
      console.log('====================\n');
      
      // 不應該包含人像用語
      expect(prompt.toLowerCase()).not.toMatch(/cheek|face|nose/);
      
      // 不應該包含 Preset 名稱
      expect(prompt).not.toContain('Rembrandt');
      expect(prompt).not.toContain('portrait setup');
      
      // 應該包含物理方向描述
      expect(prompt).toContain('Key light positioned at');
      
      // 應該包含風格標籤
      expect(prompt).toContain('Dramatic chiaroscuro');
    });
  });
  
  // ========================================
  // Test 3: 潛在問題分析
  // ========================================
  describe('Potential Issues Analysis', () => {
    it('should analyze if Preset names cause confusion in product mode', () => {
      const presets = ['rembrandt', 'butterfly', 'split', 'loop'];
      
      console.log('\n=== PRESET NAME ANALYSIS ===');
      
      presets.forEach(presetId => {
        const prompt = generateCompleteLightingPrompt(
          keyLight,
          fillLight,
          rimLight,
          presetId,
          true  // 產品模式
        );
        
        // 檢查是否包含人像相關的 Preset 名稱
        const portraitPresetNames = [
          'Rembrandt',
          'Butterfly',
          'Split',
          'Loop',
          'Broad',
          'Short',
          'Clamshell'
        ];
        
        const containsPortraitName = portraitPresetNames.some(name => 
          prompt.includes(name)
        );
        
        if (containsPortraitName) {
          console.log(`❌ ${presetId}: Contains portrait-specific Preset name`);
          console.log(`   Prompt: ${prompt.substring(0, 100)}...`);
        } else {
          console.log(`✅ ${presetId}: No portrait-specific Preset name`);
        }
      });
      
      console.log('============================\n');
    });
  });
  
  // ========================================
  // Test 4: 建議的解決方案測試
  // ========================================
  describe('Proposed Solution', () => {
    it('should consider removing Preset names in product mode', () => {
      const prompt = generateCompleteLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        true  // 產品模式
      );
      
      console.log('\n=== SOLUTION ANALYSIS ===');
      console.log('Current Output:', prompt);
      console.log('\nProposed Changes:');
      console.log('1. Remove "Rembrandt lighting style" in product mode');
      console.log('2. Keep only: direction + intensity + style tags');
      console.log('3. Example: "Key light from 45° angle, dramatic chiaroscuro..."');
      console.log('=========================\n');
      
      // 這個測試目前會失敗，因為系統還沒有實作這個邏輯
      // 但它展示了問題和解決方向
    });
  });
  
  // ========================================
  // Test 5: 不同 Preset 在產品模式下的表現
  // ========================================
  describe('Different Presets in Product Mode', () => {
    const testCases = [
      { id: 'rembrandt', concern: 'Triangle on cheek → Triangle on surface (still weird?)' },
      { id: 'butterfly', concern: 'Butterfly shadow under nose → under object (weird!)' },
      { id: 'split', concern: 'Half-lit face → Half-lit object (OK)' },
      { id: 'loop', concern: 'Loop shadow by nose → by object (weird!)' }
    ];
    
    testCases.forEach(({ id, concern }) => {
      it(`should check ${id} preset compatibility with products`, () => {
        const prompt = generateCompleteLightingPrompt(
          keyLight,
          fillLight,
          rimLight,
          id,
          true  // 產品模式
        );
        
        console.log(`\n=== ${id.toUpperCase()} PRESET ===`);
        console.log('Concern:', concern);
        console.log('Output:', prompt.substring(0, 150) + '...');
        console.log('===================\n');
      });
    });
  });
});
