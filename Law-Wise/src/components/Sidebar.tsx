// import { Plus, FileText, Menu, X, Upload } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { useState } from "react";
// import { Chat } from "./types";

// interface SidebarProps {
//   chats: Chat[];
//   currentChatId: string | null;
//   onSelectChat: (chatId: string) => void;
//   onNewChat: () => void;
//   onClearAllChats: () => void;
//   onFileUpload: (file: File) => void;
//   onUpload: (file: File) => void;
//   chatHistory: any[];
  
// }

// export function Sidebar({ 
//   chats = [], 
//   currentChatId, 
//   onSelectChat, 
//   onNewChat, 
//   onClearAllChats,
//   onFileUpload 
// }: SidebarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       onFileUpload(file);
//       // Reset the input value to allow uploading the same file again
//       e.target.value = '';
//     }
//   };

//   const formatDate = (date: Date | string) => {
//     const d = new Date(date);
//     const now = new Date();
//     const diffTime = Math.abs(now.getTime() - d.getTime());
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
//     if (diffDays === 0) {
//       return 'Today';
//     } else if (diffDays === 1) {
//       return 'Yesterday';
//     } else if (diffDays < 7) {
//       return `${diffDays} days ago`;
//     } else {
//       return d.toLocaleDateString();
//     }
//   };

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <Button
//         className="md:hidden fixed top-20 left-4 z-50 bg-card border border-border"
//         size="icon"
//         onClick={() => setIsCollapsed(!isCollapsed)}
//       >
//         <Menu className="h-4 w-4" />
//       </Button>

//       {/* Sidebar */}
//       <aside className={cn(
//         "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
//         "fixed md:relative z-40 h-full md:h-auto",
//         isCollapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "w-80",
//         "md:translate-x-0"
//       )}>
//         {/* Mobile Close Button */}
//         <Button
//           className="md:hidden absolute top-4 right-4"
//           variant="ghost"
//           size="icon"
//           onClick={() => setIsCollapsed(true)}
//         >
//           <X className="h-4 w-4" />
//         </Button>

//         {/* Header */}
//         {!isCollapsed && (
//           <div className="p-4 border-b border-sidebar-border space-y-2">
//             <Button 
//               onClick={onNewChat}
//               className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-black font-medium"
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               New Chat
//             </Button>
            
           
// <label htmlFor="file-upload-sidebar" className="cursor-pointer w-full">
//   <input
//     type="file"
//     id="file-upload-sidebar"
//     accept=".pdf,.jpg,.jpeg,.png"
//     onChange={handleFileUpload}
//     className="hidden"
//   />
//   <Button
//     variant="outline"
//     className="w-full text-muted-foreground"
//     onClick={() => {
//       // This will trigger the file input
//       document.getElementById('file-upload-sidebar')?.click();
//     }}
//   >
//     <Upload className="mr-2 h-4 w-4" />
//     Upload Document
//   </Button>
// </label>
//           </div>
//         )}

//         {/* Collapsed State */}
//         {isCollapsed && (
//           <div className="p-2 border-b border-sidebar-border hidden md:block space-y-2">
//             <Button 
//               onClick={onNewChat}
//               size="icon"
//               className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
//             >
//               <Plus className="h-4 w-4" />
//             </Button>
            
//             <label htmlFor="file-upload-sidebar-collapsed" className="cursor-pointer w-full">
//               <Input
//                 type="file"
//                 id="file-upload-sidebar-collapsed"
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 onChange={handleFileUpload}
//                 className="hidden"
//               />
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="w-full"
//               >
//                 <Upload className="h-4 w-4" />
//               </Button>
//             </label>
//           </div>
//         )}

