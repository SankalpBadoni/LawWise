import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (file: UploadedFile) => void;
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export function DocumentUpload({ isOpen, onClose, onUploadComplete }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const uploadedFile: UploadedFile = {
      name: file.name,
      size: file.size,
      type: file.type
    };

    setUploadedFile(uploadedFile);
    setIsProcessing(true);

    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      onUploadComplete(uploadedFile);
      setTimeout(() => {
        onClose();
        setUploadedFile(null);
      }, 1000);
    }, 2000);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setIsProcessing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Upload Legal Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!uploadedFile ? (
            <>
              {/* Upload Area */}
              <Card
                className={`border-2 border-dashed transition-all cursor-pointer ${
                  dragActive 
                    ? 'border-accent bg-accent/5' 
                    : 'border-muted-foreground/30 hover:border-accent/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={handleFileSelect}
              >
                <div className="p-8 text-center">
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-accent" />
                  </div>
                  
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Drop your legal document here
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  
                  <div className="text-xs text-muted-foreground">
                    Supports: PDF, TXT, DOCX, Images (PNG, JPG)
                  </div>
                </div>
              </Card>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          ) : (
            /* File Processing Status */
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{uploadedFile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(uploadedFile.size)}
                  </p>
                  
                  <div className="mt-3">
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-accent">Processing document...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Processing complete!</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {!isProcessing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetUpload}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {uploadedFile && !isProcessing && (
              <Button onClick={() => onUploadComplete(uploadedFile)} className="bg-accent hover:bg-accent/90">
                Continue
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}