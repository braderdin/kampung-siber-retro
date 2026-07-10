"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, FileText, Image, Archive, Code, FileDown, X, Check, Loader2, File, HardDrive } from "lucide-react";

interface FileDragDropZoneProps {
  className?: string;
  maxFileSize?: number;
  acceptedTypes?: string[];
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
  onUploadComplete?: (result: UploadResult) => void;
  onUploadError?: (error: string) => void;
  uploadEndpoint?: string;
  showFilePreview?: boolean;
  showStats?: boolean;
}

interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  size: number;
  fileName: string;
  error?: string;
}

interface FileInfo {
  file: File;
  preview: string;
  id: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  result?: UploadResult;
}

const DEFAULT_MAX_FILE_SIZE = 50 * 1024 * 1024;
const DEFAULT_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
  "application/json",
  "text/javascript",
  "text/html",
  "text/css",
  "application/zip",
  "application/x-tar",
  "application/gzip",
];

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return Image;
  if (type === "application/pdf") return FileText;
  if (type.startsWith("text/")) return Code;
  if (type.startsWith("application/")) return Archive;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function FileDragDropZone({ 
  className,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  multiple = false,
  onFilesSelected,
  onUploadComplete,
  onUploadError,
  uploadEndpoint = "/api/storage/upload",
  showFilePreview = true,
  showStats = true,
}: FileDragDropZoneProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragOverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (dragOverTimeoutRef.current) {
        clearTimeout(dragOverTimeoutRef.current);
      }
    };
  }, []);

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: `Saiz fail melebihi had ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`,
      };
    }

    if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Jenis fail ${file.type} tidak disokong`,
      };
    }

    return { valid: true };
  }, [maxFileSize, acceptedTypes]);

  const addFile = useCallback((file: File) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      onUploadError?.(validation.error || "Fail tidak sah");
      return;
    }

    const newFile: FileInfo = {
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      progress: 0,
    };

    setFiles(prev => multiple ? [...prev, newFile] : [newFile]);
    setTotalSize(prev => prev + file.size);
    onFilesSelected?.(multiple ? [...files.map(f => f.file), newFile] : [newFile]);
  }, [validateFile, onUploadError, onFilesSelected, files, multiple]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const uploadFile = useCallback(async (fileInfo: FileInfo): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("file", fileInfo.file);
    formData.append("fileName", fileInfo.file.name);
    formData.append("mimeType", fileInfo.file.type);

    try {
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          url: data.url,
          key: data.key,
          size: fileInfo.file.size,
          fileName: fileInfo.file.name,
        };
      } else {
        return {
          success: false,
          error: data.error || "Gagal mengunggah",
          size: fileInfo.file.size,
          fileName: fileInfo.file.name,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Ralat semasa mengunggah",
        size: fileInfo.file.size,
        fileName: fileInfo.file.name,
      };
    }
  }, [uploadEndpoint]);

  const uploadAll = useCallback(async () => {
    if (files.length === 0) return;

    setUploading(true);

    for (const fileInfo of files) {
      setFiles(prev => 
        prev.map(f => 
          f.id === fileInfo.id 
            ? { ...f, status: "uploading", progress: 0 }
            : f
        )
      );

      const result = await uploadFile(fileInfo);

      setFiles(prev => 
        prev.map(f => 
          f.id === fileInfo.id 
            ? { ...f, status: result.success ? "success" : "error", result }
            : f
        )
      );

      if (result.success) {
        onUploadComplete?.(result);
      } else {
        onUploadError?.(result.error || "Gagal mengunggah");
      }
    }

    setUploading(false);
  }, [files, uploadFile, onUploadComplete, onUploadError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => addFile(file));
  }, [addFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (dragCounter === 0) {
      setIsDragging(true);
    }
  }, [dragCounter]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragging(false);
      setDragCounter(0);
    }
  }, [dragCounter]);

  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (multiple) {
        filesArray.forEach(file => addFile(file));
      } else {
        filesArray.forEach(file => addFile(file));
      }
    }
  };

  const renderFileInfo = (fileInfo: FileInfo) => {
    const Icon = getFileIcon(fileInfo.file.type);
    
    return (
      <div 
        key={fileInfo.id} 
        className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700"
      >
        <div className="p-2 rounded-full bg-emerald-500/20">
          <Icon className="h-5 w-5 text-emerald-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-200 pixel-font truncate">
            {fileInfo.file.name}
          </p>
          <p className="text-xs text-gray-500 pixel-font">
            {formatFileSize(fileInfo.file.size)}
          </p>
        </div>
        
        {showFilePreview && fileInfo.preview && (
          <img 
            src={fileInfo.preview} 
            alt={fileInfo.file.name}
            className="w-10 h-10 rounded object-cover border border-gray-600"
          />
        )}
        
        <div className="flex items-center gap-2">
          {fileInfo.status === "uploading" && (
            <div className="w-16 h-1.5 bg-gray-700 rounded overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all"
                style={{ width: `${fileInfo.progress}%` }}
              />
            </div>
          )}
          
          {fileInfo.status === "success" && (
            <Check className="h-4 w-4 text-emerald-400" />
          )}
          
          {fileInfo.status === "error" && (
            <X className="h-4 w-4 text-red-400" />
          )}
          
          <button
            onClick={() => removeFile(fileInfo.id)}
            className="p-1 rounded-full hover:bg-gray-700 text-gray-400 transition-colors"
            title "Buang"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${className || ""}`}>
      <div 
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleSelectFiles}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all 
          ${isDragging 
            ? "border-emerald-500 bg-emerald-500/10" 
            : "border-gray-600 hover:border-gray-500"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={handleInputChange}
          className="hidden"
          multiple={multiple}
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-gray-800/50">
            <HardDrive className="h-8 w-8 text-cyan-400" />
          </div>
          
          <div>
            <h3 className="pixel-font text-lg font-semibold text-gray-200 mb-1">
              {isDragging ? "Lepaskan fail di sini" : "Seret fail ke sini atau klik"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 pixel-font">
              Saiz maks: {(maxFileSize / 1024 / 1024).toFixed(1)}MB
            </p>
          </div>
        </div>
      </div>

      {showStats && (
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pixel-font">
          <div className="flex items-center gap-4">
            <span>{files.length} fail dipilih</span>
            <span>{formatFileSize(totalSize)} / {formatFileSize(maxFileSize)}</span>
          </div>
          
          <button
            onClick={uploadAll}
            disabled={uploading || files.length === 0}
            className="flex items-center gap-1 px-3 py-1 text-xs rounded bg-emerald-500/20 hover:bg-emerald-500/30 
              text-emerald-300 transition-colors pixel-font disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Mengunggah...
              </>
            ) : (
              <>
                <Upload className="h-3 w-3" />
                Unggah Semua
              </>
            )}
          </button>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map(renderFileInfo)}
        </div>
      )}
    </div>
  );
}

