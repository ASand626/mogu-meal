'use client';

import { useAppContext } from '../context/AppContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loadingAuth, isGuest, startGuestMode, login } = useAppContext();

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

  if (!user && !isGuest) {
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
              onClick={login} 
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-primary/95 transition flex items-center justify-center gap-2 transform active:scale-95"
            >
              <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Googleアカウントでログイン / 新規登録
            </button>
            <button 
              onClick={startGuestMode} 
              className="w-full bg-secondary/30 text-primary font-bold py-3.5 rounded-xl hover:bg-secondary/50 transition flex items-center justify-center gap-2 transform active:scale-95"
            >
              ログインせずに使う（ゲストモード）
            </button>
            <p className="text-[10px] text-foreground/50 mt-2">
              ※ログインせずに使う場合、データの保持ができません。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
