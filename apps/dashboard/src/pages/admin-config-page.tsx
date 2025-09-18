import RuntimeModelsConfig from "@/components/admin/runtime-models-config";
import { useConfiguration } from "@/hooks/use-configuration";

export default function AdminConfigPage() {
  const { configuration, isLoading } = useConfiguration();

  if (isLoading || !configuration) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-17 pt-8">
      <RuntimeModelsConfig />
      <div className="space-y-6">
        {/* <div className="flex gap-4"> */}
        {/* <AdminModelConfigForm configuration={configuration} /> */}
      </div>
    </div>
  );
}
