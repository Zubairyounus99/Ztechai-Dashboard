import { createClient } from '@supabase/supabase-js';
import { showError } from '@/utils/toast';

const SUPABASE_URL = "https://xzstkvoymfwumoopspev.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6c3Rrdm95bWZ3dW1vb3BzcGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NjAxODAsImV4cCI6MjA2MjQzNjE4MH0.apBqnEQR7HMiOFYh2p-ODiUU-OHR2GUY40doHXwm8qw";

// Create the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Add global error listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    // Clear any stored data
    localStorage.removeItem('supabase.auth.token');
  }
  
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
  
  if (event === 'SIGNED_IN') {
    console.log('User signed in');
  }
});

// Wrapper function with error handling
export const safeSupabase = {
  ...supabase,
  auth: {
    ...supabase.auth,
    async getSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data;
      } catch (error) {
        showError('Session error. Please sign in again.');
        throw error;
      }
    }
  }
};

export { supabase };