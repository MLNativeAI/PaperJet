import { render, MagicLinkEmail, InvitationEmail } from "@paperjet/email";
import { envVars, logger } from "@paperjet/shared";
import type { User } from "better-auth";
import type { Organization, Invitation, Member } from "better-auth/plugins";

import { Resend } from "resend";
const resend = envVars.RESEND_API_KEY ? new Resend(envVars.RESEND_API_KEY) : null;

export async function sendMagicLink({ email, token, url }: { email: string; token: string; url: string }) {
  if (!resend) {
    logger.info(`Magic link for ${email}: ${url}`);
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
  invitation: Invitation;
  inviter: Member & {
    user: User;
  };
}): Promise<void> {
  if (!resend) {
    logger.info(`Magic link for ${email}: ${url}`);
    return;
  }
  try {
    const url = `${envVars.BASE_URL}/accept-invitation/${id}`;
    logger.info({ email, url }, `Sending invitation link to ${email}: ${url}`);
    const emailHtml = await render(InvitationEmail({ url }));

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
  // const inviteLink = `https://example.com/accept-invitation/${data.id}`;
  // sendOrganizationInvitation({
  //   email: data.email,
  //   invitedByUsername: data.inviter.user.name,
  //   invitedByEmail: data.inviter.user.email,
  //   teamName: data.organization.name,
  //   inviteLink,
  // });
}
