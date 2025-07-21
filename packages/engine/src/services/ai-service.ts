import { logger } from "@paperjet/shared";
import { AISDKError } from "ai";
import { z } from "zod";
import { generateObject } from "../lib/ai-sdk-wrapper";
import type { Configuration, ConnectionValidationResult } from "../types";
import { validateModelConfiguration } from "./admin-service";

export const convertDocumentToMarkdown = () => {};

export const validateConnection = async (configuration: Configuration): Promise<ConnectionValidationResult> => {
  try {
    const validConnection = validateModelConfiguration(configuration);

    logger.info(validConnection, "Validating connection");

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
