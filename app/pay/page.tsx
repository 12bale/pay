'use client';
import { useCalculatorStore } from '@/store/useCalculatorStore';
import { useEffect } from 'react';

const formatNumber = (num: number) => {
  return Math.floor(num).toLocaleString();
};

export default function Home() {
  const {
    totalSales,
    commission,
    afterCommission,
    materialCost,
    afterMaterialCost,
    incentiveRate,
    incentive,
    internFee,
    afterInternFee,
    tax,
    settlementAmount,
    setTotalSales,
    setIncentiveRate,
    setInternFee,
    calculate
  } = useCalculatorStore()

  const handleTotalSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setTotalSales(value);
  };

  const handleIncentiveRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setIncentiveRate(value);
  };

  const handleInternFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setInternFee(value);
  };

  useEffect(() => {
    calculate();
  }, [totalSales, incentiveRate, internFee, calculate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">급여 계산기</h1>

        <div className="space-y-4">
          {/* 입력 섹션 */}
          <div className="pb-4 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              총매출
            </label>
            <input
              type="number"
              value={totalSales || ''}
              onChange={handleTotalSalesChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="pb-4 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              인센티브율 (%)
            </label>
            <input
              type="number"
              value={incentiveRate || ''}
              onChange={handleIncentiveRateChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="pb-4 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              인턴비
            </label>
            <input
              type="number"
              value={internFee || ''}
              onChange={handleInternFeeChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* 계산 결과 섹션 */}
          <div className="pt-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">수수료 (85%)</span>
              <span className="font-medium text-gray-900">-{formatNumber(commission)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">인센티브</span>
              <span className="font-medium text-gray-900">-{formatNumber(incentive)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">재료비 (10%)</span>
              <span className="font-medium text-gray-900">-{formatNumber(materialCost)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">인턴비</span>
              <span className="font-medium text-gray-900">-{formatNumber(internFee)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">세금 (3.3%)</span>
              <span className="font-medium text-gray-900">-{formatNumber(tax)}</span>
            </div>

            <div className="pt-4 mt-4 border-t-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">정산 금액</span>
                <span className="text-2xl font-bold text-blue-600">{formatNumber(settlementAmount)}원</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
