export class ResponseHandler {
  static async parseResponse(response: string): Promise<any> {
    try {
      // Enhanced JSON extraction with error positions
      const jsonMatch = response.match(/(\{[\s\S]*\})/);
      if (!jsonMatch) throw new Error("NO_JSON_FOUND");

      let jsonStr = jsonMatch[1]
        // Fix common LLM formatting errors
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Unquoted keys
        .replace(/'/g, '"') // Single quotes to double
        .replace(/(\w+)\s*:/g, '"$1":') // Ensure key quoting
        .replace(/,\s*}/g, "}") // Trailing commas in objects
        .replace(/,\s*]/g, "]") // Trailing commas in arrays
        .replace(/(\})\s*(\")/g, "$1,$2") // Missing commas
        .replace(/(\n\s*)(\")/g, "$1  $2"); // Improve indentation

      // Balance braces automatically
      const openBraces = (jsonStr.match(/{/g) || []).length;
      const closeBraces = (jsonStr.match(/}/g) || []).length;
      if (openBraces > closeBraces) {
        jsonStr += "}".repeat(openBraces - closeBraces);
      }

      // Parse with detailed error reporting
      try {
        return JSON.parse(jsonStr);
      } catch (parseError: any) {
        console.error(`JSON Parse Error at position ${parseError.position}:`);
        console.error(
          jsonStr.slice(
            Math.max(0, parseError.position - 50),
            parseError.position + 50
          )
        );
        throw parseError;
      }
    } catch (error: any) {
      console.error("Enhanced JSON parsing failed:", error.message);
      throw new Error(`Failed to parse LLM response: ${error.message}`);
    }
  }

  private static normalizeSpec(rawSpec: any) {
    // Add framework detection based on dependencies
    const detectFramework = () => {
      if (rawSpec.dependencies?.react) return "react";
      if (rawSpec.dependencies?.vue) return "vue";
      return "react"; // default
    };

    return {
      name:
        rawSpec.name?.replace(/\s+/g, "-").toLowerCase() ||
        "ecommerce-platform",
      type: rawSpec.type || "fullstack",
      framework: rawSpec.framework || detectFramework(),
      packageManager: rawSpec.packageManager || "npm",
      files: this.normalizeFiles(rawSpec.files),
      dependencies: rawSpec.dependencies || {},
      devDependencies: rawSpec.devDependencies || {},
      scripts: this.normalizeScripts(rawSpec.scripts),
      postInstall: rawSpec.postInstall || [],
    };
  }

  private static normalizeFiles(files: any) {
    const normalized: Record<string, any> = {};
    for (const [path, content] of Object.entries(files || {})) {
      const cleanPath = path
        .replace(/\\/g, "/") // POSIX paths
        .replace(/^\/+/, ""); // Remove leading slashes
      normalized[cleanPath] = content;
    }
    return normalized;
  }

  private static normalizeScripts(scripts: any) {
    const defaults = {
      start: "react-scripts start",
      build: "react-scripts build",
      test: "react-scripts test",
    };
    return { ...defaults, ...(scripts || {}) };
  }
}
