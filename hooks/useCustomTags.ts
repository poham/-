import { useState, useEffect, useCallback } from 'react';
import { CustomTags } from '../types';
import { safeLocalStorageGet, safeLocalStorageSet, STORAGE_KEYS } from '../utils/storage';

/**
 * useCustomTags Hook
 * 
 * 管理使用者自定義的標籤集合，包含：
 * - LocalStorage 自動持久化
 * - 新增和刪除標籤的函數
 * - 自動遷移舊版顏色資料
 * 
 * @returns {Object} 包含 customTags, setCustomTags, addTag, removeTag
 */
export function useCustomTags() {
  // 從 LocalStorage 初始化
  const [customTags, setCustomTags] = useState<CustomTags>(() => {
    const defaultTags: CustomTags = {
      subject: [],
      background: [],
      cameraAngle: [],
      mood: [],
      style: [],
      colors: [],
    };
    
    const loadedTags = safeLocalStorageGet<CustomTags>(
      STORAGE_KEYS.CUSTOM_TAGS,
      defaultTags
    );
    
    // 確保 colors 欄位存在（向後相容舊版資料）
    if (!loadedTags.colors) {
      loadedTags.colors = [];
    }
    
    // 遷移舊版顏色資料（如果存在）
    if (loadedTags.colors.length === 0) {
      try {
        const oldColors = localStorage.getItem('nanoBanana_customColors');
        if (oldColors) {
          const parsedColors = JSON.parse(oldColors) as string[];
          loadedTags.colors = parsedColors;
          // 清除舊的 key
          localStorage.removeItem('nanoBanana_customColors');
          console.log('✅ 已遷移舊版顏色資料到新結構');
        }
      } catch (error) {
        console.error('遷移舊版顏色資料時發生錯誤:', error);
      }
    }
    
    return loadedTags;
  });

  // 自動持久化到 LocalStorage
  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.CUSTOM_TAGS, customTags);
  }, [customTags]);

  // 新增標籤到指定類別
  const addTag = useCallback((category: keyof CustomTags, tag: string) => {
    setCustomTags(prev => {
      // 避免重複新增
      if (prev[category].includes(tag)) {
        return prev;
      }
      return {
        ...prev,
        [category]: [...prev[category], tag],
      };
    });
  }, []);

  // 從指定類別移除標籤
  const removeTag = useCallback((category: keyof CustomTags, tag: string) => {
    setCustomTags(prev => ({
      ...prev,
      [category]: prev[category].filter(t => t !== tag),
    }));
  }, []);

  return {
    customTags,
    setCustomTags,
    addTag,
    removeTag,
  };
}
