"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/form-resolver";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { LogIn, Chrome } from "lucide-react";
import { useCaptchaToken } from "./CaptchaProvider";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

function SignInInner({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const getToken = useCaptchaToken();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const callbackUrl = params.get("next") || "/my-bookings";

  const onSubmit = async (values: FormValues) => {
    setError("");
    setBusy(true);
    try {
      const captchaToken = await getToken("signin");
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        captchaToken,
        callbackUrl,
      });
      if (res?.error) {
        setError("Invalid email or password. Please try again.");
        setBusy(false);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-[460px] rounded-2xl border border-[#e5e7eb] bg-white p-7 shadow-[5px_5px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="mb-6 text-center">
        <span className="chip">Welcome back</span>
        <h1 className="mt-3 text-2xl font-bold">Sign in</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-light)" }}>
          Access your tickets and manage bookings
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <div className="field">
          <label htmlFor="signin-email">Email</label>
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email ? (
            <span className="error" role="alert">
              {errors.email.message}
            </span>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="signin-password">Password</label>
          <input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            {...register("password")}
          />
          {errors.password ? (
            <span className="error" role="alert">
              {errors.password.message}
            </span>
          ) : null}
        </div>

        {error ? (
          <p role="alert" className="text-sm" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        ) : null}

        <button className="btn" type="submit" disabled={busy}>
          <span className="inline-flex items-center justify-center gap-2">
            <LogIn size={17} aria-hidden="true" />
            {busy ? "Signing in..." : "Sign in"}
          </span>
        </button>
      </form>

      {googleEnabled ? (
        <>
          <div className="my-4 flex items-center gap-3 text-xs" style={{ color: "var(--text-light)" }}>
            <span className="h-px flex-1" style={{ backgroundColor: "#e5e7eb" }} />
            or
            <span className="h-px flex-1" style={{ backgroundColor: "#e5e7eb" }} />
          </div>
          <button
            type="button"
            className="btn w-full"
            style={{
              backgroundColor: "var(--white)",
              color: "var(--text-dark)",
              border: "1px solid var(--text-light)",
            }}
            onClick={() => signIn("google", { callbackUrl })}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Chrome size={17} aria-hidden="true" /> Continue with Google
            </span>
          </button>
        </>
      ) : null}

      <p className="mt-6 text-center text-sm" style={{ color: "var(--text-light)" }}>
        New to Shiloh Transit?{" "}
        <Link href="/auth/signup" style={{ color: "var(--primary-color)", fontWeight: 600 }}>
          Create an account
        </Link>
      </p>
      <p
        className="mt-3 rounded-lg p-2 text-center text-xs"
        style={{ backgroundColor: "var(--extra-light)", color: "var(--text-light)" }}
      >
        Demo account: passenger@shilohtransit.co.ke with password
        RideWithConfidence1!
      </p>
    </motion.div>
  );
}

export default function SignInForm({
  googleEnabled,
}: {
  googleEnabled: boolean;
}) {
  return (
    <Suspense fallback={null}>
      <SignInInner googleEnabled={googleEnabled} />
    </Suspense>
  );
}
