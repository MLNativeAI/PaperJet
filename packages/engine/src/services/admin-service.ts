import { db } from "@paperjet/db";
import { configuration, user } from "@paperjet/db/schema";
import { logger } from "@paperjet/shared";
import { AISDKError } from "ai";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { generateObject } from "../lib/ai-sdk-wrapper";
import type { Configuration, ConfigurationUpdate, ConnectionValidationResult, ValidModelConfig } from "../types";

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

export const getConfiguration = async (): Promise<Configuration> => {
  const configEntries = await db.select().from(configuration).limit(1);
  if (configEntries[0]) {
    const config = configEntries[0];
    return {
      ...config,
      geminiApiKey: config.geminiApiKey || undefined,
      customModelToken: config.customModelToken || undefined,
      customModelName: config.customModelName || undefined,
      customModelUrl: config.customModelUrl || undefined,
      structuredOutputMode: config.structuredOutputMode || "json",
    };
  }
  throw new Error("Configuration not found");
};

export const updateConfiguration = async (configUpdate: ConfigurationUpdate) => {
  await db.update(configuration).set({
    customModelName: configUpdate.customModelName,
    customModelToken: configUpdate.customModelToken,
    customModelUrl: configUpdate.customModelUrl,
    modelType: configUpdate.modelType,
    geminiApiKey: configUpdate.geminiApiKey,
    structuredOutputMode: configUpdate.structuredOutputMode,
  });
};
