import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { signIn } from '../../services/auth.service';

export default function LoginScreen() {
    const [userType, setUserType] = useState<'cliente' | 'coletor'>('cliente');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Atenção', 'Preencha todos os campos para continuar.');
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
            
        } catch (error: any) {
            Alert.alert('Erro ao entrar', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-white px-6">
            {/* Logo */}
            <Image
                source={require('../../assets/images/ponto-final.png')}
                className="w-40 h-40 mb-6"
                resizeMode="contain"
            />

            {/* Seleção de Tipo de Usuário */}
            <View className="flex-row justify-center gap-8 mb-8">
                <TouchableOpacity
                    className="flex-row items-center gap-2"
                    onPress={() => setUserType('cliente')}
                    activeOpacity={0.7}
                >
                    <View className="w-5 h-5 rounded-full border-2 border-[#297C2A] items-center justify-center">
                        {userType === 'cliente' && <View className="w-2.5 h-2.5 rounded-full bg-[#297C2A]" />}
                    </View>
                    <Text className="text-black font-semibold text-base">Cliente</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center gap-2"
                    onPress={() => setUserType('coletor')}
                    activeOpacity={0.7}
                >
                    <View className="w-5 h-5 rounded-full border-2 border-[#297C2A] items-center justify-center">
                        {userType === 'coletor' && <View className="w-2.5 h-2.5 rounded-full bg-[#297C2A]" />}
                    </View>
                    <Text className="text-black font-semibold text-base">Coletor</Text>
                </TouchableOpacity>
            </View>

            {/* Formulário */}
            <View className="w-full gap-4">
                <View>
                    <Text className="text-black mb-1 font-semibold">E-mail</Text>
                    <TextInput
                        className="w-full bg-[#EEEEEE] rounded-lg px-4 py-3 text-black border border-[#E2E2E2]"
                        placeholder="Digite seu e-mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View>
                    <Text className="text-black mb-1 font-semibold">Senha</Text>
                    <TextInput
                        className="w-full bg-[#EEEEEE] rounded-lg px-4 py-3 text-black border border-[#E2E2E2]"
                        placeholder="Digite sua senha"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity
                    className="w-full bg-[#297C2A] rounded-lg py-4 mt-2 items-center"
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg">
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="mt-4 items-center"
                    onPress={() => router.push('../(auth)/register')}
                >
                    <Text className="text-[#297C2A] font-semibold">
                        Não tem uma conta? Cadastre-se
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}