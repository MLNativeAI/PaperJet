import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const availableProviders = z.enum(["google", "openai", "custom"]);

const addModelFormSchema = z.object({
  provider: availableProviders,
  providerApiKey: z.string().min(1, "API key is required"),
  modelName: z.string().min(1, "Model name is required"),
  displayName: z.string().min(1, "Display name is required"),
  baseUrl: z.string().optional(),
  structuredOutputMode: z.enum(["tool", "json"]),
});

type AddModelFormValues = z.infer<typeof addModelFormSchema>;

export function AddModelDialog() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddModelFormValues>({
    resolver: zodResolver(addModelFormSchema),
    defaultValues: {
      provider: "custom",
      structuredOutputMode: "tool",
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
    <Dialog>
      <DialogTrigger>
        <Button size="sm" className="gap-2">
          <Plus className="h-5 w-5" />
          Add model
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add Model Configuration</DialogTitle>
          <DialogDescription>Configure a new AI model for your organization.</DialogDescription>
        </DialogHeader>
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
              name="structuredOutputMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Structured Output Mode</FormLabel>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4"
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="tool" id={field.name} disabled={isLoading} />
                      <Label htmlFor="tool" className="flex items-center gap-2 cursor-pointer flex-1">
                        <div>
                          <div className="font-medium">Tool Mode</div>
                          <div className="text-sm text-muted-foreground">
                            Use tool calling for structured output (recommended)
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="json" id={field.name} disabled={isLoading} />
                      <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer flex-1">
                        <div>
                          <div className="font-medium">JSON Mode</div>
                          <div className="text-sm text-muted-foreground">
                            Standard JSON output. Use only if model doesn't support tools.
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Model"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
