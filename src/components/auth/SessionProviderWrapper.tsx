"use client";

import { SessionProvider } from "next-auth/react";

/** nextauth Session Provider Interface */
interface SessionProviderWrapperProps {
  /** 내용물 */
  children: React.ReactNode;
}

/** nextauth Session Provider */
export default function SessionProviderWrapper({
  children,
}: SessionProviderWrapperProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
