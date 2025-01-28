import fs from "fs-extra";
import path from "path";

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

export async function generateProject(projectSpec: any) {
  const basePath = path.resolve(process.cwd(), "generated-project");
  await generateProjectStructure(basePath, projectSpec.files);
  console.log("Project generated at", basePath);

  // Install dependencies
  const npmInstall = await import("execa");
  await npmInstall.execa(projectSpec.packageManager, ["install"], {
    cwd: basePath,
    stdio: "inherit",
  });
}
