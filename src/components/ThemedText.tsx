import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";

export interface ThemedTextProps extends TextProps {
  type?: "default" | "title" | "subtitle" | "caption";
}

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps): React.JSX.Element {
  return (
    <Text
      style={[
        type === "default" && styles.default,
        type === "title" && styles.title,
        type === "subtitle" && styles.subtitle,
        type === "caption" && styles.caption,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: { fontSize: 16, color: "#333" },
  title: { fontSize: 22, fontWeight: "bold", color: "#111" },
  subtitle: { fontSize: 18, fontWeight: "600", color: "#222" },
  caption: { fontSize: 12, color: "#666" },
});
