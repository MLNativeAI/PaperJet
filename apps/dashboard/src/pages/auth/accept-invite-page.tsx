import { useRouteContext } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmailPasswordForm } from "@/components/forms/email-password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/auth/accept-invite";

export default function AcceptInvitePage() {
  const { token, email } = Route.useSearch();
  const { serverInfo } = useRouteContext({ from: "/auth/accept-invite" });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleSendSignInLink = async () => {
    setError("");
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.magicLink({
        email,
        callbackURL: `${window.location.origin}/api/admin/accept-invitation?id=${token}`,
      });
      if (error) {
        setError(error.message || "Failed to send sign-in link");
        return;
      }
      setMagicLinkSent(true);
      toast.success("Sign-in link sent! Check your email.");
    } catch (_err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Accept invitation</CardTitle>
          <CardDescription>Welcome back! To accept your invitation, we need to verify your identity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="text-sm text-muted-foreground">
              Your email: <strong>{email}</strong>
            </div>
            {serverInfo?.authMode === "magic-link" && !magicLinkSent && (
              <button
                type="button"
                onClick={handleSendSignInLink}
                disabled={isLoading}
                className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Sign-In Link"}
              </button>
            )}
            {serverInfo?.authMode === "magic-link" && magicLinkSent && (
              <div className="text-center space-y-3">
                <div className="text-sm text-muted-foreground">
                  Sign-in link sent! Check your email and click the link to accept the invitation.
                </div>
              </div>
            )}
            {serverInfo?.authMode === "password" && (
              <EmailPasswordForm
                formMode="sign-in"
                setError={setError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                invite={token}
                email={email}
              />
            )}
            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
