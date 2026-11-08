// import * as ImagePicker from "expo-image-picker";
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   Alert,
//   FlatList,
//   Image,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // Path များကို သင့် Project Structure အတိုင်း လိုအပ်သလို စစ်ဆေးပြင်ဆင်ပါ
// import {
//   getRecords,
//   getVehicles,
//   saveRecord,
//   saveVehicle,
// } from "../database/storage";
// import {
//   EligibilityResult,
//   FuelRecord,
//   FuelType,
//   Vehicle,
//   VehicleType,
// } from "../types/fuel";
// import { checkFuelEligibility } from "../utils/fuelLogic";

// export default function HomeScreen(): React.JSX.Element {
//   // States
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
//   const [records, setRecords] = useState<FuelRecord[]>([]);

//   // Form Inputs
//   const [stationName, setStationName] = useState("");
//   const [city, setCity] = useState("");
//   const [fuelType, setFuelType] = useState<FuelType>("92");
//   const [liters, setLiters] = useState("");
//   const [scanImageUri, setScanImageUri] = useState<string | null>(null);

//   // Add Vehicle Modal
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newVehName, setNewVehName] = useState("");
//   const [newVehType, setNewVehType] = useState<VehicleType>("car");

//   const [status, setStatus] = useState<EligibilityResult>({
//     allowed: true,
//     reason: "",
//     recentCount: 0,
//   });

//   const loadData = useCallback(async () => {
//     const vehList = await getVehicles();
//     const recList = await getRecords();
//     setVehicles(vehList);
//     setRecords(recList);

//     if (vehList.length > 0 && !selectedVehicle) {
//       setSelectedVehicle(vehList[0]);
//     }
//   }, [selectedVehicle]);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   // ယာဉ်ပြောင်းတိုင်း သို့မဟုတ် လီတာရိုက်တိုင်း Status စစ်ရန်
//   useEffect(() => {
//     if (selectedVehicle) {
//       const result = checkFuelEligibility(
//         records,
//         selectedVehicle.id,
//         parseFloat(liters) || 0,
//       );
//       setStatus(result);
//     }
//   }, [selectedVehicle, records, liters]);

//   // Scan ပုံ တင်ခြင်း
//   const handleUploadScan = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 0.8,
//     });

//     if (!result.canceled) {
//       setScanImageUri(result.assets[0].uri);
//     }
//   };

//   // ယာဉ်အသစ် ထည့်သွင်းခြင်း
//   const handleAddVehicle = async () => {
//     if (!newVehName.trim()) {
//       Alert.alert("အမှား", "ယာဉ်အမည်/နံပါတ် ရိုက်ထည့်ပါ");
//       return;
//     }
//     const created: Vehicle = {
//       id: Date.now().toString(),
//       name: newVehName,
//       type: newVehType,
//       qrCodeData: `VEHICLE_QR_${Date.now()}`,
//     };
//     await saveVehicle(created);
//     setNewVehName("");
//     setIsModalOpen(false);
//     loadData();
//   };

//   // ဆီထည့်မှတ်တမ်း အသစ်သိမ်းခြင်း
//   const handleAddRecord = async () => {
//     if (!selectedVehicle) {
//       Alert.alert("အမှား", "ကျေးဇူးပြု၍ ယာဉ် ရွေးချယ်ပါ");
//       return;
//     }
//     if (!stationName || !city || !liters) {
//       Alert.alert("အမှား", "အချက်အလက်များ အပြည့်အစုံ ဖြည့်စွက်ပါ");
//       return;
//     }

//     const numLiters = parseFloat(liters);
//     const check = checkFuelEligibility(records, selectedVehicle.id, numLiters);

//     if (!check.allowed) {
//       Alert.alert("မပြုလုပ်နိုင်ပါ", check.reason);
//       return;
//     }

