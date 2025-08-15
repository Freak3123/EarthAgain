import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }
        try {
          const res = await axios.post(
            `${process.env.NEXTAUTH_URL}/api/admin/login`,
            {
              username: credentials.username,
              password: credentials.password,
            }
          );

          console.log(res.data.message);
          return {
            id: credentials.username,
          };
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            console.log("Login failed:", error.response?.data || error.message);
          } else {
            console.log("Unexpected error:", error);
          }
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (e.g. for email-based sign in)
    // newUser: null // If set, new users will be directed here on first sign in
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
