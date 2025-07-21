import type { ConfigurationUpdate } from "@paperjet/engine/types";
import { useMutation } from "@tanstack/react-query";
import { validateConnection } from "@/lib/api";

export function useValidateConnection() {
  return useMutation({
    mutationFn: async (configUpdate: ConfigurationUpdate) => {
      return validateConnection(configUpdate);
    },
  });
}
