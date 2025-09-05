import { CircleX, Info } from "lucide-react";
import { SignInForm } from "@/components/sign-in-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Route } from "@/routes/auth/sign-in";

export default function SignInPage() {
  const { invite, notFound } = Route.useSearch();
  return (
    <div className="flex flex-col gap-4">
      {invite && (
        <Alert variant="default">
          <Info />
          <AlertTitle>Create an account first</AlertTitle>
          <AlertDescription>You need to create an account to accept the invitation</AlertDescription>
        </Alert>
      )}
      {notFound && (
        <Alert variant="default">
          <CircleX />
          <AlertTitle>Invitation not found</AlertTitle>
          <AlertDescription>This invitation code does not exist</AlertDescription>
        </Alert>
      )}
      <SignInForm />
    </div>
  );
}
