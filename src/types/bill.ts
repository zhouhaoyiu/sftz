export type BillLine = {
  type: string;
  volume: number;
  waterCents: number;
  sewageCents: number;
  totalCents: number;
  segments: { volume: number; unitCents: number; amountCents: number }[];
};
export type Bill = {
  id: string;
  userHh: string;
  userName: string;
  userAddress: string;
  period: string;
  lastNumber: number;
  currentNumber: number;
  tariffVersion: string;
  population: number;
  lines: BillLine[];
  totalVolume: number;
  waterCents: number;
  sewageCents: number;
  totalCents: number;
  createdAt: string;
};
export const money = (cents: number) => (cents / 100).toFixed(2);
