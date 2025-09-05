import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";

export function useOrganization() {
  const queryClient = useQueryClient();
  const setActiveOrganization = async (organizationId: string) => {
    const { data, error } = await authClient.organization.setActive({
      organizationId: organizationId,
    });
    queryClient.invalidateQueries();
  };
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();
  return {
    activeOrganization,
    organizations,
    setActiveOrganization,
  };
}
