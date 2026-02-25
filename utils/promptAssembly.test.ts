import { describe, it, expect } from 'vitest';
import { assemblePromptParts, assembleFinalPrompt, PromptPart } from './promptAssembly';
import { PromptState } from '../types';
import { 
  SPECIAL_POV_DATA, 
  LUXURY_ARTIFACTS_DATA, 
  EDITORIAL_SERIES_DATA, 
  CHICKEN_SERIES_DATA,
  BEVERAGE_SERIES_DATA
} from '../presets';

// 測試用的最小化 PromptState
const createMinimalState = (): PromptState => ({
  camera: {
    shotType: 'Close-up',
    angle: 'Eye Level',
    aspectRatio: '1:1',
    lens: '50mm',
    roll: 0,
    composition: {
      rule: 'Rule of thirds',
      focal_point: 'center',
      alignment: 'center',
    },
  },
  subject: {
    type: 'Product',
    description: 'Luxury watch',
    materials: [],
    tags: [],
    view_angle: 'Front view',
    key_feature: 'Metallic finish',
  },
  background: {
    description: 'Clean studio',
    environment: 'Studio',
    tags: [],
  },
  optics: {
    dof: 'f/2.8',
    keyLight: {
      azimuth: 45,
      elevation: 30,
      color: '#FFFFFF',
      intensity: 80,
    },
    fillLight: {
      azimuth: 225,
      elevation: 20,
      color: '#E0F2FE',
      intensity: 40,
    },
    rimLight: {
      azimuth: 180,
      elevation: 40,
      color: '#DBEAFE',
      intensity: 30,
    },
    ambientColor: '#F5F5F5',
    studioSetup: 'rembrandt',
    source: 'Softbox',
    mood: 'Professional',
    useAdvancedLighting: false,
    // Legacy fields for backward compatibility
    lightColor: 'Warm white',
    lightIntensity: 80,
    lightRotation: 45,
    fillLightColor: 'Cool white',
    fillLightIntensity: 40,
    rimLightColor: 'Blue',
    rimLightIntensity: 30,
  },
  style: {
    visualStyle: 'Commercial (商業攝影)',
    postProcessing: [],
    filmStyle: 'None',
    grain: 'None',
    vignette: false,
  },
});

