// src/core/models/project-spec.ts
import { z } from "zod";

export const ProjectSpecSchema = z.object({
  name: z.string(),
  type: z.enum(["frontend", "backend", "fullstack"]),
  framework: z.string(),
  packageManager: z.enum(["npm", "yarn", "pnpm"]).default("npm"),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  files: z.record(z.union([z.string(), z.object({})])),
  scripts: z.record(z.string()).default({}),
  postInstall: z.array(z.string()).optional(),
});

export type ProjectSpec = z.infer<typeof ProjectSpecSchema>;
