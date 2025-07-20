import { Globe, Key, Server, Type } from "lucide-react";
import AdminModelConfigForm from "@/components/forms/admin-model-config-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useConfiguration } from "@/hooks/use-configuration";

export default function AdminConfigPage() {
  const { configuration, isLoading } = useConfiguration();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AdminModelConfigForm configuration={configuration} />;
  return (
    <div className="mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Model Settings</CardTitle>
          <CardDescription>Configure your AI model provider and authentication settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Model Provider</Label>
            <RadioGroup value={modelType} onValueChange={setModelType} className="grid grid-cols-2 gap-4">
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
                  <Server className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Custom</div>
                    <div className="text-sm text-muted-foreground">Use custom API endpoint</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {modelType === "cloud" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-medium">Cloud Configuration</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gemini-key" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Gemini API Key
                </Label>
                <Input id="gemini-key" type="password" placeholder="Enter your Gemini API key" />
                <p className="text-sm text-muted-foreground">Get your API key from the Google AI Studio console</p>
              </div>
            </div>
          )}

          {modelType === "custom" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Server className="h-4 w-4" />
                <h3 className="font-medium">Custom Configuration</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-url" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    API URL
                  </Label>
                  <Input id="api-url" type="url" placeholder="https://api.example.com/v1" />
                  <p className="text-sm text-muted-foreground">The base URL for your custom API endpoint</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model-name" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Model Name
                  </Label>
                  <Input id="model-name" placeholder="gpt-4, claude-3, llama-2, etc." />
                  <p className="text-sm text-muted-foreground">The specific model identifier to use</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access-token" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Access Token
                    <span className="text-sm text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Input id="access-token" type="password" placeholder="Bearer token or API key" />
                  <p className="text-sm text-muted-foreground">Authentication token if required by your API</p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                Validate connection
              </Button>

              <div className="flex gap-3">
                <Button variant="outline">Reset</Button>
                <Button>Save Settings</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
