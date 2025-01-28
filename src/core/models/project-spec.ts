// src/core/models/project-spec.ts
import { z } from "zod";

// src/core/models/project-spec.ts
export const ProjectSpecSchema = z.object({
  name: z.string(),
  type: z.enum(["frontend", "backend", "fullstack"]),
  framework: z.string(),
  packageManager: z.enum(["npm", "yarn", "pnpm"]),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
  files: z.record(z.union([z.string(), z.any()])),
  scripts: z.record(z.string()).optional(),
  postInstall: z.array(z.string()).optional(),
});

export type ProjectSpec = z.infer<typeof ProjectSpecSchema>;
