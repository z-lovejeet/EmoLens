'use client';

import { create } from 'zustand';
import { createSupabaseBrowser } from '@/lib/db/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const supabase = createSupabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user ?? null;
        set({
          user: currentUser,
          isAuthenticated: !!currentUser,
        });
      });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  signInWithGoogle: async () => {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Google sign-in error:', error.message);
    }
  },

  signOut: async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));
