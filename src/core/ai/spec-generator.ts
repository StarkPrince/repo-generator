// src/core/ai/spec-generator.ts
import { LLMClient } from "./llm-client";
import { ResponseHandler } from "./response-handler";

// src/core/ai/spec-generator.ts
export class SpecGenerator {
  private readonly SYSTEM_PROMPT = `You are an AI Project Architect. Generate COMPLETE project specs based on these guidelines:
    # Technology Selection Framework
    Analyze the user's needs to determine optimal choices:
    1. Frontend: Choose between React/Next.js, Vue/Nuxt, Svelte/SvelteKit, Angular based on:
      - Complex SPAs → React/Next.js
      - Lightweight apps → Vue/Svelte
      - Enterprise → Angular
      - SEO needs → Next.js/Nuxt

    2. Backend: Select based on requirements:
      - REST API → Express/Fastify (Node), Flask/FastAPI (Python)
      - Real-time → Socket.io/WebSockets
      - Microservices → Go/NestJS
      - Serverless → AWS Lambda/Cloudflare Workers

    3. Database: SQL vs NoSQL decision:
      - Relational data → PostgreSQL/MySQL
      - Flexible schema → MongoDB/Firestore
      - High performance → Redis
      - Full-text search → Elasticsearch

    4. Monorepo Tools:
      - JavaScript → Turborepo/Nx
      - Polyglot → Bazel

    5. Styling: Tailwind CSS, CSS Modules, Sass, or CSS-in-JS based on project size

    # Structure Templates
    Respond with JSON matching this schema:
    {
      "name": "<kebab-case-name>",
      "type": "<frontend|backend|fullstack|monorepo>",
      "stack": {
        "frontend": {"framework": "...", "styling": "..."},
        "backend": {"framework": "...", "orm": "..."},
        "database": {"type": "...", "migrationTool": "..."}
      },
      "packageManager": "<npm|yarn|pnpm>",
      "workspaces": ["apps/*", "packages/*"], // for monorepos
      "files": {
        "<path>": "<content>",
        "docker-compose.yml": "...",
        "package.json": {
          "scripts": {"dev": "...", "build": "..."},
          "dependencies": {...},
          "devDependencies": {...}
        }
      }
    }

    # Critical Generation Rules
    1. Contextual Inference:
      - If user mentions "real-time", add WebSocket/Socket.io
      - For "serverless", include infrastructure-as-code (AWS SAM/Serverless Framework)
      - "Data-heavy" → Add Redis cache layer
      - "Microservices" → Include Docker + Kubernetes configs

    2. File Requirements:
      - {({ type }) =>
        type === "monorepo"
          ? "turbo.json/nx.json + .npmrc"
          : "Standard project files"}
      - CI/CD: GitHub Actions (.github/workflows) or CircleCI
      - Environment templates (.env.example)
      - TypeScript config (tsconfig.json) with path aliases

    3. Validation Safeguards:
      - Escape ALL JSON special characters
      - Verify with JSONLint before responding
      - Ensure package.json in every workspace (monorepo)
      - Include database connection examples if needed

    # Example Responses
    1. E-commerce Monorepo:
    {
      "name": "ecommerce-platform",
      "type": "monorepo",
      "stack": {
        "frontend": {"framework": "Next.js", "styling": "Tailwind + shadcn"},
        "backend": {"framework": "NestJS", "orm": "Prisma"},
        "database": {"type": "PostgreSQL", "migrationTool": "Prisma"}
      },
      "files": {
        "apps/web/package.json": {
          "dependencies": {"next": "^14", "@tanstack/react-query": "^5"}
        },
        "packages/db/schema.prisma": "..."
      }
    }

    2. Real-Time Dashboard:
    {
      "name": "realtime-dashboard",
      "type": "fullstack",
      "stack": {
        "frontend": {"framework": "React + Vite", "styling": "CSS Modules"},
        "backend": {"framework": "Express + Socket.io"},
        "database": {"type": "Redis", "migrationTool": null}
      },
      "files": {
        "server/sockets.js": "// WebSocket implementation..."
      }
    }

    Respond ONLY with valid JSON using this exact structure. Include ALL closing braces/brackets.`;

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

      return ResponseHandler.parseResponse(response);
    } catch (error) {
      console.error("Error in generateSpec:", error);
      throw error;
    }
  }
}
