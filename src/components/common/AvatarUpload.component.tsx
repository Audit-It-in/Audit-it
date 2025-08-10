'use client';

import React, { useCallback, useState } from 'react';
import Image from "next/image";
import { CameraIcon, UserIcon, XIcon, CheckCircleIcon } from '@phosphor-icons/react';
import { cn } from '@/src/helpers/tailwind.helper';
import { Loader } from '@/src/components/common/Loader.component';
import { SpinnerSize, LoadingAction } from '@/src/types/ui.type';
// Avatar components not used in this component - using custom Image elements

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
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  disabled = false,
  isUploading = false,
  uploadProgress = 0,
  size = "md",
  className,
  showRemove = true,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

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
        return;
      }

      onChange(file);
    },
    [disabled, isUploading, validateFile, onChange]
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

  const previewUrl = value ? URL.createObjectURL(value) : currentImageUrl;
  const hasImage = !!(value || currentImageUrl);

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Main Avatar using our neumorphic Avatar component */}
      <div
        className={cn(
          "relative cursor-pointer transition-all duration-300 group",
          disabled && "opacity-60 cursor-not-allowed",
          isUploading && "pointer-events-none"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && document.getElementById("avatar-input")?.click()}
      >
        <input
          id='avatar-input'
          type='file'
          accept='image/*'
          onChange={handleFileInput}
          className='hidden'
          disabled={disabled || isUploading}
        />

        {/* Custom Neumorphic Avatar Container */}
        <div
          className={cn(
            "relative rounded-full transition-all duration-300",
            // Enhanced neumorphic effect - more pronounced
            "bg-gradient-to-br from-white via-primary-50/30 to-primary-50",
            "shadow-[8px_8px_16px_rgba(37,99,235,0.15),-8px_-8px_16px_rgba(255,255,255,0.9)]",
            "border border-primary-100/60",
            // Hover state
            "group-hover:shadow-[12px_12px_24px_rgba(37,99,235,0.2),-12px_-12px_24px_rgba(255,255,255,0.95)]",
            "group-hover:scale-[1.02]",
            // Drag over state - inset effect
            isDragOver && [
              "shadow-[inset_6px_6px_12px_rgba(37,99,235,0.2),inset_-6px_-6px_12px_rgba(255,255,255,0.8)]",
              "bg-gradient-to-br from-primary-50 to-primary-100",
              "border-primary-200",
            ],
            // Size variants with proper aspect ratio
            size === "xs" && "size-6",
            size === "sm" && "size-8",
            size === "md" && "size-10",
            size === "lg" && "size-12",
            size === "xl" && "size-16",
            size === "2xl" && "size-20"
          )}
        >
          {/* Inner highlight ring */}
          <div className='absolute inset-[1px] rounded-full bg-gradient-to-br from-white/60 to-transparent pointer-events-none' />

          {/* Image or Fallback Content */}
          <div className='relative z-10 size-full rounded-full overflow-hidden'>
            {hasImage && previewUrl ? (
              <Image src={previewUrl} alt='Profile' fill className='object-cover rounded-full' />
            ) : (
              <div className='size-full flex items-center justify-center bg-gradient-to-br from-primary-50/80 to-primary-100/60 rounded-full'>
                <UserIcon
                  className={cn(
                    sizeConfig.icon,
                    "transition-colors duration-300",
                    isDragOver ? "text-primary-700" : "text-primary-600 group-hover:text-primary-700"
                  )}
                  weight='bold'
                />
              </div>
            )}
          </div>
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

        {/* Camera Overlay - Clean, no distortion */}
        {!isUploading && (
          <div
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full z-10",
              "bg-black/50 flex items-center justify-center"
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

        {/* Enhanced Drag Over Overlay */}
        {isDragOver && !isUploading && (
          <div className='absolute inset-0 rounded-full flex items-center justify-center z-10 animate-pulse'>
            {/* Animated border */}
            <div className='absolute inset-1 border-2 border-primary-400 border-dashed rounded-full animate-pulse-slow' />
            <div className='text-center'>
              <div className='p-3 rounded-full bg-primary-100/80 backdrop-blur-sm mb-2 mx-auto w-fit shadow-lg'>
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

      {/* Enhanced Remove Button - Better neumorphic design */}
      {showRemove && hasImage && !isUploading && (
        <button
          type='button'
          onClick={handleRemove}
          className={cn(
            "absolute -top-2 -right-2 rounded-full transition-all duration-300 z-30",
            "bg-gradient-to-br from-red-400 via-red-500 to-red-600",
            "shadow-[4px_4px_8px_rgba(239,68,68,0.3),-2px_-2px_4px_rgba(255,255,255,0.8)]",
            "hover:shadow-[6px_6px_12px_rgba(239,68,68,0.4),-3px_-3px_6px_rgba(255,255,255,0.9)]",
            "hover:scale-110 active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(185,28,28,0.3)]",
            "border border-red-300/30",
            "flex items-center justify-center group",
            sizeConfig.button
          )}
          disabled={disabled}
        >
          {/* Inner highlight */}
          <div className='absolute inset-[1px] rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none' />
          <XIcon
            className={cn(
              sizeConfig.buttonIcon,
              "text-white drop-shadow-sm group-hover:scale-110 transition-transform relative z-10"
            )}
            weight='bold'
          />
        </button>
      )}

      {/* Enhanced Success Indicator - Better neumorphic design */}
      {value && !isUploading && (
        <div
          className={cn(
            "absolute -bottom-2 -right-2 rounded-full transition-all duration-300 z-30",
            "bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600",
            "shadow-[4px_4px_8px_rgba(16,185,129,0.3),-2px_-2px_4px_rgba(255,255,255,0.8)]",
            "border border-accent-300/30",
            "flex items-center justify-center animate-pulse",
            sizeConfig.button
          )}
        >
          {/* Inner highlight */}
          <div className='absolute inset-[1px] rounded-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none' />
          <CheckCircleIcon
            className={cn(sizeConfig.buttonIcon, "text-white drop-shadow-sm relative z-10")}
            weight='bold'
          />
        </div>
      )}
    </div>
  );
};

export default AvatarUpload; 