//         {/* Chat History */}
//         <div className="flex-1 overflow-y-auto">
//           <div className="p-4">
//             {!isCollapsed && (
//               <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-sm font-medium text-sidebar-foreground">
//                   Chat History
//                 </h3>
//                 {chats && chats.length > 0 && (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={onClearAllChats}
//                     className="text-xs text-muted-foreground hover:text-destructive"
//                   >
//                     Clear All
//                   </Button>
//                 )}
//               </div>
//             )}
//             <div className="space-y-2">
//               {chats && chats.map((chat) => (
//                 <button
//                   key={chat.id}
//                   onClick={() => onSelectChat(chat.id)}
//                   className={cn(
//                     "w-full text-left rounded-lg border transition-colors",
//                     "hover:bg-sidebar-accent hover:border-primary/50",
//                     currentChatId === chat.id 
//                       ? "bg-sidebar-accent border-primary text-sidebar-foreground" 
//                       : "border-sidebar-border text-sidebar-foreground/70",
//                     isCollapsed ? "p-2" : "p-3"
//                   )}
//                 >
//                   <div className="flex items-start gap-3">
//                     <FileText className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
//                     {!isCollapsed && (
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium truncate">
//                           {chat.title}
//                         </p>
//                         <p className="text-xs text-sidebar-foreground/50 mt-1">
//                           {formatDate(chat.createdAt)}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Collapse Toggle for Desktop */}
//         <div className="hidden md:block p-2 border-t border-sidebar-border">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="w-full text-muted-foreground"
//           >
//             {isCollapsed ? ">" : "<"}
//           </Button>
//         </div>
//       </aside>

//       {/* Mobile Overlay */}
//       {!isCollapsed && (
//         <div 
//           className="md:hidden fixed inset-0 bg-black/50 z-30"
//           onClick={() => setIsCollapsed(true)}
//         />
//       )}
//     </>
//   );
// }

import { Plus, FileText, Menu, X, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useChat } from "@/contexts/chatContext";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { chats, currentChat, switchToChat, createNewChat, deleteChat, clearAllChats, uploadDocument } = useChat();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadDocument(file);
      e.target.value = '';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        className="md:hidden fixed top-20 left-4 z-50 bg-card border border-border"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        "fixed md:relative z-40 h-full md:h-auto",
        isCollapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "w-80",
        "md:translate-x-0"
      )}>
        {/* Mobile Close Button */}
        <Button
          className="md:hidden absolute top-4 right-4"
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Header */}
        {!isCollapsed && (
          <div className="p-4 border-b border-sidebar-border space-y-2">
            <Button 
              onClick={createNewChat}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-black font-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
            
            <label htmlFor="file-upload-sidebar" className="cursor-pointer w-full">
              <Input
                type="file"
                id="file-upload-sidebar"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                className="w-full text-muted-foreground"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </label>
          </div>
        )}

        {/* Collapsed State */}
        {isCollapsed && (
          <div className="p-2 border-b border-sidebar-border hidden md:block space-y-2">
            <Button 
              onClick={createNewChat}
              size="icon"
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <label htmlFor="file-upload-sidebar-collapsed" className="cursor-pointer w-full">
              <Input
                type="file"
                id="file-upload-sidebar-collapsed"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                className="w-full"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </label>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {!isCollapsed && (
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-sidebar-foreground">
                  Chat History
                </h3>
                {chats.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllChats}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            )}
            <div className="space-y-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => switchToChat(chat.id)}
                  className={cn(
                    "w-full text-left rounded-lg border transition-colors group",
                    "hover:bg-sidebar-accent hover:border-primary/50",
                    currentChat?.id === chat.id 
                      ? "bg-sidebar-accent border-primary text-sidebar-foreground" 
                      : "border-sidebar-border text-sidebar-foreground/70",
                    isCollapsed ? "p-2" : "p-3"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium truncate">
                            {chat.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(chat.id);
                            }}
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-sidebar-foreground/50 mt-1">
                          {formatDate(chat.updatedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Collapse Toggle for Desktop */}
        <div className="hidden md:block p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full text-muted-foreground"
          >
            {isCollapsed ? ">" : "<"}
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}