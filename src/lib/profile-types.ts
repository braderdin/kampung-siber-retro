// Start: Canonical Profile Domain Types (21-field UserProfile schema)
export type BadgeTier = "bronze" | "silver" | "gold" | "platinum";

export interface Badge {
  id: string;
  name: string;
  icon: string;
  tier: BadgeTier;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  instagram?: string;
  linkedin?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  lastActive: string;
  reputation: number;
  level: number;
  isVerified: boolean;
  isFollowing: boolean;
  followers: number;
  following: number;
  posts: number;
  views: number;
  badges: Badge[];
  socials: SocialLinks;
  isPremium: boolean;
}
// End: Canonical Profile Domain Types

// Start: Raw Supabase Row Shape (defensive — tolerates missing columns)
export interface ProfileRow {
  id?: string;
  user_id?: string;
  username?: string;
  display_name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website?: string;
  created_at?: string;
  last_active?: string;
  reputation?: number | null;
  is_verified?: boolean | null;
  is_premium?: boolean | null;
  followers_count?: number | null;
  following_count?: number | null;
  posts_count?: number | null;
  views_count?: number | null;
  twitter?: string | null;
  github?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
}
// End: Raw Supabase Row Shape

// Start: Smooth Level Scaling Math (shared by client + server)
export function computeLevel(reputation: number): number {
  const rep = Math.max(0, reputation);
  // 0-99 => L1, 100-299 => L2, 300-599 => L3, 600-999 => L4, etc.
  return Math.floor(rep / 100) + 1;
}

export function computeNextLevelThreshold(level: number): number {
  return level * 100;
}

export function computeProgress(reputation: number): number {
  const rep = Math.max(0, reputation);
  const level = computeLevel(rep);
  const current = (level - 1) * 100;
  const next = computeNextLevelThreshold(level);
  const span = next - current;
  if (span <= 0) return 100;
  return Math.min(100, Math.max(0, ((rep - current) / span) * 100));
}
// End: Smooth Level Scaling Math

// Start: Map Supabase Row -> UserProfile Domain Model
export function mapRowToProfile(
  row: ProfileRow,
  opts: { isFollowing?: boolean; badges?: Badge[] } = {}
): UserProfile {
  const reputation = Number(row.reputation ?? 0);
  const level = computeLevel(reputation);

  return {
    id: row.id ?? row.user_id ?? "",
    username: row.username ?? "anonymous",
    displayName: row.display_name ?? row.username ?? "Resident",
    email: row.email ?? "",
    avatar: row.avatar_url ?? "",
    bio: row.bio ?? "",
    location: row.location ?? "",
    website: row.website ?? "",
    joinDate: row.created_at ?? new Date().toISOString(),
    lastActive: row.last_active ?? row.created_at ?? new Date().toISOString(),
    reputation,
    level,
    isVerified: Boolean(row.is_verified),
    isFollowing: Boolean(opts.isFollowing),
    followers: Number(row.followers_count ?? 0),
    following: Number(row.following_count ?? 0),
    posts: Number(row.posts_count ?? 0),
    views: Number(row.views_count ?? 0),
    badges: opts.badges ?? [],
    socials: {
      twitter: row.twitter ?? undefined,
      github: row.github ?? undefined,
      instagram: row.instagram ?? undefined,
      linkedin: row.linkedin ?? undefined,
    },
    isPremium: Boolean(row.is_premium),
  };
}
// End: Map Supabase Row -> UserProfile Domain Model