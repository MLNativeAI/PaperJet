import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { trackUsage } from "@engine/lib/usage.ts";
import { getValidModelConfig } from "@engine/services/admin-service.ts";
import type { ValidModelConfig } from "@engine/types.ts";
import { logger } from "@paperjet/shared";
import type { CoreMessage, GenerateObjectResult, LanguageModelV1, Message } from "ai";
import { generateObject as aiGenerateObject, generateText as aiGenerateText } from "ai";
import type { z } from "zod";

export type GenerateObjectOptions<T extends z.ZodType> = {
  schema: T;
  messages: CoreMessage[] | Omit<Message, "id">[];
  model?: LanguageModelV1;
  prompt?: string;
  modelConfig?: ValidModelConfig;
};

export type GenerateTextOptions = {
  messages: CoreMessage[] | Omit<Message, "id">[];
  model?: LanguageModelV1;
  prompt?: string;
  modelConfig?: ValidModelConfig;
};

export async function generateText(operationName: string, options: GenerateTextOptions): Promise<string> {
  const startTime = Date.now();
  const modelConfig = options.modelConfig || (await getValidModelConfig());
  const model = options.model || (await getModelInstance(modelConfig));

  try {
    const result = await aiGenerateText({
      model,
      messages: options.messages,
      prompt: options.prompt,
    });

    const durationMs = Date.now() - startTime;

    logger.debug(
      {
        operationName,
        modelId: model.modelId,
        durationMs,
        promptTokens: result.usage?.promptTokens,
        completionTokens: result.usage?.completionTokens,
        totalTokens: result.usage?.totalTokens,
      },
      "AI generation completed",
    );

    await trackUsage(operationName, model.modelId, result.usage, durationMs);

    return result.text;
  } catch (error) {
    const durationMs = Date.now() - startTime;

    logger.error(
      {
        operationName,
        modelId: model.modelId,
        durationMs,
        error,
      },
      "AI generation failed",
    );

    throw error;
  }
}

export async function generateObject<T extends z.ZodType>(
  operationName: string,
  options: GenerateObjectOptions<T>,
): Promise<GenerateObjectResult<z.infer<T>>> {
  const startTime = Date.now();
  const modelConfig = options.modelConfig || (await getValidModelConfig());
  const model = options.model || (await getModelInstance(modelConfig));

  try {
    const result = await aiGenerateObject({
      model,
      schema: options.schema,
      messages: options.messages,
      prompt: options.prompt,
      mode: getToolMode(modelConfig),
    });

    const durationMs = Date.now() - startTime;

    logger.debug(
      {
        operationName,
        modelId: model.modelId,
        durationMs,
        promptTokens: result.usage?.promptTokens,
        completionTokens: result.usage?.completionTokens,
        totalTokens: result.usage?.totalTokens,
      },
      "AI generation completed",
    );

    await trackUsage(operationName, model.modelId, result.usage, durationMs);

    return result;
  } catch (error) {
    const durationMs = Date.now() - startTime;

    logger.error(
      {
        operationName,
        modelId: model.modelId,
        durationMs,
        error,
      },
      "AI generation failed",
    );

    throw error;
  }
}

export async function getModelInstance(modelConfig: ValidModelConfig): Promise<LanguageModelV1> {
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
}

function getToolMode(modelConfig: ValidModelConfig): "auto" | "json" | "tool" {
  if (modelConfig.type === "cloud") {
    return "auto";
  } else {
    return modelConfig.structuredOutputMode;
  }
}
