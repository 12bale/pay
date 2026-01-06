import { create } from "zustand";

interface CalculatorState {
  totalSales: number;
  commission: number;
  afterCommission: number;
  materialCost: number;
  afterMaterialCost: number;
  incentiveRate: number;
  incentive: number;
  afterIncentive: number;
  internFee: number;
  afterInternFee: number;
  tax: number;
  settlementAmount: number;
  setTotalSales: (value: number) => void;
  setIncentiveRate: (value: number) => void;
  setInternFee: (value: number) => void;
  calculate: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  totalSales: 0,
  commission: 0,
  afterCommission: 0,
  materialCost: 0,
  afterMaterialCost: 0,
  incentiveRate: 70,
  incentive: 0,
  afterIncentive: 0,
  internFee: 1000000,
  afterInternFee: 0,
  tax: 0,
  settlementAmount: 0,

  setTotalSales: (value: number) => set({ totalSales: value }),
  setIncentiveRate: (value: number) => set({ incentiveRate: value }),
  setInternFee: (value: number) => set({ internFee: value }),

  calculate: () =>
    set((state) => {
      const totalSales = state.totalSales;
      const incentiveRate = state.incentiveRate;
      const internFee = state.internFee;

      if (totalSales === 0) {
        return {
          commission: 0,
          afterCommission: 0,
          materialCost: 0,
          afterMaterialCost: 0,
          incentive: 0,
          afterIncentive: 0,
          afterInternFee: 0,
          tax: 0,
          settlementAmount: 0,
        };
      }

      // 1단계: 수수료 (총매출 × 0.85 = 남은 금액)
      const afterCommission = totalSales * 0.85;
      const commission = totalSales - afterCommission;

      // 2단계: 인센티브 (수수료 뺀 금액의 incentiveRate%)
      const incentive = afterCommission * (incentiveRate / 100);
      const afterIncentive = afterCommission;

      // 3단계: 재료비 차감 (수수료 뺀 금액의 10%)
      const materialCost = afterCommission * 0.1;
      const afterMaterialCost = incentive - materialCost;

      // 4단계: 인턴비 차감
      const afterInternFee = afterMaterialCost - internFee;

      // 5단계: 세금 차감 (3.3%)
      const tax = afterInternFee * 0.033;
      const settlementAmount = afterInternFee - tax;

      return {
        commission,
        afterCommission,
        materialCost,
        afterMaterialCost,
        incentive,
        afterIncentive,
        afterInternFee,
        tax,
        settlementAmount,
      };
    }),
}));
