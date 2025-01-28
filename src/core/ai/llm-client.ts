import axios from "axios";

// src/core/ai/llm-client.ts
export class LLMClient {
  private readonly client = axios.create({
    baseURL: "http://localhost:11434/v1",
    headers: {
      Authorization: "Bearer ollama",
      "Content-Type": "application/json",
    },
  });

  async chatCompletion(config: {
    messages: any[];
    temperature: number;
    jsonMode: boolean;
    stream?: boolean;
    onProgress?: (chunk: string) => void;
  }) {
    const { stream = false, onProgress, ...restConfig } = config;

    if (stream) {
      return await this.streamChatCompletion(config);
    }

    const response = await this.client.post("/chat/completions", {
      model: "deepseek-r1:1.5b",
      max_tokens: 1000,
      ...restConfig,
    });

    return response.data.choices[0].message.content;
  }

  private async streamChatCompletion(config: {
    messages: any[];
    temperature: number;
    jsonMode: boolean;
    onProgress?: (chunk: string) => void;
  }) {
    const response = await this.client.post(
      "/chat/completions",
      {
        model: "deepseek-r1:1.5b",
        max_tokens: 1000,
        stream: true,
        ...config,
      },
      {
        responseType: "stream",
      }
    );

    let fullResponse = "";

    for await (const chunk of response.data) {
      const content = this.parseStreamChunk(chunk);
      if (content) {
        fullResponse += content;
        config.onProgress?.(content);
      }
    }

    return fullResponse;
  }

  private parseStreamChunk(chunk: Buffer): string {
    try {
      const lines = chunk
        .toString()
        .split("\n")
        .filter((line) => line.trim());
      let content = "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6));
          if (data.choices?.[0]?.delta?.content) {
            content += data.choices[0].delta.content;
          }
        }
      }

      return content;
    } catch (error) {
      console.error("Error parsing stream chunk:", error);
      return "";
    }
  }
}
