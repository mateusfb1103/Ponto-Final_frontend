import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ConfirmButtonProps {
  onPress: () => void;
}

export default function ConfirmButton({ onPress }: ConfirmButtonProps) {
  return (
    <View className="px-6">
      <TouchableOpacity
        className="w-full bg-[#297C2A] rounded-xl py-4 mt-5 items-center shadow-sm"
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-lg">Confirmar Endereço</Text>
      </TouchableOpacity>
    </View>
  );
}