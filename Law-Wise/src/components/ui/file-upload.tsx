import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, UploadCloud, X, Image as ImageIcon } from 'lucide-react';

// We need to define this type, as it's no longer coming from a hook
export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
  url: string;
}

interface FileUploadProps {
  onFilesSelected: (files: FileAttachment[]) => void;
  selectedFiles: FileAttachment[];
  onRemoveFile: (fileId: string) => void;
}

export function FileUpload({ onFilesSelected, selectedFiles, onRemoveFile }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFileAttachments: FileAttachment[] = acceptedFiles.map(file => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
      url: URL.createObjectURL(file),
    }));
    onFilesSelected(newFileAttachments.slice(0, 1));
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  return (
    <div className="space-y-2">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFiles.map(file => (
            <div key={file.id} className="flex items-center gap-2 p-2 bg-muted rounded-md border border-border">
              {file.type === 'application/pdf' ? (
                <FileText className="h-4 w-4 text-red-400 flex-shrink-0" />
              ) : (
                <ImageIcon className="h-4 w-4 text-blue-400 flex-shrink-0" />
              )}
              <span className="text-xs truncate" title={file.name}>{file.name}</span>
              <button onClick={() => onRemoveFile(file.id)} className="p-0.5 rounded-full hover:bg-destructive/20 text-muted-foreground hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length === 0 && (
         <div {...getRootProps()} className={`px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
          <input {...getInputProps()} />
          <div className="flex items-center justify-center text-center text-muted-foreground">
            <UploadCloud className="h-5 w-5 mr-2" />
            <p className="text-sm">{isDragActive ? "Drop the file here..." : "Drag & drop a file, or click to select"}</p>
          </div>
        </div>
      )}
    </div>
  );
}