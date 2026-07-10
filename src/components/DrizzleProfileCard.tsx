"use client";

import { useState, useEffect, useCallback } from "react";
import { User, Mail, MapPin, Calendar, Shield, Crown, Check, ExternalLink, Copy, Heart, Share2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, format } from "date-fns";

interface DrizzleProfileCardProps {
  userId: string;
  className?: string;
  showFollowButton?: boolean;
  showActionButtons?: boolean;
  compact?: boolean;
}

interface UserProfile {
  id: string;
  username: string;
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
  socials?: SocialLinks;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

interface SocialLinks {
  twitter?: string;
  github?: string;
  instagram?: string;
  linkedin?: string;
}

interface ProfileCardState {
  isLoading: boolean;
  isError: boolean;
  error?: string;
  data?: UserProfile;
}

const GRADIENTS = {
  bronze: "from-amber-600 to-amber-700",
  silver: "from-gray-400 to-gray-500",
  gold: "from-yellow-400 to-amber-500",
  platinum: "from-purple-400 to-violet-500",
};

const TIER_COLORS = {
  bronze: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  silver: "bg-gray-400/20 text-gray-300 border-gray-400/30",
  gold: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
  platinum: "bg-purple-400/20 text-purple-300 border-purple-400/30",
};

export default function DrizzleProfileCard({ 
  userId,
  className,
  showFollowButton = true,
  showActionButtons = true,
  compact = false,
}: DrizzleProfileCardProps) {
  const [followLoading, setFollowLoading] = useState(false);
  const queryClient = useQueryClient();

  const { 
    data: profile, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async (): Promise<UserProfile> => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Gagal memuat profil");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const handleFollow = useCallback(async () => {
    if (!profile || followLoading) return;

    setFollowLoading(true);
    
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: profile.isFollowing ? "DELETE" : "POST",
      });

      if (response.ok) {
        queryClient.setQueryData(["profile", userId], (old: UserProfile | undefined) => {
          if (!old) return old;
          return {
            ...old,
            isFollowing: !old.isFollowing,
            followers: old.isFollowing 
              ? old.followers - 1 
              : old.followers + 1,
          };
        });
      }
    } catch (e) {
      console.error("Error toggling follow:", e);
    } finally {
      setFollowLoading(false);
    }
  }, [profile, followLoading, userId, queryClient]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  }, []);

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

  const renderSocialLinks = () => {
    if (!profile?.socials) return null;

    return (
      <div className="flex gap-2 mt-2">
        {profile.socials.twitter && (
          <a
            href={profile.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-full hover:bg-blue-500/20 text-blue-400 transition-colors"
            title="Twitter"
          >
            <Share2 className="h-4 w-4" />
          </a>
        )}
        {profile.socials.github && (
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-full hover:bg-gray-500/20 text-gray-400 transition-colors"
            title="GitHub"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        {profile.socials.instagram && (
          <a
            href={profile.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-full hover:bg-pink-500/20 text-pink-400 transition-colors"
            title="Instagram"
          >
            <Heart className="h-4 w-4" />
          </a>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-900/50 border border-gray-700 rounded-xl p-4 ${className || ""}`}>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className={`bg-gray-900/50 border border-gray-700 rounded-xl p-4 ${className || ""}`}>
        <div className="text-center py-8">
          <User className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-500 pixel-font">Gagal memuat profil pengguna</p>
        </div>
      </div>
    );
  }

  const levelInfo = Math.floor(Math.log(profile.reputation + 1) / Math.log(10)) + 1;
  const nextLevel = levelInfo * 10;
  const progress = Math.min(100, (profile.reputation % nextLevel) / nextLevel * 100);

  return (
    <div className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700 rounded-xl overflow-hidden ${className || ""}`}>
      <div className="relative">
        <div className="h-24 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20" />
        
        <div className="absolute bottom-4 left-4">
          <div className="w-20 h-20 rounded-full border-4 border-gray-900/50 flex items-center justify-center overflow-hidden">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center pixel-font text-2xl font-bold text-white">
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
                  ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
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
            <h3 className="text-xl font-semibold text-gray-200 pixel-font flex items-center gap-2">
              {profile.username}
              {profile.isVerified && (
                <Shield className="h-4 w-4 text-blue-400" />
              )}
              <Crown className="h-4 w-4 text-yellow-400" />
            </h3>
            
            <p className="text-sm text-gray-400 pixel-font mt-1">
              Level {levelInfo} • {profile.bio || "Tidak ada bio"}
            </p>
          </div>
        </div>

        {!compact && (
          <>
            <div className="mt-3 space-y-2">
              {profile.location && (
                <div className="flex items-center gap-2 text-sm text-gray-400 pixel-font">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </div>
              )}
              
              {profile.website && (
                <div className="flex items-center gap-2 text-sm text-gray-400 pixel-font">
                  <ExternalLink className="h-4 w-4" />
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition-colors break-all"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-xs text-gray-500 pixel-font">
                <Calendar className="h-3 w-3" />
                Bergabung {formatDistanceToNow(new Date(profile.joinDate), { addRelative: true })}
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 pixel-font mb-1">
                <span>Level Progress</span>
                <span>{profile.reputation}/{nextLevel}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 pixel-font">
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
                <Eye className="h-3 w-3" />
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
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-gray-800/50 hover:bg-gray-700 text-gray-300 transition-colors pixel-font"
            >
              <Copy className="h-4 w-4" />
              Salin
            </button>
            
            <button
              onClick={() => copyToClipboard(profile.email)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-gray-800/50 hover:bg-gray-700 text-gray-300 transition-colors pixel-font"
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

const Eye = () => (
  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const useProfile = (userId: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Gagal memuat profil");
      }
      const data = await response.json();
      setProfile(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ralat tidak diketahui");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
};

export const ProfileCardSkeleton = () => (
  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 animate-pulse">
    <div className="h-24 bg-gray-700/50 rounded mb-4" />
    <div className="w-16 h-8 bg-gray-700/50 rounded mb-2" />
    <div className="w-24 h-4 bg-gray-700/50 rounded mb-4" />
    <div className="space-y-2">
      <div className="w-full h-4 bg-gray-700/50 rounded" />
      <div className="w-3/4 h-4 bg-gray-700/50 rounded" />
    </div>
  </div>
);

export const VerifiedBadge = () => (
  <div className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 pixel-font">
    <Shield className="h-3 w-3" />
    Verified
  </div>
);

export const LevelBadge = ({ level }: { level: number }) => {
  const tier = level < 10 ? "bronze" : level < 20 ? "silver" : level < 30 ? "gold" : "platinum";
  
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full border ${TIER_COLORS[tier]} pixel-font`}>
      Level {level}
    </span>
  );
};

export const ReputationDisplay = ({ reputation }: { reputation: number }) => {
  const level = Math.floor(Math.log(reputation + 1) / Math.log(10)) + 1;
  const nextLevel = level * 10;
  const progress = Math.min(100, (reputation % nextLevel) / nextLevel * 100);
  
  return (
    <div className="flex items-center gap-2">
      <div className="text-xs text-gray-500 pixel-font">
        {reputation} rep
      </div>
      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};