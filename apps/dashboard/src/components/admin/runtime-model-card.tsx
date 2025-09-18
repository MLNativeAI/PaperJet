import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription, CardTitle, CardAction, CardFooter } from "@/components/ui/card";
import { BrainIcon, RocketIcon } from "lucide-react";

export default function RuntimeModelCard({
  modelType,
  modelName,
}: {
  modelType: "fast" | "accurate";
  modelName: string;
}) {
  const modelNameLabel = modelType === "fast" ? "Fast Model" : "Accurate Model";
  const modelIcon = modelType === "fast" ? <RocketIcon /> : <BrainIcon />;
  const modelDesc =
    modelType === "fast"
      ? "Fast model is used for quick, inexpensive operations like parsing text or verification. We recommend using a snappy, smaller model"
      : "Accurate model is used for OCR and other complex tasks. Vision is required, we recommend using the best model you have.";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardDescription>{modelNameLabel}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex gap-2 items-center">
          {modelIcon}
          {modelName}
        </CardTitle>
        <CardAction>
          <Button variant="secondary">Configure</Button>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">{modelDesc}</div>
      </CardFooter>
    </Card>
  );
}
