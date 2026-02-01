import { useState } from "react";
import { Task } from "../types";
import * as z from "zod";
import { createTaskSchema } from "../schemas";

export function useTaskForm(task: Task | undefined) {
  const [createdAt, setCreatedAt] = useState<Date | undefined>(
    task?.createdAt ? new Date(task.createdAt) : undefined,
  );
  const [estimatedAt, setEstimatedAt] = useState<Date | undefined>(
    task?.estimatedAt ? new Date(task.estimatedAt) : undefined,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Task, string[]>>>();

  const schema = createTaskSchema;

  type SchemaShape = typeof schema.shape;
  type FieldName = keyof SchemaShape;

  const validateField = <K extends FieldName>(key: K, value: unknown) => {
    const validation = schema.shape[key].safeParse(value);
    if (validation.success) {
      if (errors?.[key]) {
        setErrors((prevErrors) => {
          const newErrors = { ...(prevErrors ? prevErrors : {}) };
          delete newErrors[key];
          return newErrors;
        });
      }
      return;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: validation.error.issues.map((err) => err.message),
    }));
  };

  const validateForm = (e: React.FormEvent<HTMLFormElement>): Task | null => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as Task["title"];
    const description = formData.get("description") as Task["description"];
    const status = formData.get("status") as Task["status"];
    const priority = formData.get("priority") as Task["priority"];

    const validation = schema.safeParse({
      title,
      description,
      status,
      priority,
      createdAt: createdAt,
      estimatedAt: estimatedAt,
    });

    if (!validation.success) {
      const flattened = z.flattenError(validation.error);
      const fieldErrors = flattened.fieldErrors as Partial<
        Record<keyof Task, string[]>
      >;

      setErrors(fieldErrors);
      return null;
    }

    return {
      id: task?.id || "",
      title,
      description,
      status,
      priority,
      createdAt: createdAt || new Date(),
      estimatedAt: estimatedAt || new Date(),
    } as Task;
  };

  return {
    errors,
    validateField,
    validateForm,
    setCreatedAt,
    setEstimatedAt,
    createdAt,
    estimatedAt,
  };
}
