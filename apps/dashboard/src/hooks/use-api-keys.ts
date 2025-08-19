import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createApiKey as createApiKeyApi, getApiKeys, revokeApiKey as revokeApiKeyApi } from "@/lib/api/api-keys";

// React Query hooks
export function useApiKeys() {
  const {
    data: apiKeys = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: getApiKeys,
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
    mutationFn: ({ name }: { name: string }) => createApiKeyApi(name),
    onSuccess: () => {
      // Invalidate and refetch API keys
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeApiKeyApi,
    onSuccess: () => {
      // Invalidate and refetch API keys
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
}

