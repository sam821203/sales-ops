import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { ConfigProvider, App as AntApp } from 'antd';
import 'antd/dist/reset.css';
import './index.css';
import { store } from '@/store';
import { router } from '@/router';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/login">
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
            <RouterProvider router={router} />
          </AntApp>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
    </ClerkProvider>
  </StrictMode>,
);
