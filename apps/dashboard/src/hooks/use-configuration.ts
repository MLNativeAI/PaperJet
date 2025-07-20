import { useQuery } from "@tanstack/react-query";
import { getConfiguration } from "@/lib/api";

export function useConfiguration() {
  const {
    data: configuration = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["config"],
    queryFn: getConfiguration,
  });

  return {
    configuration,
    isLoading,
    refetch,
  };
}
