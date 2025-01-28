// src/core/ai/response-handler.ts
export class ResponseHandler {
  static async parseResponse(response: string): Promise<any> {
    try {
      // Improved JSON extraction with error recovery
      const jsonMatch = response.match(/(\{[\s\S]*?})(?=\s*(?:$|\n))/);
      if (!jsonMatch) throw new Error("NO_JSON_FOUND");

      let jsonStr = jsonMatch[1]
        .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2":')
        .replace(/'/g, '"')
        .replace(/\\"/g, '"')
        .replace(
          /(:\s*")([^"]*?)(\s*[},\]])/g,
          (_, p1, p2, p3) => `${p1}${p2.replace(/\n/g, "\\n")}"${p3}`
        );

      // Balance JSON structure
      jsonStr = this.balanceJsonStructure(jsonStr);

      const parsedSpec = JSON.parse(jsonStr);
      return this.normalizeSpec(parsedSpec);
    } catch (error) {
      console.error("Enhanced parsing failed. Salvaging partial data...");
      return this.salvageEssentialFields(response);
    }
  }

  // In response-handler.ts
  private static normalizeSpec(rawSpec: any) {
    // Enforce monorepo structure when type=monorepo
    if (rawSpec.type === "monorepo") {
      rawSpec.files = {
        ...rawSpec.files,
        "turbo.json": rawSpec.files?.["turbo.json"] || {
          pipeline: {
            build: { dependsOn: ["^build"] },
            dev: { cache: false },
          },
        },
        ".npmrc": "shamefully-hoist=true",
      };

      // Add mandatory monorepo directories
      if (!rawSpec.files?.["apps/web/package.json"]) {
        rawSpec.files["apps/web/package.json"] = {
          name: "web",
          dependencies: {
            next: "^14.1.0",
            react: "^18.2.0",
            "react-dom": "^18.2.0",
          },
        };
      }
    }
    return rawSpec;
  }

  private static balanceJsonStructure(jsonStr: string): string {
    // Balance braces
    const braceDiff =
      (jsonStr.match(/{/g) || []).length - (jsonStr.match(/}/g) || []).length;
    if (braceDiff > 0) jsonStr += "}".repeat(braceDiff);

    // Balance brackets
    const bracketDiff =
      (jsonStr.match(/\[/g) || []).length - (jsonStr.match(/\]/g) || []).length;
    if (bracketDiff > 0) jsonStr += "]".repeat(bracketDiff);

    return jsonStr;
  }

  private static salvageEssentialFields(rawResponse: string): any {
    const fallbackSpec = {
      name: "default-project",
      type: "frontend",
      framework: "nextjs",
      packageManager: "npm",
      dependencies: {},
      devDependencies: {},
      files: {},
    };

    try {
      // Extract critical fields with regex
      return {
        name: this.extractField(rawResponse, "name") || fallbackSpec.name,
        type: this.extractField(rawResponse, "type") || fallbackSpec.type,
        framework:
          this.extractField(rawResponse, "framework") || fallbackSpec.framework,
        packageManager:
          this.extractField(rawResponse, "packageManager") ||
          fallbackSpec.packageManager,
        dependencies: this.extractObject(rawResponse, "dependencies"),
        devDependencies: this.extractObject(rawResponse, "devDependencies"),
        files: this.extractFiles(rawResponse),
      };
    } catch (error) {
      return fallbackSpec;
    }
  }

  private static extractField(response: string, field: string): string | null {
    const regex = new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`);
    const match = response.match(regex);
    return match?.[1] || null;
  }

  private static extractObject(response: string, field: string): object {
    const regex = new RegExp(`"${field}"\\s*:\\s*({[^}]+})`);
    const match = response.match(regex);
    try {
      return match ? JSON.parse(match[1]) : {};
    } catch {
      return {};
    }
  }

  private static extractFiles(response: string): Record<string, string> {
    const filesRegex = /"files"\s*:\s*({[\s\S]+?})(?=\s*(?:,|}|$))/;
    const match = response.match(filesRegex);

    if (!match) return {};

    try {
      return JSON.parse(
        match[1]
          .replace(/"([^"]+)":\s*"([^"]*)"/g, '"$1": "$2"')
          .replace(/\n/g, "\\n")
      );
    } catch {
      return {};
    }
  }
}
