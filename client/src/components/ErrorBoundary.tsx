import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="w-full max-w-md mx-auto border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">오류가 발생했습니다</CardTitle>
            <CardDescription>
              애플리케이션에서 예상치 못한 오류가 발생했습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
              {this.state.error?.message || '알 수 없는 오류'}
            </div>
            <div className="flex gap-2">
              <Button onClick={this.handleRetry} variant="outline" size="sm">
                다시 시도
              </Button>
              <Button onClick={() => window.location.reload()} size="sm">
                페이지 새로고침
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

// API 에러 전용 Error Boundary Hook
export function useApiError() {
  const [error, setError] = React.useState<{
    message: string;
    statusCode?: number;
    isVisible: boolean;
  }>({ message: '', isVisible: false });

  const showError = (message: string, statusCode?: number) => {
    setError({ message, statusCode, isVisible: true });
  };

  const hideError = () => {
    setError(prev => ({ ...prev, isVisible: false }));
  };

  return { error, showError, hideError };
}