const STORAGE_KEYS = {
  TRANSACTIONS: 'houseapp_transactions',
  ASSETS: 'houseapp_assets',
  LIABILITIES: 'houseapp_liabilities',
  HOUSEHOLD: 'houseapp_household',
  CATEGORIES: 'houseapp_categories',
  AI_CONVERSATION: 'houseapp_ai_conversation',
  MIGRATED_TO_FIREBASE: 'houseapp_migrated_to_firebase',
} as const;

export const storage = {
  get: <T>(key: keyof typeof STORAGE_KEYS): T | null => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS[key]);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: keyof typeof STORAGE_KEYS, value: T): void => {
    try {
      localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  remove: (key: keyof typeof STORAGE_KEYS): void => {
    localStorage.removeItem(STORAGE_KEYS[key]);
  },

  clear: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};

