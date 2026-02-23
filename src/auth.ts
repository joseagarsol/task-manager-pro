import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./features/auth/schemas";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          const { email, password } = await loginSchema.parseAsync(credentials);

          user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;

          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
        }

        console.log("Credenciales inválidas");
        return null;
      },
    }),
  ],
});
