/**
 * 安全地從 LocalStorage 讀取資料
 * 包含錯誤處理，當讀取失敗時返回預設值
 * 
 * @param key - LocalStorage 的鍵名
 * @param defaultValue - 讀取失敗時的預設值
 * @returns 解析後的資料或預設值
 */
export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to read from localStorage (key: "${key}"):`, error);
    return defaultValue;
  }
}

/**
 * 安全地寫入資料到 LocalStorage
 * 包含錯誤處理（例如 quota exceeded）
 * 
 * @param key - LocalStorage 的鍵名
 * @param value - 要儲存的資料（會自動 JSON.stringify）
 * @returns 是否成功寫入
 */
export function safeLocalStorageSet(key: string, value: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to write to localStorage (key: "${key}"):`, error);
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded. Consider clearing old data.');
    }
    return false;
  }
}

/**
 * LocalStorage 鍵名常數
 * 集中管理所有使用的鍵名，避免拼寫錯誤
 */
export const STORAGE_KEYS = {
  SIDEBAR_STATE: 'banana_sidebar_state',
  CUSTOM_TAGS: 'banana_custom_tags',
  USER_PRESETS: 'banana_user_presets',
} as const;
