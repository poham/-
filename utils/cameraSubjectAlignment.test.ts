/**
 * 攝影機-主體對齊系統測試
 */

import { describe, it, expect } from 'vitest';
import { 
  alignSubjectToCamera, 
  hasViewAngleConflict,
  getViewAngleConflictWarning 
} from './cameraSubjectAlignment';

describe('cameraSubjectAlignment', () => {
  describe('alignSubjectToCamera', () => {
    it('蟲視（-60°）→ 主體朝下看鏡頭', () => {
      const result = alignSubjectToCamera(-60, 0, 'Front View');
      expect(result).toContain('facing downwards');
      expect(result).toContain('towards the lens');
      expect(result).toContain('towering over camera');
    });

    it('低角度（-30°）→ 主體朝下看鏡頭', () => {
      const result = alignSubjectToCamera(-30, 0, 'Front View');
      expect(result).toContain('facing downwards');
      expect(result).toContain('elevated above camera');
    });

    it('平視（0°）→ 保持正面朝向', () => {
      const result = alignSubjectToCamera(0, 0, 'Front View');
      expect(result).toContain('facing towards camera');
    });

    it('高角度（45°）→ 主體朝上看鏡頭', () => {
      const result = alignSubjectToCamera(45, 0, 'Front View');
      expect(result).toContain('facing upwards');
      expect(result).toContain('camera positioned above');
    });

    it('鳥瞰（80°）→ 主體朝上看鏡頭', () => {
      const result = alignSubjectToCamera(80, 0, 'Front View');
      expect(result).toContain('facing upwards');
      expect(result).toContain('overhead view');
    });
  });

  describe('hasViewAngleConflict', () => {
    it('仰視 + Top View = 衝突', () => {
      expect(hasViewAngleConflict(-30, 'Top View')).toBe(true);
      expect(hasViewAngleConflict(-60, '俯視')).toBe(true);
    });

    it('俯視 + Bottom View = 衝突', () => {
      expect(hasViewAngleConflict(75, 'Bottom View')).toBe(true);
      expect(hasViewAngleConflict(80, '仰視')).toBe(true);
    });

    it('平視 + Front View = 無衝突', () => {
      expect(hasViewAngleConflict(0, 'Front View')).toBe(false);
    });
  });
});
