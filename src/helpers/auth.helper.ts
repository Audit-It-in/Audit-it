import { AuthErrorType } from "@/src/types/auth.type";
import { StatusMessage } from "@/src/types/common.type";
import { AUTH_ERROR_MESSAGES } from "@/src/constants/auth.constants";

/**
 * Safely maps string error codes to AuthErrorType enum values
 */
export function getAuthErrorType(errorCode: string | null): AuthErrorType {
  if (!errorCode) return AuthErrorType.DEFAULT;

  // Check if the error code matches any of our enum values
  const enumValues = Object.values(AuthErrorType) as string[];
  if (enumValues.includes(errorCode)) {
    return errorCode as AuthErrorType;
  }

  return AuthErrorType.DEFAULT;
}

/**
 * Gets the appropriate status message for an auth error
 */
export function getAuthErrorMessage(errorCode: string | null): StatusMessage {
  const errorType = getAuthErrorType(errorCode);
  return AUTH_ERROR_MESSAGES[errorType];
}
 