/**
 * Supabase client for apps/mobile (Expo).
 *
 * Differs from web in two ways:
 *  - Sessions persist in AsyncStorage, not cookies.
 *  - detectSessionInUrl is false; there is no URL to parse in a native app.
 *    OAuth redirects are handled explicitly via expo-linking.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';
import type { Database } from './database.types';

export const supabase = createSupabaseClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

// Refresh the token only while the app is in the foreground. Without this the
// timer keeps firing in the background and burns battery for nothing.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
