// Start: Imports
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getServerSupabase } from "@/lib/supabase-server";
import { UserProfile, mapRowToProfile, ProfileRow } from "@/lib/profile-types";
// End: Imports

// Start: Type Definitions (aligned with 21-field UserProfile schema)
export type Profile = UserProfile;

interface FetchOptions {
  forceRefresh?: boolean;
}

interface ProfilesState {
  profiles: Profile[];
  isHydrated: boolean;
  setProfiles: (profiles: Profile[]) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, data: Partial<Profile>) => void;
  removeProfile: (id: string) => void;
  getProfile: (id: string) => Profile | undefined;
  fetchProfile: (id: string, options?: FetchOptions) => Promise<Profile | undefined>;
  fetchProfiles: (ids: string[], options?: FetchOptions) => Promise<Profile[]>;
  toggleFollow: (id: string, token?: string) => Promise<boolean>;
}
// End: Type Definitions

// Start: Supabase-backed fetch helper
async function loadProfileFromApi(id: string, token?: string): Promise<Profile | null> {
  try {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers["authorization"] = `Bearer ${token}`;

    const response = await fetch(`/api/users/${encodeURIComponent(id)}`, { headers });
    if (!response.ok) return null;
    return (await response.json()) as Profile;
  } catch {
    return null;
  }
}

async function serverFetchProfile(id: string): Promise<Profile | null> {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .or(`user_id.eq.${id},username.eq.${id}`)
      .maybeSingle();

    if (error || !data) return null;
    return mapRowToProfile(data as ProfileRow);
  } catch {
    return null;
  }
}
// End: Supabase-backed fetch helper

// Start: Profiles Store Creation (persist + async sync)
export const useProfilesStore = create<ProfilesState>()(
  persist(
    (set, get) => ({
      profiles: [],
      isHydrated: false,

      setProfiles: (profiles) => set({ profiles }),

      addProfile: (profile) =>
        set((state) => {
          const exists = state.profiles.some((p) => p.id === profile.id);
          return exists
            ? { profiles: state.profiles.map((p) => (p.id === profile.id ? profile : p)) }
            : { profiles: [...state.profiles, profile] };
        }),

      updateProfile: (id, data) =>
        set((state) => ({
          profiles: state.profiles.map((profile) =>
            profile.id === id ? { ...profile, ...data } : profile
          ),
        })),

      removeProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((profile) => profile.id !== id),
        })),

      getProfile: (id) => get().profiles.find((profile) => profile.id === id),

      fetchProfile: async (id, options) => {
        const existing = get().getProfile(id);
        if (existing && !options?.forceRefresh) return existing;

        let profile = await loadProfileFromApi(id);
        if (!profile) {
          profile = await serverFetchProfile(id);
        }

        if (profile) {
          get().addProfile(profile);
        }
        return profile ?? undefined;
      },

      fetchProfiles: async (ids, options) => {
        const results: Profile[] = [];
        await Promise.all(
          ids.map(async (id) => {
            const found = await get().fetchProfile(id, options);
            if (found) results.push(found);
          })
        );
        return results;
      },

      toggleFollow: async (id, token) => {
        const current = get().getProfile(id);
        if (!current) return false;

        const wasFollowing = current.isFollowing;
        const method = wasFollowing ? "DELETE" : "POST";

        // Start: Optimistic UI update
        get().updateProfile(id, {
          isFollowing: !wasFollowing,
          followers: wasFollowing
            ? Math.max(0, current.followers - 1)
            : current.followers + 1,
        });
        // End: Optimistic UI update

        try {
          const headers: HeadersInit = { "Content-Type": "application/json" };
          if (token) headers["authorization"] = `Bearer ${token}`;

          const response = await fetch(`/api/users/${encodeURIComponent(id)}/follow`, {
            method,
            headers,
          });

          if (!response.ok) {
            throw new Error("Follow request failed");
          }

          const body = (await response.json()) as { isFollowing: boolean; followers: number };
          get().updateProfile(id, {
            isFollowing: body.isFollowing,
            followers: body.followers,
          });
          return body.isFollowing;
        } catch {
          // Start: Rollback on failure
          get().updateProfile(id, {
            isFollowing: wasFollowing,
            followers: current.followers,
          });
          // End: Rollback on failure
          return wasFollowing;
        }
      },
    }),
    {
      name: "kampung-siber-profiles",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ profiles: state.profiles }),
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;
      },
    }
  )
);
// End: Profiles Store Creation