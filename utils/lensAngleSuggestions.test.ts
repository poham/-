/**
 * 鏡頭-角度聯動建議系統測試
 */

import { describe, it, expect } from 'vitest';
import { 
  suggestOptimalLens, 
  isSuboptimalCombination,
  rateLensAngleCombination 
} from './lensAngleSuggestions';

describe('lensAngleSuggestions', () => {
  // ============================================================
  // 測試案例 1：極端角度建議廣角
  // ============================================================
  describe('極端角度建議廣角', () => {
    it('蟲視 + 標準鏡頭 → 建議廣角', () => {
      const suggestion = suggestOptimalLens(-60, '50mm', 'Medium Shot');

      expect(suggestion).not.toBeNull();
      expect(suggestion?.suggestedLens).toContain('Wide Angle');
      expect(suggestion?.priority).toBe('medium');
      expect(suggestion?.reason).toContain('透視變形');
    });

    it('蟲視 + 長焦 → 高優先級建議廣角', () => {
      const suggestion = suggestOptimalLens(-60, 'Telephoto (85mm)', 'Medium Shot');

      expect(suggestion).not.toBeNull();
      expect(suggestion?.suggestedLens).toContain('Wide Angle');
      expect(suggestion?.priority).toBe('high');
      expect(suggestion?.currentIssue).toContain('壓縮透視');
    });

    it('鳥瞰 + 標準鏡頭 → 建議廣角', () => {
      const suggestion = suggestOptimalLens(75, '50mm', 'Medium Shot');

      expect(suggestion).not.toBeNull();
      expect(suggestion?.suggestedLens).toContain('Wide Angle');
    });

    it('蟲視 + 廣角 → 無建議（已是最佳組合）', () => {
      const suggestion = suggestOptimalLens(-60, 'Wide Angle (24mm)', 'Medium Shot');

      expect(suggestion).toBeNull();
    });

    it('蟲視 + 魚眼 → 無建議（已是最佳組合）', () => {
      const suggestion = suggestOptimalLens(-60, 'Fisheye (8mm)', 'Medium Shot');

      expect(suggestion).toBeNull();
    });
  });

  // ============================================================
  // 測試案例 2：微距模式建議
  // ============================================================
  describe('微距模式建議', () => {
    it('微距 + 廣角 → 建議微距鏡頭', () => {
      const suggestion = suggestOptimalLens(0, 'Wide Angle (24mm)', 'Extreme Close-Up (Macro)');

      expect(suggestion).not.toBeNull();
      expect(suggestion?.suggestedLens).toContain('Macro');
      expect(suggestion?.priority).toBe('high');
      expect(suggestion?.currentIssue).toContain('無法在極近距離下對焦');
    });

    it('微距 + 長焦 → 建議微距鏡頭', () => {
      const suggestion = suggestOptimalLens(0, 'Telephoto (85mm)', 'Extreme Close-Up (Macro)');

      expect(suggestion).not.toBeNull();
      expect(suggestion?.suggestedLens).toContain('Macro');
      expect(suggestion?.priority).toBe('high');
    });

    it('微距 + 微距鏡頭 → 無建議', () => {
      const suggestion = suggestOptimalLens(0, 'Macro Lens (100mm)', 'Extreme Close-Up (Macro)');

      expect(suggestion).toBeNull();
    });
  });

  // ============================================================
  // 測試案例 3：大遠景建議
  // ============================================================
  describe('大遠景建議', () => {
    it('大遠景 + 長焦 → 建議廣角', () => {
      const suggestion = suggestOptimalLens(0, 'Telephoto (85mm)', 'Extreme Long Shot');

      expect(suggestion).not.toBeNull();
      expect(suggestion?.suggestedLens).toContain('Wide Angle');
      expect(suggestion?.priority).toBe('medium');
      expect(suggestion?.currentIssue).toContain('壓縮空間');
    });

    it('大遠景 + 廣角 → 無建議', () => {
      const suggestion = suggestOptimalLens(0, 'Wide Angle (24mm)', 'Extreme Long Shot');

      expect(suggestion).toBeNull();
    });
  });

  // ============================================================
  // 測試案例 4：特寫建議
  // ============================================================
  describe('特寫建議', () => {
    it('特寫 + 標準鏡頭 → 低優先級建議長焦', () => {
      const suggestion = suggestOptimalLens(0, '50mm', 'Close-Up');

      expect(suggestion).not.toBeNull();
      expect(suggestion?.suggestedLens).toContain('Telephoto');
      expect(suggestion?.priority).toBe('low');
    });

    it('特寫 + 長焦 → 無建議（已是最佳組合）', () => {
      const suggestion = suggestOptimalLens(0, 'Telephoto (85mm)', 'Close-Up');

      expect(suggestion).toBeNull();
    });
  });

  // ============================================================
  // 測試案例 5：次優組合檢測
  // ============================================================
  describe('次優組合檢測', () => {
    it('極端角度 + 長焦 = 次優', () => {
      expect(isSuboptimalCombination(-60, 'Telephoto (85mm)')).toBe(true);
      expect(isSuboptimalCombination(75, 'Telephoto (135mm)')).toBe(true);
    });

    it('極端角度 + 廣角 = 最佳', () => {
      expect(isSuboptimalCombination(-60, 'Wide Angle (24mm)')).toBe(false);
      expect(isSuboptimalCombination(75, 'Wide Angle (24mm)')).toBe(false);
    });

    it('平視 + 任何鏡頭 = 正常', () => {
      expect(isSuboptimalCombination(0, 'Telephoto (85mm)')).toBe(false);
      expect(isSuboptimalCombination(0, '50mm')).toBe(false);
    });
  });

  // ============================================================
  // 測試案例 6：組合評分
  // ============================================================
  describe('組合評分', () => {
    it('極端角度 + 廣角 = 高分（100）', () => {
      const score = rateLensAngleCombination(-60, 'Wide Angle (24mm)', 'Medium Shot');
      expect(score).toBe(100);
    });

    it('極端角度 + 長焦 = 低分（30）', () => {
      const score = rateLensAngleCombination(-60, 'Telephoto (85mm)', 'Medium Shot');
      expect(score).toBe(30);
    });

    it('微距 + 微距鏡頭 = 高分（100）', () => {
      const score = rateLensAngleCombination(0, 'Macro Lens (100mm)', 'Extreme Close-Up (Macro)');
      expect(score).toBe(100);
    });

    it('微距 + 廣角 = 低分（40）', () => {
      const score = rateLensAngleCombination(0, 'Wide Angle (24mm)', 'Extreme Close-Up (Macro)');
      expect(score).toBe(40);
    });

    it('特寫 + 長焦 = 高分（90）', () => {
      const score = rateLensAngleCombination(0, 'Telephoto (85mm)', 'Close-Up');
      expect(score).toBe(90);
    });

    it('平視 + 標準鏡頭 = 基礎分（70）', () => {
      const score = rateLensAngleCombination(0, '50mm', 'Medium Shot');
      expect(score).toBe(70);
    });
  });
});
