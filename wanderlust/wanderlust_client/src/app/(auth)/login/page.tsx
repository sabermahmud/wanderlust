import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login | Wanderlust",
  description: "Sign in to Wanderlust and resume your adventure.",
};

export default function LoginPage() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-14 md:py-20">
      <h1 className="text-center text-4xl font-light tracking-[-0.02em] text-foreground sm:text-5xl">
        Welcome Back
      </h1>

      <p className="mt-3 text-center text-base text-muted-foreground">
        Resume your adventure with Wanderlust
      </p>

      <LoginForm className="mt-10 w-full max-w-[480px]" />
    </section>
  );
}
