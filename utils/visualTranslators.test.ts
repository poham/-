import { describe, it, expect } from 'vitest';
import { translatePosition, translateCameraRoll } from './visualTranslators';

describe('translatePosition', () => {
  it('should translate region positions correctly', () => {
    expect(translatePosition('top_left_region')).toBe('upper left area');
    expect(translatePosition('center')).toBe('center');
    expect(translatePosition('bottom_right_region')).toBe('lower right area');
  });

  it('should translate intersection positions correctly', () => {
    expect(translatePosition('top_left_intersection')).toBe('upper left power point');
    expect(translatePosition('bottom_right_intersection')).toBe('lower right power point');
  });

  it('should handle unknown positions gracefully', () => {
    const result = translatePosition('unknown_position');
    expect(result).toBe('unknown position');
  });

  it('should be case-insensitive', () => {
    expect(translatePosition('TOP_LEFT_REGION')).toBe('upper left area');
    expect(translatePosition('Center')).toBe('center');
  });
});

describe('translateCameraRoll', () => {
  describe('zero roll', () => {
    it('should return empty string for 0 degrees', () => {
      expect(translateCameraRoll(0)).toBe('');
    });
  });

  describe('micro tilt (5-29 degrees)', () => {
    it('should translate small positive roll to "slightly tilted" with clockwise direction', () => {
      expect(translateCameraRoll(5)).toBe('slightly tilted, off-axis, off-balance, clockwise');
      expect(translateCameraRoll(10)).toBe('slightly tilted, off-axis, off-balance, clockwise');
      expect(translateCameraRoll(15)).toBe('slightly tilted, off-axis, off-balance, clockwise');
      expect(translateCameraRoll(29)).toBe('slightly tilted, off-axis, off-balance, clockwise');
    });

    it('should translate small negative roll to "slightly tilted" with counter-clockwise direction', () => {
      expect(translateCameraRoll(-5)).toBe('slightly tilted, off-axis, off-balance, counter-clockwise');
      expect(translateCameraRoll(-10)).toBe('slightly tilted, off-axis, off-balance, counter-clockwise');
      expect(translateCameraRoll(-15)).toBe('slightly tilted, off-axis, off-balance, counter-clockwise');
      expect(translateCameraRoll(-29)).toBe('slightly tilted, off-axis, off-balance, counter-clockwise');
    });
  });

  describe('medium tilt / Dutch angle (30-79 degrees)', () => {
    it('should translate medium positive roll to "Dutch angle" with clockwise direction', () => {
      expect(translateCameraRoll(30)).toBe('Dutch angle, canted angle, diagonal composition, clockwise');
      expect(translateCameraRoll(45)).toBe('Dutch angle, canted angle, diagonal composition, clockwise');
      expect(translateCameraRoll(60)).toBe('Dutch angle, canted angle, diagonal composition, clockwise');
      expect(translateCameraRoll(79)).toBe('Dutch angle, canted angle, diagonal composition, clockwise');
    });

    it('should translate medium negative roll to "Dutch angle" with counter-clockwise direction', () => {
      expect(translateCameraRoll(-30)).toBe('Dutch angle, canted angle, diagonal composition, counter-clockwise');
      expect(translateCameraRoll(-45)).toBe('Dutch angle, canted angle, diagonal composition, counter-clockwise');
      expect(translateCameraRoll(-60)).toBe('Dutch angle, canted angle, diagonal composition, counter-clockwise');
      expect(translateCameraRoll(-79)).toBe('Dutch angle, canted angle, diagonal composition, counter-clockwise');
    });
  });

  describe('strong tilt / 90 degrees (80-100 degrees)', () => {
    it('should translate 90-degree roll to "sideways, rotated 90 degrees"', () => {
      expect(translateCameraRoll(80)).toBe('sideways, rotated 90 degrees, vertical orientation');
      expect(translateCameraRoll(90)).toBe('sideways, rotated 90 degrees, vertical orientation');
      expect(translateCameraRoll(100)).toBe('sideways, rotated 90 degrees, vertical orientation');
    });

    it('should translate negative 90-degree roll to "sideways, rotated 90 degrees"', () => {
      expect(translateCameraRoll(-80)).toBe('sideways, rotated 90 degrees, vertical orientation');
      expect(translateCameraRoll(-90)).toBe('sideways, rotated 90 degrees, vertical orientation');
      expect(translateCameraRoll(-100)).toBe('sideways, rotated 90 degrees, vertical orientation');
    });
  });

  describe('inverted / 180 degrees (170-180 degrees)', () => {
    it('should translate 180-degree roll to "upside down, inverted"', () => {
      expect(translateCameraRoll(170)).toBe('upside down, inverted');
      expect(translateCameraRoll(180)).toBe('upside down, inverted');
    });

    it('should translate negative 180-degree roll to "upside down, inverted"', () => {
      expect(translateCameraRoll(-170)).toBe('upside down, inverted');
      expect(translateCameraRoll(-180)).toBe('upside down, inverted');
    });
  });

  describe('very small tilt (1-4 degrees)', () => {
    it('should translate very small positive roll to "subtle tilt"', () => {
      expect(translateCameraRoll(1)).toBe('subtle tilt, clockwise');
      expect(translateCameraRoll(2)).toBe('subtle tilt, clockwise');
      expect(translateCameraRoll(4)).toBe('subtle tilt, clockwise');
    });

    it('should translate very small negative roll to "subtle tilt"', () => {
      expect(translateCameraRoll(-1)).toBe('subtle tilt, counter-clockwise');
      expect(translateCameraRoll(-2)).toBe('subtle tilt, counter-clockwise');
      expect(translateCameraRoll(-4)).toBe('subtle tilt, counter-clockwise');
    });
  });

  describe('angle normalization', () => {
    it('should normalize angles beyond 180 degrees', () => {
      // 270 degrees clockwise = -90 degrees = 90 degrees counter-clockwise
      expect(translateCameraRoll(270)).toBe('sideways, rotated 90 degrees, vertical orientation');
      
      // 360 degrees = 0 degrees
      expect(translateCameraRoll(360)).toBe('');
      
      // 405 degrees = 45 degrees
      expect(translateCameraRoll(405)).toBe('Dutch angle, canted angle, diagonal composition, clockwise');
    });

    it('should normalize negative angles beyond -180 degrees', () => {
      // -270 degrees = 90 degrees
      expect(translateCameraRoll(-270)).toBe('sideways, rotated 90 degrees, vertical orientation');
      
      // -360 degrees = 0 degrees
      expect(translateCameraRoll(-360)).toBe('');
      
      // -405 degrees = -45 degrees
      expect(translateCameraRoll(-405)).toBe('Dutch angle, canted angle, diagonal composition, counter-clockwise');
    });
  });

  describe('edge cases between ranges', () => {
    it('should handle boundary values correctly', () => {
      // Boundary between micro and medium tilt
      expect(translateCameraRoll(29)).toBe('slightly tilted, off-axis, off-balance, clockwise');
      expect(translateCameraRoll(30)).toBe('Dutch angle, canted angle, diagonal composition, clockwise');
      
      // Boundary between medium and strong tilt
      expect(translateCameraRoll(79)).toBe('Dutch angle, canted angle, diagonal composition, clockwise');
      expect(translateCameraRoll(80)).toBe('sideways, rotated 90 degrees, vertical orientation');
      
      // Boundary between strong tilt and other ranges
      expect(translateCameraRoll(100)).toBe('sideways, rotated 90 degrees, vertical orientation');
      expect(translateCameraRoll(101)).toBe('Dutch angle, canted angle, diagonal composition, clockwise');
      
      // Boundary near inverted
      expect(translateCameraRoll(169)).toBe('Dutch angle, canted angle, diagonal composition, clockwise');
      expect(translateCameraRoll(170)).toBe('upside down, inverted');
    });
  });
});
