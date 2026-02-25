import { useState, useEffect, useCallback } from 'react';
import { SidebarState } from '../types';
import { safeLocalStorageGet, safeLocalStorageSet, STORAGE_KEYS } from '../utils/storage';
import { getDeviceType, getDefaultSidebarState } from '../utils/responsive';

/**
 * useSidebarState Hook
 * 
 * 管理側邊欄的開合狀態，包含：
 * - LocalStorage 持久化
 * - 響應式斷點偵測和自動調整
 * - Toggle 函數
 * 
 * @returns {Object} 包含 sidebarState, toggleLeftSidebar, toggleRightSidebar
 */
export function useSidebarState() {
  // 從 LocalStorage 初始化，或根據螢幕尺寸設定預設值
  const [sidebarState, setSidebarState] = useState<SidebarState>(() => {
    const saved = safeLocalStorageGet<SidebarState | null>(
      STORAGE_KEYS.SIDEBAR_STATE,
      null
    );
    
    if (saved) {
      return saved;
    }
    
    // 如果沒有儲存的狀態，根據當前螢幕尺寸設定預設值
    const deviceType = getDeviceType(window.innerWidth);
    return getDefaultSidebarState(deviceType);
  });

  // 持久化到 LocalStorage
  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.SIDEBAR_STATE, sidebarState);
  }, [sidebarState]);

  // 響應式斷點偵測 - 監聽視窗大小變化並自動調整側邊欄狀態
  useEffect(() => {
    const handleResize = () => {
      const currentDeviceType = getDeviceType(window.innerWidth);
      
      // 根據裝置類型自動調整側邊欄狀態
      if (currentDeviceType === 'mobile' || currentDeviceType === 'tablet') {
        // 手機和平板：兩側欄位都收合
        if (sidebarState.leftSidebarOpen || sidebarState.rightSidebarOpen) {
          setSidebarState({ leftSidebarOpen: false, rightSidebarOpen: false });
        }
      } else if (currentDeviceType === 'desktop') {
        // 桌面：兩側欄位都開啟
        if (!sidebarState.leftSidebarOpen || !sidebarState.rightSidebarOpen) {
          setSidebarState({ leftSidebarOpen: true, rightSidebarOpen: true });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarState]);

  // Toggle 左側邊欄（開啟時自動關閉右側欄）
  const toggleLeftSidebar = useCallback(() => {
    setSidebarState(prev => {
      const newLeftState = !prev.leftSidebarOpen;
      // 如果要開啟左側欄，且在非桌面模式下，自動關閉右側欄
      if (newLeftState && getDeviceType(window.innerWidth) !== 'desktop') {
        return { leftSidebarOpen: true, rightSidebarOpen: false };
      }
      return { ...prev, leftSidebarOpen: newLeftState };
    });
  }, []);

  // Toggle 右側邊欄（開啟時自動關閉左側欄）
  const toggleRightSidebar = useCallback(() => {
    setSidebarState(prev => {
      const newRightState = !prev.rightSidebarOpen;
      // 如果要開啟右側欄，且在非桌面模式下，自動關閉左側欄
      if (newRightState && getDeviceType(window.innerWidth) !== 'desktop') {
        return { leftSidebarOpen: false, rightSidebarOpen: true };
      }
      return { ...prev, rightSidebarOpen: newRightState };
    });
  }, []);

  return {
    sidebarState,
    toggleLeftSidebar,
    toggleRightSidebar,
  };
}
