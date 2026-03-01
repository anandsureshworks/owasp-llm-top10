"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import { AlertCircle, Terminal } from "lucide-react";

interface SandpackDemoProps {
  files: Record<string, string>;
  entry?: string;
  title?: string;
}

// ---------------------------------------------------------------------------
// Error boundary
// ---------------------------------------------------------------------------

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class SandpackErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[SandpackDemo] Unhandled error:", error, info);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="my-6 flex flex-col items-center justify-center gap-3 rounded-lg border border-red-800/50 bg-red-950/20 px-6 py-10 text-center"
        >
          <AlertCircle
            className="size-8 text-red-400"
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-red-300">
            Sandpack failed to load
          </p>
          <p className="max-w-sm text-xs text-muted-foreground">
            {this.state.message || "An unexpected error occurred in the sandbox."}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="mt-2 rounded border border-red-700/50 bg-red-950/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-900/30 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// SandpackDemo component
// ---------------------------------------------------------------------------

export function SandpackDemo({ files, entry, title }: SandpackDemoProps) {
  const sandpackFiles: Record<string, { code: string; active?: boolean }> =
    Object.fromEntries(
      Object.entries(files).map(([path, code]) => [
        path,
        { code, active: entry ? path === entry : false },
      ])
    );

  return (
    <div
      className="my-6 overflow-hidden rounded-lg border border-border"
      role="region"
      aria-label={title ?? "Interactive code sandbox"}
    >
      {/* Optional title bar */}
      {title && (
        <div className="flex items-center gap-2 border-b border-border bg-muted/20 px-4 py-2.5">
          <Terminal
            className="size-3.5 text-primary"
            aria-hidden="true"
          />
          <span className="font-mono text-xs text-muted-foreground">{title}</span>
        </div>
      )}

      <SandpackErrorBoundary>
        <Sandpack
          files={sandpackFiles}
          template="vanilla"
          theme="dark"
          options={{
            editorHeight: 400,
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: false,
            editorWidthPercentage: 55,
          }}
        />
      </SandpackErrorBoundary>
    </div>
  );
}
