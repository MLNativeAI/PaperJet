import { db } from "@paperjet/db";
import * as schema from "@paperjet/db/schema";
import { MagicLinkEmail, render } from "@paperjet/email";
import { generateId, ID_PREFIXES, isSetupRequired, validateApiKey } from "@paperjet/engine";
import { envVars, logger } from "@paperjet/shared";
import { betterAuth, type User } from "better-auth";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, magicLink } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import type { Context, Next } from "hono";
import { Resend } from "resend";

const publicRoutes = ["/api/health", "/api/auth/**"];

const resend = envVars.RESEND_API_KEY ? new Resend(envVars.RESEND_API_KEY) : null;

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
          return {
            data: {
              ...session,
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
    magicLink({
      sendMagicLink: async ({ email, token, url }, _request) => {
        if (!resend) {
          console.log(`Magic link for ${email}: ${url}`);
          return;
        }

        try {
          logger.info({ email, url }, `Sending magic link to ${email}: ${url}`);
          const emailHtml = await render(MagicLinkEmail({ url, token }));

          await resend.emails.send({
            from: envVars.FROM_EMAIL,
            to: email,
            subject: "Sign in to PaperJet",
            html: emailHtml,
          });
        } catch (error) {
          console.error("Failed to send magic link email:", error);
          throw error;
        }
      },
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

const matchesPattern = (path: string, pattern: string): boolean => {
  if (pattern.endsWith("/**")) {
    const prefix = pattern.slice(0, -2); // Remove /** from the end
    return path.startsWith(prefix);
  }
  return path === pattern;
};

export const authMiddleware = async (c: Context, next: Next) => {
  if (publicRoutes.some((pattern) => matchesPattern(c.req.path, pattern))) {
    return next();
  }

  const authHeader = c.req.header("Authorization");
  if (authHeader?.startsWith("Bearer pk_")) {
    const apiKey = authHeader.slice(7); // Remove "Bearer " prefix
    const authResult = await validateApiKeyAuth(c, apiKey);

    if (authResult) {
      c.set("user", authResult.user);
      c.set("session", authResult.session);
      c.set("apiKeyId", authResult.apiKeyId);
      return next();
    }

    return c.json({ message: "Invalid API key" }, 401);
  }

  const authResult = await validateSessionAuth(c);
  if (!authResult) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  c.set("user", authResult.user);
  c.set("session", authResult.session);
  return next();
};

async function validateApiKeyAuth(c: Context, apiKey: string) {
  const keyValidation = await validateApiKey(apiKey);

  if (!keyValidation) {
    return null;
  }

  const user = await db.query.user.findFirst({
    where: eq(schema.user.id, keyValidation.userId),
  });

  if (!user) {
    return null;
  }

  const apiKeySession = {
    id: keyValidation.keyId,
    userId: user.id,
    expiresAt: null,
    token: `api_key_${keyValidation.keyId}`, // Synthetic token
    createdAt: new Date(),
    updatedAt: new Date(),
    ipAddress: c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || null,
    userAgent: c.req.header("user-agent") || null,
    impersonatedBy: null,
  };

  return { user, session: apiKeySession, apiKeyId: keyValidation.keyId };
}

async function validateSessionAuth(c: Context) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return null;
  }

  return { user: session.user, session: session.session };
}

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

export const getUser = async (c: Context): Promise<User> => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session.user;
};
