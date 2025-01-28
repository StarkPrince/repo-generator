// src/core/ai/spec-generator.ts
import { LLMClient } from "./llm-client";
import { ResponseHandler } from "./response-handler";

// src/core/ai/spec-generator.ts
export class SpecGenerator {
  private readonly SYSTEM_PROMPT = `You MUST generate COMPLETE project specs with:
  1. Modern Tech Stack: Use latest versions of:
    - Next.js 14+ with App Router
    - TypeScript 5.3+
    - Turborepo for monorepos
    - tRPC/GraphQL for API
    - Tailwind CSS + shadcn/ui
    - Prisma + Postgres / MongoDB + Mongoose
    - React Server Components

  2. Monorepo Structure:
    {
      "type": "monorepo", ["frontend", "backend", "fullstack", "monorepo"]
      "workspaces": ["apps/*", "packages/*"],
      "files": {
        "apps/web/...": "...",
        "packages/config/...": "...",
        "packages/db/...": "..."
      }
    }

  3. Full Production-Ready Example:
    {
      "name": "travel-agent-platform",
      "type": "monorepo", // ["frontend", "backend", "fullstack", "monorepo"],
      "framework": "nextjs",
      "packageManager": "pnpm",
      "files": {
        "apps/web/package.json": {
          "name": "web",
          "dependencies": {
            "next": "^14.1.0",
            "@trpc/react-query": "^11.0.0",
            "zod": "^3.22.0"
          }
        },
        "packages/db/package.json": {
          "name": "db",
          "dependencies": {
            "prisma": "^5.8.0",
            "@types/node": "^20.0.0"
          }
        },
        "turbo.json": {
          "pipeline": {
            "build": {"dependsOn": ["^build"]}
          }
        }
      },
      "scripts": {
        "dev": "turbo dev",
        "build": "turbo build"
      },
      "dependencies": {
        "react": "^18.2.0",
        "typescript": "^5.3.0"
      }
    }

  CRITICAL RULES:
  1. Required Files:
    - turbo.json for monorepo management
    - .npmrc (shamefully-hoist=true)
    - Multiple workspace package.json files
    - Dockerfile + compose.yaml for services
    - CI/CD configs (github-actions/*)

  2. Structure Must Include:
    - apps/web (Next.js 14+)
    - apps/mobile (Expo if needed)
    - packages/config (shared ESLint/TS)
    - packages/ui (component library)
    - packages/db (Prisma schema)

  3. Validation Requirements:
    - Escape ALL double quotes in file content
    - Verify JSON validity using JSONLint
    - Include BOTH frontend and backend services
    - Add proper TypeScript path aliases

  Respond ONLY with valid JSON using this exact structure. Include ALL closing braces/brakets.`;

  constructor(private llm: LLMClient) {}

  async generateSpec(prompt: string): Promise<any> {
    try {
      const response = await this.llm.chatCompletion({
        messages: [
          { role: "system", content: this.SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        jsonMode: true,
      });

      console.log("Response:", response);

      return ResponseHandler.parseResponse(response);
    } catch (error) {
      console.error("Error in generateSpec:", error);
      throw error;
    }
  }
}
