"use client";

import * as runtime from "react/jsx-runtime";
import { useMemo } from "react";
import { Callout } from "@/components/mdx/Callout";
import { Spoiler } from "@/components/mdx/Spoiler";
import { Flag } from "@/components/mdx/Flag";
import { Steps } from "@/components/mdx/Steps";
import { PromptPlayground } from "@/components/demos/PromptPlayground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDXComponent = React.ComponentType<{
  components?: Record<string, React.ComponentType<any>>;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sharedComponents: Record<string, React.ComponentType<any>> = {
  Callout,
  Spoiler,
  Flag,
  Steps,
  PromptPlayground,
};

function getMDXComponent(code: string): MDXComponent {
  // Velite compiles MDX into a function-body string.
  // new Function(code) creates a function that, when called with the JSX runtime,
  // returns { default: Component } where Component is the MDX React component.
  const fn = new Function(code); // eslint-disable-line no-new-func
  return (fn({ ...runtime }) as { default: MDXComponent }).default;
}

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  return <Component components={sharedComponents} />;
}
