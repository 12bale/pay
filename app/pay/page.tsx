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
    <div className='p-4'>
      <p className="mt-6 font-semibold">계산</p>
      <div className="space-y-3">
        <div>
          <p>총매출</p>
          <input
            type="number"
            value={totalSales || ''}
            onChange={handleTotalSalesChange}
            className="border p-2 w-full"
          />
        </div>

        {/* 1단계: 수수료 */}
        <div>
          <p>수수료 (85%)</p>
          <input
            type="text"
            value={formatNumber(commission)}
            readOnly
            className="border p-2 w-full bg-gray-100"
          />
          <p className="text-sm text-gray-600 mt-1">
            남은 금액: {formatNumber(afterCommission)}
          </p>
        </div>

        {/* 2단계: 인센티브 */}
        <div>
          <p>인센티브 (단위: %)</p>
          <input
            type="number"
            value={incentiveRate || ''}
            onChange={handleIncentiveRateChange}
            className="border p-2 w-full"
          />
          <p className="text-sm text-gray-600 mt-1">
            인센티브 금액: {formatNumber(incentive)}
          </p>
        </div>

        {/* 3단계: 재료비 */}
        <div>
          <p>재료비 (수수료 뺀 금액의 10%)</p>
          <input
            type="text"
            value={formatNumber(materialCost)}
            readOnly
            className="border p-2 w-full bg-gray-100"
          />
          <p className="text-sm text-gray-600 mt-1">
            남은 금액: {formatNumber(afterMaterialCost)}
          </p>
        </div>

        {/* 4단계: 인턴비 */}
        <div>
          <p>인턴비</p>
          <input
            type="number"
            value={internFee || ''}
            onChange={handleInternFeeChange}
            className="border p-2 w-full"
          />
          <p className="text-sm text-gray-600 mt-1">
            남은 금액: {formatNumber(afterInternFee)}
          </p>
        </div>

        {/* 5단계: 세금 */}
        <div>
          <p>세금 (3.3%)</p>
          <input
            type="text"
            value={formatNumber(tax)}
            readOnly
            className="border p-2 w-full bg-gray-100"
          />
        </div>

        {/* 최종: 월급 */}
        <div>
          <p className="font-semibold">월급 (정산금액)</p>
          <input
            type="text"
            value={formatNumber(settlementAmount)}
            readOnly
            className="border p-2 w-full bg-green-100 font-semibold text-lg"
          />
        </div>
      </div>
    </div>
  );
}
