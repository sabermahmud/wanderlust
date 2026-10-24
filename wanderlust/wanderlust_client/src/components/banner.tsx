"use client";

import { cn } from "cn";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";

const searchFields = [
  { id: "location", label: "Location", placeholder: "Address, City Or Zip" },
  {
    id: "date-duration",
    label: "Date/Duration",
    placeholder: "Anytime/3 Days",
  },
  { id: "budget", label: "Budget", placeholder: "$0-$3000" },
  { id: "people", label: "People", placeholder: "5-10" },
];

const heroButtonClassName =
  "inline-flex h-12 items-center gap-2 rounded-md px-7 text-sm font-medium tracking-[0.06em] uppercase transition-colors";

function Banner() {
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section className="relative flex min-h-[calc(100svh_-_4rem)] flex-col overflow-hidden">
      <Image
        src="/assets/Banner.png"
        alt="Aerial view of a secluded bay with turquoise water surrounded by lush green hills"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
        <h1 className="font-heading text-[clamp(2.5rem,5.5vw,5rem)] leading-[1.1] font-extralight text-white">
          Discover Your
          <br />
          Next Adventure
        </h1>

        <p className="mt-5 max-w-[540px] text-[15px] leading-relaxed text-white/85 sm:text-base">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/destinations"
            className={cn(
              heroButtonClassName,
              "bg-brand text-white hover:bg-brand-hover",
            )}
          >
            Explore Now
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/destinations"
            className={cn(
              heroButtonClassName,
              "border border-white/25 bg-white/20 text-white backdrop-blur-sm hover:bg-white/30",
            )}
          >
            View Destination
          </Link>
        </div>
      </div>

      <form
        aria-label="Search destinations"
        onSubmit={handleSearch}
        className="relative flex w-full flex-col border-t border-white/20 bg-white/35 backdrop-blur-md md:flex-row"
      >
        {searchFields.map((field, index) => (
          <div
            key={field.id}
            className={cn(
              "flex-1 px-5 py-3",
              index > 0 && "border-t border-white/20 md:border-t-0 md:border-l",
            )}
          >
            <label
              htmlFor={field.id}
              className="block text-base font-medium text-white"
            >
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.id}
              type="text"
              placeholder={field.placeholder}
              autoComplete="off"
              className="mt-1 w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/75"
            />
          </div>
        ))}

        <button
          type="submit"
          className="flex h-12 shrink-0 items-center justify-center bg-brand px-8 text-lg font-medium text-white transition-colors hover:bg-brand-hover md:h-auto md:w-[200px]"
        >
          Search
        </button>
      </form>
    </section>
  );
}

export { Banner };
