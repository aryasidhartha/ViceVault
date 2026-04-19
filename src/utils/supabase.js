import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────────────────────────
// REPLACE THESE WITH YOUR SUPABASE PROJECT VALUES
// Dashboard → Settings → API
// ─────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://nconzktiggozghgdpncs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jb256a3RpZ2dvemdoZ2RwbmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0Mzg0MjUsImV4cCI6MjA5MTAxNDQyNX0.I4PtQyv5VykJqImHMXZOFFkJt36RwkMINExTCP0C_bg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ─────────────────────────────────────────────────────────────
// Email auth helpers
// ─────────────────────────────────────────────────────────────

function normalizeEmail(email) {
  const trimmed = String(email || '').trim().toLowerCase();
  return trimmed;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signUpWithEmail(email, password) {
  try {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !validateEmail(normalizedEmail)) {
      return { data: null, error: { message: 'Enter a valid email address.' } };
    }
    if (!password || password.length < 6) {
      return { data: null, error: { message: 'Password must be at least 6 characters.' } };
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signInWithEmail(email, password) {
  try {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !validateEmail(normalizedEmail)) {
      return { data: null, error: { message: 'Enter a valid email address.' } };
    }
    if (!password) {
      return { data: null, error: { message: 'Enter your password.' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function createProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId }])
    .select();
  return { data, error };
}
