import type { DbModelConfiguration, RuntimeModel } from "@paperjet/db/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModelSelectorDialogProps {
  modelType: "fast" | "accurate";
  currentModel: RuntimeModel | null;
  availableModels: DbModelConfiguration[];
  onSelectModel: (modelId: string) => void;
  isSettingModel: boolean;
}

export default function ModelSelectorDialog({
  modelType,
  currentModel,
  availableModels,
  onSelectModel,
  isSettingModel,
}: ModelSelectorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(currentModel?.modelId || "");

  const handleSelectModel = () => {
    if (selectedModelId) {
      onSelectModel(selectedModelId);
      setIsOpen(false);
    }
  };

  const modelTypeLabel = modelType === "fast" ? "Fast" : "Accurate";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={isSettingModel}>
          {isSettingModel ? "Setting..." : "Configure"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select {modelTypeLabel} Model</DialogTitle>
          <DialogDescription>Choose a model to use for {modelType} operations.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="model" className="text-right">
              Model
            </label>
            <Select value={selectedModelId} onValueChange={setSelectedModelId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.displayName || model.modelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSelectModel} disabled={!selectedModelId || isSettingModel}>
            {isSettingModel ? "Setting..." : "Set Model"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
