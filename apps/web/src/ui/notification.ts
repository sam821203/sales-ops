import { getAntdAppApi, type NotificationApi } from '@/context/NotificationContext';

function getNotification(): NotificationApi | null {
  return getAntdAppApi()?.notification ?? null;
}

/**
 * Show an error notification.
 * @param message - Main message (or description when only one arg)
 * @param description - Optional detail (when provided, message is used as title)
 */
export function notifyError(message: string, description?: string): void {
  getNotification()?.error({
    message: description !== undefined ? message : 'Error',
    description: description ?? message,
  });
}

/**
 * Show a success notification.
 */
export function notifySuccess(message: string, description?: string): void {
  getNotification()?.success({
    message: description !== undefined ? message : 'Success',
    description: description ?? message,
  });
}

/**
 * Show an info notification.
 */
export function notifyInfo(message: string, description?: string): void {
  getNotification()?.info({
    message: description !== undefined ? message : 'Info',
    description: description ?? message,
  });
}

/**
 * Show a warning notification.
 */
export function notifyWarning(message: string, description?: string): void {
  getNotification()?.warning({
    message: description !== undefined ? message : 'Warning',
    description: description ?? message,
  });
}
