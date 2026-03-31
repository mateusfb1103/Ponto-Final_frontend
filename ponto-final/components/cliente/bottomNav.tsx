import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 1. Nova importação

export default function BottomNav() {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="flex-row bg-white border-t border-gray-200 pt-3 px-6 justify-around items-center shadow-lg"
      style={{ paddingBottom: Math.max(insets.bottom, 10) }}
    >
      <TouchableOpacity
        className="items-center justify-center p-2"
        activeOpacity={0.8}
        onPress={() => router.push('/(cliente)/home')}
      >
        <FontAwesome name="home" size={26} color="#297C2A" />
        <Text className="text-[#297C2A] text-xs font-bold mt-1">Início</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center justify-center p-2"
        onPress={() => router.push('/(cliente)/minhas-coletas')}
        activeOpacity={0.8}
      >
        <FontAwesome5 name="list-alt" size={24} color="#297C2A" />
        <Text className="text-[#297C2A] text-xs font-bold mt-1">Pedidos</Text>
      </TouchableOpacity>
    </View>
  );
}