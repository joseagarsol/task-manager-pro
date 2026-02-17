import { User } from "../types";
import { loginSchema } from "../schemas";
import * as z from "zod";
import { useState } from "react";

export function useLoginForm() {
  const [errors, setErrors] = useState<Partial<Record<keyof User, string[]>>>();

  const schema = loginSchema;

  const validateForm = (
    e: React.FormEvent<HTMLFormElement>,
  ): Partial<User> | null => {
    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as User["email"];
    const password = formData.get("password") as User["password"];

    const validation = schema.safeParse({ email, password });

    if (!validation.success) {
      const flattened = z.flattenError(validation.error);
      const fieldErrors = flattened.fieldErrors as Partial<
        Record<keyof User, string[]>
      >;

      setErrors(fieldErrors);
      return null;
    }

    return {
      email,
      password,
    };
  };

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

  return {
    errors,
    validateField,
    validateForm,
  };
}
