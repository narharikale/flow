import { z } from "zod";

const sourceSchema = z
  .object({
    channel: z.string(),
    timestamp: z.string(),
  })
  .catchall(z.union([z.string(), z.record(z.string())]));

const fieldSchema = z
  .object({
    value: z.union([z.string(), z.date(), z.boolean()]),
    title: z.string(),
    interface: z.object({
      type: z.string(),
      options: z.array(z.string()).optional(),
    }),
    key: z.string(),
    required: z.boolean(),
    defaultValue: z.string(),
    defaultOptions: z.array(z.string()),
    hidden: z.boolean(),
    placeholder: z.string(),
    disabled: z.boolean(),
    tooltip: z.string(),
    colSpan: z.string(),
    source: sourceSchema.optional(),
  })
  .refine(
    (data) => {
      // Validate value type based on interface type
      switch (data.interface.type) {
        case "date":
          return typeof data.value === "string" || data.value instanceof Date;
        case "boolean":
          return typeof data.value === "boolean";
        default:
          return typeof data.value === "string";
      }
    },
    {
      message: "Value type must match interface type",
      path: ["value"],
    }
  );

const fieldsSchema = z.record(fieldSchema);

const sectionSchema = z.object({
  order: z.number(),
  layout: z.string(),
  title: z.string(),
  tooltip: z.string().optional(),
  bgColor: z.string(),
  fields: fieldsSchema,
  stats: z.object({
    total: z.number(),
    filled: z.number(),
  }),
});

export const formSchema = z.object({
  sections: z.record(sectionSchema),
});

export type FormValues = z.infer<typeof formSchema>;
