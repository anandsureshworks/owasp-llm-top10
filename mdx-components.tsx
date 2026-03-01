import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/Callout";
import { Spoiler } from "@/components/mdx/Spoiler";
import { Flag } from "@/components/mdx/Flag";
import { Steps } from "@/components/mdx/Steps";
import { CodeBlock } from "@/components/mdx/CodeBlock";
import { PromptPlayground } from "@/components/demos/PromptPlayground";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Callout,
    Spoiler,
    Flag,
    Steps,
    CodeBlock,
    PromptPlayground,
  };
}
