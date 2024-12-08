'use client';

import { KindeAuthProvider } from "./kinde-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <KindeAuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </KindeAuthProvider>
  );
}