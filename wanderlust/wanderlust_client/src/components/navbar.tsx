"use client";

import { useSession } from "@/lib/auth-client";
import { cn } from "cn";
import { UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/all-destinations" },
  { label: "My Bookings", href: "/bookings" },
  { label: "Admin", href: "/admin" },
];

const accountLinks = [
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

function Navbar() {
  const pathname = usePathname();
  const {data:session} = useSession();
  const user = session?.user;
  console.log(user)

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-background">
      <nav
        aria-label="Main"
        className="relative mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-5 md:px-8"
      >
        <ul className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-[15px] transition-colors",
                    isActive
                      ? "font-medium text-brand underline decoration-brand decoration-2 underline-offset-4"
                      : "text-foreground hover:text-brand",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/"
          aria-label="Wanderlast home"
          className="md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          <Image
            src="/assets/Wanderlast.png"
            alt="Wanderlast"
            width={162}
            height={24}
            priority
            className="h-5 w-auto md:h-6"
          />
        </Link>

        <ul className="flex items-center gap-4 md:gap-6 lg:gap-7">
          <li>
            <Link
              href="/profile"
              className="flex items-center gap-1.5 text-[15px] text-foreground transition-colors hover:text-brand"
            >
              <UserRound className="size-4" aria-hidden />
              {
                !user ? <span className="hidden sm:inline">Profile</span> : user.name
              }
              
            </Link>
          </li>
          {accountLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[15px] text-foreground transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export { Navbar };
