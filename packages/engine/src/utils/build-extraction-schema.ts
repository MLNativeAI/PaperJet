import { z } from "zod";
import type { WorkflowConfiguration } from "../types";

export function buildExtractionSchema(configuration: WorkflowConfiguration) {
  const fieldSchemas: Record<string, any> = {};
  const tableSchemas: Record<string, any> = {};

  configuration.objects.forEach((obj) => {
    if ('fields' in obj) {
      obj.fields.forEach((field) => {
        switch (field.type) {
          case "number":
            fieldSchemas[field.name] = z.number().nullable();
            break;
          case "date":
            fieldSchemas[field.name] = z.string().nullable(); // Date as ISO string
            break;
          default:
            fieldSchemas[field.name] = z.string().nullable();
        }
      });
    }

    if ('tables' in obj) {
      obj.tables.forEach((table) => {
        const columnSchemas: Record<string, any> = {};

        table.columns.forEach((col) => {
          switch (col.type) {
            case "number":
              columnSchemas[col.name] = z.number().nullable();
              break;
            case "date":
              columnSchemas[col.name] = z.string().nullable();
              break;
            default:
              columnSchemas[col.name] = z.string().nullable();
          }
        });

        tableSchemas[table.name] = z.array(z.object(columnSchemas));
      });
    }
  });

  return z.object({ ...fieldSchemas, ...tableSchemas });
}
