import type { Metadata } from "next";
import { googleEnabled } from "@/lib/auth";
import SignInForm from "@/components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Shiloh Transit to view and manage your bookings.",
};

export default function SignInPage() {
  return (
    <div className="section__container py-16">
      <SignInForm googleEnabled={googleEnabled} />
    </div>
  );
}
