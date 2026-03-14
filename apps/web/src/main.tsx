import '@ant-design/v5-patch-for-react-19';
import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { ConfigProvider, App as AntApp } from 'antd';
import 'antd/dist/reset.css';
import './index.css';
import { NotificationProvider } from '@/context/NotificationContext';
import { notifyError } from '@/ui/notification';
import { GlobalErrorBoundary } from '@/components/GlobalErrorBoundary';
import { store } from '@/store';
import { router } from '@/router';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Vite env
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (err: Error) => {
        notifyError(
          'Request failed',
          err instanceof Error ? err.message : 'Request failed',
        );
      },
    },
    // TanStack Query v5 does not support onError in defaultOptions.queries; use per-query onError or error boundaries.
  },
});

// Notify user when a Promise rejects and is never caught (safety net).
window.addEventListener('unhandledrejection', (event) => {
  const description =
    event.reason instanceof Error ? event.reason.message : String(event.reason);
  notifyError('Something went wrong', description || 'An unhandled error occurred.');
  event.preventDefault();
});

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');
createRoot(rootEl).render(
  <StrictMode>
    <ClerkProvider publishableKey={String(PUBLISHABLE_KEY)} afterSignOutUrl="/login">
      <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: 'Outfit, sans-serif',
            },
            components: {
              Table: {
                cellPaddingBlock: 16,
                cellPaddingInline: 24,
                cellPaddingBlockMD: 16,
                cellPaddingInlineMD: 24,
              },
            },
          }}
        >
          <AntApp>
            <NotificationProvider>
            <GlobalErrorBoundary>
              <Suspense fallback={<div className="flex min-h-[200px] items-center justify-center">Loading...</div>}>
                <RouterProvider router={router} />
              </Suspense>
            </GlobalErrorBoundary>
            </NotificationProvider>
          </AntApp>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
    </ClerkProvider>
  </StrictMode>,
);
