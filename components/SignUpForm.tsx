"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/form-resolver";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { UserPlus, Chrome } from "lucide-react";
import { useCaptchaToken } from "./CaptchaProvider";

const schema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function SignUpForm({
  googleEnabled,
}: {
  googleEnabled: boolean;
}) {
  const router = useRouter();
  const getToken = useCaptchaToken();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setError("");
    setBusy(true);
    try {
      const captchaToken = await getToken("signup");
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          captchaToken,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not create your account.");
        setBusy(false);
        return;
      }
      const login = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (login?.error) {
        router.push("/auth/signin");
        return;
      }
      router.push("/my-bookings");
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
        <span className="chip">Join Shiloh Transit</span>
        <h1 className="mt-3 text-2xl font-bold">Create account</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-light)" }}>
          Book faster and keep every ticket in one place
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <div className="field">
          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="As printed on your ID"
            {...register("name")}
          />
          {errors.name ? (
            <span className="error" role="alert">
              {errors.name.message}
            </span>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
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
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...register("password")}
          />
          {errors.password ? (
            <span className="error" role="alert">
              {errors.password.message}
            </span>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="signup-confirm">Confirm password</label>
          <input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            {...register("confirm")}
          />
          {errors.confirm ? (
            <span className="error" role="alert">
              {errors.confirm.message}
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
            <UserPlus size={17} aria-hidden="true" />
            {busy ? "Creating account..." : "Create account"}
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
            onClick={() => signIn("google", { callbackUrl: "/my-bookings" })}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Chrome size={17} aria-hidden="true" /> Continue with Google
            </span>
          </button>
        </>
      ) : null}

      <p className="mt-6 text-center text-sm" style={{ color: "var(--text-light)" }}>
        Already have an account?{" "}
        <Link href="/auth/signin" style={{ color: "var(--primary-color)", fontWeight: 600 }}>
          Sign in
        </Link>
      </p>
      <p
        className="mt-3 rounded-lg p-2 text-center text-xs"
        style={{ backgroundColor: "var(--extra-light)", color: "var(--text-light)" }}
      >
        Protected by Google reCAPTCHA v3.
      </p>
    </motion.div>
  );
}
