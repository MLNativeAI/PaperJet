import { ModelListTable } from "@/components/admin/model-list-table";
import RuntimeModelsConfig from "@/components/admin/runtime-models-config";
import { useModels } from "@/hooks/use-models";

export default function ModelsPage() {
  // we need to fetch both all the model configs and the runtime config
  // so that we can select them in the runtime model selector
  // so should we have two separate hooks/ calls or one?

  const { models } = useModels();

  return (
    <div className="space-y-17 pt-8">
      <RuntimeModelsConfig />
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">All models</h2>
        </div>
        <ModelListTable data={models} />
      </div>
    </div>
  );
}
