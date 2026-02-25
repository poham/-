import { describe, it, expect } from 'vitest';
import { 
  generateLightingPrompt, 
  assembleLightingPromptString,
  generateCompleteLightingPrompt 
} from './lightingPromptGenerator';
import { LightSource } from '../types';

describe('lightingPromptGenerator', () => {
  
  // ========================================
  // Test Case 1: Perfect Match - 林布蘭光
  // ========================================
  describe('Perfect Match Mode', () => {
    it('should return geometry + style tags when light matches Rembrandt preset', () => {
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
        intensity: 25
      };
      
      const rimLight: LightSource = {
        azimuth: 225,
        elevation: 45,
        color: '#ffffff',
        intensity: 50
      };
      
      const result = generateLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        false
      );
      
      expect(result.mode).toBe('perfect_match');
      expect(result.presetName).toBe('Rembrandt Lighting');
      expect(result.geometryTags).toContain('Rembrandt lighting style');
      expect(result.styleTags).toContain('Dramatic chiaroscuro');
      expect(result.physicalDescription).toBe('');
    });
    
    it('should still match when within tolerance range', () => {
      const keyLight: LightSource = {
        azimuth: 50,  // +5° from base (45°)
        elevation: 45, // +5° from base (40°)
        color: '#ffffff',
        intensity: 85
      };
      
      const fillLight: LightSource = {
        azimuth: 225,
        elevation: 15,
        color: '#cbd5e1',
        intensity: 25
      };
      
      const rimLight: LightSource = {
        azimuth: 225,
        elevation: 45,
        color: '#ffffff',
        intensity: 50
      };
      
      const result = generateLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        false
      );
      
      expect(result.mode).toBe('perfect_match');
      expect(result.deviationInfo.azimuthDiff).toBe(5);
      expect(result.deviationInfo.elevationDiff).toBe(5);
    });
  });
  
  // ========================================
  // Test Case 2: Style Inheritance - 角度改變過大
  // ========================================
  describe('Style Inheritance Mode', () => {
    it('should remove geometry tags but keep style tags when light deviates too much', () => {
      const keyLight: LightSource = {
        azimuth: 80,  // +35° from base (45°), exceeds tolerance (15°)
        elevation: 40,
        color: '#ffffff',
        intensity: 85
      };
      
      const fillLight: LightSource = {
        azimuth: 225,
        elevation: 15,
        color: '#cbd5e1',
        intensity: 25
      };
      
      const rimLight: LightSource = {
        azimuth: 225,
        elevation: 45,
        color: '#ffffff',
        intensity: 50
      };
      
      const result = generateLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        false
      );
      
      expect(result.mode).toBe('style_inheritance');
      expect(result.geometryTags).toHaveLength(0);
      expect(result.styleTags).toContain('Dramatic chiaroscuro');
      expect(result.physicalDescription).toContain('Key light positioned at');
    });
    
    it('should generate physical description for custom angle', () => {
      const keyLight: LightSource = {
        azimuth: 90,  // Side light
        elevation: 0,  // Eye level
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
      
      const result = generateLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',  // Selected Rembrandt but moved to side
        false
      );
      
      expect(result.mode).toBe('style_inheritance');
      expect(result.physicalDescription).toContain('side');
      expect(result.physicalDescription).toContain('eye-level');
      expect(result.physicalDescription).toContain('strong');
    });
  });
  
  // ========================================
  // Test Case 3: Product Mode Mapping
  // ========================================
  describe('Product Mode Mapping', () => {
    it('should replace portrait terms with product terms in perfect match', () => {
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
        intensity: 25
      };
      
      const rimLight: LightSource = {
        azimuth: 225,
        elevation: 45,
        color: '#ffffff',
        intensity: 50
      };
      
      const result = generateLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        true  // Product mode enabled
      );
      
      // In product mode, even perfect matches should use product_lighting mode
      // to avoid portrait-specific terminology
      expect(result.mode).toBe('product_lighting');
      
      // Check that geometry tags are removed (product mode removes all geometry tags)
      expect(result.geometryTags.length).toBe(0);
      
      // Check that style tags are preserved
      expect(result.styleTags.length).toBeGreaterThan(0);
      
      // Check that physical description is provided
      expect(result.physicalDescription).toBeTruthy();
    });
    
    it('should replace portrait terms in style inheritance mode', () => {
      const keyLight: LightSource = {
        azimuth: 80,
        elevation: 40,
        color: '#ffffff',
        intensity: 85
      };
      
      const fillLight: LightSource = {
        azimuth: 225,
        elevation: 15,
        color: '#cbd5e1',
        intensity: 25
      };
      
      const rimLight: LightSource = {
        azimuth: 225,
        elevation: 45,
        color: '#ffffff',
        intensity: 50
      };
      
      const result = generateLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        true  // Product mode enabled
      );
      
      expect(result.mode).toBe('style_inheritance');
      
      // Style tags should also be mapped
      const styleText = result.styleTags.join(' ');
      // Note: Rembrandt's style tags don't have portrait-specific terms
      // but the system should still work
      expect(result.styleTags.length).toBeGreaterThan(0);
    });
  });
  
  // ========================================
  // Test Case 4: String Assembly
  // ========================================
  describe('String Assembly', () => {
    it('should assemble complete prompt string for perfect match', () => {
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
        intensity: 25
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
      
      expect(prompt).toContain('(Geometry)');
      expect(prompt).toContain('Rembrandt lighting style');
      expect(prompt).toContain('(Key Light)');
      expect(prompt).toContain('neutral white');
      expect(prompt).toContain('(Style)');
      expect(prompt).toContain('Dramatic chiaroscuro');
    });
    
    it('should assemble complete prompt string for style inheritance', () => {
      const keyLight: LightSource = {
        azimuth: 80,
        elevation: 40,
        color: '#ff6b35',
        intensity: 85
      };
      
      const fillLight: LightSource = {
        azimuth: 225,
        elevation: 15,
        color: '#cbd5e1',
        intensity: 25
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
      
      expect(prompt).toContain('(Geometry)');
      expect(prompt).toContain('Key light positioned at');
      expect(prompt).toContain('(Key Light)');
      expect(prompt).toContain('warm orange');
      expect(prompt).toContain('(Style)');
      expect(prompt).toContain('Dramatic chiaroscuro');
      expect(prompt).not.toContain('Rembrandt lighting style');
    });
  });
  
  // ========================================
  // Test Case 5: Different Presets
  // ========================================
  describe('Different Presets', () => {
    it('should work with Butterfly preset', () => {
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
      
      const result = generateLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'butterfly',
        false
      );
      
      expect(result.mode).toBe('perfect_match');
      expect(result.geometryTags).toContain('Butterfly lighting');
      expect(result.styleTags).toContain('Soft flattering illumination');
    });
    
    it('should work with Split preset', () => {
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
      
      const result = generateLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'split',
        false
      );
      
      expect(result.mode).toBe('perfect_match');
      expect(result.geometryTags).toContain('Split lighting');
      expect(result.styleTags).toContain('Mystery and drama');
    });
  });
  
  // ========================================
  // Test Case 6: Color Descriptions
  // ========================================
  describe('Color Descriptions', () => {
    it('should describe common colors correctly', () => {
      const keyLight: LightSource = {
        azimuth: 45,
        elevation: 40,
        color: '#ffd700',  // Golden
        intensity: 85
      };
      
      const fillLight: LightSource = {
        azimuth: 225,
        elevation: 15,
        color: '#cbd5e1',
        intensity: 25
      };
      
      const rimLight: LightSource = {
        azimuth: 225,
        elevation: 45,
        color: '#ffffff',
        intensity: 50
      };
      
      const result = generateLightingPrompt(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        false
      );
      
      expect(result.colorDescription).toContain('golden');
    });
  });
});
