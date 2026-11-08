import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FuelRecordCard } from "../components/FuelRecordCard";
import { FuelStatusCard } from "../components/FuelStatusCard";
import { ThemedText } from "../components/ThemedText";
import { getRecords, saveRecord } from "../database/storage";
import { EligibilityResult, FuelRecord } from "../types/fuel";
import { checkFuelEligibility } from "../utils/fuelLogic";

export function HomeScreen(): React.JSX.Element {
  const [liters, setLiters] = useState<string>("");
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [status, setStatus] = useState<EligibilityResult>({
    allowed: true,
    reason: "",
    recentCount: 0,
  });

  const updateStatus = useCallback(
    (currentRecords: FuelRecord[], inputLiters: number = 0) => {
      const result = checkFuelEligibility(currentRecords, inputLiters);
      setStatus(result);
    },
    [],
  );

  const loadData = useCallback(async () => {
    const data = await getRecords();
    setRecords(data);
    updateStatus(data, 0);
  }, [updateStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddFuel = async (): Promise<void> => {
    const numLiters = parseFloat(liters);

    if (isNaN(numLiters) || numLiters <= 0) {
      Alert.alert("အမှား", "ကျေးဇူးပြု၍ မှန်ကန်သော လီတာပမာဏ ရိုက်ထည့်ပါ။");
      return;
    }

    const check = checkFuelEligibility(records, numLiters);

    if (!check.allowed) {
      Alert.alert("မပြုလုပ်နိုင်ပါ", check.reason);
      return;
    }

    const newRecord: FuelRecord = {
      id: Date.now().toString(),
      vehicleId: selectedVehicleId,
      liters: Number(liters),
      fuelType: selectedFuelType || "Octane 92",
      date: new Date().toISOString(),
    };

    const success = await saveRecord(newRecord);
    if (success) {
      Alert.alert("အောင်မြင်ပါသည်", "ဆီထည့်သွင်းမှု မှတ်တမ်းတင်ပြီးပါပြီ။");
      setLiters("");
      loadData();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ThemedText type="title" style={styles.header}>
        ⛽ ဆီထည့်မှတ်တမ်း System
      </ThemedText>

      {/* Fuel Eligibility Status */}
      <FuelStatusCard status={status} />

      {/* Input Form */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="ထည့်မည့် လီတာပမာဏ (ဥပမာ- 4)"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={liters}
          onChangeText={(val: string) => {
            setLiters(val);
            updateStatus(records, parseFloat(val) || 0);
          }}
        />
        <TouchableOpacity
          style={[styles.button, !status.allowed && styles.buttonDisabled]}
          onPress={handleAddFuel}
          disabled={!status.allowed}
        >
          <ThemedText style={styles.buttonText}>မှတ်တမ်း သိမ်းမည်</ThemedText>
        </TouchableOpacity>
      </View>

      {/* History Section */}
      <ThemedText type="subtitle" style={styles.subHeader}>
        ယခင် ထည့်ထားသော မှတ်တမ်းများ
      </ThemedText>

      <FlatList
        data={records}
        keyExtractor={(item: FuelRecord) => item.id}
        renderItem={({ item }: ListRenderItemInfo<FuelRecord>) => (
          <FuelRecordCard item={item} />
        )}
        ListEmptyComponent={
          <ThemedText type="caption" style={styles.emptyText}>
            မှတ်တမ်း မရှိသေးပါ။
          </ThemedText>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  header: { textAlign: "center", marginVertical: 12 },
  formContainer: { marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#a0a0a0" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  subHeader: { marginBottom: 12 },
  emptyText: { textAlign: "center", marginTop: 20 },
});
