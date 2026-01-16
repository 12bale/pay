'use client';

import React, { useState, useMemo } from 'react';

export default function RealRateCalculator() {
    // 상태 관리
    const [nominalRate, setNominalRate] = useState<number>(5.0); // 명목금리 (예: 예금 금리)
    const [inflationRate, setInflationRate] = useState<number>(3.0); // 물가상승률

    // 실질금리 계산 (피셔 방정식 적용)
    const result = useMemo(() => {
        // 공식: (1 + 명목) / (1 + 물가) - 1
        const realRateDecimal =
            (1 + nominalRate / 100) / (1 + inflationRate / 100) - 1;

        // 단순 차감 계산 (비교용)
        const simpleDiff = nominalRate - inflationRate;

        return {
            realRate: (realRateDecimal * 100).toFixed(2), // 소수점 2자리
            simpleDiff: simpleDiff.toFixed(2),
            purchasingPowerRetained: (100 / (1 + inflationRate / 100)).toFixed(1), // 구매력 보존율
        };
    }, [nominalRate, inflationRate]);

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100 font-sans">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                📉 실질금리 계산기
            </h2>
            <p className="text-center text-gray-500 text-sm mb-6">
                인플레이션을 감안한 내 자산의 진짜 수익률
            </p>

            {/* 입력 영역 */}
            <div className="space-y-5">
                <div>
                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                        <span>명목금리 (은행/채권 금리)</span>
                        <span className="text-blue-600 font-bold">{nominalRate}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.1"
                        value={nominalRate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNominalRate(Number(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div>
                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                        <span>물가상승률 (인플레이션)</span>
                        <span className="text-red-500 font-bold">{inflationRate}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        step="0.1"
                        value={inflationRate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInflationRate(Number(e.target.value))}
                        className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                </div>
            </div>

            {/* 결과 영역 */}
            <div className="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 font-medium">실질 금리</span>
                    <div className="text-right">
                        <span
                            className={`text-3xl font-bold ${Number(result.realRate) > 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            {result.realRate}%
                        </span>
                    </div>
                </div>

                {/* 시각화 바 */}
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                    {/* 전체 바 (명목금리 기준 100%로 잡았을 때 시각적 비율 - 단순 예시용) */}
                    <div
                        className="absolute top-0 left-0 h-full bg-blue-500"
                        style={{ width: '100%' }}
                    />
                    {/* 인플레이션 잠식 부분 */}
                    <div
                        className="absolute top-0 right-0 h-full bg-red-400 opacity-80"
                        style={{
                            width: `${Math.min((inflationRate / nominalRate) * 100, 100)}%`,
                            display: nominalRate > 0 ? 'block' : 'none'
                        }}
                    />
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>수익 구간 (파랑)</span>
                    <span>물가 잠식 (빨강)</span>
                </div>

                <hr className="my-4 border-gray-200" />

                {/* 인사이트 텍스트 */}
                <p className="text-sm text-gray-600 leading-relaxed">
                    {Number(result.realRate) <= 0 ? (
                        <span className="text-red-600 font-bold">⚠️ 자산 가치가 하락 중입니다.</span>
                    ) : (
                        <span className="text-green-600 font-bold">✅ 자산 가치가 상승 중입니다.</span>
                    )}
                    <br />
                    명목상으로는 {nominalRate}% 수익이지만, 물가가 {inflationRate}% 올라서
                    실제 구매력은 <span className="font-bold text-gray-800">{result.realRate}%</span>만큼만 증가했습니다.
                </p>
            </div>
        </div>
    );
}