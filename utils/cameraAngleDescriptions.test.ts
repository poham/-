import { describe, it, expect } from 'vitest';
import { 
  getCameraAngleDescription, 
  getCameraAngleHint, 
  getCameraAngleColor,
  getCompleteCameraPrompt,
  getCameraAngleLabel,
  getAzimuthHint
} from './cameraAngleDescriptions';

describe('getCameraAngleDescription - 模組化系統', () => {
  it('標準正視 (Azimuth: 0°, Elevation: 0°)', () => {
    const result = getCameraAngleDescription(0, 0);
    expect(result).toContain('EYE LEVEL SHOT');
    expect(result).toContain('facing');
    expect(result).toContain('FRONT View');
  });

  it('背面視角 (Azimuth: ±180°, Elevation: 0°)', () => {
    const result180 = getCameraAngleDescription(180, 0);
    const resultNeg180 = getCameraAngleDescription(-180, 0);
    expect(result180).toContain('DIRECT BACK View');
    expect(resultNeg180).toContain('DIRECT BACK View');
  });

  it('正頂視圖 (Elevation: 85°)', () => {
    const result = getCameraAngleDescription(0, 85);
    expect(result).toContain('TOP DOWN FLAT LAY');
    expect(result).toContain('Knolling');
  });

  it('蟲視角 (Elevation: -85°)', () => {
    const result = getCameraAngleDescription(0, -85);
    expect(result).toContain('EXTREME WORM\'S EYE VIEW');
    expect(result).toContain('Camera on floor');
  });

  it('經典 45 度角 (Azimuth: 45°, Elevation: 20°)', () => {
    const result = getCameraAngleDescription(45, 20);
    expect(result).toContain('HIGH ANGLE SHOT');
    expect(result).toContain('looking down');
    expect(result).toContain('FRONT-RIGHT 3/4 View');
  });

  it('右側正交視角 (Azimuth: 90°)', () => {
    const result = getCameraAngleDescription(90, 0);
    expect(result).toContain('RIGHT SIDE PROFILE');
  });

  it('左側正交視角 (Azimuth: -90°)', () => {
    const result = getCameraAngleDescription(-90, 0);
    expect(result).toContain('LEFT SIDE PROFILE');
  });

  it('左前 3/4 視角 (Azimuth: -45°)', () => {
    const result = getCameraAngleDescription(-45, 0);
    expect(result).toContain('FRONT-LEFT 3/4 View');
  });

  it('包含視覺細節的完整描述', () => {
    const result = getCameraAngleDescription(0, 0, true);
    expect(result).toContain('horizontal perspective');
    expect(result).toContain('symmetrical alignment');
  });
});

describe('getCompleteCameraPrompt - 完整 Prompt 生成', () => {
  it('極端低角度應包含透視補償', () => {
    const result = getCompleteCameraPrompt(-45, -70);
    expect(result).toContain('dramatic foreshortening');
  });

  it('正交角度應包含平面構圖建議', () => {
    const result = getCompleteCameraPrompt(0, 0);
    expect(result).toContain('flat composition');
  });
});

describe('getCameraAngleColor - 顏色主題', () => {
  it('不同仰角應返回正確顏色', () => {
    expect(getCameraAngleColor(85)).toBe('purple');  // 正頂視圖
    expect(getCameraAngleColor(50)).toBe('violet');  // 鳥瞰
    expect(getCameraAngleColor(20)).toBe('cyan');    // 高角度
    expect(getCameraAngleColor(0)).toBe('blue');     // 水平
    expect(getCameraAngleColor(-20)).toBe('yellow'); // 微仰角
    expect(getCameraAngleColor(-50)).toBe('orange'); // 低角度
    expect(getCameraAngleColor(-80)).toBe('red');    // 蟲視
  });
});

describe('getCameraAngleHint - 中文提示', () => {
  it('應返回適當的中文提示', () => {
    expect(getCameraAngleHint(85)).toContain('正頂視圖');
    expect(getCameraAngleHint(50)).toContain('鳥瞰');
    expect(getCameraAngleHint(0)).toContain('水平視角');
    expect(getCameraAngleHint(-70)).toContain('蟲視角');
  });
});

describe('getAzimuthHint - 方位角提示', () => {
  it('應返回正確的方位角提示', () => {
    expect(getAzimuthHint(0)).toContain('正面視角');
    expect(getAzimuthHint(45)).toContain('右前 3/4');
    expect(getAzimuthHint(90)).toContain('右側視角');
    expect(getAzimuthHint(-45)).toContain('左前 3/4');
    expect(getAzimuthHint(180)).toContain('背面視角');
  });
});

describe('getCameraAngleLabel - UI 標籤', () => {
  it('應生成簡短的 UI 標籤', () => {
    const label = getCameraAngleLabel(0, 45);
    expect(label).toContain('EYE LEVEL SHOT');
    expect(label).toContain('•');
  });
});
