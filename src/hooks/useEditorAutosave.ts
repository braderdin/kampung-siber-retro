// Start: Editor Autosave Hook for LocalStorage Protection
import { useEffect, useRef, useCallback } from 'react';

// Start: Editor Autosave Hook Interface
interface UseEditorAutosaveOptions {
  content: string;
  filename: string;
  enabled?: boolean;
  intervalMs?: number;
}
// End: Editor Autosave Hook Interface

// Start: Editor Autosave Return Type
interface UseEditorAutosaveReturn {
  clearAutosavedContent: () => void;
  hasAutosavedContent: () => boolean;
}
// End: Editor Autosave Return Type

// Start: useEditorAutosave Hook Implementation
export function useEditorAutosave({
  content,
  filename,
  enabled = true,
  intervalMs = 5000,
}: UseEditorAutosaveOptions): UseEditorAutosaveReturn {
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedContentRef = useRef<string>(content);

  // Start: Clear Autosaved Content Function
  const clearAutosavedContent = useCallback(() => {
    if (filename) {
      localStorage.removeItem(`editor_autosave_${filename}`);
    }
  }, [filename]);
  // End: Clear Autosaved Content Function

  // Start: Has Autosaved Content Function
  const hasAutosavedContent = useCallback(() => {
    if (!filename) return false;
    return localStorage.getItem(`editor_autosave_${filename}`) !== null;
  }, [filename]);
  // End: Has Autosaved Content Function

  // Start: Autosave Effect
  useEffect(() => {
    if (!enabled || !filename) return;

    // Clear any existing timer
    if (autosaveTimerRef.current) {
      clearInterval(autosaveTimerRef.current);
    }

    // Set up autosave interval
    autosaveTimerRef.current = setInterval(() => {
      if (content !== lastSavedContentRef.current) {
        try {
          const autosaveData = {
            content: content,
            timestamp: Date.now(),
            filename: filename,
          };
          localStorage.setItem(
            `editor_autosave_${filename}`,
            JSON.stringify(autosaveData)
          );
          lastSavedContentRef.current = content;
          console.log(`[Autosave] Content saved for ${filename} at ${new Date().toLocaleTimeString()}`);
        } catch (error) {
          console.error('Failed to autosave content:', error);
        }
      }
    }, intervalMs);

    // Cleanup on unmount
    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
      }
    };
  }, [content, filename, enabled, intervalMs]);
  // End: Autosave Effect

  // Start: Load Autosaved Content on Mount
  useEffect(() => {
    if (!enabled || !filename) return;

    try {
      const savedData = localStorage.getItem(`editor_autosave_${filename}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.content && parsed.timestamp) {
          // Only restore if saved within last 24 hours
          const age = Date.now() - parsed.timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (age < maxAge) {
            lastSavedContentRef.current = parsed.content;
          } else {
            // Clear expired autosave
            localStorage.removeItem(`editor_autosave_${filename}`);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load autosaved content:', error);
    }
  }, [filename, enabled]);
  // End: Load Autosaved Content on Mount

  return {
    clearAutosavedContent,
    hasAutosavedContent,
  };
}
// End: useEditorAutosave Hook Implementation

// Start: Get Autosaved Content Helper
export function getAutosavedContent(filename: string): string | null {
  if (!filename) return null;
  
  try {
    const savedData = localStorage.getItem(`editor_autosave_${filename}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return parsed.content || null;
    }
  } catch (error) {
    console.error('Failed to retrieve autosaved content:', error);
  }
  
  return null;
}
// End: Get Autosaved Content Helper

// Start: Clear All Editor Autosaves Helper
export function clearAllEditorAutosaves(): void {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('editor_autosave_')) {
      localStorage.removeItem(key);
    }
  });
}
// End: Clear All Editor Autosaves Helper