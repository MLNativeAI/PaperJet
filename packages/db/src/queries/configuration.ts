import { db } from "../db";
import { modelConfiguration } from "../schema";
import type { DbModelConfiguration } from "../types/tables";

export type RuntimeModelType = "fast" | "accurate";

export type RuntimeConfiguration = {
  fastModel: any;
  accurateModel: any;
};

export const listModels = async (): Promise<DbModelConfiguration[]> => {
  return await db.query.modelConfiguration.findMany();
};

export const addNewModel = async () => {};

//TODO: we will restore this soon
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
