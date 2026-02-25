export function AuthPageShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-25 via-gray-50 to-brand-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-brand-950/30">
      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-600/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl dark:bg-brand-700/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/3 top-1/4 h-40 w-40 rounded-full bg-secondary/20 blur-2xl dark:bg-secondary/10"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md space-y-6 px-4 py-8">
        <div className="flex flex-col gap-6">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-body dark:text-bodydark">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}
