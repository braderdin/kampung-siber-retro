// Start: Neocities-Style Web Interactive Workspace (Modern-Retro Cyber-Village)
// Live HTML/CSS/JS editor with real-time preview and direct Cloudflare R2 deploy.
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface NeocitiesWorkspaceProps {
  className?: string;
}

type EditorFile = "index.html" | "styles.css" | "script.js";

interface SessionIdentity {
  userId: string;
  username: string;
}

interface DeployResultItem {
  filename: string;
  url: string;
  contentType: string;
  size: number;
}

// Start: Local labels (Formal Bahasa Malaysia / Melayu)
const LABEL = {
  title: "Bengkel Kod Teratak Siber",
  subtitle: "Sunting HTML, CSS & JS secara langsung. Terbit terus ke Cloudflare R2.",
  html: "index.html",
  css: "styles.css",
  js: "script.js",
  preview: "Pratonton Langsung",
  deploy: "Terbit ke R2",
  deploying: "Menerbit...",
  deployedOk: "Fail berjaya diterbit ke Cloudflare R2!",
  errDeploy: "Gagal menerbit. Semak konfigurasi R2 anda.",
  errSession: "Sesi tidak dikesan. Sila log masuk terlebih dahulu.",
  openSite: "Buka Laman Terbit",
  needsLogin: "Log masuk diperlukan untuk menerbit kod.",
  refreshPreview: "Segarkan Pratonton",
};
// End: Local labels

// Start: Neon field + button styles (Cyber-Village palette #060814)
const EDITOR_CLASS =
  "w-full h-full min-h-[260px] bg-[#0a0e1f] border-0 p-4 font-mono text-[13px] leading-relaxed " +
  "text-cyan-100 placeholder-cyan-500/40 focus:outline-none resize-none " +
  "scrollbar-thin scrollbar-thumb-cyan-500/30";

const TAB_CLASS = (active: boolean) =>
  `px-4 py-2 text-xs font-pixel uppercase tracking-wider border-b-2 transition-all ${
    active
      ? "border-pink-500 text-pink-300 drop-shadow-[0_0_6px_rgba(255,0,127,0.7)]"
      : "border-transparent text-cyan-400/60 hover:text-cyan-200"
  }`;

const NEON_PINK =
  "bg-pink-500 hover:bg-pink-400 text-black font-bold shadow-[0_0_18px_rgba(255,0,127,0.5)]";
const NEON_CYAN =
  "bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_18px_rgba(0,255,255,0.5)]";
// End: Neon field + button styles

// Start: Default scaffolding for new projects
const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Teratak Siber Saya</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="village">
    <h1>Selamat Datang ke Teratak Saya!</h1>
    <p>Ini ialah laman yang dibina dengan editor Kampung Siber Retro.</p>
    <button id="magic">Tekan Saya</button>
  </main>
  <script src="script.js"></script>
