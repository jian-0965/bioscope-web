import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BioScope · 生物科学可视化科普平台",
  description: "从人体到分子，进入生命的微观世界。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
