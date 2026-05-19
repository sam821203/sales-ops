/**
 * Maps HTTP status codes to user-facing error messages.
 * If the backend response contains { message: string }, that is used instead.
 */
export const mapHttpError = (status: number, data?: unknown): Error => {
  const backendMessage = getBackendMessage(data);
  if (backendMessage !== null) {
    return new Error(backendMessage);
  }

  switch (status) {
    case 401:
      return new Error('Unauthorized. Please login again.');
    case 403:
      return new Error('You do not have permission.');
    case 404:
      return new Error('Resource not found.');
    case 409:
      return new Error('Conflict occurred.');
    case 422:
      return new Error('Validation failed.');
    default:
      if (status >= 500) {
        return new Error('Server error. Please try again later.');
      }
      return new Error(`Request failed with status ${status}.`);
  }
};

const getBackendMessage = (data: unknown): string | null => {
  if (data === null || typeof data !== 'object') {
    return null;
  }
  const obj = data as Record<string, unknown>;
  if (typeof obj.message === 'string' && obj.message.trim() !== '') {
    return obj.message;
  }
  return null;
};
