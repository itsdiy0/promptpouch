export const StorageKeys = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data'
  } as const;
  
  export const storage = {
    async set(key: string, value: any): Promise<void> {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve);
      });
    },
  
    async get(key: string): Promise<any> {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key]);
        });
      });
    },
  
    async remove(key: string): Promise<void> {
      return new Promise((resolve) => {
        chrome.storage.local.remove([key], resolve);
      });
    },
  
    async clear(): Promise<void> {
      return new Promise((resolve) => {
        chrome.storage.local.clear(resolve);
      });
    }
  };