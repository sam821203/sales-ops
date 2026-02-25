import { Outlet, useRouterState } from '@tanstack/react-router';
import { AuthGuard } from '@/components/AuthGuard';
import { DefaultLayout } from '@/layout/DefaultLayout';

const AUTH_PATHS = ['/login', '/auth/signin', '/auth/signup'];

export default function App() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthPage = AUTH_PATHS.includes(pathname);

  if (isAuthPage) {
    return <Outlet />;
  }
  return (
    <AuthGuard>
      <DefaultLayout />
    </AuthGuard>
  );
}
