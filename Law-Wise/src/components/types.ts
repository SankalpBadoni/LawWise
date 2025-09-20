// export interface Message {
//   id: string;
//   content: string;
//   isUser: boolean;
//   timestamp: Date;
// }

// export interface Chat {
//   id: string;
//   title: string;
//   messages: Message[];
//   createdAt: Date;
//   updatedAt: Date;
//   documentSummary?: DocumentSummary;
// }

// export interface DocumentSummary {
//   title: string;
//   highlights: string[];
//   actionableInsights?: string[];
// }

// export interface ChatContextType {
//   chats: Chat[];
//   currentChat: Chat | null;
//   createNewChat: () => string;
//   switchToChat: (chatId: string) => void;
//   addMessage: (content: string, isUser: boolean) => void;
//   updateChatTitle: (chatId: string, title: string) => void;
//   deleteChat: (chatId: string) => void;
//   clearAllChats: () => void;
//   uploadDocument: (file: File) => void;
// }

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
  documentSummary?: DocumentSummary;
}

export interface DocumentSummary {
  title: string;
  highlights: string[];
  actionableInsights?: string[];
}