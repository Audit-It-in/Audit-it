'use client';

import React, { useCallback, useState } from 'react';
import { CameraIcon, UserIcon, XIcon, CheckCircleIcon } from '@phosphor-icons/react';
import { cn } from '@/src/helpers/tailwind.helper';
import { Loader } from '@/src/components/common/Loader.component';
import { SpinnerSize, LoadingAction } from '@/src/types/ui.type';

export interface AvatarUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  currentImageUrl?: string;
  maxSize?: number;
  allowedTypes?: string[];
  disabled?: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showRemove?: boolean;
}

const sizeClasses = {
  sm: {
    container: 'h-16 w-16',
    icon: 'h-4 w-4',
    camera: 'h-6 w-6',
    text: 'text-xs',
  },
  md: {
    container: 'h-24 w-24',
    icon: 'h-6 w-6',
    camera: 'h-8 w-8',
    text: 'text-sm',
  },
  lg: {
    container: 'h-32 w-32',
    icon: 'h-8 w-8',
    camera: 'h-10 w-10',
    text: 'text-base',
  },
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  value,
  onChange,
  currentImageUrl,
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  disabled = false,
  isUploading = false,
  uploadProgress = 0,
  size = 'lg',
  className,
  showRemove = true,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const sizeConfig = sizeClasses[size];

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
    }

    if (!allowedTypes.includes(file.type)) {
      return `File type not supported. Allowed: ${allowedTypes.map(type => type.split('/')[1]).join(', ')}`;
    }

    return null;
  }, [maxSize, allowedTypes]);

  const handleFile = useCallback((file: File) => {
    if (disabled || isUploading) return;

    const validationError = validateFile(file);
    if (validationError) {
      console.error('File validation error:', validationError);
      return;
    }

    onChange(file);
  }, [disabled, isUploading, validateFile, onChange]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    if (disabled || isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFile(files[0]);
    }
  }, [disabled, isUploading, handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isUploading) return;
    onChange(null);
  }, [disabled, isUploading, onChange]);

  const previewUrl = value ? URL.createObjectURL(value) : currentImageUrl;
  const hasImage = !!(value || currentImageUrl);

  return (
    <div className={cn('relative inline-block', className)}>
      {/* Main Avatar Container */}
      <div
        className={cn(
          'relative rounded-full overflow-hidden cursor-pointer transition-all duration-300 group',
          sizeConfig.container,
          'shadow-[6px_6px_16px_rgba(0,0,0,0.1),-6px_-6px_16px_rgba(255,255,255,0.9)]',
          'hover:shadow-[8px_8px_20px_rgba(0,0,0,0.15),-8px_-8px_20px_rgba(255,255,255,0.95)]',
          isDragOver && 'shadow-[inset_4px_4px_12px_rgba(0,0,0,0.15),inset_-4px_-4px_12px_rgba(255,255,255,0.9)]',
          disabled && 'opacity-60 cursor-not-allowed',
          isUploading && 'pointer-events-none'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && document.getElementById('avatar-input')?.click()}
      >
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {/* Background */}
        <div className={cn(
          'absolute inset-0 transition-all duration-300',
          hasImage 
            ? 'bg-gradient-to-br from-neutral-100 to-neutral-200' 
            : isDragOver 
              ? 'bg-gradient-to-br from-primary-100 to-primary-200'
              : 'bg-gradient-to-br from-neutral-100 to-neutral-200 group-hover:from-primary-50 group-hover:to-primary-100'
        )} />

        {/* Image Display */}
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <UserIcon 
              className={cn(
                sizeConfig.icon, 
                'transition-colors duration-300',
                isDragOver ? 'text-primary-600' : 'text-neutral-400 group-hover:text-primary-500'
              )} 
              weight="bold" 
            />
          </div>
        )}

        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Loader action={LoadingAction.UPLOADING} size={SpinnerSize.SMALL} />
              <p className={cn('text-white font-medium mt-1', sizeConfig.text)}>
                {uploadProgress}%
              </p>
            </div>
          </div>
        )}

        {/* Camera Overlay */}
        {!isUploading && (
          <div className={cn(
            'absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            'flex items-center justify-center'
          )}>
            <div className="text-center">
              <CameraIcon className={cn(sizeConfig.camera, 'text-white')} weight="bold" />
              <p className={cn('text-white font-medium mt-1', sizeConfig.text)}>
                {hasImage ? 'Change' : 'Upload'}
              </p>
            </div>
          </div>
        )}

        {/* Drag Over Overlay */}
        {isDragOver && !isUploading && (
          <div className="absolute inset-0 bg-primary-500/20 border-2 border-primary-400 border-dashed rounded-full flex items-center justify-center">
            <div className="text-center">
              <CameraIcon className={cn(sizeConfig.camera, 'text-primary-600')} weight="bold" />
              <p className={cn('text-primary-700 font-medium mt-1', sizeConfig.text)}>
                Drop here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Remove Button */}
      {showRemove && hasImage && !isUploading && (
        <button
          type="button"
          onClick={handleRemove}
          className={cn(
            'absolute -top-1 -right-1 h-6 w-6 rounded-full transition-all duration-200',
            'bg-gradient-to-br from-red-500 to-red-600 text-white',
            'shadow-[2px_2px_6px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)]',
            'hover:shadow-[3px_3px_8px_rgba(0,0,0,0.3),-2px_-2px_4px_rgba(255,255,255,0.15)]',
            'hover:scale-110 active:scale-95',
            'flex items-center justify-center'
          )}
          disabled={disabled}
        >
          <XIcon className="h-3 w-3" weight="bold" />
        </button>
      )}

      {/* Success Indicator */}
      {value && !isUploading && (
        <div className={cn(
          'absolute -bottom-1 -right-1 h-6 w-6 rounded-full transition-all duration-200',
          'bg-gradient-to-br from-accent-500 to-accent-600 text-white',
          'shadow-[2px_2px_6px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.1)]',
          'flex items-center justify-center'
        )}>
          <CheckCircleIcon className="h-3 w-3" weight="bold" />
        </div>
      )}
    </div>
  );
};

export default AvatarUpload; 