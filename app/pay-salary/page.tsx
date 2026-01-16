'use client';

import { useState, useMemo, useEffect } from 'react';

type CalculationMode = 'grossToNet' | 'netToGross';

export default function SalaryCalculator() {
    // --- 상태 관리 ---
    const [mode, setMode] = useState<CalculationMode>('grossToNet');

    // 입력값 1: 연봉 (Gross)
    const [preTaxYearly, setPreTaxYearly] = useState(60000000);

    // 입력값 2: 희망 월 실수령액 (Target Net)
    const [targetMonthlyNet, setTargetMonthlyNet] = useState(4000000);

    // 공통 설정
    const [nonTaxable, setNonTaxable] = useState(200000);
    const [dependents, setDependents] = useState(1);

    // --- 1. 정방향 계산 함수 (연봉 -> 실수령) ---
    const calculateNetPay = (yearlySalary: number) => {
        const monthlyTotal = yearlySalary / 12;
        const monthlyTaxable = monthlyTotal - nonTaxable;

        // 예외 처리 (음수 방지)
        if (monthlyTaxable <= 0) {
            return { monthlyTotal, netPay: monthlyTotal, totalDeduction: 0 };
        }

        // 국민연금 (4.5%, 상한 617만 기준)
        let pension = monthlyTaxable * 0.045;
        if (pension > 277650) pension = 277650;

        // 건강보험 (3.545%) & 장기요양 (12.95%)
        const health = monthlyTaxable * 0.03545;
        const care = health * 0.1295;

        // 고용보험 (0.9%)
        const employment = monthlyTaxable * 0.009;

        // 소득세 (간이세액 약식)
        let incomeTax = 0;
        const annualTaxable = monthlyTaxable * 12;

        if (annualTaxable <= 14000000) incomeTax = monthlyTaxable * 0.005;
        else if (annualTaxable <= 50000000) incomeTax = monthlyTaxable * 0.03;
        else if (annualTaxable <= 88000000) incomeTax = monthlyTaxable * 0.06;
        else if (annualTaxable <= 150000000) incomeTax = monthlyTaxable * 0.15;
        else incomeTax = monthlyTaxable * 0.22;

        if (dependents > 1) incomeTax = incomeTax * (1 - (dependents - 1) * 0.05);
        if (incomeTax < 0) incomeTax = 0;

        const localTax = incomeTax * 0.1;
        const totalDeduction = pension + health + care + employment + incomeTax + localTax;

        return {
            monthlyTotal,
            netPay: monthlyTotal - totalDeduction,
            totalDeduction,
            pension, health, care, employment, incomeTax, localTax // 상세 내역 반환
        };
    };

    // --- 2. 역방향 계산 함수 (실수령 -> 연봉) : 바이너리 서치 ---
    const calculateGrossFromNet = (targetNet: number) => {
        let low = 10000000;   // 최소 연봉 1천만원
        let high = 500000000; // 최대 연봉 5억
        let estimatedGross = low;
        let iterations = 0;

        // 50번 반복이면 1원 단위까지 충분히 찾음
        while (low <= high && iterations < 50) {
            const mid = Math.floor((low + high) / 2);
            const { netPay } = calculateNetPay(mid);

            if (Math.abs(netPay - targetNet) < 100) { // 오차 100원 이내면 종료
                return mid;
            }

            if (netPay < targetNet) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
            estimatedGross = mid;
            iterations++;
        }
        return estimatedGross;
    };

    // --- 결과 도출 ---
    // A. 연봉 입력 모드일 때의 결과
    const grossToNetResult = useMemo(() => calculateNetPay(preTaxYearly), [preTaxYearly, nonTaxable, dependents]);

    // B. 실수령 입력 모드일 때의 예상 연봉
    const estimatedGross = useMemo(() => calculateGrossFromNet(targetMonthlyNet), [targetMonthlyNet, nonTaxable, dependents]);
    const netToGrossResult = useMemo(() => calculateNetPay(estimatedGross), [estimatedGross, nonTaxable, dependents]);

    // 최종적으로 보여줄 데이터 (모드에 따라 선택)
    const finalResult = mode === 'grossToNet' ? grossToNetResult : netToGrossResult;
    const currentGross = mode === 'grossToNet' ? preTaxYearly : estimatedGross;


    // --- 연봉표 데이터 ---
    const salaryTableData = useMemo(() => {
        const data = [];
        for (let salary = 24000000; salary <= 150000000; salary += (salary < 100000000 ? 2000000 : 5000000)) {
            const res = calculateNetPay(salary);
            data.push({ salary, ...res });
        }
        return data;
    }, [nonTaxable, dependents]);

    // 포맷팅 함수
    const formatMoney = (val: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(Math.floor(val));
    const formatSimple = (val: number) => (val / 10000).toLocaleString() + '만원';

    return (
        <div className="max-w-xl mx-auto my-10 font-sans">

            {/* 탭 메뉴 */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button
                    onClick={() => setMode('grossToNet')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'grossToNet' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    연봉으로 계산
                </button>
                <button
                    onClick={() => setMode('netToGross')}
                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${mode === 'netToGross' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    실수령액으로 환산
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">

                {/* 모드별 입력창 */}
                {mode === 'grossToNet' ? (
                    <div className="mb-6">
                        <label className="text-sm font-bold text-gray-600 mb-2 block">현재 연봉</label>
                        <input
                            type="number"
                            value={preTaxYearly}
                            onChange={(e) => setPreTaxYearly(Number(e.target.value))}
                            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-right text-2xl font-extrabold text-green-700"
                        />
                    </div>
                ) : (
                    <div className="mb-6">
                        <label className="text-sm font-bold text-gray-600 mb-2 block">희망 월 실수령액</label>
                        <input
                            type="number"
                            value={targetMonthlyNet}
                            onChange={(e) => setTargetMonthlyNet(Number(e.target.value))}
                            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-right text-2xl font-extrabold text-blue-700"
                        />
                        <p className="text-xs text-right text-gray-400 mt-2">
                            월 {formatMoney(targetMonthlyNet)}을 받으려면 연봉이 얼마나 되어야 할까요?
                        </p>
                    </div>
                )}

                {/* 공통 설정 (접이식으로 만들어도 좋음) */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">비과세액</label>
                        <input type="number" value={nonTaxable} onChange={(e) => setNonTaxable(Number(e.target.value))} className="w-full p-2 border rounded text-right text-sm" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">부양가족</label>
                        <input type="number" value={dependents} onChange={(e) => setDependents(Number(e.target.value))} className="w-full p-2 border rounded text-right text-sm" />
                    </div>
                </div>

                {/* 결과 표시 영역 */}
                {mode === 'grossToNet' ? (
                    // 정방향 결과
                    <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                        <div className="flex justify-between items-center pb-2 border-b border-green-200 mb-2">
                            <span className="text-gray-600 text-sm">월 예상 실수령액</span>
                            <span className="text-2xl font-extrabold text-green-700">{formatMoney(finalResult.netPay)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>월 공제액 합계</span>
                            <span>-{formatMoney(finalResult.totalDeduction)}</span>
                        </div>
                    </div>
                ) : (
                    // 역방향 결과 (필요 연봉 표시)
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-center pb-2 border-b border-blue-200 mb-2">
                            <span className="text-gray-600 text-sm">필요 연봉 (계약액)</span>
                            <span className="text-2xl font-extrabold text-blue-700">{formatMoney(estimatedGross)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>월 실수령액 맞춤</span>
                            <span>{formatMoney(targetMonthlyNet)}</span>
                        </div>
                        <div className="mt-2 text-xs text-blue-500 text-center bg-white rounded py-1">
                            * 연봉 {formatSimple(Math.round(estimatedGross))} 계약 시 달성 가능
                        </div>
                    </div>
                )}
            </div>

            {/* --- 하단: 연봉표 (공통) --- */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">📊 구간별 실수령액표</h3>
                </div>

                <div className="grid grid-cols-3 bg-gray-100 p-3 text-xs font-bold text-gray-500 text-center sticky top-0">
                    <div>연봉</div>
                    <div>월 실수령액</div>
                    <div>공제액</div>
                </div>

                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {salaryTableData.map((row) => {
                        // 현재 계산된 연봉(currentGross)과 비슷한 구간 하이라이트
                        const isHighlight = Math.abs(row.salary - currentGross) < 1500000;
                        const highlightColor = mode === 'grossToNet' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';

                        return (
                            <div
                                key={row.salary}
                                className={`grid grid-cols-3 p-3 text-sm text-center border-b last:border-0 transition-colors ${isHighlight ? `${highlightColor} font-bold` : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="font-medium">{formatSimple(row.salary)}</div>
                                <div>{formatMoney(row.netPay)}</div>
                                <div className="text-gray-400 text-xs flex items-center justify-center">
                                    -{formatMoney(row.totalDeduction)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}