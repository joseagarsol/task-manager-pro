import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    email: z.email("Correo electrónico inválido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "La contraseña debe tener al menos una mayúscula")
      .regex(/[a-z]/, "La contraseña debe tener al menos una minúscula")
      .regex(/[0-9]/, "La contraseña debe tener al menos un número")
      .regex(
        /[^A-Za-z0-9]/,
        "La contraseña debe tener al menos un carácter especial",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
