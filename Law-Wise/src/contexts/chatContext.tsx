"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chat, Message, DocumentSummary } from '@/components/types';
import { chatStorage } from '@/lib/chatStorage';

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  createNewChat: () => string;
  switchToChat: (chatId: string) => void;
  addMessage: (content: string, isUser: boolean, chatId?: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  deleteChat: (chatId: string) => void;
  clearAllChats: () => void;
  uploadDocument: (file: File, chatId?: string) => void;
  isUploading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load chats on mount
  useEffect(() => {
    const savedChats = chatStorage.getChats();
    setChats(savedChats);
  }, []);

  // Save chats whenever they change
  useEffect(() => {
    chatStorage.saveChats(chats);
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
    setCurrentChat(newChat);
    return newChat.id;
  };

  const switchToChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
  };

  const addMessage = (content: string, isUser: boolean, chatId?: string) => {
    const targetChatId = chatId || currentChat?.id;
    if (!targetChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === targetChatId) {
        const updatedChat = {
          ...chat,
          messages: [...chat.messages, newMessage],
          updatedAt: new Date(),
        };

        // Update title if it's the first message
        if (chat.messages.length === 0 && isUser) {
          updatedChat.title = content.slice(0, 30) + (content.length > 30 ? '...' : '');
        }

        if (chat.id === currentChat?.id) {
          setCurrentChat(updatedChat);
        }

        return updatedChat;
      }
      return chat;
    }));
  };

  const updateChatTitle = (chatId: string, title: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title, updatedAt: new Date() } : chat
    ));
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  };

  const clearAllChats = () => {
    setChats([]);
    setCurrentChat(null);
  };

  const uploadDocument = async (file: File, chatId?: string) => {
    setIsUploading(true);
    const targetChatId = chatId || currentChat?.id || createNewChat();

    // Simulate document processing
    setTimeout(() => {
      const documentSummary: DocumentSummary = {
        title: file.name,
        highlights: [
          "Document successfully uploaded and processed",
          `File type: ${file.type}`,
          `File size: ${(file.size / 1024).toFixed(2)} KB`,
          "Ready for analysis and questions"
        ],
        actionableInsights: [
          "Review key clauses for potential issues",
          "Check for any missing standard provisions"
        ]
      };

      // Add document summary to chat
      setChats(prev => prev.map(chat => {
        if (chat.id === targetChatId) {
          return { ...chat, documentSummary, updatedAt: new Date() };
        }
        return chat;
      }));

      // Add welcome message
      addMessage(`I've analyzed your document "${file.name}". What would you like to know about it?`, false, targetChatId);
      
      setIsUploading(false);
    }, 2000);
  };

  return (
    <ChatContext.Provider value={{
      chats,
      currentChat,
      createNewChat,
      switchToChat,
      addMessage,
      updateChatTitle,
      deleteChat,
      clearAllChats,
      uploadDocument,
      isUploading
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}