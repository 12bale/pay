'use client';

import { useState } from 'react';

import WealthCalculator from './pay-chart/page';       // 적립식 복리 계산기
import RealRateCalculator from './pay-interest-rate/page';   // 실질금리 계산기
import SalaryCalculator from './pay-salary/page';       // 연봉 계산기
import HairCalculator from './pay/page';       // 급여

type ToolType = 'home' | 'wealth' | 'rate' | 'salary' | 'hair';

export default function Dashboard() {
  const [activeTool, setActiveTool] = useState<ToolType>('home');

  // 도구 선택 시 화면 전환 함수
  const renderContent = () => {
    switch (activeTool) {
      case 'wealth':
        return <WealthCalculator />;
      case 'rate':
        return <RealRateCalculator />;
      case 'salary':
        return <SalaryCalculator />;
      case 'hair':
        return <HairCalculator />;
      default:
        return <HomeGrid onNavigate={setActiveTool} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* 상단 네비게이션 바 */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              className="font-bold text-xl text-gray-900 cursor-pointer flex items-center gap-2"
              onClick={() => setActiveTool('home')}
            >
              <span className="bg-indigo-600 text-white p-1 rounded-lg">💰</span>
              <span>Finance Lab</span>
            </div>

            {activeTool !== 'home' && (
              <button
                onClick={() => setActiveTool('home')}
                className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition"
              >
                ← 메인으로 돌아가기
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {renderContent()}
      </main>

      {/* 푸터 */}
      <footer className="text-center text-gray-400 text-xs py-10">
        © 2026 Finance Lab. Built with Next.js & Tailwind CSS.
      </footer>
    </div>
  );
}

// 메인 그리드 컴포넌트 (진입 화면)
function HomeGrid({ onNavigate }: { onNavigate: (tool: ToolType) => void }) {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* 히어로 섹션 */}
      <div className="text-center space-y-4 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          내 자산의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">진짜 가치</span>를<br />
          발견하세요.
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          복잡한 금융 계산은 도구에게 맡기고, 당신은 미래를 설계하세요.<br />
          SCHD 투자부터 연봉 협상까지, 모든 시나리오를 시뮬레이션합니다.
        </p>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 1. 적립식 복리 계산기 카드 */}
        <div
          onClick={() => onNavigate('wealth')}
          className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:w-2 transition-all"></div>
          <div className="mb-4 bg-indigo-50 w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            📈
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            자산 성장 시뮬레이터
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            매월 적립금과 배당 재투자를 고려한 10년 뒤 자산 가치를 계산합니다. (물가상승 반영)
          </p>
          <div className="text-indigo-600 text-sm font-semibold flex items-center">
            계산하기 <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* 2. 연봉 실수령액 계산기 카드 */}
        <div
          onClick={() => onNavigate('salary')}
          className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500 group-hover:w-2 transition-all"></div>
          <div className="mb-4 bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            💼
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
            연봉/실수령 계산기
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            "월 500 받으려면 연봉 얼마?"<br />
            4대보험과 세금을 공제한 실제 통장에 찍히는 돈을 확인하세요.
          </p>
          <div className="text-green-600 text-sm font-semibold flex items-center">
            계산하기 <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* 3. 실질금리 계산기 카드 */}
        <div
          onClick={() => onNavigate('rate')}
          className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500 group-hover:w-2 transition-all"></div>
          <div className="mb-4 bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            📉
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-500 transition-colors">
            실질 금리 계산기
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            내 예금 이자가 물가상승률을 이길 수 있을까? 명목금리의 함정을 피하세요.
          </p>
          <div className="text-red-500 text-sm font-semibold flex items-center">
            계산하기 <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* 4. 급여 계산기 카드 */}
        <div
          onClick={() => onNavigate('hair')}
          className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 group-hover:w-2 transition-all"></div>
          <div className="mb-4 bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            💇
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
            급여 계산기
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            근무 시간과 매출을 기반으로 급여를 계산합니다.
          </p>
          <div className="text-purple-600 text-sm font-semibold flex items-center">
            계산하기 <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>

      {/* 빠른 링크 섹션 (Optional) */}
      <div className="mt-12 bg-gray-100 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="font-bold text-gray-800">🚀 아직 엑셀로 관리하시나요?</h4>
          <p className="text-sm text-gray-500">배당금 관리와 목표 달성률을 웹에서 바로 확인하세요.</p>
        </div>
        <button className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition shadow-lg">
          지금 시작하기
        </button>
      </div>
    </div>
  );
}