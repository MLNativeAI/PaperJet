import { InvitationEmail, MagicLinkEmail, render } from "@paperjet/email";
import { envVars, logger } from "@paperjet/shared";
import type { User } from "better-auth";
import type { Member, Organization } from "better-auth/plugins";

import { Resend } from "resend";

const resend = envVars.RESEND_API_KEY ? new Resend(envVars.RESEND_API_KEY) : null;

function getApiBaseUrl() {
  if (envVars.ENVIRONMENT === "dev") {
    return "http://localhost:3000";
  } else {
    return envVars.BASE_URL;
  }
}

export async function sendMagicLink({ email, url }: { email: string; url: string }) {
  if (!resend) {
    logger.info(`Magic link for ${email}: ${url}`);
    return;
  }
  try {
    logger.info({ email, url }, `Sending magic link to ${email}: ${url}`);
    const emailHtml = await render(MagicLinkEmail({ url }));

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
}

export async function sendInvitationEmail({
  email,
  role,
  organization,
  id,
  inviter,
}: {
  id: string;
  role: string;
  email: string;
  organization: Organization;
  inviter: Member & {
    user: User;
  };
}): Promise<void> {
  if (!resend) {
    logger.info(`Invitation link for ${email}: ${envVars.BASE_URL}/accept-invitation/${id}`);
    return;
  }
  try {
    const url = `${getApiBaseUrl()}/api/admin/accept-invitation?id=${id}`;
    logger.info({ email, url }, `Sending invitation link to ${email}: ${url}`);
    const emailHtml = await render(
      InvitationEmail({
        url,
        inviter: inviter.user.name || inviter.user.email,
        organizationName: organization.name,
        role,
      }),
    );

    await resend.emails.send({
      from: envVars.FROM_EMAIL,
      to: email,
      subject: `You've been invited to join ${organization.name} on PaperJet`,
      html: emailHtml,
    });
  } catch (error) {
    console.error("Failed to send invitation email:", error);
    throw error;
  }
}
