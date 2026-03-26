import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '@/components/cliente/bottomNav';
import CardColeta, { Pedido } from '@/components/cliente/cardColeta';

export default function MinhasColetasScreen() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const dados = await AsyncStorage.getItem('@mock_pedidos');
      let pedidosSalvos = dados ? JSON.parse(dados) : [];

      // Injeta um pedido falso (Mock)
      if (pedidosSalvos.length === 0) {
        pedidosSalvos = [
          {
            id: 'mock-abc-123',
            endereco: 'Rua Exemplo, 123 - Londrina, PR',
            status: 'ACEITO',
            pagamento: 'PIX',
            itens: { classeA: 2, classeB: 0, classeCD: 1 },
            empresaColetora: 'EcoLondrina Entulhos',
            motorista: 'Carlos Silva',
            distancia: '3.2 km',
            valor: 'R$ 120,00'
          }
        ];
      }

      setPedidos(pedidosSalvos);
    } catch (error) {
      console.error("Erro ao carregar pedidos mockados", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator className="flex-1" size="large" color="#297C2A" />;

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      {/* Cabeçalho */}
      <View className="px-6 pt-16 pb-6 bg-[#297C2A] shadow-sm z-10">
        <Text className="text-white text-2xl font-bold">Minhas Coletas</Text>
        <Text className="text-white/90 text-sm mt-1">Histórico de solicitações (Pág. 1/10)</Text>
      </View>

      {/* Lista de Pedidos */}
      <FlatList
        data={pedidos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CardColeta 
            item={item} 
            onPress={() => alert(`Detalhes do pedido ${item.id}`)} 
          />
        )}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">Você ainda não tem nenhum pedido de coleta.</Text>
        }
      />
      
      {/* Componente Desacoplado do Rodapé */}
      <BottomNav />
    </View>
  );
}