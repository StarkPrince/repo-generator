// src/index.ts
import inquirer from "inquirer";
import { ZodError } from "zod";
import { LLMClient } from "./core/ai/llm-client";
import { SpecGenerator } from "./core/ai/spec-generator";
import { generateProject } from "./core/generator/generate-file";

(async () => {
  const llmClient = new LLMClient();
  const specGenerator = new SpecGenerator(llmClient);

  try {
    const { prompt } = await inquirer.prompt([
      {
        type: "input",
        name: "prompt",
        message: "What project do you want to build?",
      },
    ]);

    console.log(`Processing prompt: "${prompt}"`);
    const projectSpec = await specGenerator.generateSpec(prompt);
    console.log("Project Specification:", projectSpec);
    await generateProject(projectSpec);
    console.log("Project generation complete.");
  } catch (error: any) {
    console.error("Project Generation Failed:");
    if (error.message.includes("INCOMPLETE_RESPONSE")) {
      console.error("LLM returned incomplete response. Please try again.");
    } else if (error instanceof ZodError) {
      console.error("Validation Errors:");
      error.issues.forEach((issue) => {
        console.error(`- Missing ${issue.path.join(".")}: ${issue.message}`);
      });
      console.error("\nSuggestions:");
      console.error("- Check if the LLM returned all required fields");
      console.error("- Verify the response format matches the schema");
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
})();
