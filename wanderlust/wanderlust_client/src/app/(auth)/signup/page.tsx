import type { Metadata } from "next";
import { SignUpForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | Wanderlust",
  description: "Create your Wanderlust account and start your adventure.",
};

export default function SignUpPage() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-14 md:py-20">
      <h1 className="text-center text-4xl font-light tracking-[-0.02em] text-foreground sm:text-5xl">
        Create Account
      </h1>

      <p className="mt-3 text-center text-base text-muted-foreground">
        Start your adventure with Wanderlust
      </p>

      <SignUpForm className="mt-10 w-full max-w-[480px]" />
    </section>
  );
}
