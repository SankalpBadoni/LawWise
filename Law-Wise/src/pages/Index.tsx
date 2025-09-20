import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ChatArea } from "@/components/ChatArea";
import { ChatProvider } from "@/contexts/chatContext";

const Index = () => {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-background text-foreground font-['Inter',sans-serif]">
        {/* Header */}
        <Header onUploadClick={function (): void {
          throw new Error("Function not implemented.");
        } } />
        
        {/* Main Layout */}
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Chat Area */}
          <ChatArea />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Index;