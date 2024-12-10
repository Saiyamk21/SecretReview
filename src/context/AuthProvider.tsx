'use client'

import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  // To prevent hydration errors by waiting until the component is mounted on the client-side
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If the component isn't mounted yet, return null to prevent a mismatch
  if (!mounted) return null;

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
