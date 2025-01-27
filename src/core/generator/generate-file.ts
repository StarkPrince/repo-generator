import fs from "fs-extra";
import path from "path";

async function generateProjectStructure(basePath: string, structure: any) {
  for (const [name, content] of Object.entries(structure)) {
    const fullPath = path.join(basePath, name);
    if (typeof content === "string") {
      await fs.outputFile(fullPath, content);
    } else {
      await fs.ensureDir(fullPath);
      await generateProjectStructure(fullPath, content);
    }
  }
}

export async function generateProject(projectSpec: any) {
  const basePath = path.resolve(process.cwd(), "generated-project");
  const structure = {
    src: {
      ...(projectSpec.type === "frontend"
        ? {
            "App.js": `import React from 'react';\nexport default function App() { return <div>Hello World</div>; }`,
          }
        : {}),
      ...(projectSpec.type === "backend"
        ? {
            "index.js": `const express = require('express');\nconst app = express();\napp.listen(3000, () => console.log('Server running'));`,
          }
        : {}),
    },
    "package.json": JSON.stringify(
      {
        name: "generated-project",
        version: "1.0.0",
        scripts: {
          start: projectSpec.type === "backend" ? "node src/index.js" : "vite",
        },
        dependencies: projectSpec.dependencies || [],
      },
      null,
      2
    ),
  };

  await generateProjectStructure(basePath, structure);
  console.log("Project generated at", basePath);

  // Dynamically import dependencies and install them
  const npmInstall = await import("execa");
  await npmInstall.execa("npm", ["install", ...projectSpec.dependencies], {
    cwd: basePath,
    stdio: "inherit",
  });
}
