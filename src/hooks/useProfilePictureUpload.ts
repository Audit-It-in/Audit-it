import { useCallback, useState } from "react";
import { uploadProfilePicture, validateProfilePicture } from "@/src/services/upload.service";

interface UseProfilePictureUploadOptions {
  userId: string;
}

export function useProfilePictureUpload({ userId }: UseProfilePictureUploadOptions) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearFile = useCallback(() => setFile(null), []);

  const uploadIfNeeded = useCallback(
    async (_currentPath?: string | null): Promise<string | null> => {
      setError(null);
      if (!file) return null;

      const validation = validateProfilePicture(file);
      if (!validation.isValid) {
        setError(validation.error || "Invalid file");
        throw new Error(validation.error || "Invalid file");
      }

      setIsUploading(true);
      try {
        const res = await uploadProfilePicture(file, userId);
        if (!res.success || !res.path) {
          const msg = res.error || "Failed to upload profile picture";
          setError(msg);
          throw new Error(msg);
        }
        return res.path;
      } finally {
        setIsUploading(false);
      }
    },
    [file, userId]
  );

  return { file, isUploading, error, setFile, clearFile, uploadIfNeeded };
}
