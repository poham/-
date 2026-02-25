/**
 * 鏡頭-角度相容性系統測試
 */

import { describe, it, expect } from 'vitest';
import {
  detectLensType,
  detectAngleType,
  checkCompatibility,
  applyPrioritySorting
} from './lensAngleCompatibility';
import { PromptState, WarningType, PromptPriorityLevel } from '../types';

// 測試輔助函數
function createMockState(overrides: Partial<PromptState> = {}): PromptState {
  return {
    camera: {
      shotType: 'Medium Shot',
      angle: 'Eye Level',
      aspectRatio: '16:9',
      lens: '50mm',
      roll: 0,
      composition: {
        rule: 'Rule of Thirds',
        focal_point: 'center',
        alignment: 'center'
      },
      cameraAzimuth: 0,
      cameraElevation: 0,
      framingMode: 'auto',
      photographyMode: 'commercial',
      ...overrides.camera
    },
    subject: {
      type: 'Product',
      description: '',
      materials: [],
      tags: [],
      view_angle: '',
      key_feature: ''
    },
    background: {
      description: '',
      environment: '',
      tags: []
    },
    optics: {
      dof: 'f/2.8',
      keyLight: { azimuth: 45, elevation: 45, color: '#ffffff', intensity: 80 },
      fillLight: { azimuth: -45, elevation: 30, color: '#ffffff', intensity: 40 },
      rimLight: { azimuth: 180, elevation: 45, color: '#ffffff', intensity: 60 },
      ambientColor: '#ffffff',
      studioSetup: 'none',
      source: 'Natural Light',
      mood: 'Neutral',
      useAdvancedLighting: false
    },
    style: {
      visualStyle: 'Cinematic',
      postProcessing: [],
      filmStyle: 'None',
      grain: 'None',
      vignette: false
    },
    ...overrides
  } as PromptState;
}

describe('Lens Type Detection', () => {
  it('should detect fisheye lens', () => {
    expect(detectLensType('Fisheye 8mm', '')).toBe('fisheye');
  });
  
  it('should detect telephoto lens', () => {
    expect(detectLensType('Telephoto 200mm', '')).toBe('telephoto');
  });
  
  it('should detect macro from shot type', () => {
    expect(detectLensType('50mm', 'Extreme Macro')).toBe('macro');
  });
});

describe('Angle Type Detection', () => {
  it('should detect worms-eye view', () => {
    expect(detectAngleType(-60)).toBe('worms-eye');
  });
  
  it('should detect birds-eye view', () => {
    expect(detectAngleType(75)).toBe('birds-eye');
  });
});

describe('Fisheye Compatibility', () => {
  it('should add centered composition', () => {
    const state = createMockState({
      camera: { 
        lens: 'Fisheye 8mm', 
        shotType: 'Medium Shot',
        cameraElevation: 0 
      } as any
    });
    const result = checkCompatibility(state);
    
    expect(result.autoCorrections).toContainEqual(
      expect.objectContaining({
        action: 'add',
        value: 'centered composition'
      })
    );
  });
});

describe('Telephoto Compatibility', () => {
  it('should add compressed perspective', () => {
    const state = createMockState({
      camera: { 
        lens: 'Telephoto 200mm', 
        shotType: 'Medium Shot',
        cameraElevation: 0 
      } as any
    });
    const result = checkCompatibility(state);
    
    expect(result.autoCorrections).toContainEqual(
      expect.objectContaining({
        action: 'add',
        value: 'compressed perspective'
      })
    );
  });
  
  it('should warn about telephoto + worms-eye', () => {
    const state = createMockState({
      camera: { 
        lens: 'Telephoto 200mm', 
        shotType: 'Medium Shot',
        cameraElevation: -60 
      } as any
    });
    const result = checkCompatibility(state);
    
    const warning = result.warnings.find(w => w.type === WarningType.SUBOPTIMAL);
    expect(warning).toBeDefined();
    expect(warning?.message).toContain('狙擊手視角');
  });
});

