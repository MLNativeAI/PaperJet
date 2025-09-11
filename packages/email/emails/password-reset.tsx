import { Link, Text } from "@react-email/components";
import { ActionButton, EmailHeading, EmailLayout, FooterSection, LogoSection } from "./shared-components";

export interface ResetPasswordEmailTemplateProps {
  resetUrl: string;
  username: string;
}

export const ResetPasswordEmailTemplate = ({ username, resetUrl }: ResetPasswordEmailTemplateProps) => {
  const previewText = "Reset your password on PaperJet";

  return (
    <EmailLayout previewText={previewText}>
      <LogoSection />
      <EmailHeading>
        Reset your password on <strong>PaperJet</strong>
      </EmailHeading>
      <Text className="text-black text-[14px] leading-[24px]">Hello {username},</Text>
      <Text className="text-black text-[14px] leading-[24px]">
        We received a request to reset your password. Click the button below to create a new password:
      </Text>
      <ActionButton href={resetUrl}>Reset Password</ActionButton>
      <Text className="text-black text-[14px] leading-[24px]">
        or copy and paste this URL into your browser:{" "}
        <Link href={resetUrl} className="text-blue-600 no-underline">
          {resetUrl}
        </Link>
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        This password reset link will expire in 1 hour for security reasons.
      </Text>
      <FooterSection>
        <Text className="text-[#666666] text-[12px] leading-[24px]">
          This password reset request was intended for <span className="text-black">{username}</span>. If you did not
          request this password reset, you can ignore this email. If you are concerned about your account's safety,
          please reach out to{" "}
          <Link href="mailto:support@getpaperjet.com" className="text-blue-600 no-underline">
            support@getpaperjet.com
          </Link>
        </Text>
      </FooterSection>
    </EmailLayout>
  );
};

export default ResetPasswordEmailTemplate;
