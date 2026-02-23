"use server";

import prisma from "@/lib/prisma";
import { registerSchema, type RegisterSchema } from "./schemas";
import bcrypt from "bcryptjs";
import { User } from "./types";

interface RegisterResponse {
  success: boolean;
  user?: Partial<User>;
  error?: string;
}

export async function register(
  data: RegisterSchema,
): Promise<RegisterResponse> {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: "Datos inválidos",
    };
  }

  const { name, email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    return {
      success: false,
      error: "El correo electrónico ya está en uso",
    };
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
    },
  });

  return {
    success: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
  };
}
