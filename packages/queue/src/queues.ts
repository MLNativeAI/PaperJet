import { redisConnection } from "./redis";

export const baseQueueOptions = {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: {
      type: "exponential" as const,
      delay: 2000,
    },
  },
};
