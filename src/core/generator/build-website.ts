// src/core/generator/build-website.ts
import fs from "fs-extra";
import path from "path";
import { ProjectSpec } from "../../core/models/project-spec";

async function generateProjectFiles(spec: ProjectSpec) {
  const projectPath = path.resolve(process.cwd(), "generated-project");

  // Create project directory
  await fs.ensureDir(projectPath);
  console.log("Created project directory:", projectPath);

  // Generate files based on the project specification
  if (spec.files) {
    for (const [filePath, content] of Object.entries(spec.files)) {
      const fullPath = path.join(projectPath, filePath);
      await fs.outputFile(fullPath, content as string);
      console.log(`Generated file: ${filePath}`);
    }
  }

  // Install dependencies
  const installer = await import("execa");
  await installer.execa(spec.packageManager, ["install"], {
    cwd: projectPath,
    stdio: "inherit",
  });
}

export async function generateProject(spec: ProjectSpec) {
  await generateProjectFiles(spec);
  console.log("Project generation complete.");
}