//     const newRec: FuelRecord = {
//       id: Date.now().toString(),
//       vehicleId: selectedVehicle.id,
//       stationName,
//       city,
//       fuelType,
//       liters: numLiters,
//       date: new Date().toISOString(),
//       scanImageUri: scanImageUri || undefined,
//     };

//     const ok = await saveRecord(newRec);
//     if (ok) {
//       Alert.alert("အောင်မြင်ပါသည်", "ဆီထည့်သွင်းမှု မှတ်တမ်းတင်ပြီးပါပြီ");
//       setLiters("");
//       setStationName("");
//       setCity("");
//       setScanImageUri(null);
//       loadData();
//     }
//   };

//   // ယာဉ်အလိုက် ရွေးချယ်နိုင်သော ဆီအမျိုးအစားများ
//   const availableFuelOptions: FuelType[] =
//     selectedVehicle?.type === "cycle"
//       ? ["92", "95"]
//       : ["92", "95", "diesel", "premium"];

//   // ရွေးထားသည့် ယာဉ်၏ မှတ်တမ်းများသာ သီးသန့်ထုတ်ယူခြင်း
//   const filteredRecords = records.filter(
//     (r) => r.vehicleId === selectedVehicle?.id,
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={{ padding: 16 }}>
//         <Text style={styles.title}>⛽ Fuel Management System</Text>

//         {/* 1. Vehicle Selection Bar */}
//         <View style={styles.section}>
//           <View style={styles.rowBetween}>
//             <Text style={styles.sectionTitle}>၁။ ယာဉ် ရွေးချယ်ပါ</Text>
//             <TouchableOpacity
//               style={styles.addBtn}
//               onPress={() => setIsModalOpen(true)}
//             >
//               <Text style={styles.addBtnText}>+ ယာဉ်အသစ်ထည့်မည်</Text>
//             </TouchableOpacity>
//           </View>

//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={{ marginTop: 8 }}
//           >
//             {vehicles.map((v) => (
//               <TouchableOpacity
//                 key={v.id}
//                 style={[
//                   styles.vehicleChip,
//                   selectedVehicle?.id === v.id && styles.vehicleChipActive,
//                 ]}
//                 onPress={() => setSelectedVehicle(v)}
//               >
//                 <Text
//                   style={
//                     selectedVehicle?.id === v.id
//                       ? styles.textWhite
//                       : styles.textDark
//                   }
//                 >
//                   {v.type === "car" ? "🚗" : "🏍️"} {v.name}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>

//         {/* 2. QR Code Display Section (For Station Scan) */}
//         {selectedVehicle && (
//           <View style={styles.qrCard}>
//             <Text style={styles.qrTitle}>Station Scan ဖတ်ရန် QR Code</Text>

//             <Text style={styles.qrSub}>
//               {selectedVehicle.name} ({selectedVehicle.type.toUpperCase()})
//             </Text>
//           </View>
//         )}

//         {/* 3. Availability Status Card */}
//         <View
//           style={[
//             styles.statusCard,
//             status.allowed ? styles.bgSuccess : styles.bgDanger,
//           ]}
//         >
//           <Text style={styles.statusTitle}>
//             {status.allowed
//               ? "✅ ဆီထည့်ရန် ခွင့်ပြုထားပါသည်"
//               : "❌ ဆီထည့်ခွင့် မရှိသေးပါ"}
//           </Text>
//           <Text>{status.reason}</Text>
//         </View>

//         {/* 4. Record Input Form */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>၂။ ဆီထည့် မှတ်တမ်းယူရန်</Text>

//           {/* Scan Image Upload */}
//           <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadScan}>
//             <Text style={styles.uploadBtnText}>
//               {scanImageUri
//                 ? "🔄 Scan ပုံ ပြန်လည်ရွေးမည်"
//                 : "📄 Honda/ယာဉ် Scan ပုံ တင်မည်"}
//             </Text>
//           </TouchableOpacity>

