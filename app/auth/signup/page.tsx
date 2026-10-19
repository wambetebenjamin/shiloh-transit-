import type { Metadata } from "next";
import { googleEnabled } from "@/lib/auth";
import SignUpForm from "@/components/SignUpForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a Shiloh Transit account to book seats and manage tickets.",
};

export default function SignUpPage() {
  return (
    <div className="section__container py-16">
      <SignUpForm googleEnabled={googleEnabled} />
    </div>
  );
}
