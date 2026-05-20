'use client';

import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthButton() {
  const { user, login, logout, loadingAuth, isLoggingIn } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  if (loadingAuth) return <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse"></div>;

  if (user) {
    // アバター描画ヘルパー
    const renderAvatar = (sizeClass: string, textClass: string = "text-sm") => {
      if (user.photoURL) {
        return <img src={user.photoURL} alt="User" className={`${sizeClass} rounded-full object-cover bg-white shrink-0`} />;
      }
      const initial = user.displayName ? user.displayName.charAt(0) : (user.email ? user.email.charAt(0).toUpperCase() : 'M');
      return (
        <div className={`${sizeClass} rounded-full bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center font-black uppercase shrink-0 ${textClass}`}>
          {initial}
        </div>
      );
    };

    return (
      <div className="relative">
        {/* アカウントボタン（タップでメニューを開閉） */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center gap-2 hover:opacity-90 transition bg-white/10 hover:bg-white/20 rounded-full pr-3 pl-1 py-1 text-sm font-bold shadow-sm border border-white/20 focus:outline-none"
        >
          {renderAvatar("w-7 h-7", "text-xs")}
          <span className="hidden sm:inline text-white">マイアカウント</span>
        </button>

        {/* バックドロップとメニューのアニメーション制御 */}
        <AnimatePresence>
          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 cursor-default" 
                onClick={() => setIsOpen(false)}
              />

              {/* ドロップダウンメニュー（ポップオーバー） */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl py-4 px-4 border border-slate-100 z-50 flex flex-col items-center text-center text-slate-800 origin-top-right"
              >
                <div className="mb-2">
                  {renderAvatar("w-16 h-16 border-2 border-primary/20 shadow-sm", "text-2xl")}
                </div>
                <div className="font-extrabold text-sm truncate max-w-full">
                  {user.displayName || 'ユーザー名未設定'}
                </div>
                <div className="text-xs text-slate-400 truncate max-w-full mb-3 font-medium">
                  {user.email || ''}
                </div>

                <hr className="w-full border-slate-100 mb-3" />

                <button 
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-2.5 px-4 rounded-xl text-sm transition transform active:scale-95 flex items-center justify-center gap-1.5 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  ログアウト
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <button 
      onClick={login} 
      disabled={isLoggingIn}
      className="flex items-center gap-2 hover:opacity-90 transition bg-white text-primary rounded-full px-4 py-1.5 text-sm font-bold shadow-md disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-95 disabled:scale-100"
    >
      {isLoggingIn ? (
        <>
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>ログイン中...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>ログイン</span>
        </>
      )}
    </button>
  );
}
