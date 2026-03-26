import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Loader from '../common/loader';

interface MapSectionProps {
  location: Location.LocationObject | null;
  enderecoManual: string;
  onOpenEnderecoModal: () => void;
}

export default function MapSection({ location, enderecoManual, onOpenEnderecoModal }: MapSectionProps) {
  return (
    <View className="px-6 pt-6">
      <TouchableOpacity
        className="bg-white p-4 rounded-xl border border-gray-200 mb-4 shadow-sm flex-row items-center"
        onPress={onOpenEnderecoModal}
        activeOpacity={0.7}
      >
        <Text className="text-gray-500 flex-1 font-medium" numberOfLines={1}>
          {enderecoManual ? `📍 ${enderecoManual}` : '🔍 Digite o endereço manualmente...'}
        </Text>
      </TouchableOpacity>

      <View className="h-[300px] bg-gray-200 rounded-2xl overflow-hidden border border-gray-300 shadow-sm">
        {location ? (
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
          >
            <Marker coordinate={location.coords} title="Local da Coleta" />
          </MapView>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Loader visible={true} />
          </View>
        )}
      </View>
    </View>
  );
}