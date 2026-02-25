/**
 * 詞序邏輯測試
 * 驗證黃金法則：物理視角 → 鏡頭光學 → 景別構圖 → 風格氣氛
 */

import { describe, it, expect } from 'vitest';
import { translatePromptState } from './visualTranslators';
import { PromptState } from '../types';

describe('詞序邏輯 - 黃金法則驗證', () => {
  it('極端仰角：物理視角應該在風格詞之前', () => {
    const state: PromptState = {
      camera: {
        shotType: '中特寫/肩上 (Bust Shot / BS)',
        angle: 'Low Angle',
        aspectRatio: '1:1',
        lens: '50mm 標準',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: -70,  // 極端仰角
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

    // 找到關鍵詞的位置
    const cameraPos = composition.indexOf('camera positioned at');
    const extremeWormPos = composition.indexOf('extreme worm');
    const cinematicPos = composition.indexOf('cinematic');

    // 驗證：物理視角在風格詞之前
    expect(cameraPos).toBeGreaterThan(-1);
    expect(extremeWormPos).toBeGreaterThan(-1);
    expect(cinematicPos).toBeGreaterThan(-1);
    expect(extremeWormPos).toBeLessThan(cinematicPos);
    
    console.log('\n【Composition】:', composition);
    console.log('物理視角位置:', extremeWormPos);
    console.log('風格詞位置:', cinematicPos);
  });

  it('極端角度：應該包含透視補償，不應該有 zero distortion', () => {
    const state: PromptState = {
      camera: {
        shotType: '中特寫/肩上 (Bust Shot / BS)',
        angle: 'Low Angle',
        aspectRatio: '1:1',
        lens: '50mm 標準',
        roll: 0,
        composition: {
          rule: 'Rule of Thirds',
          focal_point: 'center',
          alignment: 'center'
        },
        cameraAzimuth: 0,
        cameraElevation: -70,  // 極端仰角
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
        postProcessing: [],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    };

    const translated = translatePromptState(state);
    const composition = translated.composition.toLowerCase();

    // 應該包含透視補償
    const hasForeshortening = composition.includes('foreshortening') || 
                             composition.includes('wide angle');
    expect(hasForeshortening).toBe(true);

    // 不應該有 zero distortion（這會與極端角度矛盾）
    const hasZeroDistortion = composition.includes('zero distortion');
    expect(hasZeroDistortion).toBe(false);
    
    console.log('\n【極端角度 Composition】:', composition);
    console.log('包含透視補償:', hasForeshortening);
    console.log('無 zero distortion:', !hasZeroDistortion);
  });

  it('標準視角：可以有 zero distortion', () => {
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
        cameraElevation: 0,  // 水平視角
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
        postProcessing: [],
        filmStyle: 'None',
        grain: 'None',
        vignette: false
      }
    };

    const translated = translatePromptState(state);
    const composition = translated.composition.toLowerCase();

    // 標準視角可以有 zero distortion
    const hasZeroDistortion = composition.includes('zero distortion');
    expect(hasZeroDistortion).toBe(true);
    
    console.log('\n【標準視角 Composition】:', composition);
    console.log('包含 zero distortion:', hasZeroDistortion);
  });
});
