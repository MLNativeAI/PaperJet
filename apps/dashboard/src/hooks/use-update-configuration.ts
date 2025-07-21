import type { ConfigurationUpdate } from "@paperjet/engine/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateConfiguration } from "@/lib/api";

export function useUpdateConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (configUpdate: ConfigurationUpdate) => {
      return updateConfiguration(configUpdate);
    },
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["config"] });
      toast.success("Configuration updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update configuration");
    },
  });
}