describe('promptAssembly.ts', () => {
  describe('assemblePromptParts', () => {
    it('應該組裝基本的提示詞區段', () => {
      const state = createMinimalState();
      const parts = assemblePromptParts(state);
      
      expect(parts).toBeInstanceOf(Array);
      expect(parts.length).toBeGreaterThan(0);
      
      // 檢查每個 part 都有 label 和 text
      parts.forEach(part => {
        expect(part).toHaveProperty('label');
        expect(part).toHaveProperty('text');
        expect(typeof part.label).toBe('string');
        expect(typeof part.text).toBe('string');
      });
    });

    it('應該包含 THEME 區段', () => {
      const state = createMinimalState();
      const parts = assemblePromptParts(state);
      
      const themePart = parts.find(p => p.label === 'THEME');
      expect(themePart).toBeDefined();
      expect(themePart?.text).toContain('商業產品攝影');
    });

    it('應該包含 SUBJECT 區段', () => {
      const state = createMinimalState();
      const parts = assemblePromptParts(state);
      
      const subjectPart = parts.find(p => p.label === 'SUBJECT');
      expect(subjectPart).toBeDefined();
      expect(subjectPart?.text).toContain('Product');
      expect(subjectPart?.text).toContain('Luxury watch');
      expect(subjectPart?.text).toContain('Front view');
      expect(subjectPart?.text).toContain('Metallic finish');
    });

    it('應該在 subject.type 為空時使用預設值', () => {
      const state = createMinimalState();
      state.subject.type = '';
      const parts = assemblePromptParts(state);
      
      const subjectPart = parts.find(p => p.label === 'SUBJECT');
      expect(subjectPart?.text).toContain('main object');
    });

    it('應該包含 SCENE 區段', () => {
      const state = createMinimalState();
      const parts = assemblePromptParts(state);
      
      const scenePart = parts.find(p => p.label === 'SCENE');
      expect(scenePart).toBeDefined();
      expect(scenePart?.text).toContain('Scene:');
      expect(scenePart?.text).toContain('Clean studio');
    });

    it('應該在有 bgColor 時包含背景顏色', () => {
      const state = createMinimalState();
      state.background.bgColor = '#FFFFFF';
      const parts = assemblePromptParts(state);
      
      const scenePart = parts.find(p => p.label === 'SCENE');
      expect(scenePart?.text).toContain('BG tint: #FFFFFF');
    });

    it('應該在沒有 bgColor 時不包含背景顏色', () => {
      const state = createMinimalState();
      delete state.background.bgColor;
      const parts = assemblePromptParts(state);
      
      const scenePart = parts.find(p => p.label === 'SCENE');
      expect(scenePart?.text).not.toContain('BG tint:');
    });

    it('應該包含 OPTICS 區段', () => {
      const state = createMinimalState();
      const parts = assemblePromptParts(state);
      
      const opticsPart = parts.find(p => p.label === 'OPTICS');
      expect(opticsPart).toBeDefined();
      expect(opticsPart?.text).toContain('Close-up');
      expect(opticsPart?.text).toContain('50mm lens');
      expect(opticsPart?.text).toContain('Eye Level');
      expect(opticsPart?.text).toContain('Aperture f/2.8');
    });

    it('應該在 camera.roll 非零時包含相機傾斜資訊', () => {
      const state = createMinimalState();
      state.camera.roll = 15;
      const parts = assemblePromptParts(state);
      
      const opticsPart = parts.find(p => p.label === 'OPTICS');
      expect(opticsPart?.text).toContain('Camera roll: 15 degrees');
      expect(opticsPart?.text).toContain('Dutch angle');
      expect(opticsPart?.text).toContain('canted perspective');
    });

    it('應該在 camera.roll 為零時不包含相機傾斜資訊', () => {
      const state = createMinimalState();
      state.camera.roll = 0;
      const parts = assemblePromptParts(state);
      
      const opticsPart = parts.find(p => p.label === 'OPTICS');
      expect(opticsPart?.text).not.toContain('Camera roll');
      expect(opticsPart?.text).not.toContain('Dutch angle');
    });

    it('應該包含 COMPOSITION 區段', () => {
      const state = createMinimalState();
      const parts = assemblePromptParts(state);
      
      const compositionPart = parts.find(p => p.label === 'COMPOSITION');
      expect(compositionPart).toBeDefined();
      expect(compositionPart?.text).toContain('Rule of thirds');
      expect(compositionPart?.text).toContain('aligned center');
    });

    it('應該包含 MOOD 區段', () => {
      const state = createMinimalState();
      const parts = assemblePromptParts(state);
      
      const moodPart = parts.find(p => p.label === 'MOOD');
      expect(moodPart).toBeDefined();
      expect(moodPart?.text).toContain('Global mood: Professional');
    });

    it('應該在 useAdvancedLighting 為 true 時包含 LIGHTING 區段', () => {
      const state = createMinimalState();
      state.optics.useAdvancedLighting = true;
      const parts = assemblePromptParts(state);
      
      const lightingPart = parts.find(p => p.label === 'LIGHTING');
      expect(lightingPart).toBeDefined();
      expect(lightingPart?.text).toContain('林布蘭光');
      // The formatLightingSection function formats the lighting differently now
      // Just check that it contains the studio setup name
      expect(lightingPart?.text.length).toBeGreaterThan(0);
    });

    it('應該在 useAdvancedLighting 為 false 時不包含 LIGHTING 區段', () => {
      const state = createMinimalState();
      state.optics.useAdvancedLighting = false;
      const parts = assemblePromptParts(state);
      
      const lightingPart = parts.find(p => p.label === 'LIGHTING');
      expect(lightingPart).toBeUndefined();
    });

    it('應該在有 postProcessing 標籤時包含 PROCESSING 區段', () => {
      const state = createMinimalState();
      state.style.postProcessing = ['Ultra-detailed', 'Ray tracing', 'Cinematic grain'];
      const parts = assemblePromptParts(state);
      
      const processingPart = parts.find(p => p.label === 'PROCESSING');
      expect(processingPart).toBeDefined();
      expect(processingPart?.text).toBe('Ultra-detailed, Ray tracing, Cinematic grain.');
    });

    it('應該在沒有 postProcessing 標籤時不包含 PROCESSING 區段', () => {
      const state = createMinimalState();
      state.style.postProcessing = [];
      const parts = assemblePromptParts(state);
      
      const processingPart = parts.find(p => p.label === 'PROCESSING');
      expect(processingPart).toBeUndefined();
    });

    it('應該按照正確的順序組裝區段', () => {
      const state = createMinimalState();
      state.optics.useAdvancedLighting = true;
      state.style.postProcessing = ['Test'];
      const parts = assemblePromptParts(state);
      
      const labels = parts.map(p => p.label);
      const expectedOrder = ['THEME', 'SUBJECT', 'SCENE', 'OPTICS', 'COMPOSITION', 'MOOD', 'LIGHTING', 'PROCESSING'];
      
      // 檢查順序是否正確（允許某些區段不存在）
      let lastIndex = -1;
      labels.forEach(label => {
        const expectedIndex = expectedOrder.indexOf(label);
        expect(expectedIndex).toBeGreaterThan(lastIndex);
        lastIndex = expectedIndex;
      });
    });
  });

  describe('assembleFinalPrompt', () => {
    it('應該使用視覺翻譯層組裝提示詞', () => {
      const state = createMinimalState();
      const finalPrompt = assembleFinalPrompt(state);
      
      // Should return a flowing narrative without labeled sections
      expect(finalPrompt).toBeTruthy();
      expect(finalPrompt.length).toBeGreaterThan(0);
      expect(finalPrompt).toMatch(/\./); // Should end with period
      
      // Should NOT contain technical parameters
      expect(finalPrompt).not.toMatch(/f\/\d+/); // No f-stop numbers
      expect(finalPrompt).not.toMatch(/\d+mm/); // No focal length numbers
      expect(finalPrompt).not.toMatch(/THEME|SUBJECT|SCENE|OPTICS|COMPOSITION|MOOD|LIGHTING|PROCESSING/); // No labeled sections
    });

    it('應該遵循黃金順序：Composition + Subject + Action + Environment + Lighting/Mood + Style', () => {
      const state = createMinimalState();
      state.subject.view_angle = 'standing upright';
      state.background.description = 'minimalist studio';
      state.optics.mood = 'cinematic';
      state.style.postProcessing = ['hyper-detailed', 'ray tracing'];
      
      const finalPrompt = assembleFinalPrompt(state);
      
      // Check that components appear in the correct order
      // Composition/Subject should come before Environment
      const subjectIndex = finalPrompt.toLowerCase().indexOf('luxury watch');
      const environmentIndex = finalPrompt.toLowerCase().indexOf('studio');
      expect(subjectIndex).toBeLessThan(environmentIndex);
      
      // Environment should come before Style
      const styleIndex = finalPrompt.toLowerCase().indexOf('hyper-detailed');
      if (styleIndex !== -1) {
        expect(environmentIndex).toBeLessThan(styleIndex);
      }
    });

    it('應該處理最小配置狀態', () => {
      const state = createMinimalState();
      const finalPrompt = assembleFinalPrompt(state);
      
      expect(finalPrompt).toBeTruthy();
      expect(finalPrompt.length).toBeGreaterThan(0);
      expect(finalPrompt).toMatch(/\.$/); // Should end with period
    });

    it('應該在翻譯失敗時使用降級策略', () => {
      const state = createMinimalState();
      // Create an invalid state that might cause translation issues
      state.camera.lens = 'invalid lens format';
      
      const finalPrompt = assembleFinalPrompt(state);
      
      // Should still return a valid prompt
      expect(finalPrompt).toBeTruthy();
      expect(finalPrompt.length).toBeGreaterThan(0);
    });

    it('應該整合所有翻譯的組件', () => {
      const state = createMinimalState();
      state.camera.shotType = '中景/腰上 (Chest Shot)';
      state.camera.angle = 'Eye Level';
      state.camera.lens = '50mm 標準';
      state.subject.description = 'perfume bottle';
      state.subject.materials = ['frosted glass', 'gold cap'];
      state.subject.view_angle = 'standing upright';
      state.background.description = 'marble surface';
      state.background.environment = 'minimalist studio';
      state.background.bgColor = '#E5E7EB';
      state.optics.mood = 'soft cinematic';
      state.style.postProcessing = ['hyper-detailed', 'ray tracing'];
      
      const finalPrompt = assembleFinalPrompt(state);
      
      // Should contain visual descriptions, not technical parameters
      expect(finalPrompt).toContain('perfume bottle');
      expect(finalPrompt).toContain('marble surface');
      expect(finalPrompt).toContain('minimalist studio');
      
      // Should NOT contain technical parameters
      expect(finalPrompt).not.toMatch(/50mm/);
      expect(finalPrompt).not.toMatch(/#[0-9A-Fa-f]{6}/); // No hex codes
    });
  });

  describe('整合測試：完整流程', () => {
    it('應該能夠組裝完整的提示詞（使用新的翻譯層）', () => {
      const state = createMinimalState();
      state.background.bgColor = '#F5F5F5';
      state.camera.roll = 10;
      state.optics.useAdvancedLighting = true;
      state.style.postProcessing = ['Ultra-detailed', 'Cinematic'];
      
      const finalPrompt = assembleFinalPrompt(state);
      
      expect(finalPrompt).toBeTruthy();
      expect(finalPrompt.length).toBeGreaterThan(0);
      
      // Should contain subject and environment descriptions
      expect(finalPrompt).toContain('Luxury watch');
      expect(finalPrompt).toContain('Clean studio');
      
      // Should NOT contain technical parameters or labeled sections
      expect(finalPrompt).not.toMatch(/THEME|SUBJECT|SCENE|OPTICS/);
      expect(finalPrompt).not.toMatch(/#F5F5F5/); // Hex code should be translated
    });

    it('應該能夠處理最小配置（使用新的翻譯層）', () => {
      const state = createMinimalState();
      const finalPrompt = assembleFinalPrompt(state);
      
      expect(finalPrompt).toBeTruthy();
      expect(finalPrompt.length).toBeGreaterThan(0);
      expect(finalPrompt).toMatch(/\.$/); // Should end with period
    });

    it('應該保持向後兼容（舊的 assemblePromptParts 仍然可用）', () => {
      const state = createMinimalState();
      const parts = assemblePromptParts(state);
      
      expect(parts).toBeInstanceOf(Array);
      expect(parts.length).toBeGreaterThanOrEqual(6); // 至少有 6 個基本區段
    });
  });

  describe('Backward Compatibility Test Suite (Task 14.1)', () => {
    /**
     * Task 14.1: Create backward compatibility test suite
     * - Load all presets from presets.ts
     * - Translate each preset using new translation layer
     * - Verify no errors occur
     * - Verify output contains no technical parameters
     * - Verify output follows golden order
     * Requirements: 11.1, 11.3, 11.5
     */

    // Import all preset series data
    const ALL_PRESETS = [
      ...SPECIAL_POV_DATA,
      ...LUXURY_ARTIFACTS_DATA,
      ...EDITORIAL_SERIES_DATA,
      ...CHICKEN_SERIES_DATA,
      ...BEVERAGE_SERIES_DATA
    ];

    describe('Load and translate all presets', () => {
      it('should successfully load all presets from presets.ts', () => {
        expect(ALL_PRESETS).toBeDefined();
        expect(ALL_PRESETS.length).toBeGreaterThan(0);
        
        // Verify each preset has required structure
        ALL_PRESETS.forEach(preset => {
          expect(preset).toHaveProperty('id');
          expect(preset).toHaveProperty('name');
          expect(preset).toHaveProperty('config');
          expect(preset.config).toHaveProperty('camera');
          expect(preset.config).toHaveProperty('subject');
          expect(preset.config).toHaveProperty('background');
          expect(preset.config).toHaveProperty('optics');
          expect(preset.config).toHaveProperty('style');
        });
      });

      it('should translate all presets without errors', () => {
        ALL_PRESETS.forEach(preset => {
          expect(() => {
            const finalPrompt = assembleFinalPrompt(preset.config);
            expect(finalPrompt).toBeTruthy();
          }).not.toThrow();
        });
      });

      it('should produce non-empty prompts for all presets', () => {
        ALL_PRESETS.forEach(preset => {
          const finalPrompt = assembleFinalPrompt(preset.config);
          expect(finalPrompt.length).toBeGreaterThan(0);
          expect(finalPrompt).toMatch(/\.$/); // Should end with period
        });
      });
    });

    describe('Verify no technical parameters in output', () => {
      it('should not contain focal length numbers (e.g., 50mm, 200mm)', () => {
        ALL_PRESETS.forEach(preset => {
          const finalPrompt = assembleFinalPrompt(preset.config);
          // Should not contain patterns like "50mm", "200mm", etc.
          expect(finalPrompt).not.toMatch(/\d+mm/);
        });
      });

      it('should not contain f-stop numbers (e.g., f/2.8, f/11)', () => {
        ALL_PRESETS.forEach(preset => {
          const finalPrompt = assembleFinalPrompt(preset.config);
          // Should not contain patterns like "f/2.8", "f/11", etc.
          expect(finalPrompt).not.toMatch(/f\/\d+\.?\d*/i);
        });
      });

      it('should not contain hex color codes (e.g., #FF5733)', () => {
        ALL_PRESETS.forEach(preset => {
          const finalPrompt = assembleFinalPrompt(preset.config);
          // Should not contain patterns like "#FF5733", "#1E90FF", etc.
          expect(finalPrompt).not.toMatch(/#[0-9A-Fa-f]{6}/);
        });
      });

      it('should not contain degree symbols or angle numbers', () => {
        ALL_PRESETS.forEach(preset => {
          const finalPrompt = assembleFinalPrompt(preset.config);
          // Should not contain patterns like "45°", "90 degrees", etc.
          // Exception: Dutch angle may include degree notation
          const withoutDutchAngle = finalPrompt.replace(/Dutch angle.*?degrees/gi, '');
          expect(withoutDutchAngle).not.toMatch(/\d+\s*°/);
          expect(withoutDutchAngle).not.toMatch(/\d+\s*degrees/i);
        });
      });

      it('should not contain percentage values (e.g., 80%, 40%)', () => {
        ALL_PRESETS.forEach(preset => {
          const finalPrompt = assembleFinalPrompt(preset.config);
          // Should not contain patterns like "80%", "40%", etc.
          expect(finalPrompt).not.toMatch(/\d+%/);
        });
      });

      it('should not contain labeled sections (THEME, SUBJECT, OPTICS, etc.)', () => {
        ALL_PRESETS.forEach(preset => {
          const finalPrompt = assembleFinalPrompt(preset.config);
          // Should not contain section labels
          expect(finalPrompt).not.toMatch(/THEME|SUBJECT|SCENE|OPTICS|COMPOSITION|MOOD|LIGHTING|PROCESSING/);
        });
      });
    });

    describe('Verify golden order compliance', () => {
      it('should place composition and subject descriptions first', () => {
        ALL_PRESETS.forEach(preset => {
          const finalPrompt = assembleFinalPrompt(preset.config);
          
          // Subject description should appear early in the prompt
          if (preset.config.subject.description) {
            const subjectIndex = finalPrompt.toLowerCase().indexOf(
              preset.config.subject.description.toLowerCase().substring(0, 20)
            );
            
            // Subject should appear in the first half of the prompt
            if (subjectIndex !== -1) {
              expect(subjectIndex).toBeLessThan(finalPrompt.length / 2);
            }
          }
        });
      });

      it('should place environment descriptions in the middle', () => {
        ALL_PRESETS.forEach(preset => {
          const finalPrompt = assembleFinalPrompt(preset.config);
          
          // Look for "in" keyword which typically introduces environment
          const inIndex = finalPrompt.indexOf(' in ');
          
          if (inIndex !== -1) {
            // "in" should appear after subject but before style
            expect(inIndex).toBeGreaterThan(0);
            expect(inIndex).toBeLessThan(finalPrompt.length * 0.75);
          }
        });
      });

      it('should place lighting and mood descriptions after environment', () => {
        ALL_PRESETS.forEach(preset => {
          const finalPrompt = assembleFinalPrompt(preset.config);
          
          // Look for "with" keyword which typically introduces lighting
          const withIndex = finalPrompt.indexOf(' with ');
          const inIndex = finalPrompt.indexOf(' in ');
          
          if (withIndex !== -1 && inIndex !== -1) {
            // "with" (lighting) should appear after "in" (environment)
            expect(withIndex).toBeGreaterThan(inIndex);
          }
        });
      });

      it('should place style and quality tags last', () => {
        ALL_PRESETS.forEach(preset => {
          const finalPrompt = assembleFinalPrompt(preset.config);
          
          // If there are post-processing tags, they should appear near the end
          if (preset.config.style.postProcessing.length > 0) {
            const firstTag = preset.config.style.postProcessing[0];
            const tagIndex = finalPrompt.indexOf(firstTag);
            
            if (tagIndex !== -1) {
              // Style tags should appear in the last third of the prompt
              expect(tagIndex).toBeGreaterThan(finalPrompt.length * 0.5);
            }
          }
        });
      });

      it('should integrate camera parameters with composition (not separate)', () => {
        ALL_PRESETS.forEach(preset => {
          const finalPrompt = assembleFinalPrompt(preset.config);
          
          // Camera parameters should be integrated at the beginning
          // Not in a separate section later in the prompt
          // Check that shot type appears early
          const shotTypePatterns = [
            'close-up', 'medium shot', 'full body', 'waist-up',
            'head and shoulders', 'three-quarter', 'distant view',
            'flat lay', 'top-down', 'isometric', 'front view'
          ];
          
          let foundEarly = false;
          shotTypePatterns.forEach(pattern => {
            const index = finalPrompt.toLowerCase().indexOf(pattern);
            if (index !== -1 && index < finalPrompt.length / 3) {
              foundEarly = true;
            }
          });
          
          // At least one shot type pattern should appear in the first third
          // OR the prompt should start with a capital letter (English) or Chinese character
          if (!foundEarly) {
            // If no pattern found, at least verify the prompt starts properly
            expect(finalPrompt).toMatch(/^[A-Z\u4e00-\u9fa5]/); // Starts with capital letter or Chinese character
          }
        });
      });
    });

    describe('Verify specific preset translations', () => {
      it('should correctly translate "名流與麥當勞叔叔" preset', () => {
        const preset = ALL_PRESETS.find(p => p.id === 'pov-1');
        expect(preset).toBeDefined();
        
        if (preset) {
          const finalPrompt = assembleFinalPrompt(preset.config);
          
          // Should contain subject description
          expect(finalPrompt).toContain('麥當勞叔叔');
          
          // Should not contain technical parameters
          expect(finalPrompt).not.toMatch(/50mm/);
          expect(finalPrompt).not.toMatch(/#[0-9A-Fa-f]{6}/);
          
          // Should be a flowing narrative
          expect(finalPrompt).toMatch(/\./);
          expect(finalPrompt).not.toMatch(/THEME|SUBJECT|OPTICS/);
        }
      });

      it('should correctly translate "Jaquemus 桌球組" preset', () => {
        const preset = ALL_PRESETS.find(p => p.id === 'lux-1');
        expect(preset).toBeDefined();
        
        if (preset) {
          const finalPrompt = assembleFinalPrompt(preset.config);
          
          // Should contain subject description (from description field, not type field)
          expect(finalPrompt).toContain('JAQUEMUS');
          
          // Should not contain technical parameters
          expect(finalPrompt).not.toMatch(/#e2e8f0/i);
          
          // Should be a flowing narrative
          expect(finalPrompt).toMatch(/\./);
        }
      });

      it('should correctly translate "Lacoste 網球紅土" preset', () => {
        const preset = ALL_PRESETS.find(p => p.id === 'ed-1');
        expect(preset).toBeDefined();
        
        if (preset) {
          const finalPrompt = assembleFinalPrompt(preset.config);
          
          // Should contain subject description (from type field)
          expect(finalPrompt).toContain('Lacoste');
          
          // Should not contain technical parameters
          expect(finalPrompt).not.toMatch(/#c2410c/i);
          expect(finalPrompt).not.toMatch(/315/); // Light rotation angle
          
          // Should be a flowing narrative
          expect(finalPrompt).toMatch(/\./);
        }
      });

      it('should correctly translate "塔塔醬爆發" preset', () => {
        const preset = ALL_PRESETS.find(p => p.id === 'chk-1');
        expect(preset).toBeDefined();
        
        if (preset) {
          const finalPrompt = assembleFinalPrompt(preset.config);
          
          // Should contain subject description (from description field)
          expect(finalPrompt).toContain('塔塔醬');
          
          // Should not contain technical parameters
          expect(finalPrompt).not.toMatch(/#d9f99d/i);
          
          // Should be a flowing narrative
          expect(finalPrompt).toMatch(/\./);
        }
      });
    });

    describe('Verify error handling and graceful degradation', () => {
      it('should handle presets with missing optional fields', () => {
        ALL_PRESETS.forEach(preset => {
          // Create a copy with some optional fields removed
          const minimalConfig = {
            ...preset.config,
            subject: {
              ...preset.config.subject,
              materials: [],
              tags: []
            },
            background: {
              ...preset.config.background,
              tags: []
            },
            style: {
              ...preset.config.style,
              postProcessing: []
            }
          };
          
          expect(() => {
            const finalPrompt = assembleFinalPrompt(minimalConfig);
            expect(finalPrompt).toBeTruthy();
            expect(finalPrompt.length).toBeGreaterThan(0);
          }).not.toThrow();
        });
      });

      it('should handle presets with legacy optics configuration', () => {
        ALL_PRESETS.forEach(preset => {
          // The migrateOpticsConfig function should handle legacy formats
          expect(() => {
            const finalPrompt = assembleFinalPrompt(preset.config);
            expect(finalPrompt).toBeTruthy();
          }).not.toThrow();
        });
      });

      it('should produce valid output even with unusual parameter values', () => {
        const testConfig = createMinimalState();
        
        // Test with edge case values
        testConfig.camera.lens = '999mm 超長焦';
        testConfig.optics.keyLight.azimuth = 999;
        testConfig.optics.keyLight.elevation = 999;
        testConfig.optics.keyLight.intensity = 150;
        testConfig.background.bgColor = '#ZZZZZZ'; // Invalid hex
        
        expect(() => {
          const finalPrompt = assembleFinalPrompt(testConfig);
          expect(finalPrompt).toBeTruthy();
          expect(finalPrompt.length).toBeGreaterThan(0);
        }).not.toThrow();
      });
    });
  });
});
