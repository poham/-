import { describe, it, expect } from 'vitest';
import {
  normalizeAngle,
  normalizeElevation,
  calculate3DPosition,
  projectTo2D,
  calculateOppositePosition,
  calculateRimAzimuth,
  calculateAngleFromMouse,
  calculateShadowOpacity
} from './lightingCalculations';

describe('lightingCalculations', () => {
  describe('normalizeAngle', () => {
    it('should normalize positive angles', () => {
      expect(normalizeAngle(0)).toBe(0);
      expect(normalizeAngle(90)).toBe(90);
      expect(normalizeAngle(180)).toBe(180);
      expect(normalizeAngle(270)).toBe(270);
      expect(normalizeAngle(360)).toBe(0);
    });

    it('should normalize negative angles', () => {
      expect(normalizeAngle(-90)).toBe(270);
      expect(normalizeAngle(-180)).toBe(180);
      expect(normalizeAngle(-270)).toBe(90);
    });

    it('should normalize angles > 360', () => {
      expect(normalizeAngle(450)).toBe(90);
      expect(normalizeAngle(720)).toBe(0);
    });
  });

  describe('normalizeElevation', () => {
    it('should clamp elevation to -90 to 90 range', () => {
      expect(normalizeElevation(0)).toBe(0);
      expect(normalizeElevation(45)).toBe(45);
      expect(normalizeElevation(90)).toBe(90);
      expect(normalizeElevation(-45)).toBe(-45);
      expect(normalizeElevation(-90)).toBe(-90);
    });

    it('should clamp values outside range', () => {
      expect(normalizeElevation(100)).toBe(90);
      expect(normalizeElevation(-100)).toBe(-90);
      expect(normalizeElevation(180)).toBe(90);
    });
  });

  describe('calculate3DPosition', () => {
    it('should calculate position for 0° azimuth (top)', () => {
      const pos = calculate3DPosition(0, 0, 1);
      expect(pos.x).toBeCloseTo(0, 5);
      expect(pos.y).toBeCloseTo(-1, 5);
      expect(pos.z).toBeCloseTo(0, 5);
    });

    it('should calculate position for 90° azimuth (right)', () => {
      const pos = calculate3DPosition(90, 0, 1);
      expect(pos.x).toBeCloseTo(1, 5);
      expect(pos.y).toBeCloseTo(0, 5);
      expect(pos.z).toBeCloseTo(0, 5);
    });

    it('should handle elevation', () => {
      const pos = calculate3DPosition(0, 45, 1);
      expect(pos.z).toBeCloseTo(Math.sin(45 * Math.PI / 180), 5);
    });
  });

  describe('calculateOppositePosition', () => {
    it('should calculate opposite azimuth', () => {
      const opposite = calculateOppositePosition(45, 30);
      expect(opposite.azimuth).toBe(225);
      expect(opposite.elevation).toBe(15);
    });

    it('should handle 0° azimuth', () => {
      const opposite = calculateOppositePosition(0, 60);
      expect(opposite.azimuth).toBe(180);
    });
  });

  describe('calculateRimAzimuth', () => {
    it('should calculate rim light position (180° behind)', () => {
      expect(calculateRimAzimuth(0)).toBe(180);
      expect(calculateRimAzimuth(90)).toBe(270);
      expect(calculateRimAzimuth(180)).toBe(0);
      expect(calculateRimAzimuth(270)).toBe(90);
    });
  });

  describe('calculateShadowOpacity', () => {
    it('should calculate shadow opacity based on fill intensity', () => {
      expect(calculateShadowOpacity(0)).toBe(1);
      expect(calculateShadowOpacity(100)).toBe(0.5);
      expect(calculateShadowOpacity(200)).toBe(0.3);
    });

    it('should have minimum opacity of 0.3', () => {
      expect(calculateShadowOpacity(300)).toBe(0.3);
    });
  });
});
