import { SignIn } from '@clerk/clerk-react';

export function SignInPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
      <SignIn />
    </div>
  );
}
