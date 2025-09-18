import RuntimeModelsConfig from "@/components/admin/runtime-models-config";

export default function AdminConfigPage() {
  // we need to fetch both all the model configs and the runtime config
  // so that we can select them in the runtime model selector
  // so should we have two separate hooks/ calls or one?
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
