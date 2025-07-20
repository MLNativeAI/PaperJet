import { db } from "@paperjet/db";
import { configuration, user } from "@paperjet/db/schema";
import { eq } from "drizzle-orm";
import type { Configuration } from "../types";

export const isSetupRequired = async () => {
  const adminUsers = await db.select().from(user).where(eq(user.role, "admin"));
  if (adminUsers.length === 0) {
    return true;
  } else {
    return false;
  }
};

export const getConfiguration = async (): Promise<Configuration> => {
  const configEntries = await db.select().from(configuration).limit(1);
  if (configEntries[0]) {
    const config = configEntries[0];
    if (config.modelType === "cloud" && config.geminiApiKey) {
      return {
        isValid: true,
        modelType: config.modelType,
        customModelName: config.customModelName || undefined,
        customModelToken: config.customModelToken || undefined,
        customModelUrl: config.customModelUrl || undefined,
        geminiApiKey: config.geminiApiKey || undefined,
      };
    }
    if (config.modelType === "custom" && config.customModelUrl && config.customModelName) {
      return {
        isValid: true,
        modelType: config.modelType,
        customModelName: config.customModelName || undefined,
        customModelToken: config.customModelToken || undefined,
        customModelUrl: config.customModelUrl || undefined,
        geminiApiKey: config.geminiApiKey || undefined,
      };
    }
  }
  return {
    isValid: false,
    modelType: "cloud",
  };
};
