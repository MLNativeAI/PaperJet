import { useQuery } from "@tanstack/react-query";
import type { Session } from "better-auth";
import { createContext, type ReactNode, useContext, useMemo } from "react";
import { authClient } from "@/lib/auth-client";

type UserWithRole = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  banned: boolean | null | undefined;
  role: string;
  banReason?: string | null | undefined;
  banExpires?: Date | null | undefined;
  lastActiveOrgId: string;
};

type AuthContextType = {
  session: Session | undefined;
  user: UserWithRole | undefined;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      return { session: data?.session, user: data?.user };
    },
  });
  const authValue = useMemo(() => ({ session: data?.session, user: data?.user }), [data?.session, data?.user]);
  return <AuthContext.Provider value={authValue}>{isPending ? null : children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
