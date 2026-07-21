import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/config/mongoDB/connectDB";
import { AdminUser, AdminRole } from "@/lib/models/adminUser";

// Extend the Session/JWT types to carry role + siteId.
// See docs/rbac-subsites-design.md §2.
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: AdminRole;
      siteId?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    role: AdminRole;
    siteId: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: AdminRole;
    siteId?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = credentials.username.trim().toLowerCase();

        // Bootstrap superadmin from env — keeps access before any DB user exists.
        if (
          process.env.ADMIN_NAME &&
          process.env.ADMIN_PASSWORD &&
          username === process.env.ADMIN_NAME.trim().toLowerCase() &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: `env:${username}`, role: "superadmin", siteId: null };
        }

        // DB-backed users.
        try {
          await connectDB();
          const user = await AdminUser.findOne({ username }).exec();
          if (!user) return null;

          const ok = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
          if (!ok) return null;

          return {
            id: String(user._id),
            role: user.role as AdminRole,
            siteId: user.siteId ? String(user.siteId) : null,
          };
        } catch (error) {
          console.error("authorize error:", error);
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.siteId = user.siteId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.siteId = token.siteId ?? null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
