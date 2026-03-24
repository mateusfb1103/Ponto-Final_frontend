import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'cliente' | 'coletor' | null;

// Sistema simples para avisar o aplicativo que o login/logout aconteceu
const authListeners = new Set<() => void>();
export const notifyAuthChange = () => authListeners.forEach(listener => listener());

export function useAuth() {
    const [session, setSession] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);

    const loadAuth = async () => {
        setLoading(true);
        try {
            const stored = await AsyncStorage.getItem('@mock_session');
            if (stored) {
                const data = JSON.parse(stored);
                setSession({ access_token: 'mock-fake-token' });
                setUser(data.user);
                setRole(data.role);
            } else {
                setSession(null);
                setUser(null);
                setRole(null);
            }
        } catch (e) {
            console.error('Erro ao carregar mock session', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuth(); // Carrega ao abrir o app
        authListeners.add(loadAuth); // Fica escutando novos logins

        return () => {
            authListeners.delete(loadAuth);
        };
    }, []);

    return { session, user, role, loading };
}