import inquirer from "inquirer";
import { generateProject } from "./core/generator/generate-file";
import { getChatCompletion } from "./prompt-handler";

(async () => {
  const { prompt } = await inquirer.prompt([
    { type: "input", name: "prompt", message: "What do you want to build?" },
  ]);

  console.log(`Processing prompt: "${prompt}"`);

  try {
    // Analyze the prompt using AI
    const projectSpec = await getChatCompletion(prompt);
    console.log("Project Specification:", projectSpec);

    // Generate the project
    await generateProject(projectSpec);
  } catch (error: any) {
    console.error("Error generating project:", error.message);
  }
})();
