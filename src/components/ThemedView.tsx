import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";

export function ThemedView({ style, ...rest }: ViewProps): React.JSX.Element {
  return <View style={[styles.container, style]} {...rest} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
  },
});
