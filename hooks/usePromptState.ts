import { useState, useCallback } from 'react';
import { PromptState, CameraConfig, OpticsConfig, StyleConfig } from '../types';
import { DEFAULT_STATE } from '../constants';

/**
 * usePromptState Hook
 * 
 * 管理完整的提示詞配置狀態，包含所有攝影參數
 * 提供細粒度的更新函數以避免不必要的重新渲染
 * 
 * @returns {Object} 包含 state, setState 和各種 update 函數
 */
export function usePromptState() {
  const [state, setState] = useState<PromptState>(DEFAULT_STATE);

  // 更新相機配置
  const updateCamera = useCallback((camera: CameraConfig) => {
    setState(prev => ({ ...prev, camera }));
  }, []);

  // 更新主體配置
  const updateSubject = useCallback((subject: PromptState['subject']) => {
    setState(prev => ({ ...prev, subject }));
  }, []);

  // 更新背景配置
  const updateBackground = useCallback((background: PromptState['background']) => {
    setState(prev => ({ ...prev, background }));
  }, []);

  // 更新光學配置
  const updateOptics = useCallback((optics: OpticsConfig) => {
    setState(prev => ({ ...prev, optics }));
  }, []);

  // 更新風格配置
  const updateStyle = useCallback((style: StyleConfig) => {
    setState(prev => ({ ...prev, style }));
  }, []);

  return {
    state,
    setState,
    updateCamera,
    updateSubject,
    updateBackground,
    updateOptics,
    updateStyle,
  };
}
