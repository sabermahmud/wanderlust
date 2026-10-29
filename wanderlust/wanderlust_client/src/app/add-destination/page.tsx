import type { Metadata } from "next";
import { AddPackageForm } from "@/components/add-package-form";

export const metadata: Metadata = {
  title: "Add New Travel Package",
  description: "Create and publish a new travel package for Wanderlust.",
};

export default function AddDestinationPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
      <h1 className="text-4xl font-light tracking-[-0.02em] text-foreground sm:text-5xl">
        Add New Travel Package
      </h1>

      <div className="mx-auto mt-10 w-full max-w-3xl rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <AddPackageForm />
      </div>
    </section>
  );
}
