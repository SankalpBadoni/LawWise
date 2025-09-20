import { useState, useRef, useEffect } from "react";
import { Send, Scale, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Hero } from "./Hero";
import { useChat } from "@/contexts/chatContext";
// Import our new component and its type
// import { FileUpload, FileAttachment } from "./FileUpload";
import { FileUpload, FileAttachment } from "./ui/file-upload";

export function ChatArea() {
  const [inputValue, setInputValue] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileAttachment[]>([]); // For staging the file
  const [isProcessing, setIsProcessing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentDocSessionId, setCurrentDocSessionId] = useState<string | null>(null);

  const { currentChat, createNewChat, addMessage, clearAllChats } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  useEffect(() => {
    // Sync UI state with context state
    if (currentChat) setShowChat(true);
  }, [currentChat]);

  // --- API LOGIC (Adapted from your working example) ---

  const uploadAndProcessFile = async (attachment: FileAttachment): Promise<string> => {
    const formData = new FormData();
    formData.append('pdfFile', attachment.file);
    try {
      const response = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Upload failed');
      }
      const result = await response.json();
      if (result.sessionId) {
        setCurrentDocSessionId(result.sessionId);
      }
      return result.message || "Document analysis complete.";
    } catch (error) {
      return `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const handleFollowUpQuestion = async (question: string): Promise<string> => {
    if (!currentDocSessionId) {
      return "Document context lost. Please upload the document again.";
    }
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: currentDocSessionId, question }),
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

  // --- CORE LOGIC: Unified Send Handler ---

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && selectedFiles.length === 0) || isProcessing) return;

    setIsProcessing(true);
    // Ensure a chat exists
    if (!currentChat) {
      createNewChat();
    }
    setShowChat(true);

    const currentInput = inputValue;
    const currentFiles = [...selectedFiles];
    
    // Add user message to UI immediately
    const userMessageContent = currentInput || `Uploaded: ${currentFiles.map(f => f.name).join(', ')}`;
    addMessage(userMessageContent, true);

    // Clear inputs
    setInputValue("");
    setSelectedFiles([]);

    let aiResponseContent = "";
    if (currentFiles.length > 0) {
      // It's a new document upload
      aiResponseContent = await uploadAndProcessFile(currentFiles[0]);
    } else {
      // It's a follow-up question
      aiResponseContent = await handleFollowUpQuestion(currentInput);
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
    setCurrentDocSessionId(null);
    setShowChat(false);
  };

  const handleTryDemo = () => {
    createNewChat();
    setShowChat(true);
  };

  // --- JSX Rendering ---

  if (!showChat) {
    return (
      <main className="flex-1 flex flex-col bg-background">
        <Hero onTryDemo={handleTryDemo} />
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
                placeholder="Ask a question or upload a document..."
                disabled={isProcessing}
              />
              <Button onClick={handleSendMessage} disabled={(!inputValue.trim() && selectedFiles.length === 0) || isProcessing} size="icon" className="bg-gradient-primary text-black">
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
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
              <div className={`max-w-[80%] rounded-lg p-4 ${message.isUser ? 'bg-chat-user' : 'bg-chat-ai'}`}>
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
          <div ref={messagesEndRef} />
        </div>
      </div>
      
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
              placeholder="Ask a follow-up question..."
              disabled={isProcessing}
            />
            <Button onClick={handleSendMessage} disabled={(!inputValue.trim() && selectedFiles.length === 0) || isProcessing} size="icon" className="bg-gradient-primary text-black">
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}