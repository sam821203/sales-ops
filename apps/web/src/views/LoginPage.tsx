import { SignIn, useAuth } from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';
import { AuthPageShell } from '@/components/AuthPageShell';

const LoadingState = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-25 via-gray-50 to-brand-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-brand-950/30">
    <div className="flex flex-col items-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <p className="text-sm text-body dark:text-bodydark">Loading...</p>
    </div>
  </div>
);

export function LoginPage() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || isSignedIn) {
    return <LoadingState />;
  }

  return (
    <AuthPageShell
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            to="/auth/signup"
            className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
          >
            Sign up
          </Link>
        </>
      }
    >
      <Link
        to="/"
        className="flex justify-center transition-opacity hover:opacity-90"
      >
        <img src="/logo.svg" alt="SalesOps" className="h-10" />
      </Link>
      <div className="flex flex-col items-center justify-center">
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'w-full shadow-none',
              cardBox: 'w-full',
            },
          }}
          signUpUrl="/auth/signup"
          forceRedirectUrl="/dashboard/ecommerce"
          fallbackRedirectUrl="/dashboard/ecommerce"
        />
      </div>
    </AuthPageShell>
  );
}