</body>
</html>`;

const DEFAULT_CSS = `:root {
  --bg: #060814;
  --neon: #00ffff;
  --pink: #ff007f;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--neon);
  font-family: "Courier New", monospace;
  min-height: 100vh;
  display: grid;
  place-items: center;
}
.village { text-align: center; }
h1 {
  color: var(--pink);
  text-shadow: 0 0 10px var(--pink);
  margin-bottom: 1rem;
}
button {
  margin-top: 1rem;
  padding: 0.6rem 1.4rem;
  background: var(--neon);
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}`;

const DEFAULT_JS = `const btn = document.getElementById("magic");
let clicks = 0;
btn.addEventListener("click", () => {
  clicks++;
  btn.textContent = \`Ditekan \${clicks} kali!\`;
});`;
// End: Default scaffolding

// Start: Build live preview document from three sources
function buildPreviewDoc(html: string, css: string, js: string): string {
  if (html.trim().length > 0) {
    let doc = html;
    if (!/<\s*style/i.test(doc) && css.trim()) {
      doc = doc.replace("</head>", `<style>\n${css}\n</style></head>`);
    }
    if (!/<\s*script/i.test(doc) && js.trim()) {
      doc = doc.replace("</body>", `<script>\n${js}\n</script></body>`);
    }
    return doc;
  }
  return `<!DOCTYPE html><html><head><style>${css}</style></head><body>${js ? `<script>${js}</script>` : ""}</body></html>`;
}
// End: Build live preview document

export default function NeocitiesWorkspace({ className }: NeocitiesWorkspaceProps) {
  // Start: Local state
  const [activeFile, setActiveFile] = useState<EditorFile>("index.html");
  const [html, setHtml] = useState(DEFAULT_HTML);
  const [css, setCss] = useState(DEFAULT_CSS);
  const [js, setJs] = useState(DEFAULT_JS);
  const [identity, setIdentity] = useState<SessionIdentity | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // End: Local state

  // Start: Resolve session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id ?? "";
      const username =
        (data.session?.user?.user_metadata?.username as string) ??
        (data.session?.user?.email?.split("@")[0] ?? "");
      if (!cancelled) {
        if (userId) setIdentity({ userId, username });
        setSessionReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  // End: Resolve session

  // Start: Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);
  // End: Auto-dismiss toast

  // Start: Live preview document (memoized)
  const previewDoc = useMemo(
    () => buildPreviewDoc(html, css, js),
    [html, css, js]
  );

  useEffect(() => {
    const frame = iframeRef.current;
    if (frame) {
      frame.srcdoc = previewDoc;
    }
  }, [previewDoc]);
  // End: Live preview document

  // Start: Active editor value binding
  const activeValue = activeFile === "index.html" ? html : activeFile === "styles.css" ? css : js;
  const setActiveValue = (val: string) => {
    if (activeFile === "index.html") setHtml(val);
    else if (activeFile === "styles.css") setCss(val);
    else setJs(val);
  };
  // End: Active editor value binding

  // Start: Deploy to R2 handler
  const handleDeploy = useCallback(async () => {
    if (!identity) {
      setToast({ kind: "err", msg: LABEL.errSession });
      return;
    }
    setDeploying(true);
    setToast(null);
    try {
      const res = await fetch("/api/editor/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: identity.userId,
          username: identity.username,
          files: [
            { filename: "index.html", content: html },
            { filename: "styles.css", content: css },
            { filename: "script.js", content: js },
          ],
        }),
      });
      const payload = await res.json();
      if (res.ok && payload.success) {
        const items = payload.data?.files as DeployResultItem[] | undefined;
        const siteUrl = payload.data?.siteUrl as string | null;
        setDeployedUrl(siteUrl);
        setToast({ kind: "ok", msg: LABEL.deployedOk });
        void items;
      } else {
        setToast({ kind: "err", msg: payload.error || LABEL.errDeploy });
      }
    } catch {
      setToast({ kind: "err", msg: LABEL.errDeploy });
    } finally {
      setDeploying(false);
    }
  }, [identity, html, css, js]);
  // End: Deploy to R2 handler

  // Start: Render workspace
  return (
    <div
      className={`${className || ""} w-full rounded-xl border border-cyan-500/30 bg-[#060814] p-3 sm:p-5 shadow-[0_0_40px_rgba(0,255,255,0.08)]`}
    >
      {/* Start: Header */}
      <div className="mb-4 flex flex-col gap-1 border-b border-pink-500/20 pb-3">
        <h2 className="text-lg sm:text-xl font-pixel text-pink-400 drop-shadow-[0_0_8px_rgba(255,0,127,0.6)]">
          ✦ {LABEL.title}
        </h2>
        <p className="text-[11px] sm:text-xs text-cyan-300/70">{LABEL.subtitle}</p>
      </div>
      {/* End: Header */}

      {/* Start: Session gate */}
      {sessionReady && !identity && (
        <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">
          {LABEL.errSession}
        </div>
      )}
      {/* End: Session gate */}

      {/* Start: Toast */}
      {toast && (
        <div
          className={`mb-4 rounded-md border p-3 text-sm ${
            toast.kind === "ok"
              ? "border-green-500/50 bg-green-500/10 text-green-300"
              : "border-red-500/50 bg-red-500/10 text-red-300"
          }`}
        >
          {toast.msg}
        </div>
      )}
      {/* End: Toast */}

      {/* Start: Main split layout (Mobile stack / Desktop side-by-side) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Start: Editor column */}
        <div className="flex flex-col rounded-lg border border-cyan-500/30 bg-[#060814] overflow-hidden">
          {/* File tree navigator */}
          <div className="flex border-b border-cyan-500/20 bg-[#0a0e1f]">
            {(["index.html", "styles.css", "script.js"] as EditorFile[]).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFile(f)}
                className={TAB_CLASS(activeFile === f)}
              >
                {f === "index.html" ? LABEL.html : f === "styles.css" ? LABEL.css : LABEL.js}
              </button>
            ))}
          </div>
          <textarea
            value={activeValue}
            onChange={(e) => setActiveValue(e.target.value)}
            spellCheck={false}
            className={EDITOR_CLASS}
            placeholder={`Taip kod ${activeFile} di sini...`}
          />
        </div>
        {/* End: Editor column */}

        {/* Start: Preview column */}
        <div className="flex flex-col rounded-lg border border-pink-500/30 bg-[#060814] overflow-hidden">
          <div className="flex items-center justify-between border-b border-pink-500/20 bg-[#0a0e1f] px-3 py-2">
            <span className="text-xs font-pixel uppercase tracking-wider text-pink-300/80">
              {LABEL.preview}
            </span>
            <button
              onClick={() => {
                if (iframeRef.current) iframeRef.current.srcdoc = previewDoc;
              }}
              className="text-[11px] font-pixel text-cyan-300 hover:text-cyan-100 transition-colors"
            >
              {LABEL.refreshPreview}
            </button>
          </div>
          <iframe
            ref={iframeRef}
            title="Live Preview"
            sandbox="allow-scripts allow-modals allow-forms"
            className="w-full min-h-[320px] h-[420px] bg-white"
          />
        </div>
        {/* End: Preview column */}
      </div>
      {/* End: Main split layout */}

      {/* Start: Action bar */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleDeploy}
          disabled={deploying || !identity}
          className={`rounded-md px-6 py-3 text-sm font-pixel transition-all disabled:opacity-50 ${NEON_PINK}`}
        >
          {deploying ? LABEL.deploying : LABEL.deploy}
        </button>
        {deployedUrl && (
          <a
            href={deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-md px-5 py-3 text-sm font-pixel transition-all ${NEON_CYAN}`}
          >
            {LABEL.openSite}
          </a>
        )}
      </div>
      {/* End: Action bar */}
    </div>
  );
  // End: Render workspace
}
// End: Neocities-Style Web Interactive Workspace