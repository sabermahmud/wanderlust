
"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  Camera,
  Check,
  Compass,
  DollarSign,
  Globe2,
  LoaderCircle,
  MapPin,
  Pencil,
  Plane,
  TrendingUp,
  X,
} from "lucide-react";

interface ProfileForm {
  name: string;
  location: string;
  nationality: string;
}

const initialStats = [
  {
    label: "Total Bookings",
    value: "12",
    icon: Plane,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    label: "Countries Visited",
    value: "18",
    icon: Globe2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Upcoming Trips",
    value: "2",
    icon: TrendingUp,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    label: "Total Spent",
    value: "$15,750",
    icon: DollarSign,
    color: "text-fuchsia-600",
    bg: "bg-fuchsia-50",
  },
];

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<ProfileForm>({
    name: user?.name ?? "",
    location: "",
    nationality: "",
  });

  const [savedProfile, setSavedProfile] =
    useState<ProfileForm | null>(null);

  const [avatar, setAvatar] = useState<string | null>(null);

  const currentProfile = savedProfile ?? {
    name: user?.name ?? "Traveler",
    location: "",
    nationality: "",
  };

  function handleEdit() {
    setProfile({
      ...currentProfile,
    });
    setIsEditing(true);
  }

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSavedProfile({ ...profile });
    setIsEditing(false);
  }

  function handleCancel() {
    setProfile({ ...currentProfile });
    setIsEditing(false);
  }

  function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(file);
  }

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50">
            <Compass className="h-8 w-8 text-cyan-600" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            Sign in to view your profile
          </h1>

          <p className="mt-2 text-gray-500">
            Your travel profile and account information will appear here.
          </p>

          <a
            href="/login"
            className="mt-6 inline-flex items-center justify-center bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-700"
          >
            Sign in
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-10">
          <h1 className="text-4xl font-normal tracking-tight text-gray-950 sm:text-5xl">
            My Profile
          </h1>

          <p className="mt-3 text-base text-gray-500 sm:text-lg">
            Manage your account settings and travel preferences
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* Profile card */}
          <section className="border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col items-center text-center">
              <div className="group relative">
                <div className="h-36 w-36 overflow-hidden rounded-full bg-gray-100">
                  {avatar || user.image ? (
                    <img
                      src={avatar || user.image || ""}
                      alt={currentProfile.name || "Profile picture"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-cyan-50 text-4xl font-semibold text-cyan-700">
                      {(currentProfile.name || "T")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                <label
                  htmlFor="profile-avatar"
                  className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-cyan-600 text-white transition hover:bg-cyan-700"
                  title="Change profile picture"
                >
                  <Camera className="h-5 w-5" />
                </label>

                <input
                  id="profile-avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900">
                {currentProfile.name || "Traveler"}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {user.email}
              </p>

              {currentProfile.location && (
                <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {currentProfile.location}
                </p>
              )}
            </div>

            <div className="my-6 border-t border-gray-100" />

            {/* Profile details */}
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Member since
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "short", year: "numeric" },
                      )
                    : "Member"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Nationality
                </span>

                <span className="text-right text-sm font-semibold text-gray-900">
                  {currentProfile.nationality || "Not specified"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEdit}
              className="mt-7 flex w-full items-center justify-center gap-2 bg-cyan-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </button>
          </section>

          {/* Travel statistics */}
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50">
                <Compass className="h-5 w-5 text-cyan-600" />
              </div>

              <div>
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                  Travel Statistics
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  An overview of your travel activity
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {initialStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article
                    key={stat.label}
                    className="flex min-h-[104px] items-center justify-between gap-4 border border-gray-100 bg-white px-5 py-5 shadow-sm transition hover:border-cyan-100 hover:shadow-md sm:px-6"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500">
                        {stat.label}
                      </p>

                      <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${stat.bg}`}
                    >
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Additional section */}
            <div className="mt-8 border border-gray-100 p-6 shadow-sm sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-50">
                  <Globe2 className="h-6 w-6 text-cyan-600" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your next adventure awaits
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Discover new destinations, plan your next getaway,
                    and keep all your travel experiences in one place.
                  </p>

                  <a
                    href="/all-destinations"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition hover:text-cyan-900"
                  >
                    Explore destinations
                    <TrendingUp className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Edit profile dialog */}
        {isEditing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
            onClick={handleCancel}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-profile-title"
              className="my-auto w-full max-w-lg bg-white p-6 shadow-xl sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="edit-profile-title"
                    className="text-2xl font-semibold text-gray-900"
                  >
                    Edit Profile
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Update your personal and travel details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  aria-label="Close edit profile"
                  className="p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full name
                  </label>

                  <input
                    id="profile-name"
                    type="text"
                    required
                    maxLength={100}
                    value={profile.name}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        name: event.target.value,
                      })
                    }
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>

                  <input
                    id="profile-email"
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full cursor-not-allowed border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Your email is managed by your authentication account.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="profile-location"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>

                  <input
                    id="profile-location"
                    type="text"
                    maxLength={100}
                    placeholder="e.g. San Francisco, CA"
                    value={profile.location}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        location: event.target.value,
                      })
                    }
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-nationality"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Nationality
                  </label>

                  <input
                    id="profile-nationality"
                    type="text"
                    maxLength={100}
                    placeholder="e.g. Bangladeshi"
                    value={profile.nationality}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        nationality: event.target.value,
                      })
                    }
                    className="w-full border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
                  >
                    <Check className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
