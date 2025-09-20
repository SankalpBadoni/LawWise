import { Chat } from '@/components/types';

const CHAT_STORAGE_KEY = 'lawwise-chats';

export const chatStorage = {
  getChats: (): Chat[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading chats from storage:', error);
      return [];
    }
  },

  saveChats: (chats: Chat[]): void => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats to storage:', error);
    }
  }
};