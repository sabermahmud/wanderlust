import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Cta() {
  return (
    <section className="relative isolate flex min-h-[458px] items-center justify-center overflow-hidden px-6 py-20">
      {/* Background image */}
      <Image
        src="/assets/CTA.png"
        alt="Aerial view of a plane flying over a tropical island"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 -z-10 bg-linear-to-b from-black/80 via-black/45 to-black/80"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="mx-auto w-full max-w-300 text-center">
        <h2 className="text-4xl leading-[1.1] font-light tracking-[-0.04em] text-white sm:text-5xl lg:text-[56px]">
          Ready To Start Your Journey?
        </h2>

        <p className="mt-5 text-base font-normal text-white/95 sm:text-lg">
          Join thousands of travelers who have discovered the world with us
        </p>

        <Link
          href="/destinations"
          className="mt-11 inline-flex min-h-14.5 items-center justify-center gap-6 bg-white px-6 py-4 text-sm font-medium uppercase text-neutral-950 transition-colors hover:bg-neutral-200 sm:px-7"
        >
          Book Your Trip Today
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export { Cta };