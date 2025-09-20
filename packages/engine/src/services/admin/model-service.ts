import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { logger } from "@paperjet/shared";
import { AISDKError, generateObject, type LanguageModel } from "ai";
import z from "zod";
import type { ConnectionValidationResult, ModelConfigParams } from "../../types";

export const validateConnection = async (modelConfig: ModelConfigParams): Promise<ConnectionValidationResult> => {
  const modelInstance = await getModelInstance(modelConfig);

  try {
    const result = await generateObject({
      model: modelInstance,
      schema: z.object({
        answer: z.string(),
      }),
      prompt: `Respond with pong.`,
    });
    logger.info(result.object.answer, "Validation result:");

    if (result.object.answer.length > 0) {
      return {
        isValid: true,
        error: null,
      };
    } else {
      return {
        isValid: false,
        error: "The response did not match the expected output",
      };
    }
  } catch (error) {
    logger.error(error, "Invalid model configuration");
    if (error instanceof AISDKError) {
      return {
        isValid: false,
        error: error.message,
      };
    } else if (error instanceof Error) {
      return {
        isValid: false,
        error: error.message,
      };
    } else {
      return {
        isValid: false,
        error: "Unknown validation error",
      };
    }
  }
};

export async function getModelInstance(modelConfig: ModelConfigParams): Promise<LanguageModel> {
  switch (modelConfig.provider) {
    case "google": {
      const google = createGoogleGenerativeAI({
        apiKey: modelConfig.providerApiKey,
      });
      return google(modelConfig.modelName);
    }
    case "openai": {
      const openai = createOpenAI({
        apiKey: modelConfig.providerApiKey,
      });
      return openai(modelConfig.modelName);
    }
    case "custom": {
      return createOpenAICompatible({
        baseURL: modelConfig.baseUrl || "",
        apiKey: modelConfig.providerApiKey,
        name: modelConfig.modelName,
      }).chatModel(modelConfig.modelName);
    }
  }
}
