// Start: Consolidated Multi-Tab Profile Manager (Phase 1 - Settings Overhaul)
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TabRail, { RailTab } from "@/components/ui/TabRail";
import NeonCard from "@/components/ui/NeonCard";
import NeonButton from "@/components/ui/NeonButton";
import ProfileStatusBadge from "@/components/ProfileStatusBadge";
import ProfileBioEditor from "@/components/ProfileBioEditor";
import SettingsTipping from "@/components/SettingsTipping";
import SettingsGithub from "@/components/SettingsGithub";
import SettingsNsfw from "@/components/SettingsNsfw";
import SettingsApiKey from "@/components/SettingsApiKey";
import SettingsDeleteAccount from "@/components/SettingsDeleteAccount";
import CustomDomainSetupForm from "@/components/CustomDomainSetupForm";
import AccessibilityMenu from "@/components/AccessibilityMenu";

type ThemeId = "space_neon" | "windows_gray" | "retro_matrix" | "neon_cyan" | "retro_orange";

const THEMES: { id: ThemeId; name: string; icon: string }[] = [
  { id: "space_neon", name: "Space Neon", icon: "🌌" },
  { id: "windows_gray", name: "Windows Gray", icon: "🪟" },
  { id: "retro_matrix", name: "Retro Matrix", icon: "💚" },
  { id: "neon_cyan", name: "Neon Cyan", icon: "🔵" },
  { id: "retro_orange", name: "Retro Orange", icon: "🧡" },
];

const SETTINGS_TABS: RailTab[] = [
  { id: "profile", label: "Profil", icon: "👤" },
  { id: "sites", label: "Laman", icon: "🌐" },
  { id: "tags", label: "Tag", icon: "🏷️" },
  { id: "custom_domain", label: "Domain", icon: "🔗" },
  { id: "tipping", label: "Derma", icon: "💖" },
  { id: "github", label: "GitHub", icon: "🐙" },
  { id: "api_key", label: "API Key", icon: "🔑" },
  { id: "nsfw", label: "NSFW", icon: "🔞" },
  { id: "delete", label: "Padam", icon: "⚠️" },
];

export default function SettingsHub({ username }: { username: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState<string>("profile");
  const [theme, setTheme] = useState<ThemeId>("space_neon");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState<"online" | "coding" | "makan">("online");
  const [tags, setTags] = useState<string[]>(["retro", "pixel"]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const t = searchParams?.get("tab");
    if (t && SETTINGS_TABS.some((x) => x.id === t)) setActive(t);
    const savedTheme = localStorage.getItem("background_theme") as ThemeId | null;
    if (savedTheme) setTheme(savedTheme);
    const savedBio = localStorage.getItem("user_bio");
    if (savedBio) setBio(savedBio);
    const savedStatus = localStorage.getItem("user_status") as "online" | "coding" | "makan" | null;
    if (savedStatus) setStatus(savedStatus);
  }, [searchParams]);

  const switchTab = (id: string) => {
    setActive(id);
    router.replace(`/settings/${username}?tab=${id}`, { scroll: false });
  };

  const addTag = () => {
    const v = tagInput.trim().toLowerCase();
    if (v && !tags.includes(v)) setTags([...tags, v]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  return (
    <main className="min-h-screen bg-[#060814] text-gray-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-pixel text-cyan-300 tracking-wide">Pengurus Profil</h1>
          <p className="text-sm text-gray-400 mt-1">Kelola {username} dalam satu pusat kawalan bersepadu.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:sticky md:top-20 md:self-start">
            <TabRail tabs={SETTINGS_TABS} active={active} onChange={switchTab} />
          </div>

          <div className="flex-1 min-w-0 space-y-4">
            {active === "profile" && (
              <>
                <NeonCard title="Aksesibiliti" icon="♿" accent="cyan">
                  <AccessibilityMenu />
                </NeonCard>
                <NeonCard title="Latar Belakang Tema" icon="🎨" accent="magenta">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {THEMES.map((th) => (
                      <button
                        key={th.id}
                        onClick={() => {
                          setTheme(th.id);
                          localStorage.setItem("background_theme", th.id);
                        }}
                        className={`rounded-md border p-3 text-center transition-all ${
                          theme === th.id
                            ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_12px_rgba(0,255,255,0.20)]"
                            : "border-white/5 hover:border-cyan-400/40"
                        }`}
                      >
                        <div className="text-2xl">{th.icon}</div>
                        <div className="font-pixel text-xs mt-1 text-gray-200">{th.name}</div>
                      </button>
                    ))}
                  </div>
                </NeonCard>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <NeonCard title="Status Langsung" icon="🟢" accent="volt">
                    <ProfileStatusBadge initialStatus={status} onStatusChange={(s) => { setStatus(s as "online" | "coding" | "makan"); localStorage.setItem("user_status", s); }} />
                  </NeonCard>
                  <NeonCard title="Bio Editor" icon="📝" accent="cyan">
                    <ProfileBioEditor initialBio={bio || "Saya warga kampung siber retro."} onBioChange={(b) => { setBio(b); localStorage.setItem("user_bio", b); }} />
                  </NeonCard>
                </div>
              </>
            )}

            {active === "sites" && (
              <NeonCard title="Laman & Domain" icon="🌐" accent="cyan">
                <SettingsGithub username={username} />
              </NeonCard>
            )}

            {active === "tags" && (
              <NeonCard title="Tag Komuniti" icon="🏷️" accent="magenta">
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-pink-400/40 bg-pink-500/10 px-3 py-1 text-xs text-pink-200">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="text-pink-300 hover:text-white">✕</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    placeholder="Tambah tag..."
                    className="retro-input flex-1 rounded-md bg-[#0e1330] border border-cyan-500/30 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-400"
                  />
                  <NeonButton size="sm" variant="secondary" onClick={addTag}>Tambah</NeonButton>
                </div>
              </NeonCard>
            )}

            {active === "custom_domain" && (
              <NeonCard title="Persediaan Domain Tersuai" icon="🔗" accent="volt">
                <CustomDomainSetupForm residentUsername={username} />
              </NeonCard>
            )}

            {active === "tipping" && (
              <NeonCard title="Penyokong & Derma" icon="💖" accent="magenta">
                <SettingsTipping />
              </NeonCard>
            )}

            {active === "github" && (
              <NeonCard title="Sambungan GitHub" icon="🐙" accent="cyan">
                <SettingsGithub username={username} />
              </NeonCard>
            )}

            {active === "api_key" && (
              <NeonCard title="Kunci API" icon="🔑" accent="volt">
                <SettingsApiKey />
              </NeonCard>
            )}

            {active === "nsfw" && (
              <NeonCard title="Kawalan NSFW" icon="🔞" accent="magenta">
                <SettingsNsfw />
              </NeonCard>
            )}

            {active === "delete" && (
              <NeonCard title="Padam Akaun" icon="⚠️" accent="magenta">
                <SettingsDeleteAccount />
              </NeonCard>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
// End: Consolidated Multi-Tab Profile Manager