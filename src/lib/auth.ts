/**
 * Authentication Configuration – NextAuth v5
 * 
 * Portable Architecture: Auth is isolated in this module.
 * Swap providers (GitHub, Google, Credentials) without touching routes.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma, checkDatabaseConnection, DatabaseNotConfiguredError } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: checkDatabaseConnection() ? PrismaAdapter(prisma) : undefined,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!checkDatabaseConnection()) {
          console.error("❌ Cannot authenticate: DATABASE_URL not configured");
          throw new Error("Database not configured. Please set DATABASE_URL in .env.local");
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          if (error instanceof DatabaseNotConfiguredError) {
            console.error("❌ Database not configured:", error.message);
            throw new Error("Database not configured. Please set DATABASE_URL in .env.local");
          }
          console.error("❌ Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

/**
 * Helper to get the current session (server-side)
 */
export async function getSession() {
  return await auth();
}

/**
 * Helper to require authentication – throws if not logged in
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Hash a password for storage
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Register a new user
 */
export async function registerUser(email: string, password: string, name?: string) {
  if (!checkDatabaseConnection()) {
    throw new Error("Database not configured. Please set DATABASE_URL in .env.local");
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(password);
    
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
      },
    });
  } catch (error) {
    if (error instanceof DatabaseNotConfiguredError) {
      throw new Error("Database not configured. Please set DATABASE_URL in .env.local");
    }
    throw error;
  }
}
