// src/core/models/project-spec.ts
import { z } from "zod";

// src/core/models/project-spec.ts
// In project-spec.ts
export const ProjectSpecSchema = z
  .object({
    name: z.string().min(3).max(40),
    type: z.enum(["frontend", "backend", "fullstack", "monorepo"]),
    framework: z.string().min(3),
    packageManager: z.enum(["npm", "yarn", "pnpm"]),
    dependencies: z.record(z.string()).default({}),
    devDependencies: z.record(z.string()).default({}),
    files: z.record(z.union([z.string(), z.any()])).default({}),
    scripts: z.record(z.string()).default({}),
    postInstall: z.array(z.string()).optional(),
    workspaces: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "monorepo" && !data.workspaces) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Monorepo projects must specify workspaces",
      });
    }
  });

export type ProjectSpec = z.infer<typeof ProjectSpecSchema>;
