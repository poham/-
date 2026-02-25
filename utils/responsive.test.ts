import { describe, it, expect } from 'vitest';
import { BREAKPOINTS, getDeviceType, getDefaultSidebarState } from './responsive';

describe('responsive.ts', () => {
  describe('BREAKPOINTS', () => {
    it('應該定義正確的斷點值', () => {
      expect(BREAKPOINTS.mobile).toBe(768);
      expect(BREAKPOINTS.tablet).toBe(1024);
    });
  });

  describe('getDeviceType', () => {
    it('應該在寬度 < 768px 時返回 mobile', () => {
      expect(getDeviceType(0)).toBe('mobile');
      expect(getDeviceType(320)).toBe('mobile');
      expect(getDeviceType(767)).toBe('mobile');
    });

    it('應該在寬度 = 768px 時返回 tablet（邊界值測試）', () => {
      expect(getDeviceType(768)).toBe('tablet');
    });

    it('應該在寬度 768px - 1023px 時返回 tablet', () => {
      expect(getDeviceType(800)).toBe('tablet');
      expect(getDeviceType(900)).toBe('tablet');
      expect(getDeviceType(1023)).toBe('tablet');
    });

    it('應該在寬度 = 1024px 時返回 desktop（邊界值測試）', () => {
      expect(getDeviceType(1024)).toBe('desktop');
    });

    it('應該在寬度 >= 1024px 時返回 desktop', () => {
      expect(getDeviceType(1280)).toBe('desktop');
      expect(getDeviceType(1920)).toBe('desktop');
      expect(getDeviceType(3840)).toBe('desktop');
    });

    it('應該處理極端值', () => {
      expect(getDeviceType(1)).toBe('mobile');
      expect(getDeviceType(10000)).toBe('desktop');
    });
  });

  describe('getDefaultSidebarState', () => {
    it('應該在 mobile 裝置上返回兩側欄位都收合的狀態', () => {
      const state = getDefaultSidebarState('mobile');
      expect(state.leftSidebarOpen).toBe(false);
      expect(state.rightSidebarOpen).toBe(false);
    });

    it('應該在 tablet 裝置上返回左側開啟、右側收合的狀態', () => {
      const state = getDefaultSidebarState('tablet');
      expect(state.leftSidebarOpen).toBe(true);
      expect(state.rightSidebarOpen).toBe(false);
    });

    it('應該在 desktop 裝置上返回兩側欄位都開啟的狀態', () => {
      const state = getDefaultSidebarState('desktop');
      expect(state.leftSidebarOpen).toBe(true);
      expect(state.rightSidebarOpen).toBe(true);
    });
  });
});
