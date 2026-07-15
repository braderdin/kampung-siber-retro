// Start: Kampung Siber Retro — Guided Landing Page (Server Component)
import Link from "next/link";
import InteractiveBackground from "@/components/InteractiveBackground";

export const metadata = {
  title: "Kampung Siber Retro — Kampung Digital Wargalaya",
  description:
    "Platform komuniti retro moden: bina laman HTML & CSS anda sendiri, eksplor arcade, muzium siber, dan berinteraksi dengan wargalaya kampung.",
  openGraph: {
    title: "Kampung Siber Retro",
    description: "Kampung digital wargalaya — bebas algoritma, bebas iklan.",
  },
};

interface CategoryTile {
  href: string;
  icon: string;
  title: string;
  blurb: string;
  accent: string;
}

// Start: Primary navigation tiles (real routes confirmed in src/app)
const CATEGORIES: CategoryTile[] = [
  {
    href: "/town-hall",
    icon: "🏛️",
    title: "Balai Raya",
    blurb: "Acara komuniti, pengumuman & kalender kampung.",
    accent: "from-emerald-500/20 to-teal-500/20 border-cyan-500/30",
  },
  {
    href: "/asset-store",
    icon: "💎",
    title: "Kedai Runcit",
    blurb: "Muat turun aset-retro & kod untuk projek anda.",
    accent: "from-purple-500/20 to-indigo-500/20 border-fuchsia-500/30",
  },
  {
    href: "/cyber-museum",
    icon: "🖥️",
    title: "Muzium Siber",
    blurb: "Arkib khazanah warisan internet 56k & mIRC.",
    accent: "from-sky-500/20 to-blue-500/20 border-sky-500/30",
  },
  {
    href: "/arcade",
    icon: "🕹️",
    title: "Arcade",
    blurb: "Mainkan minigame retro & lihat papan pendahulu.",
    accent: "from-orange-500/20 to-amber-500/20 border-orange-500/30",
  },
  {
    href: "/browse",
    icon: "🛒",
    title: "Lihat Sumber",
    blurb: "Terokai tutorial, templat & projek wargalaya.",
    accent: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  },
  {
    href: "/docs",
    icon: "📚",
    title: "Dokumentasi",
    blurb: "Panduan bina laman & rujukan API kampung.",
    accent: "from-lime-500/20 to-green-500/20 border-lime-500/30",
  },
  {
    href: "/bulletin",
    icon: "📌",
    title: "Papan Buletin",
    blurb: "Baca dan siar nota komuniti terkini.",
    accent: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  },
  {
    href: "/guestbook",
    icon: "✍️",
    title: "Buku Pelawat",
    blurb: "Tinggalkan jejak & sapa wargalaya lain.",
    accent: "from-cyan-500/20 to-teal-500/20 border-cyan-500/30",
  },
];
// End: Primary navigation tiles

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <InteractiveBackground />

      {/* Start: Hero Section */}
      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 pt-20 pb-12 text-center sm:pt-28">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-[#0e1330]/70 px-4 py-1.5 text-xs font-pixel text-cyan-300">
          ⚡ BEBASS ALGORITMA · BEBASS IKLAN
        </span>
        <h1 className="text-4xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-cyan-300 pixel-font sm:text-6xl">
          Kampung Siber Retro
        </h1>
        <p className="mt-5 max-w-2xl text-base text-gray-300 dark:text-gray-400 sm:text-lg">
          Selamat datang ke kampung digital wargalaya. Bina laman HTML & CSS
          anda sendiri secara percuma, main arcade, jelajah muzium siber, dan
          berinteraksi dengan penduduk kampung — tanpa algoritma yang menyekat.
        </p>

        {/* Start: Primary CTA */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signin"
            className="min-h-[44px] inline-flex items-center justify-center rounded-md border border-cyan-400/50 bg-cyan-500/20 px-6 py-3 text-sm font-bold text-cyan-200 shadow-[0_0_18px_rgba(0,255,255,0.25)] transition hover:bg-cyan-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            🚀 Mulakan Di Sini
          </Link>
          <Link
            href="/docs"
            className="min-h-[44px] inline-flex items-center justify-center rounded-md border border-fuchsia-400/40 bg-fuchsia-500/10 px-6 py-3 text-sm font-bold text-fuchsia-200 transition hover:bg-fuchsia-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
          >
            📖 Baca Panduan
          </Link>
        </div>
        {/* End: Primary CTA */}
      </section>
      {/* End: Hero Section */}

      {/* Start: Category Grid */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-100 pixel-font">
          🗺️ Ke Mana Nak Pergi?
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`group flex flex-col rounded-xl border bg-gradient-to-br ${cat.accent} p-5 backdrop-blur-md transition hover:-translate-y-1 hover:shadow-[0_0_22px_rgba(0,255,255,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300`}
            >
              <span className="text-4xl">{cat.icon}</span>
              <h3 className="mt-3 text-lg font-bold text-gray-100 pixel-font">
                {cat.title}
              </h3>
              <p className="mt-1 text-sm text-gray-300/90 dark:text-gray-400">
                {cat.blurb}
              </p>
              <span className="mt-4 text-xs font-pixel text-cyan-300 opacity-0 transition group-hover:opacity-100">
                MASUK →
              </span>
            </Link>
          ))}
        </div>
      </section>
      {/* End: Category Grid */}
    </main>
  );
}
// End: Kampung Siber Retro — Guided Landing Page