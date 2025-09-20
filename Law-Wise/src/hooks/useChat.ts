import { useState, useEffect } from 'react';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export function useChat() {
  const [chats, setChats] = useState<Chat[]>(() => {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lawwise-chats');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Save to localStorage whenever chats change
  useEffect(() => {
    localStorage.setItem('lawwise-chats', JSON.stringify(chats));
  }, [chats]);

  const createNewChat = (): string => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };

  const addMessageToChat = (chatId: string, message: Message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        // Update chat title if it's the first message
        const newMessages = [...chat.messages, message];
        let title = chat.title;
        
        if (chat.messages.length === 0 && message.isUser) {
          title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
        }

        return {
          ...chat,
          title,
          messages: newMessages,
          updatedAt: new Date(),
        };
      }
      return chat;
    }));
  };

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === currentChatId) || null;
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const clearAllChats = () => {
    setChats([]);
    setCurrentChatId(null);
  };

  return {
    chats,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    addMessageToChat,
    getCurrentChat,
    deleteChat,
    clearAllChats,
  };
}