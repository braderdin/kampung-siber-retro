"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, Image, Copy, Check, X, ExternalLink, RefreshCw, Loader2 } from "lucide-react";

interface ImgurAssetBridgeProps {
  clientId?: string;
  className?: string;
  maxFileSize?: number;
  acceptedTypes?: string[];
  onUploadComplete?: (result: UploadResult) => void;
  onUploadStart?: () => void;
  onUploadError?: (error: string) => void;
}

interface UploadResult {
  success: boolean;
  link?: string;
  thumbnailLink?: string;
  deleteHash?: string;
  message?: string;
  error?: string;
}

interface UploadedImage {
  id: string;
  url: string;
  thumbnail: string;
  deleteHash: string;
  title?: string;
  description?: string;
  uploadedAt: string;
}

const IMGUR_API_URL = "https://api.imgur.com/3/image";
const IMGUR_ANONYMOUS_UPLOAD_URL = "https://api.imgur.com/3/image";
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;
const DEFAULT_ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
];

const DEFAULT_CLIENT_ID = "5632472e7c8e6c0";

export default function ImgurAssetBridge({ 
  clientId = DEFAULT_CLIENT_ID,
  className,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  onUploadComplete,
  onUploadStart,
  onUploadError,
}: ImgurAssetBridgeProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = useCallback((file: File): boolean => {
    if (file.size > maxFileSize) {
      setError(`Saiz fail melebihi had ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`);
      return false;
    }

    if (!acceptedTypes.includes(file.type)) {
      setError(`Jenis fail ${file.type} tidak disokong`);
      return false;
    }

    return true;
  }, [maxFileSize, acceptedTypes]);

  const uploadToImgur = useCallback(async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "file");

    try {
      const response = await fetch(IMGUR_ANONYMOUS_UPLOAD_URL, {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${clientId}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          link: data.data.link,
          thumbnailLink: data.data.thumb,
          deleteHash: data.data.deletehash,
          message: data.data.title || "Berjaya unggah",
        };
      } else {
        return {
          success: false,
          error: data.data?.error || "Gagal mengunggah",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Ralat semasa mengunggah",
      };
    }
  }, [clientId]);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");

    onUploadStart?.();
    setUploading(true);

    const result = await uploadToImgur(file);

    if (result.success && result.link) {
      const newImage: UploadedImage = {
        id: Date.now().toString(),
        url: result.link,
        thumbnail: result.thumbnailLink || result.link,
        deleteHash: result.deleteHash || "",
        title: result.message,
        uploadedAt: new Date().toISOString(),
      };

      setUploadedImages(prev => [newImage, ...prev]);
      setSuccess("Berjaya mengunggah!");
      onUploadComplete?.(result);
    } else {
      setError(result.error || "Gagal mengunggah");
      onUploadError?.(result.error || "Gagal mengunggah");
    }

    setUploading(false);
    setSelectedFile(null);
  }, [validateFile, uploadToImgur, onUploadStart, onUploadComplete, onUploadError]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = Array.from(e.dataTransfer.files);
    
    if (files.length > 0) {
      await handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    
    if (dragCounterRef.current === 1) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess("Disalin ke papan keranjang!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const renderUploadedImage = (image: UploadedImage) => (
    <div 
      key={image.id} 
      className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700"
    >
      <img
        src={image.thumbnail}
        alt={image.title || "Uploaded image"}
        className="w-12 h-12 rounded object-cover"
      />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-200 pixel-font truncate">
          {image.title || "Imej"}
        </p>
        <p className="text-xs text-gray-500 pixel-font">
          {new Date(image.uploadedAt).toLocaleString()}
        </p>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => copyToClipboard(image.url)}
          className="p-1 rounded-full hover:bg-gray-700 text-gray-400 transition-colors"
          title="Salin URL"
        >
          <Copy className="h-4 w-4" />
        </button>
        
        <a
          href={image.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded-full hover:bg-gray-700 text-gray-400 transition-colors"
          title "Lihat di sebelah"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );

  const renderImgTag = (image: UploadedImage) => (
    <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 pixel-font">HTML Tag</span>
        <button
          onClick={() => copyToClipboard(`<img src="${image.url}" alt="${image.title || 'image'}" />`)}
          className="p-1 rounded-full hover:bg-gray-700 text-gray-400 transition-colors"
          title="Salin tag HTML"
        >
          <Copy className="h-3 w-3" />
        </button>
      </div>
      
      <code className="w-full px-3 py-2 bg-gray-900/50 rounded font-mono text-sm text-emerald-300 pixel-font break-all">
        {'<img src="'}{image.url}{'" alt="image" />'}
      </code>
    </div>
  );

  return (
    <div className={`flex flex-col ${className || ""}`}>
      <div className="mb-4">
        <div 
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleDropZoneClick}
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
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 rounded-full bg-gray-800/50">
              <Upload className="h-8 w-8 text-cyan-400" />
            </div>
            
            <div>
              <h3 className="pixel-font text-lg font-semibold text-gray-200 mb-1">
                {isDragging ? "Lepaskan di sini" : "Seret fail ke sini atau klik"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 pixel-font">
                Saiz maks: {(maxFileSize / 1024 / 1024).toFixed(1)}MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className="mb-4">
          <div className="relative rounded-lg overflow-hidden border border-gray-700">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
                  <p className="text-sm text-gray-200 pixel-font">Mengunggah...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-red-400" />
            <p className="text-sm text-red-200 pixel-font">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <p className="text-sm text-emerald-200 pixel-font">{success}</p>
          </div>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="mt-4">
          <h3 className="pixel-font text-sm font-semibold text-gray-200 mb-2">
            Imej yang Dimuat Turun
          </h3>
          
          <div className="space-y-3">
            {uploadedImages.map(renderUploadedImage)}
          </div>
          
          <div className="mt-4">
            <h4 className="pixel-font text-xs text-gray-500 mb-2">Tag HTML untuk setiap imej:</h4>
            <div className="space-y-2">
              {uploadedImages.map(renderImgTag)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const useImgurUpload = (clientId?: string) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const upload = useCallback(async (file: File): Promise<UploadResult> => {
    if (!file) {
      setError("Tiada fail yang dipilih");
      return { success: false, error: "Tiada fail yang dipilih" };
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", "file");

    setUploading(true);
    setError("");

    try {
      const response = await fetch(IMGUR_ANONYMOUS_UPLOAD_URL, {
        method: "POST",
        headers: {
          Authorization: `Client-ID ${clientId || DEFAULT_CLIENT_ID}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const newImage: UploadedImage = {
          id: Date.now().toString(),
          url: data.data.link,
          thumbnail: data.data.thumb,
          deleteHash: data.data.deletehash,
          uploadedAt: new Date().toISOString(),
        };

        setUploadedImages(prev => [newImage, ...prev]);
        
        return {
          success: true,
          link: data.data.link,
          thumbnailLink: data.data.thumb,
          deleteHash: data.data.deletehash,
        };
      } else {
        setError(data.data?.error || "Gagal mengunggah");
        return {
          success: false,
          error: data.data?.error || "Gagal mengunggah",
        };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Ralat semasa mengunggah";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setUploading(false);
    }
  }, [clientId]);

  const clearImages = useCallback(() => {
    setUploadedImages([]);
  }, []);

  return {
    uploadedImages,
    setUploadedImages,
    uploading,
    error,
    setError,
    upload,
    clearImages,
  };
};