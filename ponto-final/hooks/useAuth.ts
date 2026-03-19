import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

type UserRole = 'cliente' | 'coletor' | null;

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserRole(session.user.id);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserRole(session.user.id);
            } else {
                setRole(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // saber se o usuário é cliente ou coletor 
    const fetchUserRole = async (userId: string) => {
        try {
            const { data: cliente } = await supabase
                .from('usuarios')
                .select('id')
                .eq('auth_id', userId)
                .single();

            if (cliente) {
                setRole('cliente');
                return;
            }

            const { data: coletor } = await supabase
                .from('coletores')
                .select('id')
                .eq('auth_id', userId)
                .single();

            if (coletor) {
                setRole('coletor');
            } else {
                setRole(null);
            }
        } catch (error) {
            console.error('Erro ao buscar perfil do usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    return { session, user, role, loading };
}