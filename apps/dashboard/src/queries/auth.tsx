import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const authQueries = {
  all: ["auth"],
  session: () =>
    queryOptions({
      queryKey: [...authQueries.all, "session"],
      queryFn: async () => {
        console.log("Fetching session from server");
        const { data } = await authClient.getSession();
        console.log("Session data:", data);
        return { session: data?.session, user: data?.user };
      },
      staleTime: 5000,
    }),
};
