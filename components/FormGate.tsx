"use client";

import { useEffect, useState } from "react";
import { Clock, Loader2 } from "lucide-react";

export type FormCategoryKey =
  | "registration"
  | "volunteer"
  | "partner"
  | "chapter"
  | "panchayat";

interface FormSettingsData {
  masterLive: boolean;
  registration: boolean;
  volunteer: boolean;
  partner: boolean;
  chapter: boolean;
  panchayat: boolean;
}

/**
 * Gates a public submission form behind the admin-controlled live/paused
 * flag (set from the Form Data tab). Renders children once confirmed live;
 * otherwise shows a "coming soon" notice instead of the form. The API route
 * behind the form enforces the same flag server-side, so this is only about
 * what visitors see, not the security boundary.
 */
export function FormGate({
  formKey,
  children,
}: {
  formKey: FormCategoryKey;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<FormSettingsData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/form-settings")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch(() => {
        if (!cancelled) setSettings(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (settings === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
      </div>
    );
  }

  if (settings.masterLive && settings[formKey]) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
        <Clock className="h-7 w-7" />
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        This form isn&apos;t open yet
      </h1>
      <p className="mt-3 max-w-md text-gray-600">
        We&apos;ll start accepting submissions here soon. Please check back
        shortly.
      </p>
    </div>
  );
}
