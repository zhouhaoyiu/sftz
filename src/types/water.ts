export interface WaterClassification {
  waterType: string;
  waterNumber: string | number;
}

export interface EditableUser {
  userHh: string;
  jfyf: string;
  userName: string;
  userAddress: string;
  currentNumber: string | number;
  lastNumber: string | number;
  userPhone: string;
  userWx: string;
  waterClassification: WaterClassification[];
}

export interface BillingUser {
  userId: number;
  userHh: string;
  jfyf: string;
  userName: string;
  userAddress: string;
  currentNumber: number;
  lastNumber: number;
  latestPaymentDate: string;
  userPopulation: number;
  userPhone: string;
  userWx: string;
  waterClassification: string;
  userTotalUse: number;
}

export type EditableUserPayload = Omit<EditableUser, "waterClassification"> & {
  waterClassification: unknown;
};

export interface WaterPriceInput {
  waterType: number;
  waterNumber: number;
  population: number;
}

export interface WaterTypeOption {
  label: string;
  value: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function parseWaterClassifications(
  value: unknown,
): WaterClassification[] {
  if (typeof value === "string") {
    try {
      return parseWaterClassifications(JSON.parse(value));
    } catch {
      return [];
    }
  }

  if (!Array.isArray(value)) return [];

  return value.filter((item): item is WaterClassification => {
    if (typeof item !== "object" || item === null) return false;
    if (!("waterType" in item) || !("waterNumber" in item)) return false;
    return (
      typeof item.waterType === "string" &&
      (typeof item.waterNumber === "string" ||
        typeof item.waterNumber === "number")
    );
  });
}
