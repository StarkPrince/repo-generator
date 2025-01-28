import axios from "axios";

// Configure the client to connect to your local Ollama instance
const client = axios.create({
  baseURL: "http://localhost:11434/v1",
  headers: {
    Authorization: "Bearer ollama",
    "Content-Type": "application/json",
  },
});

export async function getChatCompletion(prompt: string) {
  try {
    const response = await client.post("/chat/completions", {
      model: "deepseek-r1:1.5b",
      messages: [
        {
          role: "system",
          content: `You are an expert project generator. Analyze the user's request and output a valid JSON object with the following structure (include all required fields and ensure the output strictly matches this schema): {  "name": "<project-name>",  "type": "<frontend|backend|fullstack>",  "framework": "<React|Express|TypeScript|Vue>",  "packageManager": "<npm|yarn|pnpm>",  "dependencies": ["dep1", "dep2", "dep3"],  "devDependencies": ["devDep1", "devDep2"],  "files": {    "<file-path1>": "<file-content1>",    "<file-path2>": "<file-content2>",    "<package.json>": {      "scripts": {        "build": "build-command",        "test": "test-command"      },      "dependencies": {        "prod-dep1": "^x.y.z"      },      "devDependencies": {        "dev-dep1": "^x.y.z"      }    }  },  "scripts": {    "start": "start-command",    "build": "build-command"  },  "postInstall": ["npm install", "init-script"]}`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const data = response.data.choices[0].message.content;
    console.log("Response:", data);
    return data;
  } catch (error: any) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to process the prompt.");
  }
}
