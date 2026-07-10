// Start: Imports
import { create } from 'zustand';
// End: Imports

// Start: Type Definitions
interface SuratLayangMessage {
  content: string;
  timestamp: string;
  isRead?: boolean;
}

interface Profile {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  suratLayang?: SuratLayangMessage[];
  createdAt?: string;
  updatedAt?: string;
}

interface ProfilesState {
  profiles: Profile[];
  setProfiles: (profiles: Profile[]) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, data: Partial<Profile>) => void;
  removeProfile: (id: string) => void;
  getProfile: (id: string) => Profile | undefined;
}
// End: Type Definitions

// Start: Profiles Store Creation
export const useProfilesStore = create<ProfilesState>((set, get) => ({
  profiles: [],
  
  setProfiles: (profiles) => set({ profiles }),
  
  addProfile: (profile) => set((state) => ({ 
    profiles: [...state.profiles, profile] 
  })),
  
  updateProfile: (id, data) => set((state) => ({
    profiles: state.profiles.map((profile) =>
      profile.id === id ? { ...profile, ...data } : profile
    )
  })),
  
  removeProfile: (id) => set((state) => ({
    profiles: state.profiles.filter((profile) => profile.id !== id)
  })),
  
  getProfile: (id) => get().profiles.find((profile) => profile.id === id),
}));
// End: Profiles Store Creation