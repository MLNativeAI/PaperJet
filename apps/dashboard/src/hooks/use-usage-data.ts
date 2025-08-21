import { useQuery } from "@tanstack/react-query";
import { getUsageData } from "@/lib/api/admin";

export function useUsageData() {
  const {
    data: usageData = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["usage-data"],
    queryFn: getUsageData,
  });

  return {
    usageData,
    isLoading,
    refetch,
  };
}
