'use client';

import { useState, useMemo } from 'react';

export default function WealthCalculator() {
    // --- 상태 관리 ---
    const [initialPrincipal, setInitialPrincipal] = useState(10000000);
    const [monthlyContribution, setMonthlyContribution] = useState(500000);
    const [years, setYears] = useState(10);
    const [annualRate, setAnnualRate] = useState(9.0); // SCHD+성장 고려하여 9% 기본값 추천
    const [inflationRate, setInflationRate] = useState(2.3);
    const [applyTax, setApplyTax] = useState(true);
    const [applyInflation, setApplyInflation] = useState(false);

    // --- 계산 로직 (차트 데이터 생성 포함) ---
    const { result, yearlyData } = useMemo(() => {
        let currentBalance = initialPrincipal;
        let totalPrincipal = initialPrincipal;

        // 차트용 데이터 배열
        const data = [];

        // 0년차 (시작점) 데이터
        data.push({
            year: 0,
            principal: initialPrincipal,
            interest: 0,
            total: initialPrincipal,
        });

        const monthlyRate = annualRate / 100 / 12;

        for (let year = 1; year <= years; year++) {
            // 12개월 반복 (월복리)
            for (let month = 1; month <= 12; month++) {
                const interest = currentBalance * monthlyRate;
                currentBalance += interest;
                currentBalance += monthlyContribution;
                totalPrincipal += monthlyContribution;
            }

            // 세금 및 물가 반영 계산 (단순 표시용)
            const rawInterest = currentBalance - totalPrincipal;
            const tax = applyTax ? rawInterest * 0.154 : 0;
            let netBalance = currentBalance - tax;
            let netInterest = rawInterest - tax;
            let netPrincipal = totalPrincipal;

            // 물가상승률 반영 (할인)
            if (applyInflation) {
                const discountFactor = Math.pow(1 + inflationRate / 100, year);
                netBalance = netBalance / discountFactor;
                // 물가 반영 시 원금 가치도 줄어든 것으로 표현할지, 
                // 총액에서 원금을 뺀 나머지를 수익으로 볼지 결정 필요.
                // 여기서는 '구매력 기준 총액'을 우선시하여 수익금을 재조정함.
                // (원금의 명목 금액은 유지되지만 실질 가치는 하락함)
                netPrincipal = totalPrincipal / discountFactor;
                netInterest = netBalance - netPrincipal;
            }

            data.push({
                year,
                principal: netPrincipal,
                interest: netInterest,
                total: netBalance,
            });
        }

        const lastData = data[data.length - 1];

        return {
            yearlyData: data,
            result: {
                totalPrincipal: lastData.principal,
                finalInterest: lastData.interest,
                finalAmount: lastData.total,
                yieldRate: ((lastData.total - lastData.principal) / lastData.principal) * 100
            }
        };
    }, [initialPrincipal, monthlyContribution, years, annualRate, inflationRate, applyTax, applyInflation]);

    // 화폐 포맷팅
    const formatMoney = (val: number) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Math.round(val));

    // 차트 최대 높이 계산용 (Y축 스케일)
    const maxChartValue = yearlyData[yearlyData.length - 1].total * 1.1; // 여유분 10%

    return (
        <div className="max-w-2xl mx-auto my-10 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 font-sans">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📊 자산 성장 시뮬레이터
            </h2>

            {/* --- 입력 폼 --- */}
            <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">초기 투자금</label>
                        <input type="number" value={initialPrincipal} onChange={(e) => setInitialPrincipal(Number(e.target.value))}
                            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none text-right" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">매월 적립금</label>
                        <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none text-right" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">기간 (년)</label>
                        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))}
                            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none text-right" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">연 수익률(%)</label>
                        <input type="number" step="0.1" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))}
                            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-right text-blue-600 font-bold" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">물가상승(%)</label>
                        <input type="number" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))}
                            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none text-right text-red-500" />
                    </div>
                </div>

                <div className="flex gap-4 pt-2 justify-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={applyTax} onChange={(e) => setApplyTax(e.target.checked)} className="accent-indigo-600 w-4 h-4" />
                        <span className="text-sm text-gray-700">이자 과세 (15.4%)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={applyInflation} onChange={(e) => setApplyInflation(e.target.checked)} className="accent-red-500 w-4 h-4" />
                        <span className="text-sm text-gray-700">물가상승 반영</span>
                    </label>
                </div>
            </div>

            {/* --- 차트 영역 (CSS Only) --- */}
            {/* --- 차트 영역 (CSS Only) --- */}
            <div className="mt-8">
                <h3 className="text-sm font-bold text-gray-500 mb-4">📈 연도별 자산 추이</h3>
                {/* 차트 컨테이너: 높이(h-64)와 바닥 정렬(items-end) 필수 */}
                <div className="relative h-64 border-b border-l border-gray-300 flex items-end justify-between px-2 gap-1 md:gap-2">
                    {yearlyData.map((data, index) => {
                        // 막대 높이 계산 (전체 차트 높이 대비 비율)
                        const heightPercent = (data.total / maxChartValue) * 100;

                        // 막대 내부 비율 (원금 vs 수익)
                        // 0으로 나누기 방지
                        const principalPercent = data.total > 0 ? (data.principal / data.total) * 100 : 0;
                        const interestPercent = 100 - principalPercent;

                        // 라벨 표시 간격 (데이터가 많으면 5년 단위로 표시)
                        const showLabel = years > 20 ? index % 5 === 0 : true;

                        return (
                            <div
                                key={data.year}
                                className="relative flex-1 flex flex-col justify-end group"
                                style={{ height: `${heightPercent}%` }} // 바 전체 높이 설정
                            >

                                {/* 툴팁 (Hover 시 표시) */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10 shadow-lg pointer-events-none">
                                    <div className="font-bold">{data.year}년차</div>
                                    <div>총액: {formatMoney(data.total)}</div>
                                    <div className="text-gray-300">원금: {formatMoney(data.principal)}</div>
                                    <div className="text-yellow-300">수익: {formatMoney(data.interest)}</div>
                                </div>

                                {/* 막대 그래프 (Stacked Bar) */}
                                {/* [수정됨] h-full 추가: 부모 높이를 100% 채워야 내부 %가 작동함 */}
                                <div className="w-full h-full rounded-t-sm overflow-hidden flex flex-col-reverse shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gray-100">
                                    {/* 원금 영역 (연한 색) */}
                                    <div style={{ height: `${principalPercent}%` }} className="bg-indigo-300 w-full transition-all duration-500"></div>
                                    {/* 수익 영역 (진한 색) */}
                                    <div style={{ height: `${interestPercent}%` }} className="bg-indigo-600 w-full transition-all duration-500"></div>
                                </div>

                                {/* X축 라벨 */}
                                {showLabel && (
                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 whitespace-nowrap">
                                        {data.year === 0 ? '시작' : `${data.year}년`}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- 최종 결과 요약 --- */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col items-center">
                <p className="text-gray-500 text-sm mb-1">{years}년 후 예상 수령액</p>
                <div className="text-4xl font-extrabold text-indigo-700 mb-2">
                    {formatMoney(result.finalAmount)}
                </div>
                <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">원금: {formatMoney(result.totalPrincipal)}</span>
                    <span className="text-indigo-600 font-bold">수익: +{formatMoney(result.finalInterest)}</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                    총 수익률: <span className={result.yieldRate > 0 ? "text-red-500" : "text-blue-500"}>{result.yieldRate.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    );
}