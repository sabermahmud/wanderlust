"use client";

import { cn } from "cn";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

const fieldClassName = "h-10 bg-muted/40 pl-9";
const passwordFieldClassName = "h-10 bg-muted/40 pl-9 pr-9";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 shrink-0">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3.02h3.88c2.27-2.09 3.54-5.17 3.54-8.89z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54V6.64H1.29a12 12 0 0 0 0 10.72l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0 7.7 0 3.99 2.48 1.29 6.64l3.98 3.09C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
      {children}
    </span>
  );
}

function Field({
  id,
  label,
  children,
  className,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 block">
        {label}
      </Label>
      {children}
    </div>
  );
}

interface LoginFormProps {
  className?: string;
}

function LoginForm({ className }: LoginFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || isGoogleLoading) return;

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const rememberMe = formData.get("rememberMe") === "on";

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    authClient.signIn.email(
      { email, password, rememberMe },
      {
        onSuccess: () => {
          toast.success("Welcome back! You are now signed in.");
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(
            ctx.error.message || "Could not sign you in. Please try again.",
          );
          setIsSubmitting(false);
        },
      },
    );
  }

  async function handleGoogleSignIn() {
    if (isSubmitting || isGoogleLoading) return;

    setIsGoogleLoading(true);

    authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/",
      },
      {
        onError: (ctx) => {
          toast.error(
            ctx.error.message || "Google sign in failed. Please try again.",
          );
          setIsGoogleLoading(false);
        },
      },
    );
  }

  async function handleForgotPassword() {
    if (isSubmitting || isGoogleLoading || isForgotPasswordLoading) return;

    const email = emailInputRef.current?.value.trim() ?? "";

    if (!email) {
      toast.error("Enter your email address first, then request a reset link.");
      emailInputRef.current?.focus();
      return;
    }

    setIsForgotPasswordLoading(true);

    authClient.requestPasswordReset(
      { email },
      {
        onSuccess: () => {
          toast.success(
            "If this email exists in our system, a password reset link has been sent.",
          );
          setIsForgotPasswordLoading(false);
        },
        onError: (ctx) => {
          toast.error(
            ctx.error.message ||
              "Could not send the reset link. Please try again.",
          );
          setIsForgotPasswordLoading(false);
        },
      },
    );
  }

  return (
    <Card
      className={cn(
        "w-full rounded-2xl border-0 py-0 shadow-[0_4px_24px_rgba(0,0,0,0.06)] ring-0",
        className,
      )}
    >
      <CardContent className="px-6 py-8 sm:px-10">
        <form onSubmit={handleSubmit} aria-busy={isSubmitting} noValidate>
          <div className="space-y-5">
            <Field id="email" label="Email Address">
              <div className="relative">
                <FieldIcon>
                  <Mail className="size-4" aria-hidden="true" />
                </FieldIcon>
                <Input
                  id="email"
                  name="email"
                  ref={emailInputRef}
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  className={fieldClassName}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </Field>

            <Field id="password" label="Password">
              <div className="relative">
                <FieldIcon>
                  <LockKeyhole className="size-4" aria-hidden="true" />
                </FieldIcon>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={passwordFieldClassName}
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  disabled={isSubmitting}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </Field>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <label
              htmlFor="rememberMe"
              className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
            >
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                disabled={isSubmitting}
                className="size-4 rounded border-input accent-brand"
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={
                isSubmitting || isGoogleLoading || isForgotPasswordLoading
              }
              className="text-sm font-medium text-brand transition-colors hover:text-brand-hover disabled:opacity-50"
            >
              {isForgotPasswordLoading ? "Sending..." : "Forgot password?"}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isGoogleLoading}
            className="mt-6 h-11 w-full bg-brand text-base text-white hover:bg-brand-hover"
          >
            {isSubmitting && (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            )}
            Sign In
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">
            Or continue with
          </span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || isGoogleLoading}
          className="h-11 w-full text-base"
        >
          {isGoogleLoading ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Sign In With Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-brand transition-colors hover:text-brand-hover"
          >
            Sign Up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export { LoginForm };
