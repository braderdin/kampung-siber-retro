// Start: Dynamic Username Settings Route (consolidated SettingsHub)
"use client";

import { Suspense, use } from "react";
import SettingsHub from "@/components/SettingsHub";

export default function SettingsProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060814] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400" /></div>}>
      <SettingsHub username={username} />
    </Suspense>
  );
}
// End: Dynamic Username Settings Route
