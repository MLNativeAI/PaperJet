import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRuntimeConfig() {
  const queryClient = useQueryClient();

  const {
    data: runtimeConfig = { fastModel: null, accurateModel: null },
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["runtime-config"],
    queryFn: async () => {
      const response = await fetch("/api/admin/runtime-config");

      if (!response.ok) {
        console.log("Failed to fetch runtime config");
        throw new Error("Failed to fetch runtime config");
      }

      return response.json();
    },
  });

  const setRuntimeModelMutation = useMutation({
    mutationFn: async ({ type, modelId }: { type: "fast" | "accurate"; modelId: string }) => {
      const response = await fetch("/api/admin/runtime-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, modelId }),
      });

      if (!response.ok) {
        throw new Error("Failed to set runtime model");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runtime-config"] });
    },
  });

  return {
    runtimeConfig,
    isLoading,
    refetch,
    setRuntimeModel: setRuntimeModelMutation.mutate,
    isSettingModel: setRuntimeModelMutation.isPending,
  };
}