//           {scanImageUri && (
//             <View style={styles.previewContainer}>
//               <Text style={styles.previewLabel}>တင်ထားသော Scan ပုံ -</Text>
//               <Image
//                 source={{ uri: scanImageUri }}
//                 style={styles.scanImagePreview}
//               />
//             </View>
//           )}

//           <TextInput
//             style={styles.input}
//             placeholder="ဆိုင်အမည် (ဥပမာ - Denko)"
//             value={stationName}
//             onChangeText={setStationName}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="မြို့နယ်/မြို့ (ဥပမာ - Yangon)"
//             value={city}
//             onChangeText={setCity}
//           />

//           <Text style={{ marginVertical: 6, fontWeight: "600" }}>
//             ဆီအမျိုးအစား ရွေးပါ -
//           </Text>
//           <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
//             {availableFuelOptions.map((type) => (
//               <TouchableOpacity
//                 key={type}
//                 style={[
//                   styles.fuelChip,
//                   fuelType === type && styles.fuelChipActive,
//                 ]}
//                 onPress={() => setFuelType(type)}
//               >
//                 <Text
//                   style={fuelType === type ? styles.textWhite : styles.textDark}
//                 >
//                   {type.toUpperCase()}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <TextInput
//             style={styles.input}
//             placeholder="လီတာပမာဏ (အများဆုံး ၄ လီတာ)"
//             keyboardType="numeric"
//             value={liters}
//             onChangeText={setLiters}
//           />

//           <TouchableOpacity
//             style={[styles.submitBtn, !status.allowed && styles.btnDisabled]}
//             disabled={!status.allowed}
//             onPress={handleAddRecord}
//           >
//             <Text style={styles.textWhite}>မှတ်တမ်း သိမ်းမည်</Text>
//           </TouchableOpacity>
//         </View>

//         {/* 5. Vehicle History */}
//         <Text style={styles.sectionTitle}>
//           ၃။ {selectedVehicle?.name || ""} ၏ မှတ်တမ်းများ
//         </Text>
//         <FlatList
//           data={filteredRecords}
//           scrollEnabled={false}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.historyCard}>
//               <View style={{ flex: 1 }}>
//                 <Text style={{ fontWeight: "bold" }}>
//                   {item.stationName} ({item.city})
//                 </Text>
//                 <Text style={{ color: "#666", fontSize: 12 }}>
//                   {new Date(item.date).toLocaleString()}
//                 </Text>
//               </View>
//               <View style={{ alignItems: "flex-end" }}>
//                 <Text style={{ color: "#007bff", fontWeight: "bold" }}>
//                   {item.liters} L ({String(item.fuelType).toUpperCase()})
//                 </Text>
//               </View>
//             </View>
//           )}
//           ListEmptyComponent={
//             <Text style={{ color: "#888", marginTop: 10 }}>
//               မှတ်တမ်း မရှိသေးပါ
//             </Text>
//           }
//         />
//       </ScrollView>

//       {/* Add Vehicle Modal */}
//       <Modal visible={isModalOpen} animationType="slide" transparent>
//         <View style={styles.modalBg}>
//           <View style={styles.modalCard}>
//             <Text style={styles.sectionTitle}>ယာဉ်အသစ် ထည့်မည်</Text>

//             <TextInput
//               style={styles.input}
//               placeholder="ယာဉ်အမည်/နံပါတ် (ဥပမာ- Fit YGN-1234)"
//               value={newVehName}
//               onChangeText={setNewVehName}
//             />

