import { z } from "zod";
import type { WorkflowConfiguration } from "../types";

export function buildExtractionSchema(configuration: WorkflowConfiguration) {
  const objectSchemas: Record<string, any> = {};

  configuration.objects.forEach((obj) => {
    const objectProperties: Record<string, any> = {};

    if ("fields" in obj) {
      const fieldsSchema: Record<string, any> = {};

      obj.fields?.forEach((field) => {
        switch (field.type) {
          case "number":
            fieldsSchema[field.name] = z.number().nullable();
            break;
          case "date":
            fieldsSchema[field.name] = z.string().nullable(); // Date as ISO string
            break;
          default:
            fieldsSchema[field.name] = z.string().nullable();
        }
      });

      objectProperties.fields = z.object(fieldsSchema);
    }

    if ("tables" in obj) {
      const tablesSchema: Record<string, any> = {};

      obj.tables?.forEach((table) => {
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

        tablesSchema[table.name] = z.array(z.object(columnSchemas));
      });

      objectProperties.tables = z.object(tablesSchema);
    }

    objectSchemas[obj.name] = z.object(objectProperties);
  });

  return z.object(objectSchemas);
}
