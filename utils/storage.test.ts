import { describe, it, expect, beforeEach, vi } from 'vitest';
import { safeLocalStorageGet, safeLocalStorageSet, STORAGE_KEYS } from './storage';

describe('storage.ts', () => {
  beforeEach(() => {
    // 清空 localStorage
    localStorage.clear();
    // 清除所有 mock
    vi.clearAllMocks();
  });

  describe('STORAGE_KEYS', () => {
    it('應該定義所有必要的 storage 鍵名', () => {
      expect(STORAGE_KEYS.SIDEBAR_STATE).toBe('banana_sidebar_state');
      expect(STORAGE_KEYS.CUSTOM_TAGS).toBe('banana_custom_tags');
      expect(STORAGE_KEYS.USER_PRESETS).toBe('banana_user_presets');
    });
  });

  describe('safeLocalStorageGet', () => {
    it('應該成功讀取並解析有效的 JSON 資料', () => {
      const testData = { name: 'test', value: 123 };
      localStorage.setItem('test-key', JSON.stringify(testData));
      
      const result = safeLocalStorageGet('test-key', {});
      expect(result).toEqual(testData);
    });

    it('應該在鍵不存在時返回預設值', () => {
      const defaultValue = { default: true };
      const result = safeLocalStorageGet('non-existent-key', defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('應該在 JSON 解析失敗時返回預設值', () => {
      localStorage.setItem('invalid-json', 'this is not valid JSON {');
      const defaultValue = { fallback: true };
      
      const result = safeLocalStorageGet('invalid-json', defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it('應該處理不同類型的預設值', () => {
      // 字串
      expect(safeLocalStorageGet('key1', 'default')).toBe('default');
      
      // 數字
      expect(safeLocalStorageGet('key2', 42)).toBe(42);
      
      // 布林值
      expect(safeLocalStorageGet('key3', true)).toBe(true);
      
      // 陣列
      expect(safeLocalStorageGet('key4', [])).toEqual([]);
      
      // 物件
      expect(safeLocalStorageGet('key5', { test: 'value' })).toEqual({ test: 'value' });
    });

    it('應該在錯誤時記錄 console.error', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('bad-data', 'invalid JSON');
      
      safeLocalStorageGet('bad-data', {});
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('Failed to read from localStorage');
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('safeLocalStorageSet', () => {
    it('應該成功寫入資料並返回 true', () => {
      const testData = { name: 'test', value: 456 };
      const result = safeLocalStorageSet('test-key', testData);
      
      expect(result).toBe(true);
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify(testData));
    });

    it('應該處理不同類型的資料', () => {
      // 字串
      expect(safeLocalStorageSet('key1', 'test')).toBe(true);
      expect(localStorage.getItem('key1')).toBe('"test"');
      
      // 數字
      expect(safeLocalStorageSet('key2', 123)).toBe(true);
      expect(localStorage.getItem('key2')).toBe('123');
      
      // 布林值
      expect(safeLocalStorageSet('key3', false)).toBe(true);
      expect(localStorage.getItem('key3')).toBe('false');
      
      // 陣列
      expect(safeLocalStorageSet('key4', [1, 2, 3])).toBe(true);
      expect(localStorage.getItem('key4')).toBe('[1,2,3]');
      
      // 物件
      const obj = { nested: { value: 'test' } };
      expect(safeLocalStorageSet('key5', obj)).toBe(true);
      expect(JSON.parse(localStorage.getItem('key5')!)).toEqual(obj);
    });
  });

  describe('整合測試：讀寫循環', () => {
    it('應該能夠寫入後正確讀取相同的資料', () => {
      const testData = {
        leftSidebarOpen: true,
        rightSidebarOpen: false,
      };
      
      const writeSuccess = safeLocalStorageSet('sidebar-state', testData);
      expect(writeSuccess).toBe(true);
      
      const readData = safeLocalStorageGet('sidebar-state', {});
      expect(readData).toEqual(testData);
    });

    it('應該處理複雜的嵌套資料結構', () => {
      const complexData = {
        user: {
          name: 'Test User',
          presets: [
            { id: '1', name: 'Preset 1', config: { value: 123 } },
            { id: '2', name: 'Preset 2', config: { value: 456 } },
          ],
        },
        tags: ['tag1', 'tag2', 'tag3'],
      };
      
      safeLocalStorageSet('complex-data', complexData);
      const retrieved = safeLocalStorageGet('complex-data', {});
      
      expect(retrieved).toEqual(complexData);
    });
  });
});
