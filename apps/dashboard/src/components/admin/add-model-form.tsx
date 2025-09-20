import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const availableProviders = z.enum(["google", "openai", "custom"]);

const addModelFormSchema = z.object({
  provider: availableProviders,
  baseUrl: z.string().optional(),
  providerApiKey: z.string().min(1, "API key is required"),
  modelName: z.string().min(1, "Model name is required"),
  displayName: z.string().min(1, "Display name is required"),
});

type AddModelFormValues = z.infer<typeof addModelFormSchema>;

export default function AddModelForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddModelFormValues>({
    resolver: zodResolver(addModelFormSchema),
    defaultValues: {
      provider: "custom",
    },
  });

  const watchedProvider = form.watch("provider");

  const onSubmit = async (values: AddModelFormValues) => {
    setIsLoading(true);
    try {
      // TODO: Implement mutation to create model configuration
      console.log("Creating model configuration:", values);

      toast.success("Model configuration added successfully");
      form.reset();
    } catch (err) {
      toast.error("Failed to add model configuration");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="custom">Custom (OpenAI-compatible)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {watchedProvider === "custom" && (
          <FormField
            control={form.control}
            name="baseUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://api.openai.com/v1" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="providerApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter your API key" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="modelName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., gemini-1.5-flash" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Gemini 1.5 Flash" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline">Validate connection</Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Model"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
