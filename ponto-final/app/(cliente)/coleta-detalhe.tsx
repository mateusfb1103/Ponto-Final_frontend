import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

type Pedido = {
  id: string;
  endereco: string;
  status: 'PENDENTE' | 'ABERTO' | 'ACEITO' | 'EM_COLETA' | 'FINALIZADO' | 'CANCELADO';
  pagamento: string;
  itens: { classeA: number; classeB: number; classeCD: number };
  empresaColetora?: string;
  motorista?: string;
  distancia?: string;
  valor?: string;
};

export default function ColetaDetalheScreen() {
  const { id } = useLocalSearchParams();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  const carregarDetalhes = async () => {
    try {
      const dados = await AsyncStorage.getItem('@mock_pedidos');
      if (dados) {
        const pedidos: Pedido[] = JSON.parse(dados);
        const encontrado = pedidos.find(p => p.id === id);
        setPedido(encontrado || null);
      }
    } catch (error) {
      console.error("Erro ao carregar detalhes", error);
    } finally {
      setLoading(false);
    }
  };

  const corStatus = (status: string) => {
    switch (status) {
      case 'PENDENTE': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'ABERTO': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ACEITO': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'EM_COLETA': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'FINALIZADO': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELADO': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#297C2A" />
      </View>
    );
  }

  if (!pedido) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Pedido não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} className="bg-[#297C2A] px-6 py-3 rounded-lg">
          <Text className="text-white font-bold">Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalSacos = pedido.itens.classeA + pedido.itens.classeB + pedido.itens.classeCD;

  return (
    <View className="flex-1 bg-white">
      {/* Cabeçalho Fixo do Modal */}
      <View className="px-6 pt-16 pb-4 bg-white border-b border-gray-100 flex-row justify-between items-center z-10 shadow-sm">
        <View>
          <Text className="text-gray-500 font-semibold text-sm">Detalhes da Solicitação</Text>
          <Text className="text-black text-xl font-bold mt-1">Pedido #{pedido.id.toUpperCase()}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          activeOpacity={0.7}
        >
          <FontAwesome name="close" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Mapa da Coleta (Miniatura) */}
        <View className="h-40 bg-gray-200 w-full relative">
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: -23.3045, // Mockado, idealmente viria das coords do pedido
              longitude: -51.1691,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker coordinate={{ latitude: -23.3045, longitude: -51.1691 }} />
          </MapView>
          
          {/* Badge de Status Flutuante sobre o mapa */}
          <View className={`absolute bottom-4 left-4 px-4 py-2 rounded-full border ${corStatus(pedido.status)} shadow-sm`}>
            <Text className={`font-bold text-sm ${corStatus(pedido.status).split(' ')[1]}`}>
              Status: {pedido.status === 'EM_COLETA' ? 'PEDIDO COLETADO' : pedido.status}
            </Text>
          </View>
        </View>

        <View className="p-6 gap-6">
          
          {/* Informações do Coletor (Se Aceito) */}
          {pedido.status !== 'PENDENTE' && pedido.status !== 'ABERTO' && pedido.empresaColetora && (
            <View className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl shadow-sm">
              <View className="flex-row items-center gap-3 mb-3">
                <View className="w-10 h-10 bg-indigo-200 rounded-full items-center justify-center">
                  <FontAwesome5 name="truck" size={16} color="#4338CA" />
                </View>
                <View className="flex-1">
                  <Text className="text-indigo-900 font-bold text-lg">{pedido.empresaColetora}</Text>
                  {pedido.motorista && <Text className="text-indigo-700 text-sm">Motorista: {pedido.motorista}</Text>}
                </View>
              </View>
              
              <View className="flex-row justify-between border-t border-indigo-200/50 pt-3 mt-1">
                <View>
                  <Text className="text-indigo-400 text-xs font-semibold uppercase">Distância</Text>
                  <Text className="text-indigo-800 font-bold">{pedido.distancia}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-indigo-400 text-xs font-semibold uppercase">Valor Acordado</Text>
                  <Text className="text-indigo-800 font-bold">{pedido.valor}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Endereço */}
          <View>
            <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Local de Retirada</Text>
            <View className="flex-row items-center gap-3">
              <FontAwesome5 name="map-marker-alt" size={20} color="#EF4444" />
              <Text className="text-gray-800 font-semibold text-base flex-1">{pedido.endereco}</Text>
            </View>
          </View>

          <View className="h-[1px] bg-gray-100 w-full" />

          {/* Resumo dos Resíduos */}
          <View>
            <Text className="text-gray-400 text-xs font-bold uppercase mb-3">Resíduos a Coletar ({totalSacos} Sacos)</Text>
            <View className="gap-2">
              {pedido.itens.classeA > 0 && (
                <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <Text className="text-gray-700 font-medium">Classe A (Entulho, Terra)</Text>
                  <Text className="font-bold text-gray-900">{pedido.itens.classeA}x</Text>
                </View>
              )}
              {pedido.itens.classeB > 0 && (
                <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <Text className="text-gray-700 font-medium">Classe B (Plástico, Madeira)</Text>
                  <Text className="font-bold text-gray-900">{pedido.itens.classeB}x</Text>
                </View>
              )}
              {pedido.itens.classeCD > 0 && (
                <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <Text className="text-gray-700 font-medium">Classe C/D (Perigosos)</Text>
                  <Text className="font-bold text-gray-900">{pedido.itens.classeCD}x</Text>
                </View>
              )}
            </View>
          </View>

          <View className="h-[1px] bg-gray-100 w-full" />

          {/* Pagamento */}
          <View>
            <Text className="text-gray-400 text-xs font-bold uppercase mb-2">Método de Pagamento</Text>
            <View className="flex-row items-center gap-3">
              <FontAwesome5 
                name={pedido.pagamento === 'CARTAO' ? 'credit-card' : pedido.pagamento === 'PIX' ? 'qrcode' : 'money-bill-wave'} 
                size={20} 
                color="#297C2A" 
              />
              <Text className="text-gray-800 font-semibold text-base">
                {pedido.pagamento === 'CARTAO' ? 'Cartão de Crédito/Débito' : pedido.pagamento === 'ENTREGA' ? 'Pagamento na Entrega' : 'PIX'}
              </Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}