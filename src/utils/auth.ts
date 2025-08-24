import { safeSupabase as supabase } from '@/integrations/supabase/client';
import { showError } from './toast';

export const handleAuthError = (error: any) => {
  console.error('Auth error:', error);
  showError('Authentication error. Please try again.');
  return null;
};

export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    return handleAuthError(error);
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    handleAuthError(error);
    return false;
  }
};