import { auth } from "@paperjet/auth/index";
import { db } from "@paperjet/db";
import * as schema from "@paperjet/db/schema";
import { organization as dbOrganization, user } from "@paperjet/db/schema";
import { envVars, logger } from "@paperjet/shared";
import { eq } from "drizzle-orm";
import type { Context } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";
import { COMMON_EMAIL_PROVIDERS } from "./const";
import type { UserInvitation } from "./types";

export const getDefaultOrgOrCreate = async (userId: string) => {
  try {
    const userData = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });
    if (userData?.lastActiveOrgId) {
      return userData.lastActiveOrgId;
    } else {
      const usersOrgs = await db.query.member.findMany({
        where: eq(schema.member.userId, userId),
      });
      if (usersOrgs.length > 0) {
        return usersOrgs[0]?.organizationId;
      } else {
        const { slug, id } = generateOrgSlug();
        const orgName = userData?.email ? await detectOrgNameFromEmail(userData?.email) : "Default";
        await db.insert(dbOrganization).values({
          id: id,
          slug: slug,
          name: orgName,
          createdAt: new Date(),
        });
        await db.insert(schema.member).values({
          id: crypto.randomUUID(),
          createdAt: new Date(),
          organizationId: id,
          userId: userId,
          role: "owner",
        });
        logger.info("Org and member created");
        return id;
      }
    }
  } catch (error) {
    logger.error(error, "Create org failed:");
  }
};

export const detectOrgNameFromEmail = async (email: string): Promise<string> => {
  let orgName = email.split("@")[0];

  try {
    const domainCandidate = email.split("@")[1]; // xyz.com
    const domainWithoutSuffix = domainCandidate?.split(".")[0]; // @xyz.com -> xyz
    if (domainWithoutSuffix && domainCandidate) {
      if (COMMON_EMAIL_PROVIDERS.includes(domainCandidate)) {
        return orgName || "Default";
      }
      orgName = domainWithoutSuffix.charAt(0).toUpperCase() + domainWithoutSuffix.slice(1); // xyz -> Xyz
    }
  } catch (e) {
    logger.error(e, `Could not establish user domain: ${email}`);
  }
  return orgName || "Default";
};

export async function handleOrganizationInvite(c: Context<BlankEnv, "/accept-invitation", BlankInput>) {
  logger.debug(`Handling invitation ${c.req.query("id")}`);
  const invitationId = c.req.query("id");
  if (!invitationId) {
    return c.redirect(`${envVars.BASE_URL}/auth/sign-in`);
  }
  try {
    const invitationResponse = await db.query.invitation.findFirst({
      where: eq(schema.invitation.id, invitationId),
    });
    if (!invitationResponse) {
      return c.redirect(`${envVars.BASE_URL}/auth/sign-up?notFound=true`);
    }
    const email = invitationResponse?.email;
    const userData = await db.query.user.findFirst({
      where: eq(user.email, email),
    });
    if (!userData) {
      logger.debug(`User not found, redirecting to sign up`);
      return c.redirect(`${envVars.BASE_URL}/auth/sign-up?invite=true`);
    } else {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session) {
        logger.debug("User exists but not signed in, redirecting to sign-in");
        return c.redirect(`${envVars.BASE_URL}/auth/sign-in?invite=true`);
      } else {
        logger.debug("User exists and signed in, redirect to org settings page");
        return c.redirect(`${envVars.BASE_URL}/settings/organization`);
      }
    }
  } catch (error) {
    logger.error(error, "Unknown invitation error, redirecting to sign-up");
    return c.redirect(`${envVars.BASE_URL}/auth/sign-up`);
  }
}

export async function listUserInvitations(c: Context<BlankEnv, "/invitations", BlankInput>) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.redirect("/auth/sign-in");
  }

  const invitations = await auth.api.listUserInvitations({
    query: {
      email: session.user.email,
    },
  });

  const pendingInvitations = invitations.filter((inv) => inv.status === "pending");

  const organizationIds = pendingInvitations.map((invitation) => invitation.organizationId);
  const organizations = await db.query.organization.findMany({
    where: (organization, { inArray }) => inArray(organization.id, organizationIds),
  });

  const organizationMap = new Map(organizations.map((org) => [org.id, org]));

  const invitationsWithOrgNames: UserInvitation = pendingInvitations.map((invitation) => ({
    ...invitation,
    organizationName: organizationMap.get(invitation.organizationId)?.name || "Unknown",
    expiresAt: invitation.expiresAt.toISOString(),
  }));

  return c.json(invitationsWithOrgNames);
}
