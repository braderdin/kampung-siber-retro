// Start: Cyberpunk CodeMirror Editor (Strategy 3 — Zero-DB Local Drafts)
"use client";

import { useEditorStore } from "@/store/useEditorStore";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import useDebounce from "@/hooks/useDebounce";
import { useRef, useState, useEffect } from "react";
import DraftSyncIndicator from "./DraftSyncIndicator";
import DraftRecoveryModal from "./DraftRecoveryModal";
import { getCookie, setCookie, removeCookie, COOKIE_KEYS, SEVEN_DAYS_SECONDS } from "@/lib/cookies";

interface CodeMirrorEditorProps {
  className?: string;
  value?: string;
  language?: string;
  onChange?: (value: string) => void;
}

// Start: Strategy 3 — Zero-DB Local Draft Buffer (cookie fallback)
const DRAFT_DEBOUNCE_MS = 1200;

interface DraftPayload {
  tab: string;
  code: string;
  savedAt: number;
}
// End: Strategy 3 — Zero-DB Local Draft Buffer

// Start: Dark Mode Detection Hook
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkDarkMode = () => {
      const darkClass = document.documentElement.classList.contains("dark");
      setIsDark(darkClass);
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return { isDark, isClient };
};
// End: Dark Mode Detection Hook

export default function CodeMirrorEditor({ 
  className, 
  value, 
  language = "html",
  onChange 
}: CodeMirrorEditorProps) {
  const { htmlCode, cssCode, jsCode, activeTab, setHtmlCode, setCssCode, setJsCode, isSaving, setIsSaving } = useEditorStore();
  const editorRef = useRef<any>(null);
  const { isDark } = useDarkMode();

  // Start: Strategy 3 — Draft recovery state
  const [showRecovery, setShowRecovery] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<DraftPayload | null>(null);
  // End: Strategy 3 — Draft recovery state

  // Start: Local State for Raw Input Value
  const [rawInputValue, setRawInputValue] = useState<string>(() => {
    if (value !== undefined) return value;
    switch (activeTab) {
      case "html": return htmlCode;
      case "css": return cssCode;
      case "js": return jsCode;
      default: return htmlCode;
    }
  });
  // End: Local State for Raw Input Value

  // Start: Debounced Value for State Synchronization
  const debouncedValue = useDebounce(rawInputValue, { delay: 500 });
  // End: Debounced Value for State Synchronization

  // Start: On mount — detect a stale draft and prompt recovery
  useEffect(() => {
    const raw = getCookie(COOKIE_KEYS.EDITOR_DRAFT);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as DraftPayload;
      if (draft && draft.code && draft.code.trim().length > 0) {
        // Only prompt if it differs from the current default/value
        const current = value ?? (activeTab === "html" ? htmlCode : activeTab === "css" ? cssCode : jsCode);
        if (draft.code !== current) {
          setPendingDraft(draft);
          setShowRecovery(true);
        }
      }
    } catch {
      /* corrupt draft — ignore */
    }
  }, []);
  // End: On mount — detect a stale draft

  // Start: Determine Current Code
  const getCurrentCode = () => {
    return rawInputValue;
  };
  // End: Determine Current Code

  // Start: Determine Setter Function
  const setCurrentCode = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      switch (activeTab) {
        case "html": return setHtmlCode(newValue);
        case "css": return setCssCode(newValue);
        case "js": return setJsCode(newValue);
        default: return setHtmlCode(newValue);
      }
    }
  };
  // End: Determine Setter Function

  // Start: Get Language Extension
  const getLanguageExtension = () => {
    if (language) {
      switch (language) {
        case "css": return css();
        case "javascript": return javascript();
        default: return html();
      }
    }
    switch (activeTab) {
      case "html": return html();
      case "css": return css();
      case "js": return javascript();
      default: return html();
    }
  };
  // End: Get Language Extension

  // Start: Handle Code Changes with Debounce
  const handleCodeChange = (newValue: string) => {
    setRawInputValue(newValue);
  };
  // End: Handle Code Changes with Debounce

  // Start: Sync Raw Input Value with External Changes
  useEffect(() => {
    if (value !== undefined) {
      setRawInputValue(value);
    }
  }, [value]);

  // Start: Sync Raw Input Value with Active Tab Changes
  useEffect(() => {
    switch (activeTab) {
      case "html": setRawInputValue(htmlCode); break;
      case "css": setRawInputValue(cssCode); break;
      case "js": setRawInputValue(jsCode); break;
      default: setRawInputValue(htmlCode);
    }
  }, [activeTab, htmlCode, cssCode, jsCode]);
  // End: Sync Raw Input Value with Active Tab Changes

  // Start: Sync Debounced Value to Store
  useEffect(() => {
    setCurrentCode(debouncedValue);
  }, [debouncedValue, activeTab, onChange, setHtmlCode, setCssCode, setJsCode]);
  // End: Sync Debounced Value to Store

  // Start: Strategy 3 — Persist draft to cookie (no DB write) on idle
  useEffect(() => {
    if (!rawInputValue) return;
    const timer = setTimeout(() => {
      const payload: DraftPayload = {
        tab: activeTab,
        code: rawInputValue,
        savedAt: Date.now(),
      };
      setCookie(COOKIE_KEYS.EDITOR_DRAFT, JSON.stringify(payload), {
        maxAge: SEVEN_DAYS_SECONDS,
      });
    }, DRAFT_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [rawInputValue, activeTab]);
  // End: Strategy 3 — Persist draft to cookie

  // Start: Simulate Auto-save
  useEffect(() => {
    if (rawInputValue !== getCurrentCode()) {
      setIsSaving(true);
      const timer = setTimeout(() => {
        setIsSaving(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rawInputValue, getCurrentCode, setIsSaving]);
  // End: Simulate Auto-save

  // Start: Strategy 3 — Recovery handlers
  const handleRecover = () => {
    if (pendingDraft) {
      setRawInputValue(pendingDraft.code);
      if (onChange) onChange(pendingDraft.code);
      else if (pendingDraft.tab === "html") setHtmlCode(pendingDraft.code);
      else if (pendingDraft.tab === "css") setCssCode(pendingDraft.code);
      else if (pendingDraft.tab === "js") setJsCode(pendingDraft.code);
    }
    setShowRecovery(false);
  };

  const handleDiscard = () => {
    removeCookie(COOKIE_KEYS.EDITOR_DRAFT);
    setPendingDraft(null);
    setShowRecovery(false);
  };
  // End: Strategy 3 — Recovery handlers

  // Start: Cyberpunk Theme Configuration
  const theme = vscodeDark;
  // End: Cyberpunk Theme Configuration

  return (
    <div className={className || "w-full h-full"} >
      <DraftSyncIndicator />
      {showRecovery && (
        <DraftRecoveryModal onRecover={handleRecover} onDiscard={handleDiscard} />
      )}
      <CodeMirror
        ref={editorRef}
        value={getCurrentCode()}
        height="100%"
        extensions={[getLanguageExtension()]}
        onChange={handleCodeChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          foldGutter: true,
          autocompletion: true,
        }}
        className="retro-editor-bg retro-editor-fg retro-editor-border cyber-editor-glow"
        theme={theme}
      />
    </div>
  );
}
// End: Cyberpunk CodeMirror Editor (Strategy 3 — Zero-DB Local Drafts)