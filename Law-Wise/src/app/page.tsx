"use client";

import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { Header } from "@/components/Header";
import { ChatProvider } from "@/contexts/chatContext";

export default function HomePage() {
  return (
    <ChatProvider>
      <div className="h-screen flex flex-col">
        <Header onUploadClick={function (): void {
          throw new Error("Function not implemented.");
        } } />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <ChatArea />
        </div>
      </div>
    </ChatProvider>
  );
}