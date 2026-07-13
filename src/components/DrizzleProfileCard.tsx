// Start: Imports
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Crown,
  Check,
  ExternalLink,
  Copy,
  Heart,
  Share2,
  MessageSquare,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  useProfilesStore,
  type Profile,
} from "@/store/useProfilesStore";
import {
  computeLevel,
  computeProgress,
  computeNextLevelThreshold,
} from "@/lib/profile-types";
// End: Imports

// Start: Type Definitions
interface DrizzleProfileCardProps {
  userId: string;
  className?: string;
  showFollowButton?: boolean;
  showActionButtons?: boolean;
  compact?: boolean;
}
// End: Type Definitions

const TIER_COLORS: Record<string, string> = {
  bronze: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  silver: "bg-gray-400/20 text-gray-300 border-gray-400/30",
  gold: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
  platinum: "bg-purple-400/20 text-purple-300 border-purple-400/30",
};

const CROWN_REPUTATION_THRESHOLD = 500;

// Start: Current session token helper (auth-gated follow)
async function getSessionToken(): Promise<string | undefined> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? undefined;
  } catch {
    return undefined;
  }
}
// End: Current session token helper

// Start: DrizzleProfileCard Component
export default function DrizzleProfileCard({
  userId,
  className,
  showFollowButton = true,
  showActionButtons = true,
  compact = false,
}: DrizzleProfileCardProps) {
  // Start: Store bindings
  const profile = useProfilesStore((s) => s.profiles.find((p) => p.id === userId)) as
    | Profile
    | undefined;
  const fetchProfile = useProfilesStore((s) => s.fetchProfile);
  const toggleFollow = useProfilesStore((s) => s.toggleFollow);
  // End: Store bindings

  const [followLoading, setFollowLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // Start: Hydration guard (prevent SSR mismatch)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // End: Hydration guard

  // Start: Async profile load
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    (async () => {
      const token = await getSessionToken();
      const result = await fetchProfile(userId, { forceRefresh: false });
      if (cancelled) return;
      if (!result) {
        setIsError(true);
        setError("Gagal memuat profil pengguna");
      }
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, fetchProfile]);
  // End: Async profile load

  // Start: Handle follow toggle (real Supabase-backed)
  const handleFollow = useCallback(async () => {
    if (!profile || followLoading) return;
    setFollowLoading(true);
    try {
      const token = await getSessionToken();
      await toggleFollow(profile.id, token);
    } catch (e) {
      console.error("Error toggling follow:", e);
    } finally {
      setFollowLoading(false);
    }
  }, [profile, followLoading, toggleFollow]);
  // End: Handle follow toggle

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  }, []);

  // Start: Badge renderer
  const renderBadges = () => {
    if (!profile?.badges || profile.badges.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {profile.badges.map((badge) => (
          <span
            key={badge.id}
            className={`px-2 py-0.5 text-xs rounded-full border ${TIER_COLORS[badge.tier]}`}
          >
            {badge.icon} {badge.name}
          </span>
        ))}
      </div>
    );
  };
  // End: Badge renderer

  // Start: Social links renderer
  const renderSocialLinks = () => {
    if (!profile?.socials) return null;
    const { twitter, github, instagram, linkedin } = profile.socials;
    if (!twitter && !github && !instagram && !linkedin) return null;

    const linkClass =
      "p-1 rounded-full hover:bg-[var(--neon-cyan)]/20 transition-colors";

    return (
      <div className="flex gap-2 mt-2">
        {twitter && (
          <a
            href={twitter}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} text-[var(--neon-cyan)]`}
            title="Twitter"
          >
            <Share2 className="h-4 w-4" />
          </a>
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} text-gray-300`}
            title="GitHub"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} text-[var(--neon-magenta)]`}
            title="Instagram"
          >
            <Heart className="h-4 w-4" />
          </a>
        )}
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} text-[var(--neon-volt)]`}
            title="LinkedIn"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    );
  };
  // End: Social links renderer

  if (!mounted || isLoading) {
    return (
      <div
        className={`bg-[var(--bg-pitch)] border border-[color:var(--neon-cyan)]/30 rounded-xl p-4 ${
          className || ""
        }`}
      >
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div
        className={`bg-[var(--bg-pitch)] border border-[color:var(--neon-magenta)]/40 rounded-xl p-4 ${
          className || ""
        }`}
      >
        <div className="text-center py-8">
          <User className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 pixel-font">{error || "Gagal memuat profil pengguna"}</p>
        </div>
      </div>
    );
  }

  // Start: Smooth level scaling math
  const levelInfo = computeLevel(profile.reputation);
  const nextLevel = computeNextLevelThreshold(levelInfo);
  const progress = computeProgress(profile.reputation);
  // End: Smooth level scaling math

  const showCrown = profile.reputation > CROWN_REPUTATION_THRESHOLD;

  return (
    <div
      className={`bg-[var(--bg-pitch)] border border-[color:var(--neon-cyan)]/30 rounded-xl overflow-hidden ${
        className || ""
      }`}
      style={{ boxShadow: "0 0 12px rgba(0,255,255,0.15)" }}
    >
      <div className="relative">
        {/* Start: Neon banner (no static gradient) */}
        <div
          className="h-24"
          style={{
            background:
              "linear-gradient(135deg, var(--bg-charcoal) 0%, var(--bg-pitch) 100%)",
            borderBottom: "1px solid var(--neon-cyan)",
          }}
        />
        {/* End: Neon banner */}

        <div className="absolute bottom-4 left-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
            style={{ border: "2px solid var(--neon-cyan)" }}
          >
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center pixel-font text-2xl font-bold text-white"
                style={{ background: "var(--bg-charcoal)", color: "var(--neon-cyan)" }}
              >
                {profile.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {showFollowButton && (
          <div className="absolute top-4 right-4">
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                profile.isFollowing
                  ? "bg-[var(--neon-magenta)]/20 text-[var(--neon-magenta)] hover:bg-[var(--neon-magenta)]/30"
                  : "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/30"
              } ${followLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {followLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : profile.isFollowing ? (
                "Following"
              ) : (
                "Follow"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-start justify-between mt-2">
          <div className="flex-1">
            <h3 className="text-xl font-semibold pixel-font flex items-center gap-2" style={{ color: "var(--foreground)" }}>
              {profile.username}
              {profile.isVerified && (
                <Shield className="h-4 w-4 text-[var(--neon-cyan)]" />
              )}
              {showCrown && <Crown className="h-4 w-4 text-yellow-400" />}
            </h3>

            <p className="text-sm pixel-font mt-1" style={{ color: "var(--neon-cyan)" }}>
              Level {levelInfo} • {profile.bio || "Tidak ada bio"}
            </p>
          </div>
        </div>

        {!compact && (
          <>
            <div className="mt-3 space-y-2">
              {profile.location && (
                <div className="flex items-center gap-2 text-sm pixel-font" style={{ color: "var(--foreground)" }}>
                  <MapPin className="h-4 w-4 text-[var(--neon-volt)]" />
                  {profile.location}
                </div>
              )}

              {profile.website && (
                <div className="flex items-center gap-2 text-sm pixel-font" style={{ color: "var(--foreground)" }}>
                  <ExternalLink className="h-4 w-4 text-[var(--neon-cyan)]" />
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--neon-cyan)] transition-colors break-all"
                  >
                    {profile.website}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs pixel-font" style={{ color: "var(--neon-volt)" }}>
                <Calendar className="h-3 w-3" />
                Bergabung {new Date(profile.joinDate).toLocaleDateString()}
              </div>
            </div>

            {/* Start: Level progress bar (neon fill) */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs pixel-font mb-1" style={{ color: "var(--neon-volt)" }}>
                <span>Level Progress</span>
                <span>{profile.reputation}/{nextLevel}</span>
              </div>
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ border: "1px solid var(--neon-cyan)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "var(--neon-cyan)",
                    boxShadow: "0 0 8px var(--neon-cyan)",
                  }}
                />
              </div>
            </div>
            {/* End: Level progress bar */}

            <div className="mt-3 flex items-center gap-4 text-xs pixel-font" style={{ color: "var(--neon-volt)" }}>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{profile.followers}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{profile.following}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{profile.posts}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>{profile.views}</span>
              </div>
            </div>

            {renderBadges()}
            {renderSocialLinks()}
          </>
        )}

        {showActionButtons && (
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(`@${profile.username}`)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors pixel-font"
              style={{ border: "1px solid var(--neon-cyan)", color: "var(--foreground)" }}
            >
              <Copy className="h-4 w-4" />
              Salin
            </button>

            <button
              onClick={() => copyToClipboard(profile.email)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors pixel-font"
              style={{ border: "1px solid var(--neon-magenta)", color: "var(--foreground)" }}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// End: DrizzleProfileCard Component

// Start: useProfile hook (real fetch)
export const useProfile = (userId: string) => {
  const profile = useProfilesStore((s) => s.profiles.find((p) => p.id === userId)) as
    | Profile
    | undefined;
  const fetchProfile = useProfilesStore((s) => s.fetchProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = await getSessionToken();
      const result = await fetchProfile(userId, { forceRefresh: true });
      if (!result) throw new Error("Gagal memuat profil");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ralat tidak diketahui");
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchProfile]);

  return { profile, isLoading, error, refetch };
};
// End: useProfile hook

// Start: ProfileCardSkeleton
export const ProfileCardSkeleton = () => (
  <div
    className="bg-[var(--bg-pitch)] border border-[color:var(--neon-cyan)]/30 rounded-xl p-4 animate-pulse"
  >
    <div className="h-24 bg-[var(--bg-charcoal)]/50 rounded mb-4" />
    <div className="w-16 h-8 bg-[var(--bg-charcoal)]/50 rounded mb-2" />
    <div className="w-24 h-4 bg-[var(--bg-charcoal)]/50 rounded mb-4" />
    <div className="space-y-2">
      <div className="w-full h-4 bg-[var(--bg-charcoal)]/50 rounded" />
      <div className="w-3/4 h-4 bg-[var(--bg-charcoal)]/50 rounded" />
    </div>
  </div>
);
// End: ProfileCardSkeleton

// Start: VerifiedBadge
export const VerifiedBadge = () => (
  <div
    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full pixel-font"
    style={{ border: "1px solid var(--neon-cyan)", color: "var(--neon-cyan)", background: "var(--neon-cyan)/10" }}
  >
    <Shield className="h-3 w-3" />
    Verified
  </div>
);
// End: VerifiedBadge

// Start: LevelBadge (smooth scaling tiers)
export const LevelBadge = ({ level }: { level: number }) => {
  const tier =
    level < 10 ? "bronze" : level < 20 ? "silver" : level < 30 ? "gold" : "platinum";

  return (
    <span className={`px-2 py-0.5 text-xs rounded-full border ${TIER_COLORS[tier]} pixel-font`}>
      Level {level}
    </span>
  );
};
// End: LevelBadge

// Start: ReputationDisplay (neon progress)
export const ReputationDisplay = ({ reputation }: { reputation: number }) => {
  const level = computeLevel(reputation);
  const nextLevel = computeNextLevelThreshold(level);
  const progress = computeProgress(reputation);

  return (
    <div className="flex items-center gap-2">
      <div className="text-xs pixel-font" style={{ color: "var(--neon-volt)" }}>
        {reputation} rep
      </div>
      <div
        className="w-16 h-1.5 rounded-full overflow-hidden"
        style={{ border: "1px solid var(--neon-cyan)" }}
      >
        <div
          className="h-full"
          style={{
            width: `${progress}%`,
            background: "var(--neon-cyan)",
            boxShadow: "0 0 6px var(--neon-cyan)",
          }}
        />
      </div>
    </div>
  );
};
// End: ReputationDisplay