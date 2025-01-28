import fs from "fs-extra";
import path from "path";
import { ProjectSpec } from "../../core/models/project-spec";

const CORE_FILES = [
  "README.md",
  ".gitignore",
  "package.json",
  "tsconfig.json",
  "public/favicon.ico",
  "src/index.tsx",
  "src/App.tsx",
];

export async function generateProject(projectSpec: ProjectSpec) {
  const basePath = path.resolve(process.cwd(), "generated-project");

  // Clear existing directory
  await fs.emptyDir(basePath);

  // Create essential directory structure
  await createBaseStructure(basePath);

  // Generate files from spec
  await generateSpecFiles(basePath, projectSpec);

  // Add core framework files
  await addCoreFiles(basePath, projectSpec);

  console.log("Project generated at", basePath);
}

async function createBaseStructure(basePath: string) {
  const directories = [
    "src/components",
    "src/hooks",
    "src/styles",
    "public",
    "server",
    "config",
  ];

  await Promise.all(
    directories.map((dir) => fs.ensureDir(path.join(basePath, dir)))
  );
}

async function generateSpecFiles(basePath: string, spec: ProjectSpec) {
  if (!spec.files) return;

  // First pass: Create all directories
  await Promise.all(
    Object.keys(spec.files).map(async (filePath) => {
      const fullPath = path.join(basePath, normalizePath(filePath));
      await fs.ensureDir(path.dirname(fullPath));
    })
  );

  // Second pass: Write files
  await Promise.all(
    Object.entries(spec.files).map(async ([filePath, content]) => {
      const fullPath = path.join(basePath, normalizePath(filePath));

      try {
        if (typeof content === "object") {
          await fs.outputJson(fullPath, content, { spaces: 2 });
        } else {
          await fs.outputFile(fullPath, content);
        }
      } catch (error: any) {
        console.error(`Failed to write ${filePath}:`, error.message);
      }
    })
  );
}

async function addCoreFiles(basePath: string, spec: ProjectSpec) {
  // Enhanced package.json handling
  const packageJsonPath = path.join(basePath, "package.json");
  let pkgContent = {
    name: spec.name,
    version: "1.0.0",
    scripts: spec.scripts,
    dependencies: spec.dependencies,
    devDependencies: spec.devDependencies,
  };

  try {
    await fs.outputJson(packageJsonPath, pkgContent, { spaces: 2 });
  } catch (error) {
    console.error("Error writing package.json:", error);
    // Fallback to empty package.json
    await fs.outputJson(
      packageJsonPath,
      {
        name: spec.name,
        version: "1.0.0",
        scripts: {},
        dependencies: {},
        devDependencies: {},
      },
      { spaces: 2 }
    );
  }

  // Create essential files with content validation
  await Promise.all(
    CORE_FILES.map(async (file) => {
      const fullPath = path.join(basePath, file);
      if (await fs.pathExists(fullPath)) return;

      let content = getDefaultFileContent(file, spec);
      // Ensure valid content for critical files
      if (file === "src/index.tsx") {
        content = content.includes("ReactDOM.render")
          ? content
          : `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<App />);`;
      }

      await fs.outputFile(fullPath, content);
    })
  );
}

function getDefaultFileContent(filePath: string, spec: ProjectSpec) {
  switch (filePath) {
    case "README.md":
      return `# ${spec.name}\n\nProject generated automatically`;
    case ".gitignore":
      return "node_modules/\n.env\n.DS_Store";
    case "tsconfig.json":
      return JSON.stringify(
        {
          compilerOptions: {
            target: "ESNext",
            lib: ["DOM", "DOM.Iterable", "ESNext"],
            module: "ESNext",
            skipLibCheck: true,
          },
        },
        null,
        2
      );
    default:
      return "// Auto-generated file";
  }
}

function normalizePath(filePath: string) {
  return filePath.replace(/\\/g, "/");
}
