import { AuthErrorType, AuthLoadingState } from "@/src/types/auth.type";
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";

export const AUTH_ERROR_MESSAGES: Record<AuthErrorType, StatusMessage> = {
  [AuthErrorType.ACCESS_DENIED]: {
    type: StatusMessageType.INFO,
    text: "Sign in was cancelled. You can try again whenever you're ready.",
  },
  [AuthErrorType.CALLBACK_ERROR]: {
    type: StatusMessageType.ERROR,
    text: "There was an error during sign in. Please try again.",
  },
  [AuthErrorType.CANCELLED]: {
    type: StatusMessageType.INFO,
    text: "Sign in was cancelled. You can try again whenever you're ready.",
  },
  [AuthErrorType.DEFAULT]: {
    type: StatusMessageType.ERROR,
    text: "An error occurred during sign in. Please try again.",
  },
};

export const AUTH_LOADING_MESSAGES: Record<AuthLoadingState, string> = {
  [AuthLoadingState.AUTHENTICATING]: "Authenticating...",
  [AuthLoadingState.REDIRECTING]: "Redirecting...",
  [AuthLoadingState.LOADING]: "Loading...",
  [AuthLoadingState.SETTING_UP]: "Setting up your account...",
};
 