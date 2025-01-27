import { ProjectSpec } from "@/core/models/project-spec";
import inquirer from "inquirer";

// src/cli/prompts/project-prompt.ts
export class ProjectPrompt {
  async getProjectDetails() {
    return inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Project name:",
        validate: (input: string) => /^[a-z\-]+$/.test(input),
      },
      {
        type: "list",
        name: "type",
        message: "Project type:",
        choices: ["frontend", "backend", "fullstack"],
      },
    ]);
  }

  async confirmSpec(spec: ProjectSpec) {
    const { confirmed } = await inquirer.prompt({
      type: "confirm",
      name: "confirmed",
      message: `Generate project with this spec?\n${JSON.stringify(
        spec,
        null,
        2
      )}`,
      default: true,
    });

    return confirmed;
  }
}
