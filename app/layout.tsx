import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '命画 - 基于生辰信息的专属艺术画作生成器',
  description: '输入您的出生时间，AI将结合传统文化与现代艺术算法，为您创作独一无二的专属艺术作品。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>{children}</body>
    </html>
  )
}