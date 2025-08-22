import { Trash2, Edit, Save, X } from "lucide-react";
import { produce } from "immer";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DraftObject } from "@/types";
import { useWorkflowConfig } from "@/contexts/workflow-config-context";

interface WorkflowObjectFormProps {
  object: DraftObject;
}

interface LocalObjectState {
  name: string;
  description: string;
}

export function WorkflowObjectForm({ object }: WorkflowObjectFormProps) {
  const { updateObjectName, updateObjectDescription, addObjectField, addObjectTable, removeObject } =
    useWorkflowConfig();

  const [localObject, setLocalObject] = useState<LocalObjectState>({
    name: object.name,
    description: object.description || "",
  });

  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    setLocalObject({
      name: object.name,
      description: object.description || "",
    });
  }, [object.name, object.description]);

  const handleSave = () => {
    updateObjectName(object.id, localObject.name);
    updateObjectDescription(object.id, localObject.description);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalObject({
      name: object.name,
      description: object.description || "",
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setLocalObject({
      name: object.name,
      description: object.description || "",
    });
    setIsEditing(true);
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1 pr-2">
          <Label htmlFor={`object-name-${object.id}`}>Object Name</Label>
          {isEditing ? (
            <Input
              id={`object-name-${object.id}`}
              value={localObject.name}
              onChange={(e) =>
                setLocalObject((prev) =>
                  produce(prev, (draft) => {
                    draft.name = e.target.value;
                  }),
                )
              }
              placeholder="Enter object name"
            />
          ) : (
            <div className="py-2 font-medium">{object.name}</div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeObject(object.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`object-description-${object.id}`}>Description</Label>
        {isEditing ? (
          <Textarea
            id={`object-description-${object.id}`}
            value={localObject.description}
            onChange={(e) =>
              setLocalObject((prev) =>
                produce(prev, (draft) => {
                  draft.description = e.target.value;
                }),
              )
            }
            placeholder="Enter object description"
          />
        ) : (
          <div className="py-2 text-muted-foreground">{object.description || "No description"}</div>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => addObjectField(object.id)}>
            Add Field
          </Button>
          <Button variant="outline" onClick={() => addObjectTable(object.id)}>
            Add Table
          </Button>
        </div>
      ) : null}

      <div className="flex gap-2 justify-end">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </>
        ) : (
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}

