import { ApiKeysList } from "@/components/api-keys-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiKeys } from "@/hooks/use-api-keys";
import { Link } from "@tanstack/react-router";

export default function SettingsPage() {
  const { apiKeys, isLoading, refetch } = useApiKeys();

  if (isLoading) {
    return (
      <div className="w-full px-4 py-8">
        <div>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and API keys</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Link to="/settings/models">Models</Link>
      </div>
      {/* API Keys Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">API Keys</h2>
          <p className="text-muted-foreground mt-1">Create and manage API keys to access PaperJet programmatically</p>
        </div>
      </div>
    </div>
  );
}
