"use client";

import ServerErrorScreen from "@/components/ServerErrorScreen";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ServerErrorScreen onRetry={reset} />;
}
