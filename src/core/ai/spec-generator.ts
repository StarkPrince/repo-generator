// src/core/ai/spec-generator.ts
import { LLMClient } from "./llm-client";
import { ResponseHandler } from "./response-handler";

// src/core/ai/spec-generator.ts
export class SpecGenerator {
  private readonly SYSTEM_PROMPT = `You are a project specification generator. Generate a complete project spec with these exact steps:

1. First, think about the project structure (wrap in <think></think> tags)
2. Then output a single, valid JSON object with these EXACT fields:
{
  "name": "project-name-in-kebab-case",
  "type": "fullstack",           // MUST be exactly one of: frontend, backend, fullstack
  "framework": "react",          // Common frameworks: react, express, vue, angular
  "packageManager": "npm",       // MUST be exactly one of: npm, yarn, pnpm
  "dependencies": {              // Required package versions
    "dependency-name": "version"
  },
  "files": {                     // Key files in the project
    "filepath": "content or description"
  }
}

Important:
- Choose exactly ONE value for type and packageManager
- name should be kebab-case (lowercase with hyphens)
- NO markdown code blocks around the JSON
- Must output complete JSON object`;

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
