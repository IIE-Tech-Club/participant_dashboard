// Human-readable error messages for Firebase authentication
import type { AuthError } from "firebase/auth";

export interface AuthErrorResult {
  success: false;
  message: string;
  code?: string;
}

export interface AuthSuccessResult<T = string> {
  success: true;
  data: T;
}

export type AuthResult<T = string> = AuthSuccessResult<T> | AuthErrorResult;

export const getHumanReadableError = (error: AuthError): AuthErrorResult => {
  const errorCode = error.code;
  
  // Firebase Auth error codes relevant to Google Sign-in and General errors
  const errorMap: Record<string, string> = {
    // Network and configuration errors
    'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
    'auth/requires-recent-login': 'This action requires recent authentication. Please sign in again.',
    'auth/invalid-api-key': 'Configuration error. Please contact support.',
    'auth/app-deleted': 'Authentication service is unavailable. Please try again later.',
    'auth/invalid-user-token': 'Your session has expired. Please sign in again.',
    'auth/user-token-expired': 'Your session has expired. Please sign in again.',
    'auth/web-storage-unsupported': "Your browser doesn't support secure storage. Please try a different browser.",
    'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
    'auth/popup-closed-by-user': 'Sign-in window was closed. Please try again.',
    'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups and try again.',
    
    // Google Sign-in specific errors
    'auth/credential-already-in-use': 'This Google account is already linked to another account.',
    'auth/invalid-credential': 'Invalid credentials. Please try again.',
    
    // General errors
    'auth/invalid-argument': 'Invalid input. Please check your information and try again.',
    'auth/quota-exceeded': 'Service temporarily unavailable. Please try again later.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
  };

  const message = errorMap[errorCode] || 
    'An unexpected authentication error occurred. Please try again.';

  return {
    success: false,
    message,
    code: errorCode
  };
};

// Helper function to handle initialization errors
export const getInitializationError = (error: Error): AuthErrorResult => {
  if (error.message.includes('browser')) {
    return {
      success: false,
      message: 'Authentication is not available in this environment. Please use a web browser.',
      code: 'auth/not-in-browser'
    };
  }
  
  if (error.message.includes('NEXT_PUBLIC_FIREBASE_API_KEY')) {
    return {
      success: false,
      message: 'Authentication service is not configured. Please contact support.',
      code: 'auth/not-configured'
    };
  }
  
  return {
    success: false,
    message: 'Authentication service is temporarily unavailable. Please try again later.',
    code: 'auth/service-unavailable'
  };
};
