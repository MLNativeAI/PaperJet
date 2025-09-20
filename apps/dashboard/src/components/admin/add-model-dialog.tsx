import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddModelForm from "@/components/admin/add-model-form";
import { ModelConfigParams, modelConfigSchema } from "@paperjet/engine/types";

export function AddModelDialog() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ModelConfigParams>({
    resolver: zodResolver(modelConfigSchema),
    defaultValues: {
      provider: "custom",
      structuredOutputMode: "tool",
    },
  });
  const onSubmit = async (values: ModelConfigParams) => {
    setIsLoading(true);
    try {
      // TODO: Implement mutation to create model configuration
      console.log("Creating model configuration:", values);

      toast.success("Model configuration added successfully");
      form.reset();
    } catch (err) {
      toast.error("Failed to add model configuration");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm" className="gap-2">
          <Plus className="h-5 w-5" />
          Add model
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add Model Configuration</DialogTitle>
          <DialogDescription>Configure a new AI model for your organization.</DialogDescription>
        </DialogHeader>
        <AddModelForm />
      </DialogContent>
    </Dialog>
  );
}
