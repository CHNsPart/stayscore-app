'use client';

import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

export function KindeAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <KindeProvider>{children}</KindeProvider>;
}