describe('Macro Compatibility', () => {
  it('should translate low angle to raking light', () => {
    const state = createMockState({
      camera: { 
        lens: '50mm',
        shotType: 'Extreme Macro', 
        cameraElevation: -30 
      } as any
    });
    const result = checkCompatibility(state);
    
    expect(result.autoCorrections).toContainEqual(
      expect.objectContaining({
        action: 'replace',
        value: expect.stringContaining('raking light')
      })
    );
  });
  
  it('should add focus stacking for deep DOF', () => {
    const state = createMockState({
      camera: { 
        lens: '50mm',
        shotType: 'Extreme Macro', 
        cameraElevation: 0 
      } as any,
      optics: { 
        dof: 'f/22',
        keyLight: { azimuth: 45, elevation: 45, color: '#ffffff', intensity: 80 },
        fillLight: { azimuth: -45, elevation: 30, color: '#ffffff', intensity: 40 },
        rimLight: { azimuth: 180, elevation: 45, color: '#ffffff', intensity: 60 },
        ambientColor: '#ffffff',
        studioSetup: 'none',
        source: 'Natural Light',
        mood: 'Neutral',
        useAdvancedLighting: false
      } as any
    });
    const result = checkCompatibility(state);
    
    expect(result.autoCorrections).toContainEqual(
      expect.objectContaining({
        value: expect.stringContaining('focus stacking')
      })
    );
  });
});

describe('Priority Sorting', () => {
  it('should place special optics first', () => {
    const components = [
      'cinematic',
      'FISHEYE LENS',
      'subject',
      'wide angle'
    ];
    const order = [
      PromptPriorityLevel.SPECIAL_OPTICS,
      PromptPriorityLevel.LENS_FOCAL,
      PromptPriorityLevel.SUBJECT_STYLE
    ];
    
    const sorted = applyPrioritySorting(components, order);
    
    expect(sorted[0]).toContain('FISHEYE');
  });
});

describe('Mode Conflict Detection', () => {
  it('should detect macro + wide shot conflict', () => {
    const state = createMockState({
      camera: { 
        lens: '50mm',
        shotType: 'Extreme Macro',
        cameraElevation: 0,
        scaleMode: 'realistic'
      } as any
    });
    
    // 手動添加大遠景標記（模擬使用者同時選擇微距和大遠景）
    state.camera.shotType = 'Extreme Macro 大遠景';
    
    const result = checkCompatibility(state);
    
    const conflict = result.warnings.find(w => w.type === WarningType.CONFLICT);
    expect(conflict).toBeDefined();
    expect(conflict?.message).toContain('微距模式');
    expect(conflict?.message).toContain('大遠景模式');
    expect(conflict?.message).toContain('互斥');
    expect(result.isCompatible).toBe(false);
  });
  
  it('should detect wide shot + close-up conflict', () => {
    const state = createMockState({
      camera: { 
        lens: '24mm',
        shotType: 'Extreme Long Shot Close-up',
        cameraElevation: 0,
        scaleMode: 'realistic'
      } as any
    });
    
    const result = checkCompatibility(state);
    
    const conflict = result.warnings.find(w => w.type === WarningType.CONFLICT);
    expect(conflict).toBeDefined();
    expect(conflict?.message).toContain('大遠景模式');
    expect(conflict?.message).toContain('特寫');
    expect(conflict?.message).toContain('互斥');
    expect(result.isCompatible).toBe(false);
  });
  
  it('should warn about wide shot + telephoto (suboptimal)', () => {
    const state = createMockState({
      camera: { 
        lens: 'Telephoto 200mm',
        shotType: 'Extreme Long Shot',
        cameraElevation: 0,
        scaleMode: 'realistic'
      } as any
    });
    
    const result = checkCompatibility(state);
    
    const warning = result.warnings.find(w => w.type === WarningType.SUBOPTIMAL);
    expect(warning).toBeDefined();
    expect(warning?.message).toContain('大遠景');
    expect(warning?.message).toContain('廣角');
    expect(warning?.message).toContain('望遠鏡視角');
    
    // 應該添加補償描述
    const correction = result.autoCorrections.find(c => 
      c.value?.includes('zoom lens view')
    );
    expect(correction).toBeDefined();
  });
});