//             <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
//               <TouchableOpacity
//                 style={[
//                   styles.fuelChip,
//                   newVehType === "car" && styles.fuelChipActive,
//                 ]}
//                 onPress={() => setNewVehType("car")}
//               >
//                 <Text
//                   style={
//                     newVehType === "car" ? styles.textWhite : styles.textDark
//                   }
//                 >
//                   🚗 Car
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.fuelChip,
//                   newVehType === "cycle" && styles.fuelChipActive,
//                 ]}
//                 onPress={() => setNewVehType("cycle")}
//               >
//                 <Text
//                   style={
//                     newVehType === "cycle" ? styles.textWhite : styles.textDark
//                   }
//                 >
//                   🏍️ Cycle
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
//               <TouchableOpacity
//                 style={[
//                   styles.submitBtn,
//                   { flex: 1, backgroundColor: "#6c757d" },
//                 ]}
//                 onPress={() => setIsModalOpen(false)}
//               >
//                 <Text style={styles.textWhite}>မလုပ်တော့ပါ</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.submitBtn, { flex: 1 }]}
//                 onPress={handleAddVehicle}
//               >
//                 <Text style={styles.textWhite}>သိမ်းမည်</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f4f6f8" },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 12,
//   },
//   section: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 16,
//   },
//   sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   addBtn: {
//     backgroundColor: "#28a745",
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 6,
//   },
//   addBtnText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
//   vehicleChip: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     backgroundColor: "#e9ecef",
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   vehicleChipActive: { backgroundColor: "#007bff" },
//   textWhite: { color: "#fff", fontWeight: "bold" },
//   textDark: { color: "#333" },
//   qrCard: {
//     backgroundColor: "#fff",
//     padding: 16,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   qrTitle: { fontWeight: "bold", color: "#333" },
//   qrSub: { color: "#666", fontSize: 12, marginTop: 4 },
//   statusCard: { padding: 12, borderRadius: 8, marginBottom: 16 },
//   bgSuccess: { backgroundColor: "#d4edda" },
//   bgDanger: { backgroundColor: "#f8d7da" },
//   statusTitle: { fontWeight: "bold", marginBottom: 4 },
//   input: {
//     backgroundColor: "#f8f9fa",
//     borderWidth: 1,
//     borderColor: "#ced4da",
//     padding: 10,
//     borderRadius: 6,
//     marginBottom: 10,
//   },
//   uploadBtn: {
//     backgroundColor: "#e2e3e5",
//     padding: 12,
//     borderRadius: 6,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderStyle: "dashed",
//     marginBottom: 10,
//   },
//   uploadBtnText: { color: "#383d41", fontWeight: "600" },
//   previewContainer: {
//     marginBottom: 10,
//     alignItems: "center",
//     backgroundColor: "#f8f9fa",
//     padding: 8,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#eee",
//   },
//   previewLabel: {
//     fontSize: 12,
//     color: "#666",
//     marginBottom: 6,
//     alignSelf: "flex-start",
//   },
//   scanImagePreview: {
//     width: "100%",
//     height: 150,
//     borderRadius: 6,
//     resizeMode: "cover",
//   },
//   fuelChip: {
//     padding: 8,
//     backgroundColor: "#e9ecef",
//     borderRadius: 6,
//     flex: 1,
//     alignItems: "center",
//   },
//   fuelChipActive: { backgroundColor: "#007bff" },
//   submitBtn: {
//     backgroundColor: "#007bff",
//     padding: 12,
//     borderRadius: 6,
//     alignItems: "center",
//     marginTop: 6,
//   },
//   btnDisabled: { backgroundColor: "#ccc" },
//   historyCard: {
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   modalBg: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalCard: { backgroundColor: "#fff", padding: 20, borderRadius: 10 },
// });

import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Path များကို သင့် Project တည်ဆောက်ပုံအတိုင်း စစ်ဆေးပေးပါ
import {
  getRecords,
  getVehicles,
  saveRecord,
  saveVehicle,
} from "../database/storage";
import {
  EligibilityResult,
  FuelRecord,
  FuelType,
  Vehicle,
  VehicleType,
} from "../types/fuel";
import { checkFuelEligibility } from "../utils/fuelLogic";

