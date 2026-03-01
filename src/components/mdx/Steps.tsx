import type { ReactNode } from "react";

interface StepsProps {
  children: ReactNode;
}

/**
 * Numbered step list wrapper for MDX content.
 *
 * Usage in MDX:
 *   <Steps>
 *     <div>First step content</div>
 *     <div>Second step content</div>
 *   </Steps>
 *
 * Each direct child becomes a numbered step item.
 */
export function Steps({ children }: StepsProps) {
  const steps = Array.isArray(children) ? children : [children];

  return (
    <ol
      className="my-6 space-y-6"
      aria-label="Step-by-step instructions"
    >
      {steps.map((step, index) => (
        <li
          key={index}
          className="relative flex gap-4"
        >
          {/* Step number indicator */}
          <div className="flex flex-col items-center">
            <div
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-bold text-primary"
            >
              {index + 1}
            </div>
            {/* Connecting line — not rendered after the last step */}
            {index < steps.length - 1 && (
              <div
                aria-hidden="true"
                className="mt-2 w-px flex-1 bg-border"
              />
            )}
          </div>

          {/* Step content */}
          <div className="min-w-0 flex-1 pb-2 pt-1">
            <div className="text-sm text-foreground [&>p]:mt-0 [&>p+p]:mt-3">
              {step}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
