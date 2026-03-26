import React from 'react';
import { View, Text } from 'react-native';

export default function ResiduesTable() {
  return (
    <View className="px-6 mt-8">
      <Text className="text-lg font-bold text-black mb-3">Guia de Resíduos</Text>
      <View
        className="rounded-xl overflow-hidden bg-white border border-gray-100"
        style={{ elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 }}
      >
        <View className="flex-row bg-[#297C2A] p-3">
          <Text className="flex-[1.2] text-white font-bold border-r border-white/30 pr-2">Tipo de Resíduo</Text>
          <Text className="flex-[2] text-white font-bold pl-3">Resíduos</Text>
        </View>
        <View className="flex-row border-b border-gray-100 p-3 bg-white">
          <Text className="flex-[1.2] font-semibold text-gray-800 border-r border-gray-200 pr-2">Classe A</Text>
          <Text className="flex-[2] pl-3 text-gray-600 text-sm">Argamassa, concreto, bloco, tijolo e solo (terra)</Text>
        </View>
        <View className="flex-row border-b border-gray-100 p-3 bg-gray-50/50">
          <Text className="flex-[1.2] font-semibold text-gray-800 border-r border-gray-200 pr-2">Classe B</Text>
          <Text className="flex-[2] pl-3 text-gray-600 text-sm">Plásticos, papel, papelão, metais, vidros, gesso e madeiras</Text>
        </View>
        <View className="flex-row p-3 bg-white">
          <Text className="flex-[1.2] font-semibold text-gray-800 border-r border-gray-200 pr-2">Classe C/D</Text>
          <Text className="flex-[2] pl-3 text-gray-600 text-sm">Tintas, solventes, óleos, telhas de amianto e lixo hospitalar</Text>
        </View>
      </View>
    </View>
  );
}