export default function HomeScreen(): React.JSX.Element {
  // States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [records, setRecords] = useState<FuelRecord[]>([]);

  // Form Inputs (ဆီထည့် မှတ်တမ်း)
  const [stationName, setStationName] = useState("");
  const [city, setCity] = useState("");
  const [fuelType, setFuelType] = useState<FuelType>("92");
  const [liters, setLiters] = useState("");

  // Add Vehicle Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehName, setNewVehName] = useState("");
  const [newVehType, setNewVehType] = useState<VehicleType>("car");
  const [newVehQrImage, setNewVehQrImage] = useState<string | null>(null); // QR Image State

  const [status, setStatus] = useState<EligibilityResult>({
    allowed: true,
    reason: "",
    recentCount: 0,
  });

  const loadData = useCallback(async () => {
    const vehList = await getVehicles();
    const recList = await getRecords();
    setVehicles(vehList);
    setRecords(recList);

    if (vehList.length > 0 && !selectedVehicle) {
      setSelectedVehicle(vehList[0]);
    }
  }, [selectedVehicle]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ယာဉ်ပြောင်းတိုင်း သို့မဟုတ် လီတာရိုက်တိုင်း Status စစ်ရန်
  useEffect(() => {
    if (selectedVehicle) {
      const result = checkFuelEligibility(
        records,
        selectedVehicle.id,
        parseFloat(liters) || 0,
      );
      setStatus(result);
    }
  }, [selectedVehicle, records, liters]);

  // Modal တွင် QR ပုံ ရွေးချယ်ရန် Function
  const handleSelectQrImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setNewVehQrImage(result.assets[0].uri);
    }
  };

  // ယာဉ်အသစ် ထည့်သွင်းခြင်း (QR Image အပါအဝင်)
  const handleAddVehicle = async () => {
    if (!newVehName.trim()) {
      Alert.alert("အမှား", "ယာဉ်အမည်/နံပါတ် ရိုက်ထည့်ပါ");
      return;
    }

    if (!newVehQrImage) {
      Alert.alert(
        "သတိပေးချက်",
        "ကျေးဇူးပြု၍ ယာဉ်၏ QR Code ပုံ Upload တင်ပေးပါ",
      );
      return;
    }

    const created: Vehicle = {
      id: Date.now().toString(),
      name: newVehName,
      type: newVehType,
      qrCodeData: newVehQrImage, // Upload တင်လိုက်သော ပုံ Uri ကို သိမ်းဆည်းမည်
    };

    await saveVehicle(created);
    setNewVehName("");
    setNewVehQrImage(null);
    setIsModalOpen(false);
    loadData();
  };

  // ဆီထည့်မှတ်တမ်း အသစ်သိမ်းခြင်း
  const handleAddRecord = async () => {
    if (!selectedVehicle) {
      Alert.alert("အမှား", "ကျေးဇူးပြု၍ ယာဉ် ရွေးချယ်ပါ");
      return;
    }
    if (!stationName || !city || !liters) {
      Alert.alert("အမှား", "အချက်အလက်များ အပြည့်အစုံ ဖြည့်စွက်ပါ");
      return;
    }

    const numLiters = parseFloat(liters);
    const check = checkFuelEligibility(records, selectedVehicle.id, numLiters);

    if (!check.allowed) {
      Alert.alert("မပြုလုပ်နိုင်ပါ", check.reason);
      return;
    }

    const newRec: FuelRecord = {
      id: Date.now().toString(),
      vehicleId: selectedVehicle.id,
      stationName,
      city,
      fuelType,
      liters: numLiters,
      date: new Date().toISOString(),
    };

    const ok = await saveRecord(newRec);
    if (ok) {
      Alert.alert("အောင်မြင်ပါသည်", "ဆီထည့်သွင်းမှု မှတ်တမ်းတင်ပြီးပါပြီ");
      setLiters("");
      setStationName("");
      setCity("");
      loadData();
    }
  };

  const availableFuelOptions: FuelType[] =
    selectedVehicle?.type === "cycle"
      ? ["92", "95"]
      : ["92", "95", "diesel", "premium"];

  const filteredRecords = records.filter(
    (r) => r.vehicleId === selectedVehicle?.id,
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>⛽ Fuel Management System</Text>

        {/* 1. Vehicle Selection Bar */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>၁။ ယာဉ် ရွေးချယ်ပါ</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setIsModalOpen(true)}
            >
              <Text style={styles.addBtnText}>+ ယာဉ်အသစ်ထည့်မည်</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 8 }}
          >
            {vehicles.map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.vehicleChip,
                  selectedVehicle?.id === v.id && styles.vehicleChipActive,
                ]}
                onPress={() => setSelectedVehicle(v)}
              >
                <Text
                  style={
                    selectedVehicle?.id === v.id
                      ? styles.textWhite
                      : styles.textDark
                  }
                >
                  {v.type === "car" ? "🚗" : "🏍️"} {v.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 2. QR Code Display Section (Upload တင်ထားသော QR Image ကို ပြသခြင်း) */}
        {selectedVehicle && (
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Station Scan ဖတ်ရန် QR Code</Text>
            <View style={{ marginVertical: 10 }}>
              {selectedVehicle.qrCodeData ? (
                <Image
                  source={{ uri: selectedVehicle.qrCodeData }}
                  style={styles.qrImageDisplay}
                />
              ) : (
                <Text style={{ color: "#999", marginVertical: 20 }}>
                  QR ပုံ မရှိပါ။
                </Text>
              )}
            </View>
            <Text style={styles.qrSub}>
              {selectedVehicle.name} ({selectedVehicle.type.toUpperCase()})
            </Text>
          </View>
        )}

        {/* 3. Availability Status Card */}
        <View
          style={[
            styles.statusCard,
            status.allowed ? styles.bgSuccess : styles.bgDanger,
          ]}
        >
          <Text style={styles.statusTitle}>
            {status.allowed
              ? "✅ ဆီထည့်ရန် ခွင့်ပြုထားပါသည်"
              : "❌ ဆီထည့်ခွင့် မရှိသေးပါ"}
          </Text>
          <Text>{status.reason}</Text>
        </View>

        {/* 4. Record Input Form (Scan ပုံ တင်ရန် ဖျက်ထားသည်) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>၂။ ဆီထည့် မှတ်တမ်းယူရန်</Text>

          <TextInput
            style={styles.input}
            placeholder="ဆိုင်အမည် (ဥပမာ - Denko)"
            value={stationName}
            onChangeText={setStationName}
          />
          <TextInput
            style={styles.input}
            placeholder="မြို့နယ်/မြို့ (ဥပမာ - Yangon)"
            value={city}
            onChangeText={setCity}
          />

          <Text style={{ marginVertical: 6, fontWeight: "600" }}>
            ဆီအမျိုးအစား ရွေးပါ -
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
            {availableFuelOptions.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.fuelChip,
                  fuelType === type && styles.fuelChipActive,
                ]}
                onPress={() => setFuelType(type)}
              >
                <Text
                  style={fuelType === type ? styles.textWhite : styles.textDark}
                >
                  {type.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="လီတာပမာဏ (အများဆုံး ၄ လီတာ)"
            keyboardType="numeric"
            value={liters}
            onChangeText={setLiters}
          />

          <TouchableOpacity
            style={[styles.submitBtn, !status.allowed && styles.btnDisabled]}
            disabled={!status.allowed}
            onPress={handleAddRecord}
          >
            <Text style={styles.textWhite}>မှတ်တမ်း သိမ်းမည်</Text>
          </TouchableOpacity>
        </View>

        {/* 5. Vehicle History */}
        <Text style={styles.sectionTitle}>
          ၃။ {selectedVehicle?.name || ""} ၏ မှတ်တမ်းများ
        </Text>
        <FlatList
          data={filteredRecords}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyCard}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}>
                  {item.stationName} ({item.city})
                </Text>
                <Text style={{ color: "#666", fontSize: 12 }}>
                  {new Date(item.date).toLocaleString()}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: "#007bff", fontWeight: "bold" }}>
                  {item.liters} L ({String(item.fuelType).toUpperCase()})
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ color: "#888", marginTop: 10 }}>
              မှတ်တမ်း မရှိသေးပါ
            </Text>
          }
        />
      </ScrollView>

      {/* Add Vehicle Modal (QR Code Image Upload ပါဝင်သည်) */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.sectionTitle}>ယာဉ်အသစ် ထည့်မည်</Text>

            <TextInput
              style={styles.input}
              placeholder="ယာဉ်အမည်/နံပါတ် (ဥပမာ- Fit YGN-1234)"
              value={newVehName}
              onChangeText={setNewVehName}
            />

            <View style={{ flexDirection: "row", gap: 10, marginVertical: 10 }}>
              <TouchableOpacity
                style={[
                  styles.fuelChip,
                  newVehType === "car" && styles.fuelChipActive,
                ]}
                onPress={() => setNewVehType("car")}
              >
                <Text
                  style={
                    newVehType === "car" ? styles.textWhite : styles.textDark
                  }
                >
                  🚗 Car
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.fuelChip,
                  newVehType === "cycle" && styles.fuelChipActive,
                ]}
                onPress={() => setNewVehType("cycle")}
              >
                <Text
                  style={
                    newVehType === "cycle" ? styles.textWhite : styles.textDark
                  }
                >
                  🏍️ Cycle
                </Text>
              </TouchableOpacity>
            </View>

            {/* QR Image Upload Section */}
            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={handleSelectQrImage}
            >
              <Text style={styles.uploadBtnText}>
                {newVehQrImage
                  ? "🔄 QR ပုံ ပြန်လည်ရွေးမည်"
                  : "📷 ယာဉ်၏ QR Image Upload တင်မည်"}
              </Text>
            </TouchableOpacity>

            {newVehQrImage && (
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: newVehQrImage }}
                  style={styles.qrModalPreview}
                />
              </View>
            )}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  { flex: 1, backgroundColor: "#6c757d" },
                ]}
                onPress={() => {
                  setIsModalOpen(false);
                  setNewVehQrImage(null);
                }}
              >
                <Text style={styles.textWhite}>မလုပ်တော့ပါ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, { flex: 1 }]}
                onPress={handleAddVehicle}
              >
                <Text style={styles.textWhite}>သိမ်းမည်</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
  },
  section: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addBtn: {
    backgroundColor: "#28a745",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addBtnText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  vehicleChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 20,
    marginRight: 8,
  },
  vehicleChipActive: { backgroundColor: "#007bff" },
  textWhite: { color: "#fff", fontWeight: "bold" },
  textDark: { color: "#333" },
  qrCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  qrTitle: { fontWeight: "bold", color: "#333" },
  qrSub: { color: "#666", fontSize: 12, marginTop: 4 },
  qrImageDisplay: { width: 140, height: 140, resizeMode: "contain" },
  statusCard: { padding: 12, borderRadius: 8, marginBottom: 16 },
  bgSuccess: { backgroundColor: "#d4edda" },
  bgDanger: { backgroundColor: "#f8d7da" },
  statusTitle: { fontWeight: "bold", marginBottom: 4 },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ced4da",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  uploadBtn: {
    backgroundColor: "#e2e3e5",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    marginVertical: 6,
  },
  uploadBtnText: { color: "#383d41", fontWeight: "600" },
  previewContainer: {
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#eee",
    marginTop: 6,
  },
  qrModalPreview: { width: 100, height: 100, resizeMode: "contain" },
  fuelChip: {
    padding: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 6,
    flex: 1,
    alignItems: "center",
  },
  fuelChipActive: { backgroundColor: "#007bff" },
  submitBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 6,
  },
  btnDisabled: { backgroundColor: "#ccc" },
  historyCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justify: "space-between",
    marginBottom: 8,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: { backgroundColor: "#fff", padding: 20, borderRadius: 10 },
});
