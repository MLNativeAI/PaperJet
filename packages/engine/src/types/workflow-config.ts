// --- Schema for the basic 'field' objects ---

import z from "zod";

// This schema describes a single field with a name and a specific type.
const FieldSchema = z.object({
  name: z.string(),
  type: z.union([z.literal("string"), z.literal("date"), z.literal("number")]),
});

// --- Schema for the 'tables' objects' columns ---
// This schema is identical to FieldSchema, but is named differently for clarity
// within the context of a table.
const ColumnSchema = z.object({
  name: z.string(),
  type: z.union([z.literal("string"), z.literal("date"), z.literal("number")]),
});

// --- Schema for a 'table' within the configuration ---
// This describes a structured table with a name, optional description,
// and an array of columns.
const TableSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  columns: z.array(ColumnSchema),
});

// --- Schemas for the different types of objects in the main 'objects' array ---
// There are two possible structures for an object: one with 'fields' and one with 'tables'.
const FieldsObjectSchema = z.object({
  name: z.string(),
  fields: z.array(FieldSchema),
});

const TablesObjectSchema = z.object({
  name: z.string(),
  tables: z.array(TableSchema),
});

// --- Schema for the entire 'objects' array ---
// This array can contain a mix of objects with either fields or tables.
const ObjectsArraySchema = z.array(z.union([FieldsObjectSchema, TablesObjectSchema]));

export const WorkflowConfigurationSchema = z.object({
  objects: ObjectsArraySchema,
});

export type WorkflowConfiguration = z.infer<typeof WorkflowConfigurationSchema>;
