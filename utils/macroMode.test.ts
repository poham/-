/**
 * 微距優先模式測試
 * 驗證微距模式下的詞序邏輯和主體轉譯
 */

import { describe, it, expect } from 'vitest';
import { translatePromptState } from './visualTranslators';
import { PromptState } from '../types';

describe('微距優先模式 (Macro Override Mode)', () => {
  it('微距模式：EXTREME MACRO 應該篡位到最前面', () => {
    const state: PromptState = {
      camera: {
        shotType: '微距 (Macro Shot)',
        angle: 'Eye Level',
        aspectRatio: '1:1',
        lens: '100mm 微距',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product',
        photographyMode: 'commercial'
      },
      subject: {
        type: 'table tennis racket',
        description: 'professional equipment',
        materials: ['linen', 'wood'],
        tags: [],
        view_angle: 'facing front',
        key_feature: 'surface texture'
      },
      background: {
        description: 'neutral studio',
        environment: 'clean backdrop',
        tags: []
      },
      optics: {
        dof: 'f/2.8',
        keyLight: { azimuth: 45, elevation: 30, color: '#ffffff', intensity: 80 },
        fillLight: { azimuth: 225, elevation: 20, color: '#cbd5e1', intensity: 30 },
        rimLight: { azimuth: 180, elevation: 0, color: '#ffffff', intensity: 50 },
        ambientColor: '#1a1a1a',
        studioSetup: 'none',
        source: 'studio lighting',
        mood: 'clinical precision',
        useAdvancedLighting: true
      },
      style: {
        visualStyle: 'Cinematic',
        postProcessing: ['ultra-sharp detail'],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    };

    const translated = translatePromptState(state);
    const composition = translated.composition.toLowerCase();

    // 驗證：EXTREME MACRO 在最前面
    expect(composition).toMatch(/^extreme macro/i);
    
    // 驗證：包含微距關鍵詞
    expect(composition).toContain('1:1 macro detail');
    expect(composition).toContain('microscopic view');
    
    // 驗證：Cinematic 在後面
    const macroPos = composition.indexOf('extreme macro');
    const cinematicPos = composition.indexOf('cinematic');
    expect(macroPos).toBeLessThan(cinematicPos);
    
    console.log('\n【微距模式 Composition】:', composition);
  });

  it('微距模式：低角度應該轉譯為「側掠光」而非「往上看」', () => {
    const state: PromptState = {
      camera: {
        shotType: '微距 (Macro Shot)',
        angle: 'Low Angle',
        aspectRatio: '1:1',
        lens: '100mm 微距',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: -45,  // 低角度
        framingMode: 'product',
        photographyMode: 'commercial'
      },
      subject: {
        type: 'table tennis racket',
        description: '',
        materials: ['linen'],
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
        keyLight: { azimuth: 45, elevation: 30, color: '#ffffff', intensity: 80 },
        fillLight: { azimuth: 225, elevation: 20, color: '#cbd5e1', intensity: 30 },
        rimLight: { azimuth: 180, elevation: 0, color: '#ffffff', intensity: 50 },
        ambientColor: '#1a1a1a',
        studioSetup: 'none',
        source: '',
        mood: '',
        useAdvancedLighting: false
      },
      style: {
        visualStyle: '',
        postProcessing: [],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    };

    const translated = translatePromptState(state);
    const composition = translated.composition.toLowerCase();

    // 驗證：包含「側掠光」相關描述
    expect(composition).toMatch(/raking light|side.*lit|surface relief/i);
    
    // 驗證：不應該包含「looking up」（普通模式的低角度描述）
    expect(composition).not.toContain('looking up');
    
    console.log('\n【微距低角度 Composition】:', composition);
  });

  it('微距模式：主體應該轉換為材質細節描述', () => {
    const state: PromptState = {
      camera: {
        shotType: '微距 (Macro Shot)',
        angle: 'Eye Level',
        aspectRatio: '1:1',
        lens: '100mm 微距',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product',
        photographyMode: 'commercial'
      },
      subject: {
        type: 'table tennis racket',
        description: '',
        materials: ['linen', 'wood'],
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
        keyLight: { azimuth: 45, elevation: 30, color: '#ffffff', intensity: 80 },
        fillLight: { azimuth: 225, elevation: 20, color: '#cbd5e1', intensity: 30 },
        rimLight: { azimuth: 180, elevation: 0, color: '#ffffff', intensity: 50 },
        ambientColor: '#1a1a1a',
        studioSetup: 'none',
        source: '',
        mood: '',
        useAdvancedLighting: false
      },
      style: {
        visualStyle: '',
        postProcessing: [],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    };

    const translated = translatePromptState(state);
    const subject = translated.subject.toLowerCase();

    // 驗證：包含材質紋理描述
    expect(subject).toMatch(/linen.*weave|fiber.*texture|wood.*grain|pore/i);
    
    // 驗證：不應該只是「table tennis racket」
    expect(subject).not.toBe('table tennis racket');
    
    console.log('\n【微距模式 Subject】:', subject);
  });

  it('微距模式：景深應該描述為「極淺」', () => {
    const state: PromptState = {
      camera: {
        shotType: '微距 (Macro Shot)',
        angle: 'Eye Level',
        aspectRatio: '1:1',
        lens: '100mm 微距',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product',
        photographyMode: 'commercial'
      },
      subject: {
        type: 'product',
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
        keyLight: { azimuth: 45, elevation: 30, color: '#ffffff', intensity: 80 },
        fillLight: { azimuth: 225, elevation: 20, color: '#cbd5e1', intensity: 30 },
        rimLight: { azimuth: 180, elevation: 0, color: '#ffffff', intensity: 50 },
        ambientColor: '#1a1a1a',
        studioSetup: 'none',
        source: '',
        mood: '',
        useAdvancedLighting: false
      },
      style: {
        visualStyle: '',
        postProcessing: [],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    };

    const translated = translatePromptState(state);
    const composition = translated.composition.toLowerCase();

    // 驗證：包含極淺景深描述
    expect(composition).toMatch(/depth of field falls off|millimeter.*thin|focus plane|background.*dissolved/i);
    
    console.log('\n【微距景深描述】:', composition);
  });

  it('非微距模式：應該使用標準詞序邏輯', () => {
    const state: PromptState = {
      camera: {
        shotType: '中特寫/肩上 (Bust Shot / BS)',
        angle: 'Eye Level',
        aspectRatio: '1:1',
        lens: '50mm 標準',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'portrait',
        photographyMode: 'commercial'
      },
      subject: {
        type: 'person',
        description: 'professional model',
        materials: [],
        tags: [],
        view_angle: 'facing front',
        key_feature: 'confident expression'
      },
      background: {
        description: 'minimalist studio',
        environment: 'clean backdrop',
        tags: []
      },
      optics: {
        dof: 'f/2.8',
        keyLight: { azimuth: 45, elevation: 30, color: '#ffffff', intensity: 80 },
        fillLight: { azimuth: 225, elevation: 20, color: '#cbd5e1', intensity: 30 },
        rimLight: { azimuth: 180, elevation: 0, color: '#ffffff', intensity: 50 },
        ambientColor: '#1a1a1a',
        studioSetup: 'rembrandt',
        source: 'studio lighting',
        mood: 'soft cinematic',
        useAdvancedLighting: true
      },
      style: {
        visualStyle: 'Cinematic',
        postProcessing: ['hyper-detailed'],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    };

    const translated = translatePromptState(state);
    const composition = translated.composition.toLowerCase();

    // 驗證：不應該包含微距關鍵詞
    expect(composition).not.toContain('extreme macro');
    expect(composition).not.toContain('microscopic');
    
    // 驗證：應該使用標準詞序（camera positioned at 在前）
    expect(composition).toContain('camera positioned at');
    
    console.log('\n【標準模式 Composition】:', composition);
  });
});
