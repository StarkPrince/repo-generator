// src/core/ai/spec-generator.ts
import { LLMClient } from "./llm-client";
import { ResponseHandler } from "./response-handler";

// src/core/ai/spec-generator.ts
export class SpecGenerator {
  private readonly SYSTEM_PROMPT = `You are a project specification generator. First think about the project structure, then output a valid JSON object. Your response must have this exact structure:

  1. First, your thinking wrapped in <think></think> tags
  2. Then, a complete JSON object with this structure:
  {
    "name": "project-name",
    "type": "frontend|backend|fullstack",
    "framework": "framework-name",
    "packageManager": "npm|yarn|pnpm",
    "dependencies": {
      "dependency1": "version"
    },
    "files": {
      "filepath": "content"
    }
  }

  Important: Always complete your thinking and output the complete JSON object.`;

  constructor(private llm: LLMClient) {}

  async generateSpec(prompt: string): Promise<any> {
    try {
      const response = await this.llm.chatCompletion({
        messages: [
          { role: "system", content: this.SYSTEM_PROMPT },
          {
            role: "user",
            content: `Generate a project specification for: ${prompt}. Make sure to complete your thinking and include the full JSON object.`,
          },
        ],
        temperature: 0.1,
        jsonMode: true,
      });

      return ResponseHandler.parseResponse(response);
    } catch (error: any) {
      console.error("Error in generateSpec:", error);
      throw error;
    }
  }
}
