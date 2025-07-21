import { db } from "@paperjet/db";
import { configuration, user } from "@paperjet/db/schema";
import { eq } from "drizzle-orm";
import type { Configuration, ConfigurationUpdate, ValidModelConfig } from "../types";

export const validateConnection = () => {};

export const getValidModelConfig = async () => {
  const configuration = await getConfiguration();
  return validateModelConfiguration(configuration);
};

export const isSetupRequired = async () => {
  const adminUsers = await db.select().from(user).where(eq(user.role, "admin"));
  if (adminUsers.length === 0) {
    return true;
  } else {
    return false;
  }
};

const validateModelConfiguration = (config: Configuration): ValidModelConfig => {
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
    };
  }
  throw new Error("Model configuration is invalid");
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
  });
};
