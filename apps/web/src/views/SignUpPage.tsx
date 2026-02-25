import { SignUp } from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';
import { AuthPageShell } from '@/components/AuthPageShell';

export function SignUpPage() {
  return (
    <AuthPageShell
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400"
          >
            Sign in
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
        <SignUp
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'w-full shadow-none',
              cardBox: 'w-full',
            },
          }}
          signInUrl="/login"
          forceRedirectUrl="/dashboard/ecommerce"
          fallbackRedirectUrl="/dashboard/ecommerce"
        />
      </div>
    </AuthPageShell>
  );
}
