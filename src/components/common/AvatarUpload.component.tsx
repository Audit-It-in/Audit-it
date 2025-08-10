"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { CameraIcon, UserIcon, XIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { cn } from "@/src/helpers/tailwind.helper";
import { Loader } from "@/src/components/common/Loader.component";
import { SpinnerSize, LoadingAction } from "@/src/types/ui.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { FILE_VALIDATION } from "@/src/services/upload.service";

export interface AvatarUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  currentImageUrl?: string;
  maxSize?: number;
  allowedTypes?: string[];
  disabled?: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showRemove?: boolean;
  onError?: (message: string) => void;
  helperText?: string;
  errorText?: string;
}

const sizeClasses = {
  xs: {
    icon: "h-3 w-3",
    camera: "h-4 w-4",
    text: "text-xs",
    button: "h-5 w-5",
    buttonIcon: "h-2 w-2",
  },
  sm: {
    icon: "h-4 w-4",
    camera: "h-5 w-5",
    text: "text-xs",
    button: "h-6 w-6",
    buttonIcon: "h-3 w-3",
  },
  md: {
    icon: "h-5 w-5",
    camera: "h-6 w-6",
    text: "text-sm",
    button: "h-7 w-7",
    buttonIcon: "h-3 w-3",
  },
  lg: {
    icon: "h-6 w-6",
    camera: "h-7 w-7",
    text: "text-sm",
    button: "h-8 w-8",
    buttonIcon: "h-4 w-4",
  },
  xl: {
    icon: "h-8 w-8",
    camera: "h-9 w-9",
    text: "text-base",
    button: "h-9 w-9",
    buttonIcon: "h-4 w-4",
  },
  "2xl": {
    icon: "h-10 w-10",
    camera: "h-11 w-11",
    text: "text-lg",
    button: "h-10 w-10",
    buttonIcon: "h-5 w-5",
  },
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  value,
  onChange,
  currentImageUrl,
  maxSize = FILE_VALIDATION.PROFILE_PICTURE.maxSize,
  allowedTypes = [...FILE_VALIDATION.PROFILE_PICTURE.allowedTypes],
  disabled = false,
  isUploading = false,
  uploadProgress = 0,
  size = "md",
  className,
  showRemove = true,
  onError,
  helperText,
  errorText,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const triggerId = useId();
  const [objectPreviewUrl, setObjectPreviewUrl] = useState<string | null>(null);

  const sizeConfig = sizeClasses[size];

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSize) {
        return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
      }

      if (!allowedTypes.includes(file.type)) {
        return `File type not supported. Allowed: ${allowedTypes.map((type) => type.split("/")[1]).join(", ")}`;
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
        console.error("File validation error:", validationError);
        onError?.(validationError);
        return;
      }

      onChange(file);
    },
    [disabled, isUploading, validateFile, onChange, onError]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
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

      if (disabled || isUploading) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0 && files[0].type.startsWith("image/")) {
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

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled || isUploading) return;
      onChange(null);
    },
    [disabled, isUploading, onChange]
  );

  // Manage object URL lifecycle
  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setObjectPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setObjectPreviewUrl(null);
    }
  }, [value]);

  const previewUrl = value ? objectPreviewUrl : currentImageUrl;
  const hasImage = !!(value || currentImageUrl);

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Main Avatar using neumorphic Avatar UI */}
      <div
        role='button'
        aria-label={hasImage ? "Change profile photo" : "Upload profile photo"}
        aria-describedby={`${triggerId}-help`}
        tabIndex={disabled || isUploading ? -1 : 0}
        className={cn(
          "relative transition-all duration-300 group outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full",
          !disabled && !isUploading && "cursor-pointer",
          disabled && "opacity-60 cursor-not-allowed",
          isUploading && "pointer-events-none"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (disabled || isUploading) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          id={`${triggerId}-input`}
          type='file'
          accept='image/*'
          onChange={handleFileInput}
          className='hidden'
          disabled={disabled || isUploading}
        />

        <div
          className={cn(
            // Size variants
            size === "xs" && "size-6",
            size === "sm" && "size-8",
            size === "md" && "size-10",
            size === "lg" && "size-12",
            size === "xl" && "size-16",
            size === "2xl" && "size-20",
            "rounded-full shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-sm border border-primary-100/60",
            isDragOver && "shadow-neumorphic-inset bg-primary-50/80 border-primary-200"
          )}
        >
          <Avatar className='size-full' variant='interactive'>
            {hasImage && previewUrl ? (
              <AvatarImage src={previewUrl} alt='Profile' />
            ) : (
              <AvatarFallback size={size} className='bg-primary-50'>
                <UserIcon
                  className={cn(
                    sizeConfig.icon,
                    "transition-colors duration-300",
                    isDragOver ? "text-primary-700" : "text-primary-600 group-hover:text-primary-700"
                  )}
                  weight='bold'
                />
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className='absolute inset-0 bg-primary-900/70 backdrop-blur-sm rounded-full flex items-center justify-center z-20'>
            <div className='text-center'>
              <Loader action={LoadingAction.UPLOADING} size={SpinnerSize.SMALL} />
              <p className={cn("text-white font-medium mt-1", sizeConfig.text)}>{uploadProgress}%</p>
            </div>
          </div>
        )}

        {/* Camera Overlay */}
        {!isUploading && (
          <div
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full z-10",
              "bg-black/40 flex items-center justify-center"
            )}
          >
            <CameraIcon className={cn(sizeConfig.camera, "text-white")} weight='bold' />
          </div>
        )}

        {/* Floating Tooltip - Outside the circle */}
        {!isUploading && (
          <div className='absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20'>
            <div className='px-3 py-2 bg-primary-600 text-white text-xs font-medium rounded-lg shadow-lg whitespace-nowrap'>
              <div className='absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-600 rotate-45'></div>
              {hasImage ? "Click to change photo" : "Click to upload photo"}
            </div>
          </div>
        )}

        {/* Drag Over Overlay */}
        {isDragOver && !isUploading && (
          <div className='absolute inset-0 rounded-full flex items-center justify-center z-10 animate-pulse'>
            <div className='absolute inset-1 border-2 border-primary-400 border-dashed rounded-full' />
            <div className='text-center'>
              <div className='p-3 rounded-full bg-primary-100/80 backdrop-blur-sm mb-2 mx-auto w-fit shadow-neumorphic-sm'>
                <CameraIcon className={cn(sizeConfig.camera, "text-primary-600")} weight='bold' />
              </div>
              <p
                className={cn("text-primary-700 font-bold bg-white/80 px-2 py-1 rounded-lg shadow-md", sizeConfig.text)}
              >
                Drop here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Remove Button */}
      {showRemove && hasImage && !isUploading && (
        <button
          type='button'
          onClick={handleRemove}
          aria-label='Remove profile photo'
          className={cn(
            "absolute -top-2 -right-2 rounded-full transition-all duration-300 z-30",
            "bg-red-500 hover:bg-red-600",
            "shadow-neumorphic-sm hover:shadow-neumorphic-md active:shadow-neumorphic-inset",
            "border border-red-300/30",
            "flex items-center justify-center group",
            sizeConfig.button
          )}
          disabled={disabled}
        >
          <XIcon
            className={cn(
              sizeConfig.buttonIcon,
              "text-white drop-shadow-sm group-hover:scale-110 transition-transform relative z-10"
            )}
            weight='bold'
          />
        </button>
      )}

      {/* Success Indicator */}
      {value && !isUploading && (
        <div
          className={cn(
            "absolute -bottom-2 -right-2 rounded-full transition-all duration-300 z-30",
            "bg-accent-600",
            "shadow-neumorphic-sm",
            "border border-accent-300/30",
            "flex items-center justify-center animate-pulse",
            sizeConfig.button
          )}
        >
          <CheckCircleIcon
            className={cn(sizeConfig.buttonIcon, "text-white drop-shadow-sm relative z-10")}
            weight='bold'
          />
        </div>
      )}

      {/* Helper / Error text */}
      {(helperText || errorText) && (
        <div id={`${triggerId}-help`} className={cn("mt-2", sizeConfig.text)}>
          {errorText ? (
            <p className='text-red-600 font-medium'>{errorText}</p>
          ) : (
            helperText && <p className='text-neutral-600'>{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
