import type { ReactNode } from 'react';
import { Button, Spin } from 'antd';
import { Card } from '@/components/common/Card';

export interface DataBoundaryProps {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  fallbackMessage: string;
  variant: 'page' | 'inline';
  errorTitle?: string;
  errorActionLabel?: string;
  onRetry?: () => void;
  children: ReactNode;
  className?: string;
}

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export function DataBoundary({
  isLoading,
  isError,
  error,
  fallbackMessage,
  variant,
  errorTitle,
  errorActionLabel,
  onRetry,
  children,
  className = '',
}: DataBoundaryProps): ReactNode {
  if (isLoading) {
    if (variant === 'page') {
      return (
        <div
          className={`flex flex-1 items-center justify-center py-12 ${className}`.trim()}
        >
          <Spin size="large" />
        </div>
      );
    }
    return (
      <div
        className={`flex min-h-0 flex-1 items-center justify-center p-8 ${className}`.trim()}
      >
        <Spin />
      </div>
    );
  }

  if (isError) {
    const message = getErrorMessage(error, fallbackMessage);
    if (variant === 'page') {
      return (
        <div className={`flex flex-1 flex-col gap-4 ${className}`.trim()}>
          <Card title={errorTitle ?? 'Error'} description={message}>
            {onRetry != null && (
              <Button type="primary" onClick={onRetry}>
                {errorActionLabel ?? 'Retry'}
              </Button>
            )}
          </Card>
        </div>
      );
    }
    return (
      <div
        className={`flex min-h-0 flex-1 items-center justify-center p-8 text-red-600 dark:text-red-400 ${className}`.trim()}
      >
        {message}
      </div>
    );
  }

  return <>{children}</>;
}
