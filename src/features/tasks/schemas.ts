import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  status: z.enum(["Backlog", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  createdAt: z.date({
    error: (issue) =>
      issue.input === undefined
        ? "La fecha de creación es obligatoria"
        : "Fecha inválida",
  }),
  estimatedAt: z.date({
    error: (issue) =>
      issue.input === undefined
        ? "La fecha estimada es obligatoria"
        : "Fecha inválida",
  }),
});

export const statusSchema = z.enum(["Backlog", "In Progress", "Done"]);

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type StatusInput = z.infer<typeof statusSchema>;
