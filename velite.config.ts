import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

const owaspCategory = s.enum([
  "llm01", "llm02", "llm03", "llm04", "llm05",
  "llm06", "llm07", "llm08", "llm09", "llm10",
]);

const difficulty = s.enum(["beginner", "intermediate", "advanced"]);
const severity = s.enum(["low", "medium", "high", "critical"]);

// Shared base fields
const baseFields = {
  slug: s.path(),
  title: s.string().max(100),
  description: s.string().max(300),
  owaspCategory,
  tags: s.array(s.string()).default([]),
  author: s.string().default("Community"),
  publishedAt: s.isodate(),
  updatedAt: s.isodate().optional(),
  draft: s.boolean().default(false),
  body: s.mdx(),
};

const writeups = defineCollection({
  name: "Writeup",
  pattern: "writeups/**/*.mdx",
  schema: s.object({
    ...baseFields,
    difficulty,
    severity,
    cvssScore: s.number().min(0).max(10).optional(),
    relatedLabs: s.array(s.string()).default([]),
    relatedDemos: s.array(s.string()).default([]),
    relatedTools: s.array(s.string()).default([]),
    toc: s.toc(),
  }),
});

const labs = defineCollection({
  name: "Lab",
  pattern: "labs/**/*.mdx",
  schema: s.object({
    ...baseFields,
    difficulty,
    challengeType: s.enum(["black-box", "white-box", "ctf", "guided"]),
    sandboxType: s.enum(["sandpack", "iframe", "none"]).default("none"),
    timeEstimate: s.string().optional(),
    points: s.number().int().min(0).default(0),
    hasSolution: s.boolean().default(false),
    flagFormat: s.string().optional(),
    relatedWriteups: s.array(s.string()).default([]),
    toc: s.toc(),
  }),
});

const demos = defineCollection({
  name: "Demo",
  pattern: "demos/**/*.mdx",
  schema: s.object({
    ...baseFields,
    demoType: s.enum(["interactive", "visualization", "comparison", "benchmark"]),
    isSafeToRun: s.boolean().default(true),
    requiresApiKey: s.boolean().default(false),
    interactiveComponents: s.array(s.string()).default([]),
    relatedWriteups: s.array(s.string()).default([]),
    toc: s.toc(),
  }),
});

const tools = defineCollection({
  name: "Tool",
  pattern: "tools/**/*.mdx",
  schema: s.object({
    ...baseFields,
    owaspCategories: s.array(owaspCategory).min(1),
    toolType: s.enum(["scanner", "framework", "library", "dataset", "benchmark", "red-team", "defense"]),
    projectUrl: s.string().url(),
    githubUrl: s.string().url().optional(),
    license: s.string().optional(),
    status: s.enum(["active", "maintained", "archived", "experimental"]).default("active"),
    toc: s.toc(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { writeups, labs, demos, tools },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: false,
        },
      ],
    ],
    remarkPlugins: [remarkGfm],
  },
});
