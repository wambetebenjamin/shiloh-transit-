"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { CaptchaProvider } from "./CaptchaProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CaptchaProvider>{children}</CaptchaProvider>
    </SessionProvider>
  );
}
