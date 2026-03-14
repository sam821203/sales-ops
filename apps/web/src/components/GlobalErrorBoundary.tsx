import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from 'antd';
import { notifyError } from '@/ui/notification';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    void errorInfo;
    notifyError('Something went wrong', error?.message ?? 'An unexpected error occurred.');
  }

  public render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 p-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {this.state.error.message}
          </p>
          <Button type="primary" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
