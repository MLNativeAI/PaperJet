// import { google } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const aiSdkModel = () => {
  // const apiKey = Bun.env.GOOGLE_GENERATIVE_AI_API_KEY;
  // if (!apiKey) {
  //   throw new Error("Google API key not configured");
  // }
  return createOpenAICompatible({
    baseURL: "http://localhost:11434/v1",
    apiKey: "ollama",
    name: "granite",
  }).chatModel("hf.co/unsloth/Mistral-Small-3.2-24B-Instruct-2506-GGUF:UD-Q4_K_XL");
  // return google("gemini-2.5-flash");
};
