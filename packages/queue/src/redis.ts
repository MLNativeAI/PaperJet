import { logger } from "@paperjet/shared";
import IORedis from "ioredis";

// Redis connection configuration
export const redisConnection = new IORedis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  lazyConnect: true,
});

// Connection event handlers
redisConnection.on("connect", () => {
  logger.info("Redis connected");
});

redisConnection.on("error", (error) => {
  logger.error(error, "Redis connection error:");
});

redisConnection.on("close", () => {
  logger.info("Redis connection closed");
});
