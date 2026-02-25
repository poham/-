/**
 * 大遠景優先模式測試
 * 驗證大遠景模式下的詞序邏輯和主體轉譯
 */

import { describe, it, expect } from 'vitest';
import { translatePromptState } from './visualTranslators';
import { PromptState } from '../types';

describe('大遠景優先模式 (Wide Shot Override Mode)', () => {
  it('大遠景寫實模式：EXTREME WIDE 應該篡位到最前面', () => {
    const state: PromptState = {
      camera: {
        shotType: '大遠景',
        angle: 'Eye Level',
        aspectRatio: '16:9',
        lens: '24mm 廣角',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product',
        photographyMode: 'commercial',
        scaleMode: 'realistic'
      },
      subject: {
        type: 'table tennis racket',
        description: 'professional equipment',
        materials: ['linen', 'wood'],
        tags: [],
        view_angle: '',
        key_feature: ''
      },
      background: {
        description: 'minimalist grey studio',
        environment: 'infinite backdrop',
        tags: []
      },
      optics: {
        dof: 'f/8',
        keyLight: { azimuth: 45, elevation: 30, color: '#ffffff', intensity: 80 },
        fillLight: { azimuth: 225, elevation: 20, color: '#cbd5e1', intensity: 30 },
        rimLight: { azimuth: 180, elevation: 0, color: '#ffffff', intensity: 50 },
        ambientColor: '#1a1a1a',
        studioSetup: 'none',
        source: 'natural light',
        mood: 'minimalist',
        useAdvancedLighting: false
      },
      style: {
        visualStyle: 'Cinematic',
        postProcessing: [],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    };

    const translated = translatePromptState(state);
    const composition = translated.composition.toLowerCase();

    // 驗證：EXTREME WIDE 在最前面
    expect(composition).toMatch(/^extreme wide/i);
    
    // 驗證：包含寫實模式關鍵詞
    expect(composition).toContain('negative space');
    expect(composition).toContain('realistic proportions');
    
    // 驗證：Cinematic 在後面
    const widePos = composition.indexOf('extreme wide');
    const cinematicPos = composition.indexOf('cinematic');
    expect(widePos).toBeLessThan(cinematicPos);
    
    console.log('\n【大遠景寫實 Composition】:', composition);
  });

  it('大遠景巨物模式：應該包含 Surreal 和 Monumental 關鍵詞', () => {
    const state: PromptState = {
      camera: {
        shotType: '極遠景',
        angle: 'Low Angle',
        aspectRatio: '16:9',
        lens: '14mm 超廣角',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: -45,
        framingMode: 'product',
        photographyMode: 'commercial',
        scaleMode: 'surreal'
      },
      subject: {
        type: 'table tennis racket',
        description: '',
        materials: [],
        tags: [],
        view_angle: '',
        key_feature: ''
      },
      background: {
        description: 'urban landscape',
        environment: 'city skyline',
        tags: []
      },
      optics: {
        dof: 'f/11',
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
        visualStyle: 'Cinematic',
        postProcessing: [],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    };

    const translated = translatePromptState(state);
    const composition = translated.composition.toLowerCase();

    // 驗證：包含巨物模式關鍵詞
    expect(composition).toContain('surreal');
    expect(composition).toContain('monumental');
    
    // 驗證：不應該包含 "negative space"（巨物模式不需要留白）
    expect(composition).not.toContain('negative space');
    
    console.log('\n【大遠景巨物 Composition】:', composition);
  });

  it('大遠景寫實模式：主體應該轉換為「微小」描述', () => {
    const state: PromptState = {
      camera: {
        shotType: '大遠景',
        angle: 'Eye Level',
        aspectRatio: '16:9',
        lens: '24mm 廣角',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: 0,
        framingMode: 'product',
        photographyMode: 'commercial',
        scaleMode: 'realistic'
      },
      subject: {
        type: 'table tennis racket',
        description: 'with JAQUEMUS branding',
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
        dof: 'f/8',
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

    // 驗證：包含「微小」關鍵詞
    expect(subject).toMatch(/tiny|small|distant/i);
    
    // 驗證：包含「孤獨」或「遠處」的描述
    expect(subject).toMatch(/solitary|in the distance|placed/i);
    
    console.log('\n【大遠景寫實 Subject】:', subject);
  });

  it('大遠景巨物模式：主體應該轉換為「巨大」描述', () => {
    const state: PromptState = {
      camera: {
        shotType: '極遠景',
        angle: 'Low Angle',
        aspectRatio: '16:9',
        lens: '14mm 超廣角',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: -45,
        framingMode: 'product',
        photographyMode: 'commercial',
        scaleMode: 'surreal'
      },
      subject: {
        type: 'table tennis racket',
        description: 'with visible texture',
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
        dof: 'f/11',
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

    // 驗證：包含「巨大」關鍵詞
    expect(subject).toMatch(/colossal|giant|monumental|towering/i);
    
    // 驗證：包含比例參照
    expect(subject).toMatch(/skyscraper|structure|larger than life/i);
    
    console.log('\n【大遠景巨物 Subject】:', subject);
  });

  it('大遠景寫實模式：低角度應該轉譯為「低地平線」', () => {
    const state: PromptState = {
      camera: {
        shotType: '大遠景',
        angle: 'Low Angle',
        aspectRatio: '16:9',
        lens: '24mm 廣角',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: -45,
        framingMode: 'product',
        photographyMode: 'commercial',
        scaleMode: 'realistic'
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
        dof: 'f/8',
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

    // 驗證：包含「低地平線」相關描述
    expect(composition).toMatch(/low horizon|endless floor|vast ceiling/i);
    
    // 驗證：不應該包含「looking up」（普通模式的低角度）
    expect(composition).not.toContain('looking up');
    
    console.log('\n【大遠景寫實低角度 Composition】:', composition);
  });

  it('大遠景巨物模式：低角度應該轉譯為「仰視巨物」', () => {
    const state: PromptState = {
      camera: {
        shotType: '極遠景',
        angle: 'Low Angle',
        aspectRatio: '16:9',
        lens: '14mm 超廣角',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: -45,
        framingMode: 'product',
        photographyMode: 'commercial',
        scaleMode: 'surreal'
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
        dof: 'f/11',
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

    // 驗證：包含「仰視」和「巨物」相關描述
    expect(composition).toMatch(/low angle looking up|towering|dramatic scale|looming/i);
    
    console.log('\n【大遠景巨物低角度 Composition】:', composition);
  });

  it('非大遠景模式：應該使用標準詞序邏輯', () => {
    const state: PromptState = {
      camera: {
        shotType: '中特寫/胸上',
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

    // 驗證：不應該包含大遠景關鍵詞
    expect(composition).not.toContain('extreme wide');
    expect(composition).not.toContain('establishing shot');
    
    // 驗證：應該使用標準詞序（camera positioned at 在前）
    expect(composition).toContain('camera positioned at');
    
    console.log('\n【標準模式 Composition】:', composition);
  });
});
