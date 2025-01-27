// src/core/generator/template-engine.ts
import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import { ProjectSpec } from "../models/project-spec";

export class TemplateEngine {
  private readonly CORE_TEMPLATES = path.join(__dirname, "../../templates");

  async render(spec: ProjectSpec): Promise<Record<string, string>> {
    const files: Record<string, string> = {};

    // Merge base templates with framework-specific templates
    const templatePath = path.join(
      this.CORE_TEMPLATES,
      spec.type,
      spec.framework.toLowerCase()
    );

    await this.processDirectory(templatePath, files, spec);

    return files;
  }

  private async processDirectory(
    dir: string,
    files: Record<string, string>,
    context: object
  ) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await this.processDirectory(fullPath, files, context);
      } else {
        const content = await fs.promises.readFile(fullPath, "utf8");
        const template = handlebars.compile(content);
        files[fullPath.replace(this.CORE_TEMPLATES, "")] = template(context);
      }
    }
  }
}
