import { db } from "@db/db";
import { configuration } from "@db/schema";
import type { DbConfiguration } from "@db/types/tables";

export const getConfiguration = async (): Promise<DbConfiguration> => {
  const configEntries = await db.select().from(configuration).limit(1);
  if (configEntries[0]) {
    const config = configEntries[0];
    return {
      ...config,
      geminiApiKey: config.geminiApiKey,
      customModelToken: config.customModelToken,
      customModelName: config.customModelName,
      customModelUrl: config.customModelUrl,
      structuredOutputMode: config.structuredOutputMode || "json",
    };
  }
  throw new Error("Configuration not found");
};

// TODO we will restore this soon
// export const updateConfiguration = async (configUpdate: ConfigurationUpdate) => {
//   await db.update(configuration).set({
//     customModelName: configUpdate.customModelName,
//     customModelToken: configUpdate.customModelToken,
//     customModelUrl: configUpdate.customModelUrl,
//     modelType: configUpdate.modelType,
//     geminiApiKey: configUpdate.geminiApiKey,
//     structuredOutputMode: configUpdate.structuredOutputMode,
//   });
// };
