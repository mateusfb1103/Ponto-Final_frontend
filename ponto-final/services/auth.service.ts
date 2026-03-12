import { supabase } from './supabase';

export interface SignUpData {
    email: string;
    password: string;
    nome: string;
    celular: string;
    cpf: string;
}

export async function signUp({ email, password, nome, celular, cpf }: SignUpData) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nome,
                celular,
                cpf,
            },
        },
    });

    if (error) throw new Error(error.message);
    return data;
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw new Error(error.message);
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
}

export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session;
}

