import { ProjectSpecSchema } from "../models/project-spec";

export class ResponseHandler {
  static async parseResponse(response: string): Promise<any> {
    try {
      console.log("Starting response parsing. Raw response:", response);

      // Wait for complete thinking section
      if (response.includes("<think>") && !response.includes("</think>")) {
        throw new Error(
          "Response incomplete - waiting for think section to complete"
        );
      }

      // Look for JSON after the thinking section
      const jsonMatch = response.split("</think>")[1]?.match(/({[\s\S]*})\s*$/);
      if (!jsonMatch) {
        throw new Error("Response incomplete - waiting for JSON object");
      }

      // Get the matched JSON string
      const jsonStr = jsonMatch[1].trim();
      console.log("Extracted JSON:", jsonStr);

      try {
        // Parse the JSON
        const parsedJson = JSON.parse(jsonStr);

        // Normalize the spec
        const normalizedSpec = {
          name: parsedJson.name || "default-project",
          type: parsedJson.type || "fullstack",
          framework: parsedJson.framework || "typescript",
          packageManager: parsedJson.packageManager || "npm",
          files: parsedJson.files || {},
          dependencies: parsedJson.dependencies || {},
          devDependencies: parsedJson.devDependencies || {},
          scripts: parsedJson.scripts || {},
          postInstall: parsedJson.postInstall || [],
        };

        // Validate against schema
        return ProjectSpecSchema.parse(normalizedSpec);
      } catch (error: any) {
        console.error("JSON parsing error:", error);
        throw new Error(`Invalid JSON format: ${error.message}`);
      }
    } catch (error: any) {
      if (error.message.includes("waiting for")) {
        // If we're waiting for more content, throw a special error
        throw new Error("INCOMPLETE_RESPONSE");
      }
      throw error;
    }
  }
}
