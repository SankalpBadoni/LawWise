import { useState, useRef, useEffect } from "react";
import { Send, Scale, X, Loader2, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hero } from "./Hero";
import { useChat } from "@/contexts/chatContext";
import { FileUpload, FileAttachment } from "./ui/file-upload";

// Define the structure for a message in the chat history for the backend
interface BackendMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatArea() {
  const [inputValue, setInputValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileAttachment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // --- NEW: State for language selection ---
  const [language, setLanguage] = useState("English");
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);
  
  const { currentChat, createNewChat, addMessage, clearAllChats } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // Sync UI state with context state
  useEffect(() => {
    if (currentChat) setShowChat(true);
  }, [currentChat]);

  // --- NEW: Fetch supported languages on component mount ---
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('https://lawwise.onrender.com/api/languages');
        if (!response.ok) throw new Error('Failed to fetch languages');
        const data = await response.json();
        setSupportedLanguages(data.languages || []);
      } catch (error) {
        console.error("Error fetching languages:", error);
        setSupportedLanguages(["English"]); // Fallback
      }
    };
    fetchLanguages();
  }, []);


  // --- API LOGIC (UPDATED FOR NEW BACKEND) ---

  const handleFileUpload = async (attachment: FileAttachment, userQuestion: string): Promise<string> => {
    const formData = new FormData();
    formData.append('pdfFile', attachment.file);
    formData.append('language', language);
    if (userQuestion) {
      formData.append('userQuestion', userQuestion);
    }

    try {
      const response = await fetch('https://lawwise.onrender.com/api/upload', {
        method: 'POST', 
        body: formData 
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Upload failed');
      }
      const result = await response.json();
      return result.message || "Document analysis complete.";
    } catch (error) {
      return `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const handleChatMessage = async (question: string, history: BackendMessage[]): Promise<string> => {
    try {
      const response = await fetch('https://lawwise.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: question, 
          chatHistory: history,
          language: language
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to get a response');
      }
      const result = await response.json();
      return result.message;
    } catch (error) {
      return `Error getting answer: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  // --- CORE LOGIC: Unified Send Handler (UPDATED) ---
  const handleSendMessage = async () => {
    if ((!inputValue.trim() && selectedFiles.length === 0) || isProcessing) return;

    setIsProcessing(true);
    let currentChatInstance = currentChat;
    if (!currentChatInstance) {
      const chatResult = createNewChat();
      // If createNewChat returns a string (chatId), fetch the Chat object by id
      if (typeof chatResult === "string") {
        // You must implement or import getChatById from your context or state management
        currentChatInstance = getChatById(chatResult);
      } else {
        currentChatInstance = chatResult;
      }
    }
    setShowChat(true);

    const currentInput = inputValue;
    const currentFiles = [...selectedFiles];
    
    // Add user message to UI immediately
    const userMessageContent = currentInput || `Uploaded: ${currentFiles.map(f => f.name).join(', ')}`;
    addMessage(userMessageContent, true);

    // Clear inputs for next message
    setInputValue("");
    setSelectedFiles([]);

    let aiResponseContent = "";

    // Map frontend chat history to the format the backend expects
    const backendChatHistory: BackendMessage[] = (currentChatInstance?.messages || [])
      .map(msg => ({
        role: msg.isUser ? 'user' as 'user' : 'assistant' as 'assistant',
        content: msg.content
      }));

    if (currentFiles.length > 0) {
      // It's a new document upload (with an optional initial question)
      aiResponseContent = await handleFileUpload(currentFiles[0], currentInput);
    } else {
      // It's a follow-up question
      aiResponseContent = await handleChatMessage(currentInput, backendChatHistory);
    }
    
    addMessage(aiResponseContent, false);
    setIsProcessing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    clearAllChats();
    setShowChat(false);
  };

  const handleTryDemo = () => {
    createNewChat();
    setShowChat(true);
  };

  // --- JSX Rendering (Added Language Selector) ---

  const inputArea = (
    <div className="border-t border-border p-6 bg-card">
      <div className="max-w-4xl mx-auto space-y-2">
        <FileUpload
          onFilesSelected={setSelectedFiles}
          selectedFiles={selectedFiles}
          onRemoveFile={(fileId) => setSelectedFiles(prev => prev.filter(f => f.id !== fileId))}
        />
        <div className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={showChat ? "Ask a follow-up question..." : "Ask a question or upload a document..."}
            disabled={isProcessing}
          />
          {/* --- NEW: Language Selector --- */}
          <Select value={language} onValueChange={setLanguage} disabled={isProcessing}>
            <SelectTrigger className="w-[150px]">
              <Languages className="h-4 w-4 mr-2"/>
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {supportedLanguages.map(lang => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSendMessage} disabled={(!inputValue.trim() && selectedFiles.length === 0) || isProcessing} size="icon" className="bg-gradient-primary text-black">
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );

  if (!showChat) {
    return (
      <main className="flex-1 flex flex-col bg-background">
        <Hero onTryDemo={handleTryDemo} />
        {inputArea}
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-background overflow-hidden h-full">
      <div className="flex-1 flex flex-col min-h-0 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Chat with LawWise</h2>
          <Button variant="ghost" size="sm" onClick={handleClearChat} className="text-muted-foreground hover:text-destructive">
            <X className="h-4 w-4 mr-2" /> Clear Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentChat?.messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-4 ${
                message.isUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-[#1f2937] text-[#f9fafb]'
              }`}>
                {!message.isUser && (
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="h-4 w-4" />
                    <span className="text-xs font-medium">LawWise AI</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-2 block">{new Date(message.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
          {isProcessing && (
             <div className="flex justify-start">
               <div className="max-w-[80%] rounded-lg p-4 bg-[#1f2937] text-[#f9fafb]">
                <div className="flex items-center gap-2">
                   <Loader2 className="h-4 w-4 animate-spin" />
                   <span className="text-sm font-medium">LawWise is thinking...</span>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {inputArea}
    </main>
  );
}

function getChatById(chatResult: string): import("./types").Chat {
  throw new Error("Function not implemented.");
}
