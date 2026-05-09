'use client';

import { useAppContext } from '../context/AppContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loadingAuth, login } = useAppContext();

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <img src="/logo.png" alt="Loading" className="w-16 h-16 animate-bounce" />
          <p className="font-bold text-primary animate-pulse">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
          <img src="/logo.png" alt="MoguMeal" className="w-24 h-24 mb-4 drop-shadow-md" />
          <h1 className="text-2xl font-extrabold text-primary mb-2">MoguMeal</h1>
          <p className="text-sm text-foreground/70 mb-8 font-medium">
            家族みんなが笑顔になる<br />ハイブリッド型献立メーカー
          </p>

          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={() => login(true)} 
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-primary/90 transition flex items-center justify-center gap-2"
            >
              はじめての方（アカウント作成）
            </button>
            <button 
              onClick={() => login(false)} 
              className="w-full bg-secondary/30 text-primary font-bold py-3.5 rounded-xl hover:bg-secondary/50 transition flex items-center justify-center gap-2"
            >
              ログイン
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
