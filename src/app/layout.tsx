import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import Link from "next/link";

import AuthButton from "../components/AuthButton";
import AuthGuard from "../components/AuthGuard";
import ErrorBoundary from "../components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#D35400",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "MoguMeal",
  description: "家族みんなが笑顔になる、ハイブリッド型献立メーカー",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MoguMeal",
  },
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
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] pb-20 md:pb-0">
        <ErrorBoundary>
        <AppProvider>
          <AuthGuard>
            <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center gap-2 relative z-10">
              <Link href="/" className="flex items-center gap-3 text-2xl font-extrabold tracking-wider hover:opacity-80 transition shrink-0">
                <img src="/logo.png" alt="MoguMeal Logo" className="w-10 h-10 object-contain bg-white rounded-full p-1" />
                <span className="hidden sm:inline">MoguMeal</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <nav className="hidden md:flex gap-4 text-sm font-bold opacity-90">
                  <Link href="/settings" className="hover:underline hover:opacity-100 transition">⚙️ 設定</Link>
                  <Link href="/" className="hover:underline hover:opacity-100 transition">📅 献立作成</Link>
                  <Link href="/menu" className="hover:underline hover:opacity-100 transition">🍽️ 献立表</Link>
                  <Link href="/recipes" className="hover:underline hover:opacity-100 transition">📖 レシピ図鑑</Link>
                  <Link href="/favorites" className="hover:underline hover:opacity-100 transition">❤️ お気に入り</Link>
                </nav>
                <AuthButton />
              </div>
            </header>
            
            <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
              {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] flex justify-around items-center pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] px-2 z-50">
            <Link href="/" className="flex flex-col items-center gap-1 p-1 text-primary/80 hover:text-primary transition w-16">
              <span className="text-xl">📅</span>
              <span className="text-[10px] font-bold">作成</span>
            </Link>
            <Link href="/menu" className="flex flex-col items-center gap-1 p-1 text-primary/80 hover:text-primary transition w-16">
              <span className="text-xl">🍽️</span>
              <span className="text-[10px] font-bold">献立表</span>
            </Link>
            <Link href="/recipes" className="flex flex-col items-center gap-1 p-1 text-primary/80 hover:text-primary transition w-16">
              <span className="text-xl">📖</span>
              <span className="text-[10px] font-bold">レシピ</span>
            </Link>
            <Link href="/favorites" className="flex flex-col items-center gap-1 p-1 text-primary/80 hover:text-primary transition w-16">
              <span className="text-xl">❤️</span>
              <span className="text-[10px] font-bold">お気に入り</span>
            </Link>
            <Link href="/settings" className="flex flex-col items-center gap-1 p-1 text-primary/80 hover:text-primary transition w-16">
              <span className="text-xl">⚙️</span>
              <span className="text-[10px] font-bold">設定</span>
            </Link>
          </nav>
          </AuthGuard>
        </AppProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
