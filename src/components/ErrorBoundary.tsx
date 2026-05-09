'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
            <p className="text-sm text-slate-700 mb-4">
              画面の表示中に予期せぬエラーが発生しました。申し訳ありません。
            </p>
            <div className="bg-slate-100 p-4 rounded text-xs text-red-800 font-mono overflow-auto max-h-64">
              {this.state.error?.message || 'Unknown error'}
              <br /><br />
              {this.state.error?.stack}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition"
            >
              ページを再読み込みする
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
