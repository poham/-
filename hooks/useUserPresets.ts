import { useState, useEffect, useCallback } from 'react';
import { Preset, PromptState } from '../types';
import { safeLocalStorageGet, safeLocalStorageSet, STORAGE_KEYS } from '../utils/storage';

/**
 * useUserPresets Hook
 * 
 * 管理使用者自定義的預設集合，包含：
 * - LocalStorage 自動持久化
 * - 儲存和刪除預設集的函數
 * 
 * @returns {Object} 包含 userPresets, setUserPresets, savePreset, deletePreset
 */
export function useUserPresets() {
  // 從 LocalStorage 初始化
  const [userPresets, setUserPresets] = useState<Preset[]>(() => {
    return safeLocalStorageGet<Preset[]>(
      STORAGE_KEYS.USER_PRESETS,
      []
    );
  });

  // 自動持久化到 LocalStorage
  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.USER_PRESETS, userPresets);
  }, [userPresets]);

  // 儲存新的預設集
  const savePreset = useCallback((name: string, config: PromptState) => {
    const newPreset: Preset = {
      id: `user-${Date.now()}`,
      name,
      description: '使用者自定義預設',
      config,
    };

    setUserPresets(prev => [...prev, newPreset]);
  }, []);

  // 刪除預設集
  const deletePreset = useCallback((id: string) => {
    setUserPresets(prev => prev.filter(preset => preset.id !== id));
  }, []);

  return {
    userPresets,
    setUserPresets,
    savePreset,
    deletePreset,
  };
}
