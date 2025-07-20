import { zodResolver } from "@hookform/resolvers/zod";
import type { Configuration } from "@paperjet/engine/types";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AdminModelConfigForm({ configuration }: { configuration: Configuration }) {
  const schema = z.object({
    modelType: z.enum(["cloud", "custom"]),
    geminiApiKey: z.string(),
    customModelUrl: z.string(),
    customModelName: z.string(),
    customModelToken: z.string(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...configuration,
    },
  });

  const onSubmit = async (_values: z.infer<typeof schema>) => {};

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
                  onValueChange={field.onChange}
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
                        <div className="text-sm text-muted-foreground">Use custom API endpoint</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
