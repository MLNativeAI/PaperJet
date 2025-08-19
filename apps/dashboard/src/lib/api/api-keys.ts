import { ApiKey } from "@/components/api-keys-list";
import type { ApiRoutes } from "@api/index";
import { hc, type InferResponseType } from "hono/client";

const client = hc<ApiRoutes>("/");

export async function getApiKeys(): Promise<ApiKey[]> {
  const response = await client.api["api-keys"].$get();

  if (!response.ok) {
    throw new Error("Failed to fetch API keys");
  }

  const data = await response.json();
  return data as ApiKey[];
}

export async function createApiKey(name: string): Promise<{ key: string; id: string }> {
  const response = await client.api["api-keys"].$post({
    json: { name },
  });

  if (!response.ok) {
    throw new Error("Failed to create API key");
  }

  const data = await response.json();
  return { key: data.key, id: data.id };
}

export async function revokeApiKey(keyId: string): Promise<void> {
  const response = await client.api["api-keys"][":keyId"].$delete({
    param: { keyId },
  });

  if (!response.ok) {
    throw new Error("Failed to revoke API key");
  }
}

