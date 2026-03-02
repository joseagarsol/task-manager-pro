import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./features/auth/schemas";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = await loginSchema.parseAsync(credentials);

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.picture = user.image;
        token.name = user.name;
      }

      if (trigger === "update") {
        if (session.image !== undefined) {
          token.picture = session.image;
        }
        if (session.name !== undefined) {
          token.name = session.name;
        }
      }
      return token;
    },
    async session({ session, token, trigger }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.image = token.picture as string;
        session.user.name = token.name as string;
      }
      if (trigger === "update" && session.user) {
        session.user.image = token.picture as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
});
