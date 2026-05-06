import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { signOut, getSession } from '../../services/auth.service';

const MOCK_COLETAS = [
  { id: '1', endereco: 'Rua das Flores, 123', distancia: '1.2 km', valor: 'R$ 150,00', materiais: 'Madeira, Gesso' },
  { id: '2', endereco: 'Av. Principal, 900', distancia: '3.5 km', valor: 'R$ 200,00', materiais: 'Entulho misto' },
  { id: '3', endereco: 'Rua do Comércio, 40', distancia: '5.0 km', valor: 'R$ 90,00', materiais: 'Plástico, Papelão' },
  { id: '4', endereco: 'Alameda das Árvores, 77', distancia: '6.1 km', valor: 'R$ 300,00', materiais: 'Concreto, Tijolos' },
];

export default function ColetorDisponiveisScreen() {
  const [userName, setUserName] = useState('Coletor');

  useEffect(() => {
    getSession().then(session => {
      if (session?.user?.nome) setUserName(session.user.nome);
    });
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  const renderColetaCard = ({ item }: { item: typeof MOCK_COLETAS[0] }) => (
    <View className="bg-white p-5 rounded-xl border border-gray-200 mb-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="font-bold text-xl text-black">{item.valor}</Text>
        <View className="bg-[#E8F5E9] px-3 py-1 rounded-full">
          <Text className="text-[#297C2A] font-bold text-xs">{item.distancia}</Text>
        </View>
      </View>
      
      <Text className="text-gray-700 mb-1 font-medium">📍 {item.endereco}</Text>
      <Text className="text-gray-500 text-sm mb-5">  {item.materiais}</Text>

      <TouchableOpacity
        className="w-full bg-[#297C2A] rounded-lg py-3 items-center"
        onPress={() => router.push('/(coletor)/coleta-detalhe')}
        activeOpacity={0.7}
      >
        <Text className="text-white font-bold">Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      {/* Cabeçalho */}
      <View className="px-6 pt-16 pb-6 bg-[#297C2A] shadow-md z-10">
        <Text className="text-white text-2xl font-bold">Fala, {userName}</Text>
        <Text className="text-white/90 text-sm mt-1">
          Coletas disponíveis na sua região hoje
        </Text>
      </View>

      {/* Lista de Oportunidades */}
      <FlatList
        data={MOCK_COLETAS}
        keyExtractor={item => item.id}
        renderItem={renderColetaCard}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10 text-base">
            Nenhuma coleta disponível no momento.
          </Text>
        }
      />

      {/* Rodapé fixo para sair da conta */}
      <View className="absolute bottom-0 w-full p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          className="w-full bg-red-50 rounded-lg py-3 items-center"
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text className="text-red-600 font-semibold">Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}