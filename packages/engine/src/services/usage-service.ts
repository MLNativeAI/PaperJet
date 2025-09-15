import { UsageData, UsageStats } from "@engine/types.ts";
import { subDays } from "date-fns";

export const getUsageStats = (usageData: UsageData[]): UsageStats => {
  const timePeriod = subDays(new Date(), 30);
  const filteredUsageData = usageData.filter((ud) => new Date(ud.createdAt) >= timePeriod);

  return {
    cost: filteredUsageData.reduce((acc, curr) => acc + curr.totalCost, 0),
    requests: filteredUsageData.length,
    executions: [...new Set(filteredUsageData.map((ud) => ud.executionId).filter((ud) => ud !== null))].length,
    users: [...new Set(filteredUsageData.map((ud) => ud.userId).filter((ud) => ud !== null))].length,
    timePeriod: "30days",
  };
};
