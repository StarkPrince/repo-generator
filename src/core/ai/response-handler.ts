import { ProjectSpecSchema } from "../models/project-spec";

export class ResponseHandler {
  static async parseResponse(response: string): Promise<any> {
    try {
      console.log("Starting response parsing. Raw response:", response);

      // Wait for complete thinking section and JSON
      if (!response.includes("</think>")) {
        throw new Error("INCOMPLETE_RESPONSE");
      }

      // Extract JSON part - look for content between ```json and ``` or just {}
      let jsonStr = "";
      const jsonBlockMatch = response.match(/```json\s*({[\s\S]*?})\s*```/);
      const jsonMatch = response.match(/({[\s\S]*})\s*$/);

      if (jsonBlockMatch) {
        jsonStr = jsonBlockMatch[1];
      } else if (jsonMatch) {
        jsonStr = jsonMatch[1];
      } else {
        throw new Error("No valid JSON found in response");
      }

      // Clean up the JSON string
      jsonStr = jsonStr
        .replace(/\|.*?[,"\s]/g, '"') // Remove pipe options
        .replace(/'/g, '"') // Replace single quotes
        .trim();

      console.log("Cleaned JSON string:", jsonStr);

      // Parse JSON
      const parsedJson = JSON.parse(jsonStr);

      // Normalize and validate the spec
      const normalizedSpec = {
        name:
          parsedJson.name?.toLowerCase().replace(/\s+/g, "-") ||
          "ecommerce-platform",
        type: parsedJson.type?.split("|")[0] || "fullstack", // Take first option if multiple
        framework:
          parsedJson.framework === "npm" ? "react" : parsedJson.framework, // Fix framework/pm swap
        packageManager: parsedJson.packageManager?.toLowerCase() || "npm",
        files: parsedJson.files || {},
        dependencies: parsedJson.dependencies || {},
        devDependencies: parsedJson.devDependencies || {},
        scripts: parsedJson.scripts || {},
        postInstall: parsedJson.postInstall || [],
      };

      console.log("Normalized spec:", normalizedSpec);

      return ProjectSpecSchema.parse(normalizedSpec);
    } catch (error: any) {
      if (error.message === "INCOMPLETE_RESPONSE") {
        throw error;
      }
      console.error("Parsing error:", error);
      throw new Error(`Failed to parse LLM response: ${error.message}`);
    }
  }
}
