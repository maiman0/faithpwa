import axios from 'axios';

// Narrows a caught `unknown` into a display-safe message, preferring the
// backend's own message (axios error response body) over the generic
// Error/Axios message, and falling back to a caller-supplied default.
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || error.message || fallback;
  }
  if (error instanceof Error) {
    return error.message || fallback;
  }
  return fallback;
};
