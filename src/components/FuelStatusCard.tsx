import React from "react";
import { StyleSheet, View } from "react-native";
import { FUEL_RULES } from "../constants/config";
import { EligibilityResult } from "../types/fuel";
import { ThemedText } from "./ThemedText";

interface FuelStatusCardProps {
  status: EligibilityResult;
}

export function FuelStatusCard({
  status,
}: FuelStatusCardProps): React.JSX.Element {
  const isAllowed = status.allowed;

  return (
    <View style={[styles.card, isAllowed ? styles.bgSuccess : styles.bgDanger]}>
      {/* 1. ခွင့်ပြုချက် Status ခေါင်းစဉ် */}
      <ThemedText
        type="subtitle"
        style={isAllowed ? styles.textSuccess : styles.textDanger}
      >
        {isAllowed
          ? "✅ ဆီထည့်ရန် ခွင့်ပြုထားပါသည်"
          : "❌ ဆီထည့်ခွင့် မရှိသေးပါ"}
      </ThemedText>

      {/* 2. အသေးစိတ် အကြောင်းအရင်း */}
      <ThemedText style={styles.desc}>{status.reason}</ThemedText>

      {/* 3. ဆီထည့်ခွင့်မရှိပါက နောက်တစ်ကြိမ် ပြန်ထည့်လို့ရမည့်ရက် ပြသခြင်း */}
      {!isAllowed && status.nextAvailableDate && (
        <View style={styles.nextDateBox}>
          <ThemedText type="caption" style={styles.nextDateLabel}>
            📅 နောက်တစ်ကြိမ် ပြန်ထည့်လို့ရမည့်ရက် -
          </ThemedText>
          <ThemedText style={styles.nextDateValue}>
            {status.nextAvailableDate}
          </ThemedText>
        </View>
      )}

      {/* 4. စည်းမျဉ်း သတိပေးချက် */}
      <ThemedText type="caption" style={styles.rule}>
        * ၇ ရက်အတွင်း အများဆုံး {FUEL_RULES.MAX_TRANSACTIONS_PER_PERIOD} ကြိမ်
        (၁ ကြိမ်လျှင် {FUEL_RULES.MAX_LITERS_PER_TRANSACTION} လီတာ)
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  bgSuccess: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
    borderWidth: 1,
  },
  bgDanger: {
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
    borderWidth: 1,
  },
  textSuccess: {
    color: "#155724",
  },
  textDanger: {
    color: "#721c24",
  },
  desc: {
    marginTop: 6,
    fontSize: 14,
    color: "#333333",
  },
  nextDateBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  nextDateLabel: {
    color: "#555555",
    fontSize: 12,
  },
  nextDateValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#dc3545",
    marginTop: 2,
  },
  rule: {
    marginTop: 10,
    color: "#666666",
  },
});
