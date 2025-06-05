import { storage, StorageKeys } from './storage';
import type { User } from '../types/auth';

export const authStorage = {
  async saveAuth(token: string, user: User): Promise<void> {
    await Promise.all([
      storage.set(StorageKeys.AUTH_TOKEN, token),
      storage.set(StorageKeys.USER_DATA, user)
    ]);
  },

  async getToken(): Promise<string | null> {
    return await storage.get(StorageKeys.AUTH_TOKEN);
  },

  async getUser(): Promise<User | null> {
    return await storage.get(StorageKeys.USER_DATA);
  },

  async clearAuth(): Promise<void> {
    await Promise.all([
      storage.remove(StorageKeys.AUTH_TOKEN),
      storage.remove(StorageKeys.USER_DATA)
    ]);
  }
};