import { db } from "@paperjet/db";
import * as schema from "@paperjet/db/schema";
import { organization as dbOrganization, user } from "@paperjet/db/schema";
import { logger } from "@paperjet/shared";
import { generateOrgSlug } from "@paperjet/shared/id";
import { eq } from "drizzle-orm";
import { COMMON_EMAIL_PROVIDERS } from "./const";

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
