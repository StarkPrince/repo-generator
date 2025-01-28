import { ProjectSpec, ProjectSpecSchema } from "../models/project-spec";
import { LLMClient } from "./llm-client";

export class SpecGenerator {
  private readonly SYSTEM_PROMPT = `
  You are a project specification generator. The user's prompt describes a project. Your task is to respond with a **VALID JSON OBJECT** that conforms to this schema and nothing else:

  ${JSON.stringify(ProjectSpecSchema.shape)}

  DO NOT include explanations, narratives, or HTML markup. Respond exclusively with the JSON object.
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

    try {
      return ProjectSpecSchema.parse(JSON.parse(response));
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);

      const jsonMatch = response.match(/({.*})/s);

      if (jsonMatch) {
        try {
          const jsonContent = jsonMatch[1].trim();
          console.log("Extracted JSON:", jsonContent);
          return ProjectSpecSchema.parse(JSON.parse(jsonContent));
        } catch (extractionError) {
          console.error("Extraction Error:", extractionError);
        }
      }

      throw new Error("Invalid response from AI. Expected valid JSON.");
    }
  }
}
