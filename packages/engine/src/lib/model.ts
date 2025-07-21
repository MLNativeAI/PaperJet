import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModelV1 } from "ai";
import { getValidModelConfig } from "../services/admin-service";

export const getModelInstance = async (): Promise<LanguageModelV1> => {
  const modelConfig = await getValidModelConfig();
  if (modelConfig.type === "cloud") {
    const google = createGoogleGenerativeAI({
      apiKey: modelConfig.geminiApiKey,
    });
    return google("gemini-2.5-flash", {
      structuredOutputs: true,
    });
  } else {
    return createOpenAICompatible({
      baseURL: modelConfig.customModelUrl,
      apiKey: modelConfig.customModelToken,
      name: modelConfig.customModelName,
    }).chatModel(modelConfig.customModelName, {});
  }
};
