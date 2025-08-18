import { useQuery } from "@tanstack/react-query";
import { getAllExecutions } from "@/lib/api/executions";

export function useExecutions() {
  const {
    data: executions = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["executions"],
    queryFn: getAllExecutions,
  });

  return {
    executions,
    isLoading,
    refetch,
  };
}
