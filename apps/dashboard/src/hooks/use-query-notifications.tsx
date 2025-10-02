import { toast } from "sonner";
import { Route } from "@/routes/_app";

export function useQueryNoficiations() {
  const { signedIn, newUser } = Route.useSearch();
  if (signedIn === true) {
    toast.success("Welcome back!");
  }
  if (newUser === true) {
    toast.success("Hi new user");
  }
  return {};
}
