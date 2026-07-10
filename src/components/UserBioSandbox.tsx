"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Code, Shield, AlertCircle, Check, RefreshCw, ExternalLink, Copy, Download } from "lucide-react";

interface UserBioSandboxProps {
  src?: string;
  title?: string;
  className?: string;
  width?: string;
  height?: string;
  showHeader?: boolean;
  showControls?: boolean;
  sandbox?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

interface SandboxState {
  loaded: boolean;
  error: boolean;
  errorMessage: string;
  loading: boolean;
}

interface SandboxRef {
  reload: () => void;
  postMessage: (message: any) => void;
  getIframe: () => HTMLIFrameElement | null;
}

const DEFAULT_WIDTH = "100%";
const DEFAULT_HEIGHT = "400px";
const DEFAULT_SANDBOX = "allow-scripts allow-same-origin allow-forms";

export default function UserBioSandbox({ 
  src,
  title = "Portfolio Sandbox",
  className,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  showHeader = true,
  showControls = true,
  sandbox = DEFAULT_SANDBOX,
  onLoad,
  onError,
}: UserBioSandboxProps) {
  const [state, setState] = useState<SandboxState>({
    loaded: false,
    error: false,
    errorMessage: "",
    loading: false,
  });
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (src) {
      try {
        const url = new URL(src);
        setOrigin(url.origin);
      } catch (e) {
        setState({
          loaded: false,
          error: true,
          errorMessage: "URL portfolio tidak sah",
          loading: false,
        });
      }
    }
  }, [src]);

  const handleLoad = useCallback(() => {
    setState((prev) => ({ ...prev, loaded: true, loading: false }));
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLIFrameElement, Event>) => {
    setState({
      loaded: false,
      error: true,
      errorMessage: "Gagal memuat portfolio",
      loading: false,
    });
    onError?.("Gagal memuat portfolio");
  }, [onError]);

  const handleFrameError = useCallback(() => {
    setState({
      loaded: false,
      error: true,
      errorMessage: "Portfolio tidak boleh dimuat. Semak sandbox settings.",
      loading: false,
    });
  }, []);

  const reload = useCallback(() => {
    if (iframeRef.current) {
      setState({
        loaded: false,
        error: false,
        errorMessage: "",
        loading: true,
      });
      
      const srcValue = iframeRef.current.src;
      iframeRef.current.src = "";
      setTimeout(() => {
        iframeRef.current!.src = srcValue;
      }, 100);
    }
  }, []);

  const postMessage = useCallback((message: any) => {
    if (iframeRef.current && state.loaded) {
      iframeRef.current.contentWindow?.postMessage(message, origin);
    }
  }, [state.loaded, origin]);

  const copyOrigin = useCallback(() => {
    if (origin) {
      navigator.clipboard.writeText(origin);
    }
  }, [origin]);

  const getIframe = useCallback(() => iframeRef.current, []);

  if (!src) {
    return (
      <div className={`border-2 border-dashed rounded-xl p-6 text-center ${className || ""}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-gray-800/50">
            <Code className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <h3 className="pixel-font text-lg font-semibold text-gray-200 mb-2">
              Portfolio Tidak Ditunjukkan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 pixel-font">
              Sila berikan URL portfolio untuk dimuat
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className || ""}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <h3 className="pixel-font text-lg font-semibold text-gray-200">
              {title}
            </h3>
            <span className="text-xs text-gray-500 pixel-font">
              (Sandbox: {sandbox.split(" ")[0]})
            </span>
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              {state.error && (
                <button
                  onClick={handleFrameError}
                  className="p-1 rounded-full hover:bg-red-500/20 text-red-400 transition-colors"
                  title="Kena ulang cuba"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
              
              <button
                onClick={reload}
                className="p-1 rounded-full hover:bg-gray-800/50 text-gray-400 transition-colors"
                title="Muat ulang"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              
              {origin && (
                <button
                  onClick={copyOrigin}
                  className="p-1 rounded-full hover:bg-gray-800/50 text-gray-400 transition-colors"
                  title="Salin asal"
                >
                  <Copy className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {state.error ? (
        <div className="border-2 border-red-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-200 pixel-font mb-1">
                Ralat Portfolio
              </h4>
              <p className="text-sm text-red-300 pixel-font">{state.errorMessage}</p>
              <button
                onClick={reload}
                className="mt-2 flex items-center gap-1 px-3 py-1 text-xs rounded bg-red-500/20 hover:bg-red-500/30 
                  text-red-300 transition-colors pixel-font"
              >
                <RefreshCw className="h-3 w-3" />
                Cuba Semula
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="relative rounded-xl overflow-hidden border border-gray-700"
          style={{ width, height }}
        >
          <iframe
            ref={iframeRef}
            src={src}
            title={title}
            sandbox={sandbox}
            className="w-full h-full border-0"
            style={{
              background: "#0a0a0a",
              fontFamily: "monospace",
            }}
            onLoad={handleLoad}
            onError={handleError}
            allow="fullscreen"
          />
          
          {state.loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-400 pixel-font">Memuat portfolio...</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pixel-font">
        <div className="flex items-center gap-2">
          <Shield className="h-3 w-3" />
          <span>Selamat: Sandbox diaktifkan</span>
        </div>
        
        {origin && (
          <div className="flex items-center gap-2">
            <span>Asal: {origin}</span>
            <button
              onClick={copyOrigin}
              className="px-2 py-0.5 rounded bg-gray-800/50 hover:bg-gray-700 text-gray-300 transition-colors"
            >
              <Copy className="h-3 w-3 inline mr-1" />
              Salin
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const useSandbox = (src?: string) => {
  const [state, setState] = useState<SandboxState>({
    loaded: false,
    error: false,
    errorMessage: "",
    loading: false,
  });
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (src) {
      try {
        const url = new URL(src);
        setOrigin(url.origin);
      } catch (e) {
        setState({
          loaded: false,
          error: true,
          errorMessage: "URL tidak sah",
          loading: false,
        });
      }
    }
  }, [src]);

  const reload = useCallback(() => {
    if (iframeRef.current) {
      setState({
        loaded: false,
        error: false,
        errorMessage: "",
        loading: true,
      });
      
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = "";
      setTimeout(() => {
        iframeRef.current!.src = currentSrc;
      }, 100);
    }
  }, []);

  const postMessage = useCallback((message: any) => {
    if (iframeRef.current && state.loaded) {
      iframeRef.current.contentWindow?.postMessage(message, origin);
    }
  }, [state.loaded, origin]);

  return {
    state,
    setState,
    iframeRef,
    origin,
    reload,
    postMessage,
    getIframe: () => iframeRef.current,
  };
};

export const createSandboxContainer = () => {
  const containers: HTMLIFrameElement[] = [];
  
  const addContainer = (iframe: HTMLIFrameElement) => {
    containers.push(iframe);
  };
  
  const removeContainer = (iframe: HTMLIFrameElement) => {
    const index = containers.indexOf(iframe);
    if (index > -1) {
      containers.splice(index, 1);
    }
  };
  
  const getActiveContainers = () => containers;
  
  const clearAll = () => {
    containers.forEach(container => {
      try {
        container.remove();
      } catch (e) {}
    });
    containers.length = 0;
  };
  
  return {
    addContainer,
    removeContainer,
    getActiveContainers,
    clearAll,
  };
};