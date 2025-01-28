// src/core/ai/spec-generator.ts
import { LLMClient } from "./llm-client";
import { ResponseHandler } from "./response-handler";

// src/core/ai/spec-generator.ts
export class SpecGenerator {
  private readonly SYSTEM_PROMPT = `You MUST generate COMPLETE project specs with:
  1. Required package.json fields (name, scripts, dependencies)
  2. Full file structure for the specified framework
  3. OS-agnostic POSIX paths (use forward slashes)
  4. All object keys in double quotes
  5. Proper commas between entries
  6. Complete JSON structure
  7. Actual file content (not descriptions)
  
  Example Response:
  {
    "name": "ecommerce-platform",
    "type": "fullstack",
    "framework": "react",
    "packageManager": "npm",
    "files": {
      "src/main.tsx": "import React from 'react';\n...",
      "package.json": {
        "name": "ecommerce-platform",
        "scripts": {
          "start": "react-scripts start",
          "build": "react-scripts build"
        },
        "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0"
        }
      }
    },
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build"
    },
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    },
    "devDependencies": {
      "typescript": "^5.0.0"
    }
  }


  CRITICAL RULES:
  1. For files object:
    - Keys must be relative paths with forward slashes
    - Values must be strings or valid JSON objects

  2. For package.json:
    - Must include name, scripts, dependencies, devDependencies
    - Scripts should contain at least "start", "build", "test"

  3. JSON structure must be complete with all closing braces

  BAD EXAMPLE:
  {
    "files": {
      "src/a.js": "content"  // ← Missing comma
      "src/b.js": "content"
    }
  }

  GOOD EXAMPLE:
  {
    "files": {
      "src/a.js": "content",
      "src/b.js": "content"
    },
    "dependencies": {
      "react": "^18.2.0"
    }
  }
  
  Respond ONLY with the JSON object. Include ALL closing braces.`;

  constructor(private llm: LLMClient) {}

  async generateSpec(prompt: string): Promise<any> {
    try {
      const response = await this.llm.chatCompletion({
        messages: [
          { role: "system", content: this.SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        jsonMode: true,
      });

      console.log("Response:", response);

      return ResponseHandler.parseResponse(response);
    } catch (error) {
      console.error("Error in generateSpec:", error);
      throw error;
    }
  }
}
