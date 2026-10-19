import type { Metadata } from "next";
import ServerErrorScreen from "@/components/ServerErrorScreen";

export const metadata: Metadata = {
  title: "Server Error",
  description: "Something went wrong on our end. Please try again.",
};

export default function ServerErrorPage() {
  return <ServerErrorScreen />;
}
