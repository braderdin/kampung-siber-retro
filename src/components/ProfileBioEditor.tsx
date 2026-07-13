"use client";

import { useState, useEffect, useCallback } from 'react';

interface ProfileBioEditorProps {
  initialBio?: string;
  onBioChange?: (bio: string) => void;
  className?: string;
}

export default function ProfileBioEditor({ 
  initialBio = 'I am a resident of the retro cyber village.',
  onBioChange,
  className
}: ProfileBioEditorProps) {
  const [bioContent, setBioContent] = useState<string>(initialBio);
  const [previewContent, setPreviewContent] = useState<string>(initialBio);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setBioContent(initialBio);
    setPreviewContent(initialBio);
    setCharacterCount(initialBio.length);
  }, [initialBio]);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setBioContent(newContent);
    setPreviewContent(newContent);
    setCharacterCount(newContent.length);
    
    if (onBioChange) {
      onBioChange(newContent);
    }
  }, [onBioChange]);

  const handleSave = useCallback(async () => {
    if (bioContent.trim().length === 0) return;
    
    setIsSaving(true);
    
    // Simulate async save operation with debounce
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsSaving(false);
    setIsEditing(false);
    
    if (onBioChange) {
      onBioChange(bioContent);
    }
  }, [bioContent, onBioChange]);

  const handleCancel = useCallback(() => {
    setBioContent(previewContent);
    setCharacterCount(previewContent.length);
    setIsEditing(false);
  }, [previewContent]);

  const handlePreviewChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreviewContent(e.target.value);
  }, []);

  const toggleEdit = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  const formatBioForDisplay = useCallback((text: string): string => {
    return text
      .replace(/\n/g, '<br/>')
      .replace(/@/g, '<span class="text-cyan-400 font-bold">@</span>')
      .replace(/\b(Halo|Hello|Hi)\b/gi, '<span class="text-yellow-400 font-bold">$1</span>')
      .replace(/\b(kampung|siber|retro)\b/gi, '<span class="text-purple-400 font-bold">$1</span>');
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      if (isEditing && !isSaving) {
        handleSave();
      }
    }
  }, [isEditing, isSaving, handleSave]);

  const MAX_CHARACTERS = 500;

  return (
    <div 
      className={`profile-bio-editor ${className || ''}`}
      onKeyDown={handleKeyDown}
    >
      {/* Start: Editor Header */}
      <div className="retro-window-header bg-gray-200 dark:bg-gray-700 px-3 py-2 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center">
        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 pixel-font">
          <span className="mr-2">📝</span>
          Bio Editor
        </h4>
        {!isEditing ? (
          <button
            onClick={toggleEdit}
            className="retro-btn-secondary text-xs px-2 py-1"
            disabled={isSaving}
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={handleCancel}
              className="retro-btn-secondary text-xs px-2 py-1"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="retro-btn-primary text-xs px-2 py-1"
              disabled={isSaving || bioContent.trim().length === 0}
            >
              {isSaving ? '⏳ Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>
      {/* End: Editor Header */}

      {/* Start: Editor Content */}
      <div className="p-3">
        {/* Start: Live Preview Terminal */}
        <div className="retro-terminal mb-3">
          <div className="retro-terminal-header bg-gray-800 px-3 py-2 border-b border-gray-700 flex justify-between items-center">
            <div className="flex gap-2">
              <span className="text-xs text-gray-400">🔴</span>
              <span className="text-xs text-gray-400">🟡</span>
              <span className="text-xs text-gray-400">🟢</span>
            </div>
            <span className="text-xs text-gray-500 pixel-font">bio_preview.txt</span>
          </div>
          <div 
            className="retro-terminal-body p-3 font-mono text-xs leading-5 text-green-400"
            dangerouslySetInnerHTML={{ __html: mounted ? formatBioForDisplay(previewContent) : '' }}
          />
        </div>
        {/* End: Live Preview Terminal */}

        {/* Start: Textarea Input */}
        <div className="retro-window-sm">
          <label className="retro-window-header bg-gray-100 dark:bg-gray-800 px-3 py-2 border-b border-gray-300 dark:border-gray-600">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 pixel-font">
              Edit Bio
            </span>
          </label>
          <textarea
            value={bioContent}
            onChange={handleContentChange}
            className="w-full p-3 bg-black/20 border border-gray-300 dark:border-gray-600 rounded-b retro-textarea text-green-400 font-mono resize-vertical"
            rows={4}
            maxLength={MAX_CHARACTERS}
            placeholder="Type your bio here..."
            disabled={isSaving}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
          <div className="retro-window-footer bg-gray-100 dark:bg-gray-800 px-3 py-2 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center">
            <span className={`text-xs pixel-font ${characterCount >= MAX_CHARACTERS ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {characterCount.toLocaleString()}/{MAX_CHARACTERS}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 pixel-font">
              Ctrl+S to save
            </span>
          </div>
        </div>
        {/* End: Textarea Input */}
      </div>
      {/* End: Editor Content */}
    </div>
  );
}
