import axios from "axios";

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
  }) {
    const response = await this.client.post("/chat/completions", {
      model: "deepseek-r1:1.5b",
      ...config,
    });
    return response.data.choices[0].message.content;
  }
}
