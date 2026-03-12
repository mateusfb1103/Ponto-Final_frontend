import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { signUp } from '../../services/auth.service';

export default function RegisterScreen() {
    const [userType, setUserType] = useState<'cliente' | 'coletor'>('cliente');
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [celular, setCelular] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!nome || !cpf || !celular || !email || !password) {
            Alert.alert('Atenção', 'Preencha todos os campos para continuar.');
            return;
        }

        setLoading(true);
        try {
            // O userType será passado para sabermos em qual tabela salvar depois
            await signUp({ email, password, nome, celular, cpf, tipo: userType } as any);

            Alert.alert('Sucesso', 'Conta criada com sucesso!');
            router.back(); // Volta para a tela de login
        } catch (error: any) {
            Alert.alert('Erro ao cadastrar', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
            <View className="flex-1 justify-center items-center px-6 py-10">

                {/* Logo */}
                <Image
                    source={require('../../assets/images/ponto-final.png')}
                    className="w-32 h-32 mb-6"
                    resizeMode="contain"
                />

                {/* Seleção de Tipo de Usuário */}
                <View className="flex-row justify-center gap-8 mb-6">
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
                        <Text className="text-black mb-1 font-semibold">Nome Completo</Text>
                        <TextInput
                            className="w-full bg-[#EEEEEE] rounded-lg px-4 py-3 text-black border border-[#E2E2E2]"
                            placeholder="Digite seu nome"
                            value={nome}
                            onChangeText={setNome}
                        />
                    </View>

                    <View>
                        <Text className="text-black mb-1 font-semibold">CPF</Text>
                        <TextInput
                            className="w-full bg-[#EEEEEE] rounded-lg px-4 py-3 text-black border border-[#E2E2E2]"
                            placeholder="000.000.000-00"
                            keyboardType="numeric"
                            value={cpf}
                            onChangeText={setCpf}
                        />
                    </View>

                    <View>
                        <Text className="text-black mb-1 font-semibold">Celular</Text>
                        <TextInput
                            className="w-full bg-[#EEEEEE] rounded-lg px-4 py-3 text-black border border-[#E2E2E2]"
                            placeholder="(00) 00000-0000"
                            keyboardType="phone-pad"
                            value={celular}
                            onChangeText={setCelular}
                        />
                    </View>

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
                            placeholder="Crie uma senha"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity
                        className="w-full bg-[#297C2A] rounded-lg py-4 mt-2 items-center"
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text className="text-white font-bold text-lg">
                            {loading ? 'Cadastrando...' : 'Cadastrar'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="mt-4 mb-10 items-center"
                        onPress={() => router.back()}
                    >
                        <Text className="text-[#297C2A] font-semibold">
                            Já tem uma conta? Entre aqui
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}