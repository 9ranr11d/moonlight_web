import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id?: string; // `id` 필드 추가
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
