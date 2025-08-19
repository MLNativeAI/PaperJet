import { db } from "@paperjet/db";
import * as schema from "@paperjet/db/schema";
import { envVars, logger } from "@paperjet/shared";
import * as bcrypt from "bcryptjs";
import { and, eq, isNull } from "drizzle-orm";
import { generateId, ID_PREFIXES } from "../utils/id";

function generateApiKey(): string {
  const prefix = envVars.ENVIRONMENT === "prod" ? "pk_live" : "pk_test";
  const randomBytes = crypto.getRandomValues(new Uint8Array(24));
  const randomString = Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `${prefix}_${randomString}`;
}

export async function createApiKey(userId: string, name: string): Promise<{ id: string; key: string }> {
  const plainKey = generateApiKey();
  const hashedKey = await bcrypt.hash(plainKey, 10);
  const id = generateId(ID_PREFIXES.apiKey);

  await db.insert(schema.apiKey).values({
    id,
    name,
    key: hashedKey,
    userId,
    createdAt: new Date(),
  });

  logger.info({ userId, keyId: id }, "API key created");

  return { id, key: plainKey };
}

export async function listApiKeys(userId: string) {
  const keys = await db
    .select({
      id: schema.apiKey.id,
      name: schema.apiKey.name,
      createdAt: schema.apiKey.createdAt,
      lastUsedAt: schema.apiKey.lastUsedAt,
      revokedAt: schema.apiKey.revokedAt,
    })
    .from(schema.apiKey)
    .where(eq(schema.apiKey.userId, userId))
    .orderBy(schema.apiKey.createdAt);

  return keys.map((key) => {
    // Generate masked key showing prefix and first 4 chars of the key ID
    const prefix = envVars.ENVIRONMENT === "prod" ? "pk_live" : "pk_test";
    const maskedKey = `${prefix}_${key.id.substring(4, 8)}****`;

    return {
      ...key,
      key: maskedKey,
      status: key.revokedAt ? ("revoked" as const) : ("active" as const),
    };
  });
}

export async function revokeApiKey(userId: string, keyId: string): Promise<void> {
  await db
    .update(schema.apiKey)
    .set({ revokedAt: new Date() })
    .where(and(eq(schema.apiKey.id, keyId), eq(schema.apiKey.userId, userId), isNull(schema.apiKey.revokedAt)));

  logger.info({ userId, keyId }, "API key revoked");
}

export async function validateApiKey(plainKey: string): Promise<{ userId: string; keyId: string } | null> {
  const activeKeys = await db
    .select({
      id: schema.apiKey.id,
      key: schema.apiKey.key,
      userId: schema.apiKey.userId,
    })
    .from(schema.apiKey)
    .where(isNull(schema.apiKey.revokedAt));

  // Check each key (we need to compare hashed values)
  for (const keyRecord of activeKeys) {
    const isValid = await bcrypt.compare(plainKey, keyRecord.key);
    if (isValid) {
      // Update last used timestamp
      await updateLastUsed(keyRecord.id);
      return { userId: keyRecord.userId, keyId: keyRecord.id };
    }
  }

  return null;
}

async function updateLastUsed(keyId: string): Promise<void> {
  await db.update(schema.apiKey).set({ lastUsedAt: new Date() }).where(eq(schema.apiKey.id, keyId));
}
