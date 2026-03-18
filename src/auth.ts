import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import { compare } from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const res = await query(
          "SELECT id, email, password_hash, display_name FROM users WHERE email = ?",
          [credentials.email],
        );

        const user = res.rows[0];

        if (!user || !user.password_hash) return null;

        const isPasswordCorrect = await compare(
          credentials.password as string,
          user.password_hash as string,
        );

        if (!isPasswordCorrect) return null;

        return {
          id: user.id as string,
          email: user.email as string,
          name: user.display_name as string,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isSettingPage = nextUrl.pathname.startsWith("/setting");

      // ログイン済みユーザーがLP (/) にアクセスした場合はダッシュボードへ
      if (nextUrl.pathname === "/" && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // ログアウト直後（isLoggedIn=false）にLP (/) にアクセスした場合はそのまま表示
      if (nextUrl.pathname === "/" && !isLoggedIn) {
        return true;
      }

      if (isSettingPage && !isLoggedIn) {
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        const res = await query("SELECT id FROM users WHERE email = ?", [
          user.email,
        ]);
        if (res.rows.length === 0) {
          const now = new Date().toISOString();
          await query(
            "INSERT INTO users (id, email, display_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            [user.id, user.email, user.name, now, now],
          );
        } else {
          token.sub = res.rows[0].id as string;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
