import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Importando os ícones para o rodapé
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type Pedido = {
  id: string;
  endereco: string;
  status: 'PENDENTE' | 'ABERTO' | 'ACEITO' | 'EM_COLETA' | 'FINALIZADO' | 'CANCELADO';
  pagamento: string;
  itens: any;
  empresaColetora?: string;
  distancia?: string;
  valor?: string;
};

export default function MinhasColetasScreen() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    const dados = await AsyncStorage.getItem('@mock_pedidos');
    if (dados) {
      setPedidos(JSON.parse(dados));
    }
    setLoading(false);
  };

  const corStatus = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'bg-orange-100 text-orange-700';
      case 'ABERTO': return 'bg-blue-100 text-blue-700';
      case 'ACEITO': return 'bg-indigo-100 text-indigo-700';
      case 'EM_COLETA': return 'bg-purple-100 text-purple-700';
      case 'FINALIZADO': return 'bg-green-100 text-green-700';
      case 'CANCELADO': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderPedido = ({ item }: { item: Pedido }) => (
    <TouchableOpacity 
      className="bg-white p-5 rounded-xl border border-gray-200 mb-4 shadow-sm"
      onPress={() => alert(`Detalhes do pedido ${item.id}`)}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-3">
        <Text className="font-bold text-gray-800 flex-1 pr-4" numberOfLines={1}>
          Pedido #{item.id.toUpperCase()}
        </Text>
        <View className={`px-3 py-1 rounded-full ${corStatus(item.status).split(' ')[0]}`}>
          <Text className={`font-bold text-xs ${corStatus(item.status).split(' ')[1]}`}>
            {item.status === 'EM_COLETA' ? 'PEDIDO COLETADO' : item.status}
          </Text>
        </View>
      </View>

      {item.status === 'ABERTO' && (
        <View className="flex-row items-center gap-2 mb-3 bg-blue-50 p-2 rounded-lg">
          <ActivityIndicator size="small" color="#1D4ED8" />
          <Text className="text-blue-700 text-sm font-semibold">Estamos encontrando um coletor para você...</Text>
        </View>
      )}

      {item.status === 'ACEITO' && item.empresaColetora && (
        <View className="bg-indigo-50 p-3 rounded-lg mb-3">
          <Text className="font-bold text-indigo-800">Coletor: {item.empresaColetora}</Text>
          <Text className="text-indigo-600 text-sm">Distância: {item.distancia} • Valor: {item.valor}</Text>
        </View>
      )}

      <Text className="text-gray-600 text-sm mb-1">📍 {item.endereco}</Text>
      <Text className="text-gray-500 text-sm mt-2">
        Sacos: {item.itens.classeA + item.itens.classeB + item.itens.classeCD} totais
      </Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator className="flex-1" size="large" color="#297C2A" />;

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <View className="px-6 pt-16 pb-4 bg-[#297C2A] shadow-sm z-10">
        <Text className="text-white text-2xl font-bold">Minhas Coletas</Text>
        <Text className="text-white/90 text-sm mt-1">Histórico de solicitações (Pág. 1/10)</Text>
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={item => item.id}
        renderItem={renderPedido}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">Você ainda não tem nenhum pedido de coleta.</Text>
        }
      />
      
      {/* ----------------- RODAPÉ DE NAVEGAÇÃO ----------------- */}
      <View className="flex-row bg-white border-t border-gray-200 py-3 pb-6 px-6 justify-around items-center shadow-lg">
        {/* Botão Home - Direciona para a Home */}
        <TouchableOpacity 
          className="items-center justify-center p-2" 
          onPress={() => router.push('/(cliente)/home')}
          activeOpacity={0.8}
        >
          <FontAwesome name="home" size={26} color="#297C2A" />
          <Text className="text-[#297C2A] text-xs font-bold mt-1">Início</Text>
        </TouchableOpacity>

        {/* Botão Lista - Fica na mesma tela */}
        <TouchableOpacity 
          className="items-center justify-center p-2" 
          activeOpacity={0.8}
        >
          <FontAwesome5 name="list-alt" size={24} color="#297C2A" />
          <Text className="text-[#297C2A] text-xs font-bold mt-1">Pedidos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}