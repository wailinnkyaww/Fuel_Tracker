import AsyncStorage from "@react-native-async-storage/async-storage";
import { FuelRecord, Vehicle } from "../types/fuel";

const RECORDS_KEY = "@fuel_records";
const VEHICLES_KEY = "@vehicles_list";

// Vehicles Storage
export const getVehicles = async (): Promise<Vehicle[]> => {
  const json = await AsyncStorage.getItem(VEHICLES_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveVehicle = async (vehicle: Vehicle): Promise<boolean> => {
  const existing = await getVehicles();
  const updated = [vehicle, ...existing];
  await AsyncStorage.setItem(VEHICLES_KEY, JSON.stringify(updated));
  return true;
};

// Records Storage
export const getRecords = async (): Promise<FuelRecord[]> => {
  const json = await AsyncStorage.getItem(RECORDS_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveRecord = async (newRecord: FuelRecord): Promise<boolean> => {
  const existing = await getRecords();
  const updated = [newRecord, ...existing];
  await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(updated));
  return true;
};
