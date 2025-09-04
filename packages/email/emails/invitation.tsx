import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import React from "react";

interface InvitationEmailProps {
  url: string;
  inviter: string;
  organizationName: string;
  role: string;
}

export const InvitationEmail = ({ url, inviter, organizationName, role }: InvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>You've been invited to join {organizationName} on PaperJet</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>You're invited to PaperJet</Heading>
          <Text style={text}>
            <strong>{inviter}</strong> has invited you to join <strong>{organizationName}</strong> on PaperJet as a{" "}
            <strong>{role}</strong>.
          </Text>
          <Text style={text}>
            Click the button below to accept the invitation and get started. This link will expire in 7 days.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={url}>
              Accept Invitation
            </Button>
          </Section>
          <Text style={text}>If you didn't expect this invitation, you can safely ignore it.</Text>
          <Text style={footer}>
            If the button doesn't work, copy and paste this link into your browser:
            <br />
            {url}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#007ee6",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
};

const footer = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "32px 0 0 0",
};
