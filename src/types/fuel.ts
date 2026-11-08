export type VehicleType = "car" | "cycle";

export type FuelType = "92" | "95" | "diesel" | "premium";

export interface Vehicle {
  id: string;
  name: string; // ဥပမာ - Honda Fit (YGN-1234), Wave 125
  type: VehicleType;
  qrCodeData: string; // Station မှ scan ဖတ်ရန် QR Code ID
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  stationName: string;
  city: string;
  fuelType: FuelType;
  liters: number;
  date: string;
  scanImageUri?: string;
}

export interface EligibilityResult {
  allowed: boolean;
  reason: string;
  recentCount: number;
  remainingCount?: number;
  nextAvailableDate?: string;
}
