import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// 🛠️ 여기를 수정하세요
export const metadata: Metadata = {
  title: '모두의 계산기 | 금융, 연봉, 투자를 한 번에',
  description: '복잡한 계산은 가라! 연봉 실수령액부터 SCHD 적립식 투자 시뮬레이션까지, 누구나 쉽게 사용하는 필수 금융 계산기 모음.',
  icons: {
    icon: '/favicon.ico', // 파비콘이 있다면 설정
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}