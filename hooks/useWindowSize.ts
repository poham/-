import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

/**
 * useWindowSize Hook
 * 
 * 即時追蹤視窗尺寸變化（帶防抖優化）
 * 
 * @returns {WindowSize} 包含 width 和 height 的物件
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let timeoutId: number | undefined;

    // 處理視窗大小變化（帶防抖）
    const handleResize = () => {
      // 清除之前的 timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // 設定新的 timeout（100ms 防抖）
      timeoutId = window.setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    };

    // 註冊事件監聽器
    window.addEventListener('resize', handleResize);

    // 清理函數
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}
