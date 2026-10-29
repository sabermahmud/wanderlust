"use client";

import { cn } from "cn";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

const fieldClassName = "h-10 bg-muted/40 pl-9";
const passwordFieldClassName = "h-10 bg-muted/40 pl-9 pr-9";
const MIN_PASSWORD_LENGTH = 8;

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

interface SignUpFormProps {
  className?: string;
}

function SignUpForm({ className }: SignUpFormProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting || isGoogleLoading) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    authClient.signUp.email(
      { name, email, password },
      {
        onSuccess: () => {
          toast.success("Account created successfully! Welcome aboard.");
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(
            ctx.error.message || "Could not create your account. Try again.",
          );
          setIsSubmitting(false);
        },
      },
    );
  }

  async function handleGoogleSignUp() {
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
            ctx.error.message || "Google sign up failed. Please try again.",
          );
          setIsGoogleLoading(false);
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
            <Field id="name" label="Full Name">
              <div className="relative">
                <FieldIcon>
                  <UserRound className="size-4" aria-hidden="true" />
                </FieldIcon>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  autoComplete="name"
                  maxLength={120}
                  className={fieldClassName}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </Field>

            <Field id="email" label="Email Address">
              <div className="relative">
                <FieldIcon>
                  <Mail className="size-4" aria-hidden="true" />
                </FieldIcon>
                <Input
                  id="email"
                  name="email"
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
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
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

            <Field id="confirmPassword" label="Confirm Password">
              <div className="relative">
                <FieldIcon>
                  <LockKeyhole className="size-4" aria-hidden="true" />
                </FieldIcon>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  minLength={MIN_PASSWORD_LENGTH}
                  className={passwordFieldClassName}
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  disabled={isSubmitting}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </Field>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isGoogleLoading}
            className="mt-6 h-11 w-full bg-brand text-base text-white hover:bg-brand-hover"
          >
            {isSubmitting && (
              <LoaderCircle aria-hidden="true" className="animate-spin" />
            )}
            Create Account
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">Or sign up with</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignUp}
          disabled={isSubmitting || isGoogleLoading}
          className="h-11 w-full text-base"
        >
          {isGoogleLoading ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Sign Up With Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-brand transition-colors hover:text-brand-hover"
          >
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export { SignUpForm };
