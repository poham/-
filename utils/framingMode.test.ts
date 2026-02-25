/**
 * Framing Mode Tests
 * 
 * Tests for the framing mode system that allows manual override
 * of product vs portrait shot type descriptions.
 */

import { describe, it, expect } from 'vitest';
import { translatePromptState } from './visualTranslators';
import { PromptState } from '../types';
import { DEFAULT_STATE } from '../constants';

describe('Framing Mode System', () => {
  const baseState: PromptState = {
    ...DEFAULT_STATE,
    camera: {
      ...DEFAULT_STATE.camera,
      shotType: '特寫/肩上 (Close-up / CU)',
    },
    subject: {
      ...DEFAULT_STATE.subject,
      type: '炸雞',
    },
  };

  describe('Auto Mode (Default)', () => {
    it('should auto-detect product for 炸雞', () => {
      const state = {
        ...baseState,
        camera: {
          ...baseState.camera,
          framingMode: 'auto' as const,
        },
      };

      const result = translatePromptState(state);
      
      // Should use product description
      expect(result.composition).toContain('Close-up');
      expect(result.composition).toContain('product');
      expect(result.composition).not.toContain('Face filling frame');
    });

    it('should auto-detect portrait for person', () => {
      const state = {
        ...baseState,
        camera: {
          ...baseState.camera,
          framingMode: 'auto' as const,
        },
        subject: {
          ...baseState.subject,
          type: 'person',
        },
      };

      const result = translatePromptState(state);
      
      // Should use portrait description
      expect(result.composition).toContain('Face filling frame');
      expect(result.composition).not.toContain('product');
    });

    it('should work without framingMode field (backward compatibility)', () => {
      const state = {
        ...baseState,
        camera: {
          ...baseState.camera,
          framingMode: undefined,
        },
      };

      const result = translatePromptState(state);
      
      // Should still auto-detect (炸雞 = product)
      expect(result.composition).toContain('product');
    });
  });

  describe('Product Mode (Manual Override)', () => {
    it('should force product mode even for person', () => {
      const state = {
        ...baseState,
        camera: {
          ...baseState.camera,
          framingMode: 'product' as const,
        },
        subject: {
          ...baseState.subject,
          type: 'person',
        },
      };

      const result = translatePromptState(state);
      
      // Should use product description despite subject being person
      expect(result.composition).toContain('product');
      expect(result.composition).not.toContain('Face filling frame');
    });

    it('should use product descriptions for all shot types', () => {
      const shotTypes = [
        '特寫/肩上 (Close-up / CU)',
        '中景/腰上 (Chest Shot)',
        '遠景 (Long Shot / LS)',
      ];

      shotTypes.forEach((shotType) => {
        const state = {
          ...baseState,
          camera: {
            ...baseState.camera,
            shotType,
            framingMode: 'product' as const,
          },
          subject: {
            ...baseState.subject,
            type: 'person', // Force person but use product mode
          },
        };

        const result = translatePromptState(state);
        
        // All should use product terminology
        expect(result.composition).toContain('product');
      });
    });
  });

  describe('Portrait Mode (Manual Override)', () => {
    it('should force portrait mode even for product', () => {
      const state = {
        ...baseState,
        camera: {
          ...baseState.camera,
          framingMode: 'portrait' as const,
        },
        subject: {
          ...baseState.subject,
          type: '炸雞', // Product
        },
      };

      const result = translatePromptState(state);
      
      // Should use portrait description despite subject being product
      expect(result.composition).toContain('Face filling frame');
      expect(result.composition).not.toContain('product');
    });

    it('should use body-part descriptions for all shot types', () => {
      const shotTypes = [
        '特寫/肩上 (Close-up / CU)',
        '中景/腰上 (Chest Shot)',
        '遠景 (Long Shot / LS)',
      ];

      shotTypes.forEach((shotType) => {
        const state = {
          ...baseState,
          camera: {
            ...baseState.camera,
            shotType,
            framingMode: 'portrait' as const,
          },
          subject: {
            ...baseState.subject,
            type: '炸雞', // Force product but use portrait mode
          },
        };

        const result = translatePromptState(state);
        
        // Should use body-part terminology
        expect(result.composition).not.toContain('product');
      });
    });
  });

  describe('Camera Angle Descriptions', () => {
    it('should use product view descriptions in product mode', () => {
      const state = {
        ...baseState,
        camera: {
          ...baseState.camera,
          framingMode: 'product' as const,
          cameraAzimuth: 0,
          cameraElevation: 60,
        },
      };

      const result = translatePromptState(state);
      
      // Should use product-specific angle description with "camera positioned at" prefix
      expect(result.composition).toContain('camera positioned at');
      expect(result.composition).toContain('elevated high angle');
      expect(result.composition).toContain('looking down at product');
    });

    it('should use camera position descriptions in portrait mode', () => {
      const state = {
        ...baseState,
        camera: {
          ...baseState.camera,
          framingMode: 'portrait' as const,
          cameraAzimuth: 0,
          cameraElevation: 60,
        },
      };

      const result = translatePromptState(state);
      
      // Should use camera position description with "camera positioned at" prefix
      expect(result.composition).toContain('camera positioned at');
      expect(result.composition).toContain('Camera at');
      expect(result.composition).toContain('looking down');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined framingMode gracefully', () => {
      const state = {
        ...baseState,
        camera: {
          ...baseState.camera,
          framingMode: undefined,
        },
      };

      expect(() => translatePromptState(state)).not.toThrow();
    });

    it('should handle empty subject type', () => {
      const state = {
        ...baseState,
        camera: {
          ...baseState.camera,
          framingMode: 'auto' as const,
        },
        subject: {
          ...baseState.subject,
          type: '',
        },
      };

      const result = translatePromptState(state);
      
      // Should default to portrait mode for empty subject
      expect(result.composition).not.toContain('product');
    });
  });
});
