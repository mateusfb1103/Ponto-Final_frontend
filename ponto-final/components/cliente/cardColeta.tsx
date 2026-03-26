import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

export type Pedido = {
  id: string;
  endereco: string;
  status: 'PENDENTE' | 'ABERTO' | 'ACEITO' | 'EM_COLETA' | 'FINALIZADO' | 'CANCELADO';
  pagamento: string;
  itens: any;
  empresaColetora?: string;
  motorista?: string;
  distancia?: string;
  valor?: string;
};

interface CardColetaProps {
  item: Pedido;
  onPress: () => void;
}

export default function CardColeta({ item, onPress }: CardColetaProps) {
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

  return (
    <TouchableOpacity 
      className="bg-white p-5 rounded-xl border border-gray-200 mb-4 shadow-sm"
      onPress={onPress}
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
          <Text className="text-blue-700 text-sm font-semibold">Estamos encontrando um coletor para você..</Text>
        </View>
      )}

      {item.status === 'ACEITO' && item.empresaColetora && (
        <View className="bg-indigo-50 p-4 rounded-xl mb-3 border border-indigo-100">
          <Text className="font-bold text-indigo-900 text-base mb-1">🚚 {item.empresaColetora}</Text>
          {item.motorista && (
            <Text className="text-indigo-800 font-medium text-sm mb-2">Motorista: {item.motorista}</Text>
          )}
          <View className="flex-row justify-between bg-white/60 p-2 rounded-lg mt-1">
            <Text className="text-indigo-700 text-xs font-bold">📍 {item.distancia}</Text>
            <Text className="text-indigo-700 text-xs font-bold">💰 {item.valor}</Text>
          </View>
        </View>
      )}

      <Text className="text-gray-600 text-sm mb-1">📍 {item.endereco}</Text>
      <Text className="text-gray-500 text-sm mt-2 font-medium">
        📦 {item.itens.classeA + item.itens.classeB + item.itens.classeCD} sacos totais
      </Text>
    </TouchableOpacity>
  );
}