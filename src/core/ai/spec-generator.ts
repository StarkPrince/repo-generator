// src/core/ai/spec-generator.ts
import { ProjectSpec, ProjectSpecSchema } from "../models/project-spec";
import { LLMClient } from "./llm-client";

export class SpecGenerator {
  private readonly SYSTEM_PROMPT = `
    You are an expert project generator. Analyze the user request and output:
    - Framework detection
    - Architecture decisions
    - Required dependencies
    - File structure
    - Build configuration
    Output VALID JSON only using this schema: ${JSON.stringify(
      ProjectSpecSchema.shape
    )}
  `;

  constructor(private llm: LLMClient) {}

  async generateSpec(prompt: string): Promise<ProjectSpec> {
    const response = await this.llm.chatCompletion({
      messages: [
        { role: "system", content: this.SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      jsonMode: true,
    });

    return ProjectSpecSchema.parse(response);
  }
}
