// src/core/models/project-spec.ts
import { z } from "zod";

// src/core/models/project-spec.ts
export const ProjectSpecSchema = z.object({
  name: z.string().min(3).max(40),
  type: z.enum(["frontend", "backend", "fullstack"]),
  framework: z.string().min(3),
  packageManager: z.enum(["npm", "yarn", "pnpm"]),
  dependencies: z.record(z.string()).default({}),
  devDependencies: z.record(z.string()).default({}),
  files: z.record(z.union([z.string(), z.any()])).default({}),
  scripts: z.record(z.string()).default({}),
  postInstall: z.array(z.string()).optional(),
});

export type ProjectSpec = z.infer<typeof ProjectSpecSchema>;
