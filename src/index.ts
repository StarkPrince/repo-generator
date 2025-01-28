import inquirer from "inquirer";
import { LLMClient } from "./core/ai/llm-client";
import { SpecGenerator } from "./core/ai/spec-generator";
import { generateProject } from "./core/generator/generate-file";

(async () => {
  const llmClient = new LLMClient();
  const specGenerator = new SpecGenerator(llmClient);

  const { prompt } = await inquirer.prompt([
    { type: "input", name: "prompt", message: "What do you want to build?" },
  ]);

  console.log(`Processing prompt: ${prompt}`);

  try {
    const projectSpec = await specGenerator.generateSpec(prompt);
    console.log("Valid Project Spec:", projectSpec);

    await generateProject(projectSpec);
  } catch (error: any) {
    console.error("Project Generation Failed:", error.message);
  }
})();
