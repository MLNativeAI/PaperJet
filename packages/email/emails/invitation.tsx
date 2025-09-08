import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export interface InvitationEmailProps {
  url: string;
  inviter: string;
  organizationName: string;
  role: string;
}

export const InvitationEmail = ({ url, inviter, organizationName, role }: InvitationEmailProps) => {
  const previewText = `You've been invited to join ${organizationName} on PaperJet`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-4">
                  <span className="text-white text-xl font-bold">P</span>
                </div>
              </div>
            </Section>

            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              You're invited to <strong>PaperJet</strong>! 🎉
            </Heading>

            <Text className="text-black text-[14px] leading-[24px]">Hi there,</Text>

            <Text className="text-black text-[14px] leading-[24px]">
              <strong>{inviter}</strong> has invited you to join <strong>{organizationName}</strong> on PaperJet as a{" "}
              <strong>{role}</strong>.
            </Text>

            <Section className="bg-[#f6f9fc] rounded-lg p-[16px] my-[24px]">
              <Text className="text-[#374151] text-[14px] leading-[20px] m-0">
                <strong>What you can do with PaperJet:</strong>
              </Text>
              <Text className="text-[#374151] text-[12px] leading-[18px] mt-[8px] mb-0">
                📄 <strong>Process any document</strong> - PDFs, images, scanned documents
                <br />🤖 <strong>AI-powered extraction</strong> - Extract data automatically
                <br />🔒 <strong>Privacy-first</strong> - Your data stays secure and private
                <br />⚡ <strong>Custom workflows</strong> - Build workflows for your specific needs
              </Text>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
              Click the button below to accept the invitation and get started. This link will expire in 7 days.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-[12px] font-semibold no-underline text-center px-6 py-3"
                href={url}
              >
                Accept Invitation
              </Button>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
              If you didn't expect this invitation, you can safely ignore this email.
            </Text>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If the button doesn't work, copy and paste this link into your browser:
            </Text>
            <Text className="text-[#666666] text-[12px] leading-[24px] break-all">{url}</Text>

            <Section className="text-center mt-[24px]">
              <Text className="text-[#999999] text-[10px] leading-[16px]">
                PaperJet - Privacy-first document processing
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

InvitationEmail.PreviewProps = {
  url: "https://paperjet.ai/invite/abc123",
  inviter: "John Doe",
  organizationName: "Acme Corp",
  role: "admin",
} as InvitationEmailProps;

export default InvitationEmail;
