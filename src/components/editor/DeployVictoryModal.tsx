// Start: Neon Victory Deployment Modal (Teratak Siber Live Success)
// Jaw-dropping responsive neon modal shown after a successful R2 deploy.
"use client";

import { useEffect, useState } from "react";

interface DeployVictoryModalProps {
  open: boolean;
  siteUrl: string | null;
  profileUpdated: boolean;
  onClose: () => void;
}

// Start: Neon label set (Formal Bahasa Malaysia / Melayu)
const L = {
  titleFlash: "Teratak Siber Anda Berjaya Diterbitkan!",
  subtitle: "Laman cyber-village anda kini hidup di produksi.",
  liveLabel: "Pautan Langsung Produksi",
  copy: "Salin Pautan",
  copied: "Pautan disalin ke papan klip!",
  open: "Buka Laman",
  close: "Tutup",
  shareHint: "Kongsi kad ini dengan rakan Siber anda.",
  noUrl: "Pautan sedang diproses — sila semak status terbitan.",
};
// End: Neon label set

// Start: Synthwave Neon Confetti Particle Set (deterministic — zero hydration drift)
// Colors strictly conform to the Cyber-Village protocol:
//  - Synthwave Magenta: #ff007f
//  - Cyber Neon Cyan:    #00ffff
//  - Retro Volt Green:   #aaff00
const NEON_COLORS = ["#ff007f", "#00ffff", "#aaff00"] as const;

interface ConfettiParticle {
  left: number; // vw percentage start
  delay: number; // s
  duration: number; // s
  color: string;
  size: number; // px
  rotate: number; // deg drift
}

// Precomputed particle field (no Math.random at render) so SSR + client match.
const CONFETTI_PARTICLES: ConfettiParticle[] = Array.from({ length: 28 }, (_, i) => {
  const seeded = (i * 9301 + 49297) % 233280; // deterministic pseudo-seed
  const r1 = (seeded / 233280);
  const r2 = ((seeded * 7 + 13) % 233280) / 233280;
  const r3 = ((seeded * 11 + 29) % 233280) / 233280;
  return {
    left: Math.round(r1 * 100),
    delay: +(r2 * 1.4).toFixed(2),
    duration: +(2.4 + r3 * 1.8).toFixed(2),
    color: NEON_COLORS[i % NEON_COLORS.length],
    size: 6 + Math.round(r3 * 6),
    rotate: Math.round(r1 * 360),
  };
});
// End: Synthwave Neon Confetti Particle Set

export default function DeployVictoryModal({
  open,
  siteUrl,
  profileUpdated,
  onClose,
}: DeployVictoryModalProps) {
  const [copied, setCopied] = useState(false);

  // Start: Reset copy state whenever modal opens
  useEffect(() => {
    if (open) setCopied(false);
  }, [open]);
  // End: Reset copy state

  // Start: Escape key closes modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  // End: Escape key closes modal

  if (!open) return null;

  // Start: Scoped Neon Confetti Style Block (self-contained, zero layout shift)
  const confettiStyleId = "neon-confetti-anim";
  // End: Scoped Neon Confetti Style Block

  // Start: Copy to clipboard handler
  const handleCopy = async () => {
    if (!siteUrl) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(siteUrl);
      } else {
        const ta = document.createElement("textarea");
        ta.value = siteUrl;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(false);
    }
  };
  // End: Copy to clipboard handler

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={L.titleFlash}
      onClick={onClose}
    >
      {/* Start: Neon Confetti Overlay (pointer-events disabled, GPU-transformed) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
        aria-hidden="true"
      >
        {CONFETTI_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="neon-confetti-particle absolute top-[-24px] block rounded-[2px]"
            style={{
              left: `${p.left}vw`,
              width: `${p.size}px`,
              height: `${p.size * 1.6}px`,
              background: p.color,
              boxShadow: `0 0 8px ${p.color}, 0 0 14px ${p.color}`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              ["--neon-rotate" as string]: `${p.rotate}deg`,
            }}
          />
        ))}
      </div>
      {/* End: Neon Confetti Overlay */}

      {/* Start: Scoped Keyframes (injected once per render, deduped by id) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
#${confettiStyleId} {}
@keyframes neon-confetti-fall {
  0%   { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 0; }
  10%  { opacity: 1; }
  100% { transform: translate3d(0, 110vh, 0) rotate(var(--neon-rotate, 360deg)); opacity: 0; }
}
.neon-confetti-particle {
  animation-name: neon-confetti-fall;
  animation-timing-function: cubic-bezier(0.37, 0, 0.63, 1);
  animation-iteration-count: infinite;
  will-change: transform, opacity;
}
@media (prefers-reduced-motion: reduce) {
  .neon-confetti-particle { animation: none; opacity: 0; }
}
`,
        }}
      />
      {/* End: Scoped Keyframes */}

      {/* Start: Modal Card Frame (Share Card Design) */}
      <div
        className="relative z-20 w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#060814] p-6 shadow-[0_0_60px_rgba(0,255,255,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Start: Neon flash indicator */}
        <div className="mb-4 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-pink-500/60 bg-pink-500/10 shadow-[0_0_30px_rgba(255,0,127,0.6)]">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="animate-pulse text-base font-bold text-pink-400 drop-shadow-[0_0_10px_rgba(255,0,127,0.8)] sm:text-lg">
            {L.titleFlash}
          </h2>
          <p className="mt-1 text-[11px] text-cyan-300/70 sm:text-xs">{L.subtitle}</p>
          {profileUpdated && (
            <p className="mt-1 text-[10px] text-green-300/80">✓ Profil diurnal dikemas kini</p>
          )}
        </div>
        {/* End: Neon flash indicator */}

        {/* Start: Share card frame */}
        <div className="rounded-xl border border-cyan-500/30 bg-[#0a0e1f] p-4">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-cyan-400/70">
            {L.liveLabel}
          </p>
          <div className="break-all rounded-md border border-pink-500/30 bg-black/40 px-3 py-2 font-mono text-[12px] text-cyan-200">
            {siteUrl || L.noUrl}
          </div>
          {siteUrl && (
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block rounded-md bg-cyan-500 px-4 py-2 text-center text-xs font-bold text-black shadow-[0_0_18px_rgba(0,255,255,0.5)] transition hover:bg-cyan-400"
            >
              {L.open}
            </a>
          )}
          <p className="mt-3 text-center text-[10px] text-cyan-300/50">{L.shareHint}</p>
        </div>
        {/* End: Share card frame */}

        {/* Start: Action row */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleCopy}
            disabled={!siteUrl}
            className="rounded-md bg-pink-500 px-5 py-2.5 text-xs font-bold text-black shadow-[0_0_18px_rgba(255,0,127,0.5)] transition hover:bg-pink-400 disabled:opacity-40"
          >
            {copied ? "✓ " + L.copied : L.copy}
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-cyan-500/40 px-5 py-2.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/10"
          >
            {L.close}
          </button>
        </div>
        {/* End: Action row */}

        {/* Start: Copy success toast (inside modal) */}
        {copied && (
          <div className="mt-3 rounded-md border border-green-500/50 bg-green-500/10 px-3 py-2 text-center text-[11px] text-green-300">
            ✓ {L.copied}
          </div>
        )}
        {/* End: Copy success toast */}
      </div>
      {/* End: Modal Card Frame */}
    </div>
  );
}
// End: Neon Victory Deployment Modal