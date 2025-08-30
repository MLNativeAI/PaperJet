import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import OrgLogoWithFallback from "@/components/org-logo-with-fallback";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const orgNameLogoSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
});

type OrgNameLogoFormValues = z.infer<typeof orgNameLogoSchema>;

export default function OrgNameLogo() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<OrgNameLogoFormValues>({
    resolver: zodResolver(orgNameLogoSchema),
    defaultValues: {
      name: activeOrganization?.name || "",
    },
  });

  const onSubmit = async (values: OrgNameLogoFormValues) => {
    if (!activeOrganization) {
      setError("No active organization found");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.organization.update({
        data: {
          name: values.name,
        },
        organizationId: activeOrganization.id,
      });

      if (error) {
        setError(error.message || "Failed to update organization");
        toast.error("Failed to update organization");
      } else {
        toast.success("Organization updated successfully");
      }
    } catch (err) {
      setError("Failed to update organization");
      toast.error("Failed to update organization");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div>
        <h2 className="text-xl font-bold">Organization Information</h2>
        <p className="text-muted-foreground">Manage your organization's details and settings</p>
      </div>
      <div className="flex flex-col border border-1 p-4 gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-row items-center gap-4">
                <Avatar className="h-20 w-20">
                  {activeOrganization && <OrgLogoWithFallback activeOrganization={activeOrganization} />}
                </Avatar>
                <Button variant="outline" size="sm" type="button">
                  Change Logo
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-80">
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder={activeOrganization?.name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-sm text-red-500">{error}</div>}

            <div className="flex w-full pt-4 justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
