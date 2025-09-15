import { generateObject } from "@engine/lib/ai-sdk-wrapper.ts";
import type { Configuration, ConnectionValidationResult, ValidModelConfig } from "@engine/types.ts";
import { getConfiguration } from "@paperjet/db";
import { logger } from "@paperjet/shared";
import { AISDKError } from "ai";
import { z } from "zod";

export const validateConnection = async (configuration: Configuration): Promise<ConnectionValidationResult> => {
  try {
    const validModelConfig = validateModelConfiguration(configuration);

    logger.info(validModelConfig, "Validating connection");

    const prompt = `Respond with pong.`;
    const result = await generateObject("validateConnection", {
      schema: z.object({
        answer: z.string(),
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      modelConfig: validModelConfig,
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

export const getValidModelConfig = async () => {
  const configuration = await getConfiguration();
  return validateModelConfiguration(configuration);
};

export const validateModelConfiguration = (config: Configuration): ValidModelConfig => {
  if (config.modelType === "cloud" && config.geminiApiKey) {
    return {
      type: config.modelType,
      geminiApiKey: config.geminiApiKey,
    };
  }
  if (config.modelType === "custom" && config.customModelUrl && config.customModelName) {
    return {
      type: config.modelType,
      customModelName: config.customModelName,
      customModelToken: config.customModelToken,
      customModelUrl: config.customModelUrl,
      structuredOutputMode: config.structuredOutputMode || "tool",
    };
  }
  throw new Error("Model configuration is invalid. Please check if all required fields are set.");
};
