"use client";

import { cn } from "cn";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarDays,
  Compass,
  Layers,
  LayoutDashboard,
  MapPin,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  RefreshCw,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { DestinationsData } from "@/app/all-destinations/page";
import { AuthContext, type Booking } from "@/app/context/AuthProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_BASE_URL = "http://localhost:5000";

const navigation = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Packages", href: "/all-destinations", icon: Package },
  { label: "Add Package", href: "/admin/packages/new", icon: Plus },
  { label: "Bookings", href: "/bookings", icon: CalendarDays },
];

function formatDeparture(value: string): string {
  if (!value) {
    return "Not set";
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return value;
  }

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPrice(price: string): string {
  if (!price) {
    return "—";
  }

  const numeric = Number(price);

  if (Number.isFinite(numeric)) {
    return `$${numeric.toLocaleString("en-US")}`;
  }

  return price.startsWith("$") ? price : `$${price}`;
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarProfile() {
  return (
    <div className="mt-auto p-4">
      <Separator className="mb-4" />
      <div className="flex items-center gap-3 rounded-xl p-2">
        <Avatar>
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">Administrator</p>
          <p className="truncate text-xs text-muted-foreground">
            admin@example.com
          </p>
        </div>
        <Settings className="size-4 text-muted-foreground" aria-hidden="true" />
      </div>
    </div>
  );
}

function SidebarBrand() {
  return (
    <div className="flex h-16 items-center gap-3 border-b px-6">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Compass className="size-5" aria-hidden="true" />
      </div>
      <div>
        <p className="font-bold tracking-tight">Travel Admin</p>
        <p className="text-xs text-muted-foreground">Management panel</p>
      </div>
    </div>
  );
}

interface StatCard {
  title: string;
  value: string;
  description: string;
  icon: typeof Package;
}

function StatsGrid({
  destinations,
  bookings,
}: {
  destinations: DestinationsData[];
  bookings: Booking[];
}) {
  const countries = new Set(
    destinations.map((destination) => destination.country).filter(Boolean),
  ).size;
  const categories = new Set(
    destinations.map((destination) => destination.category).filter(Boolean),
  ).size;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  const stats: StatCard[] = [
    {
      title: "Total Packages",
      value: String(destinations.length),
      description: `Across ${countries} ${countries === 1 ? "country" : "countries"}`,
      icon: Package,
    },
    {
      title: "Total Bookings",
      value: String(bookings.length),
      description:
        bookings.length === 0
          ? "No bookings yet"
          : `${pendingBookings} pending confirmation`,
      icon: CalendarDays,
    },
    {
      title: "Destinations",
      value: String(destinations.length),
      description: "Live travel packages on the platform",
      icon: MapPin,
    },
    {
      title: "Categories",
      value: String(categories),
      description: "Beach, Mountain, City and more",
      icon: Layers,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title} className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>

              <div className="mt-5">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

function PackagesSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"].map((key) => (
        <div
          key={key}
          className="flex animate-pulse items-center gap-4 rounded-lg border border-border p-3"
        >
          <div className="size-10 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-muted" />
            <div className="h-3 w-1/4 rounded bg-muted" />
          </div>
          <div className="h-5 w-16 rounded-full bg-muted" />
        </div>
      ))}
    </div>
  );
}

