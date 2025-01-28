import fs from "fs-extra";
import path from "path";
import { ProjectSpec } from "../../core/models/project-spec";

export async function generateProject(projectSpec: ProjectSpec) {
  const basePath = path.resolve(
    process.cwd(),
    "generated-projects",
    projectSpec.name.toLowerCase().replace(/ /g, "-")
  );
  // Clear existing directory
  await fs.emptyDir(basePath);
  await createBaseStructure(basePath, projectSpec);
  await generateSpecFiles(basePath, projectSpec);
  await addCoreFiles(basePath, projectSpec);
  console.log("Project generated at", basePath);
}

// In generate-file.ts
async function createBaseStructure(basePath: string, spec: ProjectSpec) {
  const baseDirs = [
    "apps/web/src",
    "apps/mobile",
    "packages/config",
    "packages/ui",
    "packages/db",
    "public",
    "server",
    "config",
  ];

  if (spec.type === "monorepo") {
    await Promise.all([
      fs.ensureDir(path.join(basePath, "apps/web/src/pages")),
      fs.ensureDir(path.join(basePath, "packages/config")),
      fs.outputFile(
        path.join(basePath, "apps/web/next.config.js"),
        `
        /** @type {import('next').NextConfig} */
        module.exports = {
          experimental: {
            appDir: true,
          },
        }
      `
      ),
    ]);
  }

  await Promise.all(
    baseDirs.map((dir) => fs.ensureDir(path.join(basePath, dir)))
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

// In generate-file.ts
async function addCoreFiles(basePath: string, spec: ProjectSpec) {
  const coreDependencies = {
    typescript: "^5.3.0",
    "@types/node": "^20.0.0",
    ...spec.dependencies,
  };

  const rootPkg = {
    name: spec.name,
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "turbo dev",
      build: "turbo build",
      test: "turbo test",
      ...spec.scripts,
    },
    workspaces: ["apps/*", "packages/*"],
    dependencies: coreDependencies,
    devDependencies: {
      turbo: "latest",
      ...spec.devDependencies,
    },
  };

  await fs.outputJson(path.join(basePath, "package.json"), rootPkg, {
    spaces: 2,
  });

  // Generate workspace package.jsons
  if (spec.type === "monorepo") {
    await generateWorkspacePackages(basePath, spec);
  }
}

async function generateWorkspacePackages(basePath: string, spec: ProjectSpec) {
  const webPkg = {
    name: "web",
    version: "1.0.0",
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
    },
    dependencies: {
      next: "^14.1.0",
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      ...spec.dependencies,
    },
  };

  await fs.outputJson(path.join(basePath, "apps/web/package.json"), webPkg, {
    spaces: 2,
  });
}

function normalizePath(filePath: string) {
  return filePath.replace(/\\/g, "/");
}
