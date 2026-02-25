import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';

const LOGIN_PATH = '/login';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Protects backend routes: redirects to /login when user is not signed in.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate({ to: LOGIN_PATH, search: { redirect: pathname } });
    }
  }, [isLoaded, isSignedIn, navigate, pathname]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return <>{children}</>;
}
