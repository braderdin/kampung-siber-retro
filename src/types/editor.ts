// Start: Editor TypeScript Type Definitions
// This file declares strict TypeScript typings governing editor operational modes

// Start: Editor Operational Modes Type
export type EditorMode = 'edit' | 'preview' | 'split';
// End: Editor Operational Modes Type

// Start: Editor File Language Type
export type FileLanguage = 'html' | 'css' | 'javascript' | 'typescript' | 'json' | 'markdown';
// End: Editor File Language Type

// Start: Upload Execution Status State
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
// End: Upload Execution Status State

// Start: Filename Parameters Interface
export interface FilenameParams {
  name: string;
  extension: string;
  fullPath: string;
  sanitized: string;
}
// End: Filename Parameters Interface

// Start: Editor State Interface
export interface EditorState {
  content: string;
  filename: string;
  language: FileLanguage;
  isDirty: boolean;
  isSaved: boolean;
  lastSaved: Date | null;
}
// End: Editor State Interface

// Start: Editor File Content Response Interface
export interface EditorFileContent {
  success: boolean;
  content?: string;
  filename?: string;
  size?: number;
  error?: string;
  errorCode?: number;
}
// End: Editor File Content Response Interface

// Start: Editor Upload Response Interface
export interface EditorUploadResponse {
  success: boolean;
  url?: string;
  key?: string;
  size: number;
  error?: string;
}
// End: Editor Upload Response Interface

// Start: Editor Autosave Data Interface
export interface AutosaveData {
  content: string;
  timestamp: number;
  filename: string;
}
// End: Editor Autosave Data Interface

// Start: Media Embed Type
export type MediaEmbedType = 'spotify' | 'youtube' | 'soundcloud' | 'vimeo' | 'tiktok';
// End: Media Embed Type

// Start: Media Embed Snippet Interface
export interface MediaEmbedSnippet {
  type: MediaEmbedType;
  code: string;
  placeholder: string;
}
// End: Media Embed Snippet Interface

// Start: Embed Snippet Templates Constant
export const EMBED_TEMPLATES: Record<MediaEmbedType, string> = {
  spotify: '<iframe src="https://open.spotify.com/embed/track/XXXXXXXXXXXXXXXXX" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>',
  youtube: '<iframe src="https://www.youtube.com/embed/XXXXXXXXXXXXX" width="560" height="315" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
  soundcloud: '<iframe src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/XXXXXXXXXXXXX&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&visual=true" width="100%" height="166" frameborder="0" allow="autoplay"></iframe>',
  vimeo: '<iframe src="https://player.vimeo.com/video/XXXXXXXXXXXXX" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>',
  tiktok: '<iframe src="https://www.tiktok.com/embed/v2/XXXXXXXXXXXXX" width="300" height="500" frameborder="0" scrolling="no"></iframe>',
};
// End: Embed Snippet Templates Constant

// Start: Editor Configuration Interface
export interface EditorConfig {
  autosaveInterval: number;
  maxContentSize: number;
  r2BucketName: string;
  allowedMimeTypes: string[];
}
// End: Editor Configuration Interface

// Start: R2 Configuration Constants
export const R2_CONFIG: EditorConfig = {
  autosaveInterval: 5000,
  maxContentSize: 500 * 1024, // 500KB
  r2BucketName: process.env.R2_BUCKET_NAME || 'kampung-siber-sites',
  allowedMimeTypes: [
    'text/html',
    'text/css',
    'text/javascript',
    'application/json',
  ],
};
// End: R2 Configuration Constants

// Start: Window Dimensions Interface
export interface WindowDimensions {
  width: number;
  height: number;
}
// End: Window Dimensions Interface

// Start: Responsive Breakpoints Interface
export interface ResponsiveBreakpoints {
  mobile: WindowDimensions;
  tablet: WindowDimensions;
  desktop: WindowDimensions;
}
// End: Responsive Breakpoints Interface

// Start: Default Responsive Breakpoints
export const DEFAULT_BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: { width: 0, height: 480 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1024, height: 768 },
};
// End: Default Responsive Breakpoints