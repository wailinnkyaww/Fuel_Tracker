import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { FuelRecord } from "../types/fuel";
import { ThemedText } from "./ThemedText";

interface FuelRecordCardProps {
  item: FuelRecord;
}

export function FuelRecordCard({
  item,
}: FuelRecordCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <ThemedText style={styles.date}>
          📅 {new Date(item.date).toLocaleString("my-MM")}
        </ThemedText>
        <ThemedText style={styles.amount}>
          {item.liters} L ({item.fuelType?.toUpperCase() || "N/A"})
        </ThemedText>
      </View>

      {/* Upload တင်ခဲ့သော Scan ပုံရှိပါက ပြသခြင်း */}
      {item.scanImageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.scanImageUri }} style={styles.scanImage} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: { fontSize: 15, fontWeight: "bold", color: "#007bff" },
  date: { fontSize: 13, color: "#555" },
  imageContainer: {
    marginTop: 8,
    borderRadius: 6,
    overflow: "hidden",
  },
  scanImage: {
    width: "100%",
    height: 140,
    borderRadius: 6,
  },
});
