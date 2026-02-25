import { SidebarState } from '../types';

/**
 * 響應式斷點常數
 * mobile: < 768px
 * tablet: 768px - 1499px
 * desktop: >= 1500px
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1500,
} as const;

/**
 * 裝置類型
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

/**
 * 根據視窗寬度判斷裝置類型
 * @param width - 視窗寬度（像素）
 * @returns 裝置類型
 */
export function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
}

/**
 * 根據裝置類型取得預設的側邊欄狀態
 * - Desktop: 兩側欄位都開啟
 * - Tablet: 兩側欄位都收合（避免擋住中央內容）
 * - Mobile: 兩側欄位都收合
 * 
 * @param deviceType - 裝置類型
 * @returns 側邊欄狀態
 */
export function getDefaultSidebarState(deviceType: DeviceType): SidebarState {
  switch (deviceType) {
    case 'mobile':
    case 'tablet':
      return { leftSidebarOpen: false, rightSidebarOpen: false };
    case 'desktop':
    default:
      return { leftSidebarOpen: true, rightSidebarOpen: true };
  }
}
