import fs from "fs-extra";
import path from "path";
import { ProjectSpec } from "../../core/models/project-spec";

async function generateProjectStructure(basePath: string, structure: any) {
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = path.join(basePath, name);
    if (typeof content === "string") {
      await fs.outputFile(fullPath, content);
    } else if (typeof content === "object") {
      await fs.outputFile(fullPath, JSON.stringify(content, null, 2));
    } else {
      throw new Error(`Unsupported file content type for ${name}`);
    }
  }
}
export async function generateProject(projectSpec: ProjectSpec) {
  const basePath = path.resolve(process.cwd(), "generated-project");

  if (projectSpec.files && typeof projectSpec.files === "object") {
    for (const [filePath, fileContent] of Object.entries(projectSpec.files)) {
      const fullPath = path.join(basePath, filePath);

      if (typeof fileContent === "string") {
        await fs.outputFile(fullPath, fileContent);
      } else {
        await fs.outputFile(fullPath, JSON.stringify(fileContent, null, 2));
      }
    }
  }

  console.log("Project generated at", basePath);
}
