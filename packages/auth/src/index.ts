import { db } from "@paperjet/db";
import * as schema from "@paperjet/db/schema";
import { organization as dbOrganization, user } from "@paperjet/db/schema";
import { isSetupRequired } from "@paperjet/engine";
import { envVars, generateId, ID_PREFIXES, logger } from "@paperjet/shared";
import { betterAuth, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, apiKey, magicLink, organization } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import type { Context, Next } from "hono";
import { sendInvitationEmail, sendMagicLink } from "./email";
import { getDefaultOrgOrCreate } from "./org";
import type { SessionWithOrg } from "./types";

const publicRoutes = ["/api/health", "/api/auth/**"];

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
      lastActiveOrgId: {
        type: "string",
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const isAdminSetupRequired = await isSetupRequired();
          if (isAdminSetupRequired) {
            return {
              data: {
                ...user,
                id: generateId(ID_PREFIXES.user),
                role: "admin",
                emailVerified: true,
              },
            };
          } else {
            return {
              data: {
                ...user,
                id: generateId(ID_PREFIXES.user),
              },
            };
          }
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const orgId = await getDefaultOrgOrCreate(session.userId);
          if (!orgId) {
            throw new Error("org not found");
          }
          const org = await db.query.organization.findFirst({
            where: eq(dbOrganization.id, orgId),
          });
          if (!org) {
            throw new Error("org not found");
          }
          await db
            .update(user)
            .set({
              lastActiveOrgId: orgId,
            })
            .where(eq(user.id, session.userId));

          return {
            data: {
              ...session,
              activeOrganizationId: org.id,
              id: generateId(ID_PREFIXES.session),
            },
          };
        },
      },
    },
    account: {
      create: {
        before: async (account) => {
          return {
            data: {
              ...account,
              id: generateId(ID_PREFIXES.account),
            },
          };
        },
      },
    },
    verification: {
      create: {
        before: async (verification) => {
          return {
            data: {
              ...verification,
              id: generateId(ID_PREFIXES.verification),
            },
          };
        },
      },
    },
  },
  plugins: [
    admin(),
    apiKey({
      rateLimit: {
        enabled: false,
      },
    }),
    organization({
      sendInvitationEmail: sendInvitationEmail,
      cancelPendingInvitationsOnReInvite: true,
    }),
    magicLink({
      sendMagicLink: sendMagicLink,
    }),
  ],
  socialProviders: {
    google: {
      prompt: "select_account",
      enabled: envVars.GOOGLE_CLIENT_ID !== undefined && envVars.GOOGLE_CLIENT_SECRET !== undefined,
      clientId: envVars.GOOGLE_CLIENT_ID || "",
      clientSecret: envVars.GOOGLE_CLIENT_SECRET || "",
      redirectUri: envVars.BASE_URL,
    },
    microsoft: {
      enabled: envVars.MICROSOFT_CLIENT_ID !== undefined && envVars.MICROSOFT_CLIENT_SECRET !== undefined,
      clientId: envVars.MICROSOFT_CLIENT_ID || "",
      clientSecret: envVars.MICROSOFT_CLIENT_SECRET || "",
      redirectURI: envVars.BASE_URL,
    },
  },
  trustedOrigins: [envVars.BASE_URL],
});

// Helper function to check if a path matches a pattern with wildcards
const matchesPattern = (path: string, pattern: string): boolean => {
  if (pattern.endsWith("/**")) {
    const prefix = pattern.slice(0, -2); // Remove /** from the end
    return path.startsWith(prefix);
  }
  return path === pattern;
};

// Authentication middleware
export const requireAuth = async (c: Context, next: Next) => {
  if (publicRoutes.some((pattern) => matchesPattern(c.req.path, pattern))) {
    return next();
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    logger.info("missing auth");
    return c.json({ message: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
};

export const authHandler = async (c: Context) => {
  return auth.handler(c.req.raw);
};

export const getUserIfLoggedIn = async (c: Context): Promise<string | undefined> => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return undefined;
  }
  return session.user.id;
};

export const getUserSession = async (
  c: Context,
): Promise<{
  user: User;
  session: SessionWithOrg;
}> => {
  const sessionData = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!sessionData) {
    throw new Error("Unauthorized");
  }
  if (!sessionData.session.activeOrganizationId) {
    throw new Error("Active organization is missing");
  }
  return {
    user: sessionData.user,
    session: {
      ...sessionData.session,
      activeOrganizationId: sessionData.session.activeOrganizationId,
    },
  };
};
