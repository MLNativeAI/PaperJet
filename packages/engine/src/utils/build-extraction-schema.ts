import { z } from "zod";
import type { WorkflowConfiguration } from "../types";

export function buildExtractionSchema(configuration: WorkflowConfiguration) {
  const objectSchemas: Record<string, any> = {};

  configuration.objects.forEach((obj) => {
    const objectProperties: Record<string, any> = {};

    // Add description field to the object schema
    if (obj.description) {
      objectProperties.description = z.string();
    }

    if ("fields" in obj) {
      const fieldsSchema: Record<string, any> = {};

      obj.fields?.forEach((field) => {
        switch (field.type) {
          case "number":
            fieldsSchema[field.name] = z.number().nullable().optional();
            break;
          case "date":
            fieldsSchema[field.name] = z.string().nullable().optional(); // Date as ISO string
            break;
          default:
            fieldsSchema[field.name] = z.string().nullable().optional();
        }
        
        // Add description to field if it exists
        if (field.description) {
          fieldsSchema[field.name] = fieldsSchema[field.name].describe(field.description);
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
              columnSchemas[col.name] = z.number().nullable().optional();
              break;
            case "date":
              columnSchemas[col.name] = z.string().nullable().optional();
              break;
            default:
              columnSchemas[col.name] = z.string().nullable().optional();
          }
          
          // Add description to column if it exists
          if (col.description) {
            columnSchemas[col.name] = columnSchemas[col.name].describe(col.description);
          }
        });

        tablesSchema[table.name] = z.array(z.object(columnSchemas)).optional();
        
        // Add description to table if it exists
        if (table.description) {
          tablesSchema[table.name] = tablesSchema[table.name].describe(table.description);
        }
      });

      objectProperties.tables = z.object(tablesSchema).optional();
    }

    objectSchemas[obj.name] = z.object(objectProperties).optional();
  });

  return z.object(objectSchemas);
}
