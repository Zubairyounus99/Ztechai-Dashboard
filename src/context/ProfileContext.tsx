import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'Admin' | 'Employee';
};

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  session: Session | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error.message);
        } else {
          setProfile(data);
        }
      }
      setLoading(false);
    };

    fetchSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_IN' && session?.user.id !== profile?.id) {
        fetchSessionAndProfile();
      }
      if (_event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [profile?.id]);

  const value = {
    session,
    profile,
    loading,
  };

  return (
    <ProfileContext.Provider value={value}>
      {!loading && children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};