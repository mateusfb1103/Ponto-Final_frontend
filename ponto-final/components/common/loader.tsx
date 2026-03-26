import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
};

export default function Loader({ visible }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#297C2A" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(215, 215, 215, 0.7)",
  },
});