export const useFileUpload = (options?: {
  maxFileSize?: number;
  acceptedTypes?: string[];
  multiple?: boolean;
  uploadEndpoint?: string;
}) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [totalSize, setTotalSize] = useState(0);

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    const maxSize = options?.maxFileSize || DEFAULT_MAX_FILE_SIZE;
    const accepted = options?.acceptedTypes || DEFAULT_ACCEPTED_TYPES;

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `Saiz fail melebihi had`,
      };
    }

    if (accepted.length > 0 && !accepted.includes(file.type)) {
      return {
        valid: false,
        error: `Jenis fail tidak disokong`,
      };
    }

    return { valid: true };
  }, [options?.maxFileSize, options?.acceptedTypes]);

  const addFile = useCallback((file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) return;

    const newFile: FileInfo = {
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      progress: 0,
    };

    setFiles(prev => (options?.multiple ? [...prev, newFile] : [newFile]));
    setTotalSize(prev => prev + file.size);
  }, [validateFile, options?.multiple]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const uploadFile = useCallback(async (fileInfo: FileInfo): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("file", fileInfo.file);

    try {
      const response = await fetch(options?.uploadEndpoint || "/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          url: data.url,
          key: data.key,
          size: fileInfo.file.size,
          fileName: fileInfo.file.name,
        };
      } else {
        return {
          success: false,
          error: data.error || "Gagal mengunggah",
          size: fileInfo.file.size,
          fileName: fileInfo.file.name,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Ralat semasa mengunggah",
        size: fileInfo.file.size,
        fileName: fileInfo.file.name,
      };
    }
  }, [options?.uploadEndpoint]);

  return {
    files,
    setFiles,
    uploading,
    setUploading,
    totalSize,
    addFile,
    removeFile,
    uploadFile,
    validateFile,
  };
};