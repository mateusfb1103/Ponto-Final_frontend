import AsyncStorage from '@react-native-async-storage/async-storage';
import { notifyAuthChange } from '../hooks/useAuth';

export interface SignUpData {
    email: string;
    password: string;
    nome: string;
    celular: string;
    tipo: 'cliente' | 'coletor';
    cpf?: string;
    cnpj?: string;
}

// Simula a lentidão da internet (1 segundo)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function signUp(data: SignUpData) {
    await delay(1000);

    const mockSession = {
        user: { id: 'user-mock-123', email: data.email, nome: data.nome },
        role: data.tipo
    };

    await AsyncStorage.setItem('@mock_session', JSON.stringify(mockSession));
    notifyAuthChange(); // Avisa o layout para mudar de tela
    return mockSession;
}

export const signIn = async (
    email: string,
    password: string,
    role: 'cliente' | 'coletor'
) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = {
        id: '123',
        email,
        nome: role === 'cliente' ? 'João (Cliente)' : 'Carlos (Coletor)',
    };

    const sessionData = {
        user: mockUser,
        role: role
    };

    await AsyncStorage.setItem('@mock_session', JSON.stringify(sessionData));
    notifyAuthChange();
    return { user: mockUser };
};

export async function signOut() {
    await delay(500);
    await AsyncStorage.removeItem('@mock_session');
    notifyAuthChange();
}

export async function getSession() {
    const stored = await AsyncStorage.getItem('@mock_session');
    return stored ? JSON.parse(stored) : null;
}