import { supabase } from '@/integrations/supabase/client';
import { showError } from './toast';
import { Session } from '@supabase/supabase-js';

export const handleAuthError = (error: { message: any; }) => {
  console.error('Auth error:', error);
  showError(error.message || 'Authentication error. Please try again.');
  return null;
};

export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data;
  } catch (error) {
    return handleAuthError(error as Error);
  }
};

export const getCurrentSession = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    handleAuthError(error);
    throw error;
  }
  return data.session;
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    handleAuthError(error as Error);
    return false;
  }
};