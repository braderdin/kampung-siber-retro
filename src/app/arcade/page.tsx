// Start: Arcade Portal Hub (Kampung Siber Retro-Modern)
import Link from "next/link";

interface ArcadeGame {
  slug: string;
  title: string;
  taglineMs: string;
  taglineEn: string;
  blurbMs: string;
  blurbEn: string;
  icon: string;
  accent: "cyan" | "magenta" | "volt";
  terminal: string;
}

// Start: Curated Sub-Game Registry
const ARCADE_GAMES: ArcadeGame[] = [
  {
    slug: "retro-pong",
    title: "Retro Pong",
    taglineMs: "Paddle Neon Klasik",
    taglineEn: "Classic Neon Paddle",
    blurbMs:
      "Main semula legenda 1972 dengan halaju bola kinetik dan kesan cahaya siber. Uji refleks anda menentang AI kampung.",
    blurbEn:
      "Replay the 1972 legend with kinetic ball velocity and cyber light trails. Test your reflexes against the village AI.",
    icon: "🏓",
    accent: "cyan",
    terminal: "> ./launch retro-pong --mode=neon",
  },
  {
    slug: "retro-snake",
    title: "Retro Snake",
    taglineMs: "Ular Volt Pixel",
    taglineEn: "Volt Pixel Serpent",
    blurbMs:
      "Kawal ular pixel yang membesar setiap kali memakan data. Elak tembok grid dan ekor sendiri untuk skor maksimum.",
    blurbEn:
      "Pilot a pixel serpent that grows with every data pellet. Dodge the grid walls and your own tail for a top score.",
    icon: "🐍",
    accent: "volt",
    terminal: "> ./launch retro-snake --mode=volt",
  },
];
// End: Curated Sub-Game Registry

// Start: Accent Map (Kampung Siber Brand Variables)
const ACCENT_MAP: Record<
  ArcadeGame["accent"],
  { border: string; glow: string; text: string; chip: string }
> = {
  cyan: {
    border: "border-[#00ffff]/50",
    glow: "hover:shadow-[0_0_28px_rgba(0,255,255,0.45)]",
    text: "text-[#00ffff]",
    chip: "bg-[#00ffff]/10 text-[#00ffff]",
  },
  magenta: {
    border: "border-[#ff007f]/50",
    glow: "hover:shadow-[0_0_28px_rgba(255,0,127,0.45)]",
    text: "text-[#ff007f]",
    chip: "bg-[#ff007f]/10 text-[#ff007f]",
  },
  volt: {
    border: "border-[#aaff00]/50",
    glow: "hover:shadow-[0_0_28px_rgba(170,255,0,0.45)]",
    text: "text-[#aaff00]",
    chip: "bg-[#aaff00]/10 text-[#aaff00]",
  },
};
// End: Accent Map

export default function ArcadePortalPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060814] text-gray-100">
      {/* Start: Pitch-Black Grid Canvas */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(255,0,127,0.18), transparent 60%), radial-gradient(circle at 80% 80%, rgba(0,255,255,0.12), transparent 55%)",
        }}
        aria-hidden
      />
      {/* End: Pitch-Black Grid Canvas */}

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Start: Portal Header */}
        <header className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#ff007f]/40 bg-[#ff007f]/10 px-4 py-1 text-xs font-pixel tracking-widest text-[#ff007f]">
            <span className="text-sm">🕹️</span> ARCADE.SIBER
          </div>
          <h1 className="font-pixel text-4xl font-bold text-white drop-shadow-[0_0_18px_rgba(0,255,255,0.55)] sm:text-5xl">
            Dewan <span className="text-[#00ffff]">Arcade</span> Kampung
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-pixel text-sm text-gray-400">
            Hab utama permainan retro. Pilih satu terminal di bawah untuk
            melancarkan sub-permainan yang sedang aktif.
          </p>
        </header>
        {/* End: Portal Header */}

        {/* Start: Game Grid */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {ARCADE_GAMES.map((game) => {
            const a = ACCENT_MAP[game.accent];
            return (
              <Link
                key={game.slug}
                href={`/arcade/${game.slug}`}
                className={`group relative flex flex-col rounded-2xl border ${a.border} bg-[#0e1330]/80 p-6 backdrop-blur-sm transition-all duration-300 ${a.glow} hover:-translate-y-1`}
              >
                {/* Start: Terminal Micro-Copy */}
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`rounded px-2 py-1 font-pixel text-[10px] tracking-wider ${a.chip}`}
                  >
                    STATUS: AKTIF
                  </span>
                  <span className="font-pixel text-[10px] text-gray-500">
                    {game.terminal}
                  </span>
                </div>
                {/* End: Terminal Micro-Copy */}

                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border ${a.border} text-4xl`}
                  >
                    {game.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-pixel text-2xl font-bold text-white">
                      {game.title}
                    </h2>
                    <p className={`font-pixel text-xs ${a.text}`}>
                      {game.taglineMs} · {game.taglineEn}
                    </p>
                  </div>
                </div>

                <p className="mt-4 font-pixel text-sm leading-relaxed text-gray-300">
                  {game.blurbMs}
                </p>
                <p className="mt-2 font-pixel text-xs leading-relaxed text-gray-500">
                  {game.blurbEn}
                </p>

                {/* Start: Launch CTA */}
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="font-pixel text-xs text-gray-400">
                    /arcade/{game.slug}
                  </span>
                  <span
                    className={`font-pixel text-sm font-bold ${a.text} transition-transform group-hover:translate-x-1`}
                  >
                    LANCAR →
                  </span>
                </div>
                {/* End: Launch CTA */}
              </Link>
            );
          })}
        </section>
        {/* End: Game Grid */}

        {/* Start: Footer Note */}
        <footer className="mt-12 text-center font-pixel text-[10px] text-gray-600">
          KAMPUNG SIBER RETRO · ARCADE MODULE v1.0 · {">"} ALL SYSTEMS NOMINAL
        </footer>
        {/* End: Footer Note */}
      </div>
    </main>
  );
}
// End: Arcade Portal Hub (Kampung Siber Retro-Modern)