import { describe, it, expect } from 'vitest';
import { 
  formatLightSourceForPrompt, 
  formatRimLightForPrompt, 
  formatLightingSection 
} from './lightingFormatters';
import { LightSource } from '../types';

describe('lightingFormatters.ts', () => {
  describe('formatLightSourceForPrompt', () => {
    it('should use visual translators instead of technical parameters', () => {
      const lightSource: LightSource = {
        azimuth: 45,
        elevation: 30,
        color: '#FFFFFF',
        intensity: 80,
      };
      
      const result = formatLightSourceForPrompt(lightSource, 'Key');
      
      // Should NOT contain numerical angles
      expect(result).not.toMatch(/45°/);
      expect(result).not.toMatch(/30°/);
      expect(result).not.toMatch(/Azimuth/);
      expect(result).not.toMatch(/Elevation/);
      
      // Should NOT contain intensity percentage
      expect(result).not.toMatch(/80%/);
      expect(result).not.toMatch(/at \d+%/);
      
      // Should contain visual descriptions
      expect(result).toMatch(/lighting/i);
      expect(result).toMatch(/shadows|illumination/i);
    });

    it('should translate colored light without hex codes', () => {
      const lightSource: LightSource = {
        azimuth: 90,
        elevation: 0,
        color: '#FF5733', // Orange-red color
        intensity: 60,
      };
      
      const result = formatLightSourceForPrompt(lightSource, 'Fill');
      
      // Should NOT contain hex code
      expect(result).not.toMatch(/#FF5733/);
      expect(result).not.toMatch(/#[0-9A-Fa-f]{6}/);
      
      // Should contain color description
      expect(result).toMatch(/orange|red|warm/i);
    });

    it('should not include color description for white light', () => {
      const lightSource: LightSource = {
        azimuth: 0,
        elevation: 45,
        color: '#FFFFFF',
        intensity: 70,
      };
      
      const result = formatLightSourceForPrompt(lightSource, 'Key');
      
      // White light should not add extra color description
      // (translator returns "Pure white, neutral color temperature" but we skip it for #FFFFFF)
      expect(result).not.toMatch(/Pure white/);
    });
  });

  describe('formatRimLightForPrompt', () => {
    it('should calculate backlit position and use visual translators', () => {
      const rimLight = {
        elevation: 40,
        color: '#FFFFFF',
        intensity: 30,
      };
      const keyAzimuth = 45;
      
      const result = formatRimLightForPrompt(rimLight, keyAzimuth);
      
      // Should NOT contain numerical angles
      expect(result).not.toMatch(/225°/); // (45 + 180) % 360
      expect(result).not.toMatch(/40°/);
      expect(result).not.toMatch(/Azimuth/);
      expect(result).not.toMatch(/Elevation/);
      expect(result).not.toMatch(/backlit\)/); // Old format had "(backlit)"
      
      // Should NOT contain intensity percentage
      expect(result).not.toMatch(/30%/);
      
      // Should contain visual descriptions
      expect(result).toMatch(/lighting|backlit|rim/i);
    });

    it('should translate colored rim light', () => {
      const rimLight = {
        elevation: 50,
        color: '#60A5FA', // Blue color
        intensity: 40,
      };
      const keyAzimuth = 0;
      
      const result = formatRimLightForPrompt(rimLight, keyAzimuth);
      
      // Should NOT contain hex code
      expect(result).not.toMatch(/#60A5FA/);
      expect(result).not.toMatch(/#[0-9A-Fa-f]{6}/);
      
      // Should contain color description
      expect(result).toMatch(/blue|cool/i);
    });
  });

  describe('formatLightingSection', () => {
    const keyLight: LightSource = {
      azimuth: 45,
      elevation: 30,
      color: '#FFFFFF',
      intensity: 80,
    };
    
    const fillLight: LightSource = {
      azimuth: 225,
      elevation: 20,
      color: '#E0F2FE',
      intensity: 40,
    };
    
    const rimLight = {
      elevation: 40,
      color: '#DBEAFE',
      intensity: 30,
    };

    it('should use studio setup name and tags when provided', () => {
      const result = formatLightingSection(
        keyLight,
        fillLight,
        rimLight,
        'Rembrandt',
        'triangle catchlight, dramatic shadows'
      );
      
      // Should include studio setup name and tags
      expect(result).toContain('Rembrandt');
      expect(result).toContain('triangle catchlight');
      
      // Should NOT include individual light descriptions when preset is used
      expect(result).not.toMatch(/Key.*Fill.*Rim/);
    });

    it('should format individual lights in manual mode', () => {
      const result = formatLightingSection(
        keyLight,
        fillLight,
        rimLight,
        'manual'
      );
      
      // Should include visual descriptions for each light
      expect(result).toMatch(/lighting/i);
      expect(result).toMatch(/shadows|illumination/i);
      
      // Should NOT contain technical parameters
      expect(result).not.toMatch(/\d+°/);
      expect(result).not.toMatch(/Azimuth|Elevation/);
      expect(result).not.toMatch(/\d+%/);
      expect(result).not.toMatch(/#[0-9A-Fa-f]{6}/);
    });

    it('should format individual lights when no prompt tags provided', () => {
      const result = formatLightingSection(
        keyLight,
        fillLight,
        rimLight,
        'rembrandt',
        undefined // No prompt tags
      );
      
      // Should include studio setup name
      expect(result).toContain('Studio Setup: rembrandt');
      
      // Should also include individual light descriptions
      expect(result).toMatch(/lighting/i);
    });
  });

  describe('Visual translation integration', () => {
    it('should produce human-readable lighting descriptions', () => {
      const keyLight: LightSource = {
        azimuth: 30,
        elevation: 45,
        color: '#FFFFFF',
        intensity: 85,
      };
      
      const fillLight: LightSource = {
        azimuth: 270,
        elevation: 15,
        color: '#CBD5E1',
        intensity: 35,
      };
      
      const rimLight = {
        elevation: 50,
        color: '#60A5FA',
        intensity: 25,
      };
      
      const result = formatLightingSection(
        keyLight,
        fillLight,
        rimLight,
        'manual'
      );
      
      // Should be a flowing description without technical jargon
      expect(result.length).toBeGreaterThan(50); // Should be descriptive
      expect(result).not.toMatch(/\d+°/); // No degree symbols
      expect(result).not.toMatch(/#[0-9A-Fa-f]{6}/); // No hex codes
      expect(result).not.toMatch(/\d+%/); // No percentages
      
      // Should contain descriptive words
      expect(result).toMatch(/lighting|shadows|illumination|soft|strong|intense/i);
    });
  });
});
