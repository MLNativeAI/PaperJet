import type { ApiKeysRoutes } from "@paperjet/api/routes";
import type { ApiKey } from "@paperjet/engine/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";

const apiKeyClient = hc<ApiKeysRoutes>("/api/v1/api-keys");

async function fetchApiKeys(): Promise<ApiKey[]> {
  const response = await apiKeyClient.index.$get();
  if (!response.ok) {
    console.error("API Key fetch failed");
    return [];
  }
  return response.json();
}

async function createApiKey(data: { name: string }) {
  // // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  //
  // // Generate a mock API key
  // const randomHex = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // const newKey = `pk_live_${randomHex}${randomHex}`;
  //
  // // Add to mock data (in real app, this would be handled by the backend)
  // const newApiKey: ApiKey = {
  //   id: String(mockApiKeys.length + 1),
  //   name: data.name,
  //   key: newKey,
  //   createdAt: new Date(),
  //   lastUsedAt: null,
  //   status: "active",
  // };
  // mockApiKeys.unshift(newApiKey);
  //
  // return { key: newKey, id: newApiKey.id };
  return {};
}

async function revokeApiKey(keyId: string): Promise<void> {
  // // Simulate network delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  //
  // // Update mock data (in real app, this would be handled by the backend)
  // const key = mockApiKeys.find((k) => k.id === keyId);
  // if (key) {
  //   key.status = "revoked";
  // }
}

// React Query hooks
export function useApiKeys() {
  const {
    data: apiKeys = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: fetchApiKeys,
  });

  return {
    apiKeys,
    isLoading,
    refetch,
  };
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApiKey,
    onSuccess: () => {
      // Invalidate and refetch API keys
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => {
      // Invalidate and refetch API keys
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}
