import RuntimeModelCard from "@/components/admin/runtime-model-card";

export default function RuntimeModelsConfig() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Runtime models</h2>
      </div>
      <div className="flex gap-4">
        <RuntimeModelCard modelName="Gemini Flash 2.5" modelType="accurate" />
        <RuntimeModelCard modelName="GPT-OSS 120B" modelType="fast" />
      </div>
    </div>
  );
}
