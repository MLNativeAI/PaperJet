import { zodResolver } from "@hookform/resolvers/zod";
import type { Configuration, ConnectionValidationResult } from "@paperjet/engine/types";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUpdateConfiguration } from "@/hooks/use-update-configuration";
import { useValidateConnection } from "@/hooks/use-validate-connection";

export default function AdminModelConfigForm({ configuration }: { configuration: Configuration }) {
  const schema = z.object({
    modelType: z.enum(["cloud", "custom"]),
    geminiApiKey: z.string().optional(),
    customModelUrl: z.string().optional(),
    customModelName: z.string().optional(),
    customModelToken: z.string().optional(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...configuration,
    },
  });
  const watchedModelType = form.watch("modelType");

  const { mutateAsync, isPending } = useUpdateConfiguration();
  const { mutateAsync: validateConnection, isPending: isValidating } = useValidateConnection();
  const [validationResult, setValidationResult] = useState<ConnectionValidationResult | null>(null);

  const runConnectionValidation = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setValidationResult(null);
    const result = await validateConnection(form.getValues());
    setValidationResult(result);
  };

  const onSubmit = async (_values: z.infer<typeof schema>) => {
    await mutateAsync(_values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="modelType"
            render={({ field }) => (
              <FormItem>
                <RadioGroup
                  onValueChange={(e) => {
                    setValidationResult(null);
                    field.onChange(e);
                  }}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="cloud" id="cloud" />
                    <Label htmlFor="cloud" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div>
                        <div className="font-medium">Cloud</div>
                        <div className="text-sm text-muted-foreground">Use Google Gemini API</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div>
                        <div className="font-medium">Custom</div>
                        <div className="text-sm text-muted-foreground">
                          Use an OpenAI-compatbile API server and model
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </FormItem>
            )}
          />
        </div>
        {watchedModelType === "cloud" && (
          <FormField
            control={form.control}
            name="geminiApiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gemini API Key</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your Gemini API Key" />
                </FormControl>
                <p className="text-sm text-muted-foreground">Get your API key from the Google AI Studio console</p>
              </FormItem>
            )}
          />
        )}

        {watchedModelType === "custom" && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="customModelUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model endpoint</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="http://localhost:11434/v1" />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">The base URL for your custom API endpoint</p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customModelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ex. mistral-small-3.2:22b" />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">The model identifier</p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customModelToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access token (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="xyz" />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">Use only if your server requires authentication</p>
                </FormItem>
              )}
            />
          </div>
        )}
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                disabled={isValidating}
                className="flex items-center gap-2 bg-transparent"
                onClick={runConnectionValidation}
              >
                {isValidating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Validate connection
              </Button>
              {validationResult?.isValid && <div className="text-green-500 text-sm ">Connection is valid</div>}
              {validationResult && !validationResult?.isValid && (
                <div className="text-red-500 text-sm ">{validationResult.error}</div>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={isPending}>
                Save settings
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
