"use client";

import React, { useCallback, useState } from "react";
import { UploadIcon, FileIcon, ImageIcon, XIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";
import { Button } from "@/src/components/ui/button";
import { Loader } from "@/src/components/common/Loader.component";
import { SpinnerSize, LoadingAction } from "@/src/types/ui.type";

export interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  allowedTypes?: string[];
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  showPreview?: boolean;
  className?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  accept = "image/*,.pdf",
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"],
  placeholder = "Drag & drop a file here, or click to browse",
  helperText,
  error,
  disabled = false,
  required = false,
  showPreview = true,
  className,
  isUploading = false,
  uploadProgress = 0,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
      }

      if (!allowedTypes.includes(file.type)) {
        return `File type not supported. Allowed: ${allowedTypes.join(", ")}`;
      }

      return null;
    },
    [maxSize, allowedTypes]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (disabled || isUploading) return;

      const validationError = validateFile(file);
      if (validationError) {
        // You might want to show this error via a toast or callback
        console.error("File validation error:", validationError);
        return;
      }

      onChange(file);
    },
    [disabled, isUploading, validateFile, onChange]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragOver(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      setDragCounter(0);

      if (disabled || isUploading) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [disabled, isUploading, handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    if (disabled || isUploading) return;
    onChange(null);
  }, [disabled, isUploading, onChange]);

  const isImage = value && value.type.startsWith("image/");
  const previewUrl = value && isImage ? URL.createObjectURL(value) : null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative overflow-hidden transition-all duration-300 rounded-xl border-2 border-dashed",
          "bg-gradient-to-br from-neutral-50 to-neutral-100/60",
          !value &&
            !isDragOver &&
            cn(
              "shadow-[inset_2px_2px_8px_rgba(0,0,0,0.08),inset_-2px_-2px_8px_rgba(255,255,255,0.9)]",
              "hover:shadow-[inset_3px_3px_10px_rgba(0,0,0,0.1),inset_-3px_-3px_10px_rgba(255,255,255,0.95)]"
            ),
          isDragOver && "border-primary-400 bg-gradient-to-br from-primary-50/80 to-primary-100/40",
          !isDragOver && "border-neutral-300/60",
          error && "border-red-400 bg-gradient-to-br from-red-50/80 to-red-100/40",
          disabled && "opacity-60 cursor-not-allowed",
          !disabled && "cursor-pointer hover:border-primary-300",
          isUploading && "pointer-events-none"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && document.getElementById("file-input")?.click()}
      >
        <input
          id='file-input'
          type='file'
          accept={accept}
          onChange={handleFileInput}
          className='hidden'
          disabled={disabled || isUploading}
        />

        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className='absolute inset-0 bg-gradient-to-br from-primary-50/90 to-primary-100/70 backdrop-blur-sm flex items-center justify-center z-10'>
            <div className='text-center space-y-2'>
              <Loader action={LoadingAction.UPLOADING} size={SpinnerSize.MEDIUM} />
              <p className='text-sm font-medium text-primary-700'>Uploading... {uploadProgress}%</p>
            </div>
          </div>
        )}

        <div className='p-6 text-center space-y-3'>
          {value ? (
            <div className='space-y-3'>
              {/* File Preview */}
              <div className='flex items-center justify-center'>
                {showPreview && previewUrl ? (
                  <div className='relative'>
                    <img src={previewUrl} alt='Preview' className='w-16 h-16 object-cover rounded-lg shadow-md' />
                    {!isUploading && (
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        className='absolute -top-2 -right-2 h-6 w-6 rounded-full p-0'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove();
                        }}
                      >
                        <XIcon weight='bold' className='h-3 w-3' />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className='flex items-center space-x-3'>
                    {value.type === "application/pdf" ? (
                      <FileIcon weight='bold' className='h-8 w-8 text-red-500' />
                    ) : (
                      <ImageIcon weight='bold' className='h-8 w-8 text-primary-500' />
                    )}
                    <div className='text-left'>
                      <p className='text-sm font-medium text-neutral-700 truncate max-w-[200px]'>{value.name}</p>
                      <p className='text-xs text-neutral-500'>{formatFileSize(value.size)}</p>
                    </div>
                    {!isUploading && (
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 rounded-full p-0 hover:bg-red-100'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove();
                        }}
                      >
                        <XIcon weight='bold' className='h-4 w-4 text-red-500' />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {!isUploading && (
                <div className='flex items-center justify-center space-x-1 text-xs text-accent-600'>
                  <CheckCircleIcon weight='bold' className='h-3 w-3' />
                  <span>File selected</span>
                </div>
              )}
            </div>
          ) : (
            <div className='space-y-3'>
              <div className='flex justify-center'>
                <div
                  className={cn(
                    "p-3 rounded-full transition-colors duration-200",
                    "bg-gradient-to-br from-neutral-100 to-neutral-200/80",
                    "shadow-[2px_2px_6px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.9)]",
                    isDragOver && "from-primary-100 to-primary-200/80"
                  )}
                >
                  <UploadIcon
                    weight='bold'
                    className={cn(
                      "h-6 w-6 transition-colors duration-200",
                      isDragOver ? "text-primary-600" : "text-neutral-500"
                    )}
                  />
                </div>
              </div>

              <div className='space-y-1'>
                <p
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    isDragOver ? "text-primary-700" : "text-neutral-700"
                  )}
                >
                  {placeholder}
                </p>

                {helperText && <p className='text-xs text-neutral-500'>{helperText}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className='text-sm text-red-600 flex items-center space-x-1'>
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}

      {/* Helper Info */}
      {!error && !helperText && (
        <p className='text-xs text-neutral-500'>
          Max file size: {Math.round(maxSize / (1024 * 1024))}MB
          {required && <span className='text-red-500 ml-1'>*</span>}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
