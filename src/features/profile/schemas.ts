import { z } from "zod";

export const imageSchema = z.object({
  image: z
    .instanceof(File, {
      message: "Debes subir una imagen",
    })
    .refine((file) => file.size <= 2097152, {
      message: "La imagen debe pesar menos de 2MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      {
        message: "La imagen debe ser JPG, PNG o GIF",
      },
    ),
});

export const profileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El email es requerido"),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
export type ImageSchema = z.infer<typeof imageSchema>;
