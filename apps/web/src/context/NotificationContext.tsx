import { createContext, useContext, useEffect, type ReactElement, type ReactNode } from 'react';
import { App } from 'antd';

export type NotificationApi = ReturnType<typeof App.useApp>['notification'];

const NotificationContext = createContext<NotificationApi | undefined>(undefined);

let antdAppApi: ReturnType<typeof App.useApp> | null = null;

export function getAntdAppApi(): ReturnType<typeof App.useApp> | null {
  return antdAppApi;
}

export function useNotification(): NotificationApi {
  const notification = useContext(NotificationContext);
  if (notification === undefined) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return notification;
}

interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * Must be used inside antd's <App>. Provides notification via React Context
 * (useNotification) and sets the full antd app api for getAntdAppApi() so
 * non-React code and class components can show notifications.
 */
export function NotificationProvider({ children }: NotificationProviderProps): ReactElement {
  const api = App.useApp();

  useEffect(() => {
    antdAppApi = api;
    return () => {
      antdAppApi = null;
    };
  }, [api]);

  return (
    <NotificationContext.Provider value={api.notification}>
      {children}
    </NotificationContext.Provider>
  );
}
