import { describe, it, expect } from 'vitest';
import { 
  checkStyleCompatibility, 
  getStyleSuggestion,
  StyleConflictType 
} from './styleCompatibility';
import { StyleConfig } from '../types';

describe('Style Compatibility System', () => {
  describe('checkStyleCompatibility', () => {
    it('應該檢測底片模擬與 UE5 渲染的強烈衝突', () => {
      const config: StyleConfig = {
        visualStyle: 'Cinematic',
        filmStyle: 'None',
        postProcessing: ['Kodak Portra 400', 'UE5 渲染', '光線追蹤'],
        grain: 'Medium',
        vignette: true
      };
      
      const warnings = checkStyleCompatibility(config);
      
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0].type).toBe(StyleConflictType.ANALOG_VS_DIGITAL);
      expect(warnings[0].severity).toBe('high');
      expect(warnings[0].conflictingTags).toContain('Kodak Portra 400');
      expect(warnings[0].conflictingTags).toContain('UE5 渲染');
    });
    
    it('應該檢測底片模擬與 8K 解析度的中度衝突', () => {
      const config: StyleConfig = {
        visualStyle: 'Cinematic',
        filmStyle: 'None',
        postProcessing: ['Fujifilm Superia', '8K 解析度', '超精細'],
        grain: 'Low',
        vignette: true
      };
      
      const warnings = checkStyleCompatibility(config);
      
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0].severity).toBe('medium');
    });
    
    it('應該檢測電影顆粒與超精細的衝突', () => {
      const config: StyleConfig = {
        visualStyle: 'Hyper-Realistic',
        filmStyle: 'None',
        postProcessing: ['電影顆粒', '超精細', '8K 解析度'],
        grain: 'High',
        vignette: false
      };
      
      const warnings = checkStyleCompatibility(config);
      
      const grainConflict = warnings.find(w => w.type === StyleConflictType.GRAIN_VS_SHARP);
      expect(grainConflict).toBeDefined();
      expect(grainConflict?.severity).toBe('medium');
    });
    
    it('不應該對純類比風格產生警告', () => {
      const config: StyleConfig = {
        visualStyle: 'Cinematic',
        filmStyle: 'Kodak Portra 400',
        postProcessing: ['電影顆粒', '變形鏡頭光暈'],
        grain: 'Medium',
        vignette: true
      };
      
      const warnings = checkStyleCompatibility(config);
      
      expect(warnings.length).toBe(0);
    });
    
    it('不應該對純數位風格產生警告', () => {
      const config: StyleConfig = {
        visualStyle: 'Hyper-Realistic',
        filmStyle: 'None',
        postProcessing: ['超精細', '光線追蹤', '8K 解析度'],
        grain: 'None',
        vignette: false
      };
      
      const warnings = checkStyleCompatibility(config);
      
      expect(warnings.length).toBe(0);
    });
  });
  
  describe('getStyleSuggestion', () => {
    it('應該為類比風格提供建議', () => {
      const config: StyleConfig = {
        visualStyle: 'Cinematic',
        filmStyle: 'Kodak Portra 400',
        postProcessing: [],
        grain: 'None',
        vignette: true
      };
      
      const suggestion = getStyleSuggestion(config);
      
      expect(suggestion).toContain('類比風格');
      expect(suggestion).toContain('電影顆粒');
    });
    
    it('應該為數位風格提供建議', () => {
      const config: StyleConfig = {
        visualStyle: 'Hyper-Realistic',
        filmStyle: 'None',
        postProcessing: ['光線追蹤'],
        grain: 'None',
        vignette: false
      };
      
      const suggestion = getStyleSuggestion(config);
      
      expect(suggestion).toContain('數位風格');
    });
    
    it('應該警告混合風格', () => {
      const config: StyleConfig = {
        visualStyle: 'Cinematic',
        filmStyle: 'Kodak Portra 400',
        postProcessing: ['UE5 渲染'],
        grain: 'Medium',
        vignette: true
      };
      
      const suggestion = getStyleSuggestion(config);
      
      expect(suggestion).toContain('混合風格');
      expect(suggestion).toContain('衝突');
    });
  });
});
