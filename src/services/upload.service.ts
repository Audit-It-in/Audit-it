import { supabase } from "@/src/helpers/supabase.helper";
import { STORAGE_BUCKETS } from "@/src/constants/storage.constants";
import { useQuery } from "@tanstack/react-query";

// File validation constants
export const FILE_VALIDATION = {
  PROFILE_PICTURE: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
  },
  CERTIFICATE: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
  },
} as const;

// Types
export interface UploadResult {
  success: boolean;
  path?: string; // storage path only (no public url)
  url?: string; // optional public/signed URL when applicable
  error?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

// File validation functions
export function validateProfilePicture(file: File): FileValidationResult {
  return validateFile(file, FILE_VALIDATION.PROFILE_PICTURE);
}

export function validateCertificate(file: File): FileValidationResult {
  return validateFile(file, FILE_VALIDATION.CERTIFICATE);
}

function validateFile(
  file: File,
  validation: { maxSize: number; allowedTypes: readonly string[]; allowedExtensions: readonly string[] }
): FileValidationResult {
  // Check file size
  if (file.size > validation.maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${validation.maxSize / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!validation.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not supported. Allowed types: ${validation.allowedTypes.join(", ")}`,
    };
  }

  // Check file extension
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
  if (!validation.allowedExtensions.includes(fileExtension)) {
    return {
      isValid: false,
      error: `File extension not supported. Allowed extensions: ${validation.allowedExtensions.join(", ")}`,
    };
  }

  return { isValid: true };
}

// Upload functions
export async function uploadProfilePicture(file: File, userId: string): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateProfilePicture(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Create file path: {userId}/avatar.{extension}
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const filePath = `${userId}/avatar.${fileExtension}`;

    // Delete existing profile picture if any
    await supabase.storage.from(STORAGE_BUCKETS.PROFILE_PICTURES).remove([filePath]);

    // Upload new file
    const { error } = await supabase.storage.from(STORAGE_BUCKETS.PROFILE_PICTURES).upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

    if (error) {
      console.error("Profile picture upload error:", error);
      return { success: false, error: "Failed to upload profile picture" };
    }

    // Return storage path only; consumers should resolve signed URLs
    // Clear any cached signed URL for this path
    clearUrlCache(STORAGE_BUCKETS.PROFILE_PICTURES, filePath);

    return { success: true, path: filePath };
  } catch (error) {
    console.error("Profile picture upload error:", error);
    return { success: false, error: "Failed to upload profile picture" };
  }
}

export async function uploadCertificate(
  file: File,
  userId: string,
  certificateType = "membership"
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateCertificate(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Create file path: {userId}/{certificateType}.{extension}
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const filePath = `${userId}/${certificateType}.${fileExtension}`;

    // Upload file
    const { error } = await supabase.storage.from(STORAGE_BUCKETS.ACCOUNTANT_CERTIFICATES).upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

    if (error) {
      console.error("Certificate upload error:", error);
      return { success: false, error: "Failed to upload certificate" };
    }

    // Get public URL (note: this will be private due to RLS policies)
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKETS.ACCOUNTANT_CERTIFICATES).getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error("Certificate upload error:", error);
    return { success: false, error: "Failed to upload certificate" };
  }
}

// Delete functions
export async function deleteProfilePicture(userId: string): Promise<boolean> {
  try {
    // Try to delete common file extensions
    const extensions = ["jpg", "jpeg", "png", "webp"];

    for (const ext of extensions) {
      const filePath = `${userId}/avatar.${ext}`;
      await supabase.storage.from(STORAGE_BUCKETS.PROFILE_PICTURES).remove([filePath]);
      clearUrlCache(STORAGE_BUCKETS.PROFILE_PICTURES, filePath);
    }

    return true;
  } catch (error) {
    console.error("Profile picture delete error:", error);
    return false;
  }
}

export async function deleteCertificate(userId: string, certificateType = "membership"): Promise<boolean> {
  try {
    // Try to delete common file extensions
    const extensions = ["pdf", "jpg", "jpeg", "png"];

    for (const ext of extensions) {
      const filePath = `${userId}/${certificateType}.${ext}`;
      await supabase.storage.from(STORAGE_BUCKETS.ACCOUNTANT_CERTIFICATES).remove([filePath]);
    }

    return true;
  } catch (error) {
    console.error("Certificate delete error:", error);
    return false;
  }
}

// Helper function to extract file info from URL
export function extractFileInfoFromUrl(url: string): { fileName: string; extension: string } | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    return { fileName, extension };
  } catch {
    return null;
  }
}

// === Signed URL utilities and caching ===

type UrlCacheValue = { url: string; expires: number };
const urlCache = new Map<string, UrlCacheValue>();

function getCacheKey(bucket: string, path: string): string {
  return `${bucket}:${path}`;
}

export function clearUrlCache(bucket?: string, path?: string): void {
  if (bucket && path) {
    urlCache.delete(getCacheKey(bucket, path));
  } else {
    urlCache.clear();
  }
}

export async function getSignedUrl(bucket: string, path: string, expiresInSeconds = 15 * 60): Promise<string> {
  const now = Date.now();
  const key = getCacheKey(bucket, path);
  const cached = urlCache.get(key);
  if (cached && cached.expires > now + 5_000) {
    return cached.url;
  }

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  if (error || !data?.signedUrl) {
    throw new Error("Failed to generate signed URL");
  }
  const value: UrlCacheValue = { url: data.signedUrl, expires: now + expiresInSeconds * 1000 };
  urlCache.set(key, value);
  return value.url;
}

export async function getSignedProfilePictureUrl(path: string, expiresInSeconds = 15 * 60): Promise<string> {
  return getSignedUrl(STORAGE_BUCKETS.PROFILE_PICTURES, path, expiresInSeconds);
}

export function useProfilePictureUrl(path?: string | null) {
  return useQuery<string>({
    queryKey: ["profile-picture-url", path],
    queryFn: () => getSignedProfilePictureUrl(path!),
    enabled: !!path,
    staleTime: 15 * 60 * 1000,
  });
}
