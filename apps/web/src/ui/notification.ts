import { getAntdAppApi, type NotificationApi } from '@/context/NotificationContext';

const getNotification = (): NotificationApi | null =>
  getAntdAppApi()?.notification ?? null;

/**
 * Show an error notification.
 * @param message - Main message (or description when only one arg)
 * @param description - Optional detail (when provided, message is used as title)
 */
export const notifyError = (message: string, description?: string): void => {
  getNotification()?.error({
    message: description !== undefined ? message : 'Error',
    description: description ?? message,
  });
};

/**
 * Show a success notification.
 */
export const notifySuccess = (message: string, description?: string): void => {
  getNotification()?.success({
    message: description !== undefined ? message : 'Success',
    description: description ?? message,
  });
};

/**
 * Show an info notification.
 */
export const notifyInfo = (message: string, description?: string): void => {
  getNotification()?.info({
    message: description !== undefined ? message : 'Info',
    description: description ?? message,
  });
};

/**
 * Show a warning notification.
 */
export const notifyWarning = (message: string, description?: string): void => {
  getNotification()?.warning({
    message: description !== undefined ? message : 'Warning',
    description: description ?? message,
  });
};
