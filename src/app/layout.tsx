import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoguMeal",
  description: "家族みんなが笑顔になる、ハイブリッド型献立メーカー",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <AppProvider>
          <header className="bg-primary text-primary-foreground p-4 shadow-md flex flex-col sm:flex-row justify-between items-center gap-2">
            <Link href="/" className="flex items-center gap-3 text-2xl font-extrabold tracking-wider hover:opacity-80 transition">
              <img src="/logo.png" alt="MoguMeal Logo" className="w-10 h-10 object-contain bg-white rounded-full p-1" />
              MoguMeal
            </Link>
            <nav className="flex gap-4 text-sm font-bold opacity-90">
              <Link href="/settings" className="hover:underline hover:opacity-100 transition">⚙️ 設定</Link>
              <Link href="/" className="hover:underline hover:opacity-100 transition">📅 献立作成</Link>
              <Link href="/menu" className="hover:underline hover:opacity-100 transition">🍽️ 献立表</Link>
              <Link href="/recipes" className="hover:underline hover:opacity-100 transition">📖 レシピ図鑑</Link>
              <Link href="/favorites" className="hover:underline hover:opacity-100 transition">❤️ お気に入り</Link>
            </nav>
          </header>
          <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
