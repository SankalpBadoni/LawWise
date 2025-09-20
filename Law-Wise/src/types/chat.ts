export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    fileUrl?: string; // optional if file uploaded
  }
  
  export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
  }
  