"use client";

import { SessionProvider } from "next-auth/react";
import { LocaleProvider } from "./locale-provider";
import { AppStateProvider } from "./app-state-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppStateProvider><LocaleProvider><SessionProvider>{children}</SessionProvider></LocaleProvider></AppStateProvider>;
}
