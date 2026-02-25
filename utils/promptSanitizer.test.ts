/**
 * Prompt 淨化系統測試
 * 
 * 測試案例涵蓋：
 * 1. 視角矛盾修正
 * 2. 鏡頭衝突關鍵字移除
 * 3. 補償描述添加
 * 4. 重複形容詞去除
 */

import { describe, it, expect } from 'vitest';
import { 
  sanitizePromptState, 
  needsSanitization,
  detectDilutedKeywords 
} from './promptSanitizer';
import { PromptState } from '../types';

describe('promptSanitizer', () => {
  // ============================================================
  // 測試案例 1：視角矛盾修正
  // ============================================================
  describe('視角矛盾修正', () => {
    it('應該修正「仰視 + Top View」的矛盾', () => {
      const state: Partial<PromptState> = {
        camera: {
          shotType: 'Medium Shot',
          angle: 'Low Angle',
          aspectRatio: '1:1',
          lens: '50mm',
          roll: 0,
          cameraElevation: -60, // 仰視
          cameraAzimuth: 0,
          composition: {
            rule: 'Rule of Thirds',
            focal_point: 'Center',
            alignment: 'Centered'
          }
        },
        subject: {
          type: 'Tennis Racket',
          description: 'professional tennis racket',
          materials: ['carbon fiber'],
          tags: [],
          view_angle: 'Top View', // 矛盾：仰視但主體俯視
          key_feature: 'TML logo'
        },
        background: {
          description: 'clean white background',
          environment: 'studio',
          tags: []
        },
        optics: {
          dof: 'f/2.8',
          keyLight: { azimuth: 45, elevation: 45, color: '#ffffff', intensity: 80 },
          fillLight: { azimuth: -45, elevation: 30, color: '#ffffff', intensity: 40 },
          rimLight: { azimuth: 180, elevation: 45, color: '#ffffff', intensity: 60 },
          ambientColor: '#1a1a1a',
          studioSetup: 'rembrandt',
          source: 'studio',
          mood: 'dramatic',
          useAdvancedLighting: true
        },
        style: {
          visualStyle: 'Cinematic',
          mood: 'dramatic',
          postProcessing: [],
          filmStyle: 'none',
          grain: 'none',
          vignette: false
        }
      };

      const result = sanitizePromptState(state as PromptState);

      // 檢查視角是否被修正
      expect(result.sanitizedState.subject.view_angle).toContain('facing downwards');
      expect(result.sanitizedState.subject.view_angle).toContain('towards the lens');
      
      // 檢查修正記錄
      expect(result.appliedCorrections.length).toBeGreaterThan(0);
      expect(result.appliedCorrections[0]).toContain('修正視角矛盾');
    });

    it('應該修正「俯視 + Bottom View」的矛盾', () => {
      const state: Partial<PromptState> = {
        camera: {
          shotType: 'Medium Shot',
          angle: "Bird's Eye",
          aspectRatio: '1:1',
          lens: '50mm',
          roll: 0,
          cameraElevation: 75, // 俯視
          cameraAzimuth: 0,
          composition: {
            rule: 'Rule of Thirds',
            focal_point: 'Center',
            alignment: 'Centered'
          }
        },
        subject: {
          type: 'Product',
          description: 'luxury watch',
          materials: ['metal'],
          tags: [],
          view_angle: 'Bottom View', // 矛盾：俯視但主體仰視
          key_feature: 'dial'
        },
        background: {
          description: 'clean background',
          environment: 'studio',
          tags: []
        },
        optics: {
          dof: 'f/2.8',
          keyLight: { azimuth: 45, elevation: 45, color: '#ffffff', intensity: 80 },
          fillLight: { azimuth: -45, elevation: 30, color: '#ffffff', intensity: 40 },
          rimLight: { azimuth: 180, elevation: 45, color: '#ffffff', intensity: 60 },
          ambientColor: '#1a1a1a',
          studioSetup: 'rembrandt',
          source: 'studio',
          mood: 'dramatic',
          useAdvancedLighting: true
        },
        style: {
          visualStyle: 'Commercial',
          mood: 'clean',
          postProcessing: [],
          filmStyle: 'none',
          grain: 'none',
          vignette: false
        }
      };

      const result = sanitizePromptState(state as PromptState);

      // 檢查視角是否被修正
      expect(result.sanitizedState.subject.view_angle).toContain('facing upwards');
      expect(result.sanitizedState.subject.view_angle).toContain('towards the lens');
    });

    it('平視時應該根據方位角調整朝向', () => {
      const state: Partial<PromptState> = {
        camera: {
          shotType: 'Medium Shot',
          angle: 'Eye Level',
          aspectRatio: '1:1',
          lens: '50mm',
          roll: 0,
          cameraElevation: 0, // 平視
          cameraAzimuth: 0,
          composition: {
            rule: 'Rule of Thirds',
            focal_point: 'Center',
            alignment: 'Centered'
          }
        },
        subject: {
          type: 'Product',
          description: 'bottle',
          materials: ['glass'],
          tags: [],
          view_angle: 'Front View',
          key_feature: 'label'
        },
        background: {
          description: 'clean background',
          environment: 'studio',
          tags: []
        },
        optics: {
          dof: 'f/2.8',
          keyLight: { azimuth: 45, elevation: 45, color: '#ffffff', intensity: 80 },
          fillLight: { azimuth: -45, elevation: 30, color: '#ffffff', intensity: 40 },
          rimLight: { azimuth: 180, elevation: 45, color: '#ffffff', intensity: 60 },
          ambientColor: '#1a1a1a',
          studioSetup: 'rembrandt',
          source: 'studio',
          mood: 'clean',
          useAdvancedLighting: true
        },
        style: {
          visualStyle: 'Commercial',
          mood: 'clean',
          postProcessing: [],
          filmStyle: 'none',
          grain: 'none',
          vignette: false
        }
      };

      const result = sanitizePromptState(state as PromptState);

      // 平視時，視角應該根據方位角調整（正面 = facing towards camera）
      expect(result.sanitizedState.subject.view_angle).toContain('facing');
      expect(result.sanitizedState.subject.view_angle).toContain('camera');
    });
  });

  // ============================================================
  // 測試案例 2：重複形容詞去除
  // ============================================================
  describe('重複形容詞去除', () => {
    it('應該檢測出重複的關鍵字', () => {
      const text = 'clean minimal clean background white clean space';
      const diluted = detectDilutedKeywords(text);

      expect(diluted.length).toBeGreaterThan(0);
      expect(diluted[0]).toContain('clean');
      expect(diluted[0]).toContain('3');
    });

    it('應該去除重複的形容詞', () => {
      const state: Partial<PromptState> = {
        camera: {
          shotType: 'Medium Shot',
          angle: 'Eye Level',
          aspectRatio: '1:1',
          lens: '50mm',
          roll: 0,
          composition: {
            rule: 'Rule of Thirds',
            focal_point: 'Center',
            alignment: 'Centered'
          }
        },
        subject: {
          type: 'Product',
          description: 'clean minimal clean product', // 重複 "clean"
          materials: [],
          tags: [],
          view_angle: 'Front View',
          key_feature: 'design'
        },
        background: {
          description: 'white white background', // 重複 "white"
          environment: 'studio',
          tags: []
        },
        optics: {
          dof: 'f/2.8',
          keyLight: { azimuth: 45, elevation: 45, color: '#ffffff', intensity: 80 },
          fillLight: { azimuth: -45, elevation: 30, color: '#ffffff', intensity: 40 },
          rimLight: { azimuth: 180, elevation: 45, color: '#ffffff', intensity: 60 },
          ambientColor: '#1a1a1a',
          studioSetup: 'rembrandt',
          source: 'studio',
          mood: 'clean',
          useAdvancedLighting: true
        },
        style: {
          visualStyle: 'Commercial',
          mood: 'clean clean mood', // 重複 "clean"
          postProcessing: [],
          filmStyle: 'none',
          grain: 'none',
          vignette: false
        }
      };

      const result = sanitizePromptState(state as PromptState);

      // 檢查重複是否被移除
      const cleanCount = (result.sanitizedState.subject.description.match(/clean/gi) || []).length;
      expect(cleanCount).toBe(1);

      const whiteCount = (result.sanitizedState.background.description.match(/white/gi) || []).length;
      expect(whiteCount).toBe(1);
    });
  });

  // ============================================================
  // 測試案例 3：needsSanitization 檢測
  // ============================================================
  describe('needsSanitization 檢測', () => {
    it('有視角矛盾時應該返回 true', () => {
      const state: Partial<PromptState> = {
        camera: {
          shotType: 'Medium Shot',
          angle: 'Low Angle',
          aspectRatio: '1:1',
          lens: '50mm',
          roll: 0,
          cameraElevation: -60,
          cameraAzimuth: 0,
          composition: {
            rule: 'Rule of Thirds',
            focal_point: 'Center',
            alignment: 'Centered'
          }
        },
        subject: {
          type: 'Product',
          description: 'product',
          materials: [],
          tags: [],
          view_angle: 'Top View', // 矛盾
          key_feature: 'feature'
        },
        background: {
          description: 'background',
          environment: 'studio',
          tags: []
        },
        optics: {
          dof: 'f/2.8',
          keyLight: { azimuth: 45, elevation: 45, color: '#ffffff', intensity: 80 },
          fillLight: { azimuth: -45, elevation: 30, color: '#ffffff', intensity: 40 },
          rimLight: { azimuth: 180, elevation: 45, color: '#ffffff', intensity: 60 },
          ambientColor: '#1a1a1a',
          studioSetup: 'rembrandt',
          source: 'studio',
          mood: 'dramatic',
          useAdvancedLighting: true
        },
        style: {
          visualStyle: 'Cinematic',
          mood: 'dramatic',
          postProcessing: [],
          filmStyle: 'none',
          grain: 'none',
          vignette: false
        }
      };

      expect(needsSanitization(state as PromptState)).toBe(true);
    });

    it('沒有問題時應該返回 false', () => {
      const state: Partial<PromptState> = {
        camera: {
          shotType: 'Medium Shot',
          angle: 'Eye Level',
          aspectRatio: '1:1',
          lens: '50mm',
          roll: 0,
          cameraElevation: 0,
          cameraAzimuth: 0,
          composition: {
            rule: 'Rule of Thirds',
            focal_point: 'Center',
            alignment: 'Centered'
          }
        },
        subject: {
          type: 'Product',
          description: 'product',
          materials: [],
          tags: [],
          view_angle: 'facing towards camera', // 已經是標準化的描述
          key_feature: 'feature'
        },
        background: {
          description: 'background',
          environment: 'studio',
          tags: []
        },
        optics: {
          dof: 'f/2.8',
          keyLight: { azimuth: 45, elevation: 45, color: '#ffffff', intensity: 80 },
          fillLight: { azimuth: -45, elevation: 30, color: '#ffffff', intensity: 40 },
          rimLight: { azimuth: 180, elevation: 45, color: '#ffffff', intensity: 60 },
          ambientColor: '#1a1a1a',
          studioSetup: 'rembrandt',
          source: 'studio',
          mood: 'clean',
          useAdvancedLighting: true
        },
        style: {
          visualStyle: 'Commercial',
          mood: 'clean',
          postProcessing: [],
          filmStyle: 'none',
          grain: 'none',
          vignette: false
        }
      };

      expect(needsSanitization(state as PromptState)).toBe(false);
    });
  });
});