function PackagesTableCard({
  destinations,
  loading,
  error,
  onRetry,
}: {
  destinations: DestinationsData[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const recentPackages = destinations.slice(-5);

  return (
    <Card className="min-w-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Recent Packages</CardTitle>
          <CardDescription className="mt-1">
            Manage and monitor your travel packages.
          </CardDescription>
        </div>

        <Button
          variant="outline"
          size="sm"
          render={<Link href="/all-destinations" />}
        >
          View all
          <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <PackagesSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-10 text-center">
            <AlertTriangle
              className="size-8 text-destructive"
              aria-hidden="true"
            />
            <p className="font-medium">Could not load packages</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-1"
              onClick={onRetry}
            >
              <RefreshCw aria-hidden="true" />
              Try again
            </Button>
          </div>
        ) : recentPackages.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border px-4 py-10 text-center">
            <Package
              className="size-8 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="font-medium">No packages yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first travel package to see it here.
            </p>
            <Button
              size="sm"
              className="mt-1"
              render={<Link href="/admin/packages/new" />}
            >
              <Plus aria-hidden="true" />
              Add Package
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {recentPackages.map((pkg) => (
                  <TableRow key={pkg._id}>
                    <TableCell>
                      <div className="flex min-w-40 items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {pkg.imageUrl ? (
                            <Image
                              src={pkg.imageUrl}
                              alt={pkg.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-muted-foreground">
                              <MapPin className="size-4" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{pkg.name}</p>
                          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                            <MapPin className="size-3" aria-hidden="true" />
                            {pkg.country}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">{pkg.category || "—"}</Badge>
                    </TableCell>

                    <TableCell className="font-medium">
                      {formatPrice(pkg.price)}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {formatDeparture(pkg.departureDate)}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${pkg.name}`}
                            />
                          }
                        >
                          <MoreHorizontal
                            className="size-4"
                            aria-hidden="true"
                          />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            render={
                              <Link href={`/all-destinations/${pkg._id}`} />
                            }
                          >
                            View package
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            render={<Link href="/admin/packages/new" />}
                          >
                            Add similar package
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityPanel({ bookings }: { bookings: Booking[] }) {
  const recentBookings = [...bookings].reverse().slice(0, 3);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>The latest updates on your platform.</CardDescription>
      </CardHeader>

      <CardContent>
        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-border px-4 py-8 text-center">
            <CalendarDays
              className="size-8 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm font-medium">No activity yet</p>
            <p className="text-xs text-muted-foreground">
              New bookings will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {recentBookings.map((booking, index) => {
              const isConfirmed = booking.status === "Confirmed";

              return (
                <div key={booking.bookingId} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CalendarDays className="size-4" aria-hidden="true" />
                    </div>

                    {index !== recentBookings.length - 1 && (
                      <div className="mt-2 h-8 w-px bg-border" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 pb-1">
                    <p className="text-sm font-medium">New booking received</p>
                    <p className="mt-1 truncate text-xs leading-5 text-muted-foreground">
                      {booking.name} · Booking #{booking.bookingId}
                    </p>
                    <span
                      className={cn(
                        "mt-2 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                        isConfirmed
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700",
                      )}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Separator className="my-5" />

        <Button
          variant="outline"
          className="w-full"
          render={<Link href="/bookings" />}
        >
          View all activity
        </Button>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  const actions: {
    title: string;
    description: string;
    href: string;
    icon: typeof Package;
  }[] = [
    {
      title: "Create a package",
      description: "Add a new travel destination.",
      href: "/admin/packages/new",
      icon: Plus,
    },
    {
      title: "Manage bookings",
      description: "Review customer reservations.",
      href: "/bookings",
      icon: CalendarDays,
    },
    {
      title: "Browse destinations",
      description: "Explore all published packages.",
      href: "/all-destinations",
      icon: MapPin,
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">
          Common tasks to help you manage your platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link key={action.title} href={action.href}>
              <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/40">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="ml-auto size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function PageHeader({
  onOpenMenu,
  children,
}: {
  onOpenMenu: () => void;
  children?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
          onClick={onOpenMenu}
        >
          <Menu className="size-4" aria-hidden="true" />
        </Button>

        <div>
          <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Manage your travel platform
          </p>
        </div>
      </div>

      {children}
    </header>
  );
}

export default function AdminPage() {
  const auth = useContext(AuthContext);
  const [destinations, setDestinations] = useState<DestinationsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const bookings = auth?.booked ?? [];

  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/all-destinations`);

      if (!res.ok) {
        throw new Error("The server responded with an error.");
      }

      const data: DestinationsData[] = await res.json();
      setDestinations(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setDestinations([]);
      setError(
        fetchError instanceof Error && fetchError.message
          ? fetchError.message
          : "Unable to reach the server. Make sure the API is running.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <div className="flex min-h-screen">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 shrink-0 border-r bg-background lg:flex lg:flex-col">
          <SidebarBrand />

          <div className="px-4 py-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </p>
            <SidebarNav />
          </div>

          <SidebarProfile />
        </aside>

        {/* Sidebar (mobile) */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarBrand />
            </SheetHeader>

            <div className="px-4 py-6">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Workspace
              </p>
              <SidebarNav onNavigate={() => setMenuOpen(false)} />
            </div>

            <SidebarProfile />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <PageHeader onOpenMenu={() => setMenuOpen(true)}>
            <Button render={<Link href="/admin/packages/new" />}>
              <Plus className="mr-2 size-4" aria-hidden="true" />
              Add Package
            </Button>
          </PageHeader>

          <div className="mx-auto max-w-[1600px] space-y-8 p-4 sm:p-6 lg:p-8">
            {/* Welcome section */}
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="mb-2 text-sm font-medium text-primary">
                  YOUR WORKSPACE
                </p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome back, Admin 👋
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Here&apos;s what&apos;s happening with your platform today.
                </p>
              </div>

              <Button
                size="lg"
                className="h-10 bg-brand px-4 text-white hover:bg-brand-hover"
                render={<Link href="/admin/packages/new" />}
              >
                <Plus className="mr-2 size-4" aria-hidden="true" />
                Add New Package
              </Button>
            </section>

            {/* Statistics */}
            <StatsGrid destinations={destinations} bookings={bookings} />

            {/* Main dashboard grid */}
            <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
              <PackagesTableCard
                destinations={destinations}
                loading={loading}
                error={error}
                onRetry={fetchDestinations}
              />

              <ActivityPanel bookings={bookings} />
            </section>

            {/* Quick actions */}
            <QuickActions />

            <footer className="border-t pt-5 text-center text-xs text-muted-foreground">
              Admin Dashboard · Built with Next.js and shadcn/ui
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
