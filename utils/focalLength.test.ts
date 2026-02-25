/**
 * Focal Length Translation Tests
 * 
 * Tests for the pure optical terminology used in focal length descriptions.
 */

import { describe, it, expect } from 'vitest';
import { translateFocalLength } from './visualTranslators';

describe('translateFocalLength - Pure Optical Terminology', () => {
  describe('Fisheye (8mm)', () => {
    it('should describe fisheye lens with extreme distortion', () => {
      const result = translateFocalLength('8mm 魚眼');
      
      expect(result).toContain('Fisheye lens perspective');
      expect(result).toContain('extreme barrel distortion');
      expect(result).toContain('180-degree field of view');
      expect(result).toContain('spherical projection');
      expect(result).not.toContain('human eye');
      expect(result).not.toContain('natural');
    });
  });

  describe('Ultra-wide (14mm)', () => {
    it('should describe ultra-wide-angle lens characteristics', () => {
      const result = translateFocalLength('14mm 超廣角');
      
      expect(result).toContain('Ultra-wide-angle lens perspective');
      expect(result).toContain('pronounced barrel distortion');
      expect(result).toContain('exaggerated spatial depth');
      expect(result).toContain('dramatic foreground emphasis');
      expect(result).not.toContain('human eye');
    });
  });

  describe('Wide-angle (24mm)', () => {
    it('should describe wide-angle lens with barrel distortion', () => {
      const result = translateFocalLength('24mm 移軸');
      
      expect(result).toContain('Wide-angle lens perspective');
      expect(result).toContain('noticeable barrel distortion');
      expect(result).toContain('expanded spatial depth');
      expect(result).toContain('environmental context');
      expect(result).not.toContain('human eye');
    });
  });

  describe('Moderate wide-angle (35mm)', () => {
    it('should describe moderate wide-angle with slight distortion', () => {
      const result = translateFocalLength('35mm 街拍');
      
      expect(result).toContain('Moderate wide-angle lens perspective');
      expect(result).toContain('slight barrel distortion');
      expect(result).toContain('natural spatial relationships');
      expect(result).toContain('documentary style');
      expect(result).not.toContain('human eye');
    });
  });

  describe('Standard lens (50mm)', () => {
    it('should describe standard lens with zero distortion', () => {
      const result = translateFocalLength('50mm 標準');
      
      expect(result).toContain('Standard lens perspective');
      expect(result).toContain('zero distortion');
      expect(result).toContain('rectilinear projection');
      expect(result).toContain('neutral spatial rendering');
      expect(result).not.toContain('human eye');
      expect(result).not.toContain('natural view');
    });
  });

  describe('Portrait telephoto (85mm)', () => {
    it('should describe portrait lens with moderate compression', () => {
      const result = translateFocalLength('85mm 人像');
      
      expect(result).toContain('Portrait telephoto lens perspective');
      expect(result).toContain('moderate compression');
      expect(result).toContain('subject-background separation');
      expect(result).toContain('flattering facial proportions');
      expect(result).not.toContain('human eye');
    });
  });

  describe('Medium telephoto (135mm)', () => {
    it('should describe medium telephoto with strong compression', () => {
      const result = translateFocalLength('135mm 長焦');
      
      expect(result).toContain('Medium telephoto lens perspective');
      expect(result).toContain('strong compression');
      expect(result).toContain('flattened depth planes');
      expect(result).toContain('isolated subject');
      expect(result).not.toContain('human eye');
    });
  });

  describe('Super telephoto (200mm)', () => {
    it('should describe super telephoto with extreme compression', () => {
      const result = translateFocalLength('200mm 特寫');
      
      expect(result).toContain('Super telephoto lens perspective');
      expect(result).toContain('extreme compression');
      expect(result).toContain('collapsed spatial depth');
      expect(result).toContain('stacked background layers');
      expect(result).toContain('narrow field of view');
      expect(result).not.toContain('human eye');
    });
  });

  describe('Edge cases', () => {
    it('should handle invalid focal length format', () => {
      const result = translateFocalLength('invalid lens');
      
      expect(result).toBe('invalid lens');
    });

    it('should handle unexpected focal length values', () => {
      const result = translateFocalLength('75mm custom');
      
      // Should fallback to original string
      expect(result).toBe('75mm custom');
    });
  });

  describe('Optical terminology validation', () => {
    it('should never use subjective terms like "human eye" or "natural view"', () => {
      const allLenses = [
        '8mm 魚眼',
        '14mm 超廣角',
        '24mm 移軸',
        '35mm 街拍',
        '50mm 標準',
        '85mm 人像',
        '135mm 長焦',
        '200mm 特寫'
      ];

      allLenses.forEach(lens => {
        const result = translateFocalLength(lens);
        expect(result.toLowerCase()).not.toContain('human eye');
        expect(result.toLowerCase()).not.toContain('natural view');
        expect(result.toLowerCase()).not.toContain('like human');
      });
    });

    it('should use professional optical terms', () => {
      const allLenses = [
        '8mm 魚眼',
        '14mm 超廣角',
        '24mm 移軸',
        '35mm 街拍',
        '50mm 標準',
        '85mm 人像',
        '135mm 長焦',
        '200mm 特寫'
      ];

      allLenses.forEach(lens => {
        const result = translateFocalLength(lens);
        // Should contain "lens perspective" or "projection"
        expect(
          result.includes('lens perspective') || 
          result.includes('projection')
        ).toBe(true);
      });
    });
  });
});
