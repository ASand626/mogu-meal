'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { 
    user, 
    loadingAuth, 
    isGuest, 
    isLoggingIn, 
    startGuestMode, 
    login, 
    loginWithEmail, 
    signUpWithEmail, 
    resetPassword 
  } = useAppContext();

  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');

  // 未ログイン時にURLが /settings や /menu のまま残るのを防ぐため、ルートへリセット
  useEffect(() => {
    if (!loadingAuth && !user && !isGuest) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/' && currentPath !== '/login') {
          router.push('/');
        }
      }
    }
  }, [user, isGuest, loadingAuth, router]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Firebaseエラーコードの日本語マッピング
  const getFriendlyErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-email':
        return '有効なメールアドレスの形式で入力してください。';
      case 'auth/user-disabled':
        return 'このアカウントは無効化されています。';
      case 'auth/user-not-found':
        return 'アカウントが見つかりませんでした。新規登録を行ってください。';
      case 'auth/wrong-password':
        return 'パスワードが間違っています。';
      case 'auth/email-already-in-use':
        return 'このメールアドレスは既に登録されています。';
      case 'auth/weak-password':
        return 'パスワードは6文字以上で入力してください。';
      case 'auth/network-request-failed':
        return 'ネットワークエラーが発生しました。通信環境を確認してください。';
      case 'auth/too-many-requests':
        return '試行回数が多すぎるため、一時的にロックされています。しばらく時間をおいて再試行してください。';
      case 'auth/invalid-credential':
        return 'メールアドレスまたはパスワードが間違っています。';
      case 'auth/operation-not-allowed':
        return 'メール/パスワード認証がFirebaseで有効になっていません。Firebase ConsoleのAuthentication -> Sign-in methodで「メール/パスワード」を有効に設定してください。';
      default:
        return 'エラーが発生しました。もう一度お試しください。';
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('メールアドレスとパスワードを入力してください。');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setErrorMsg(getFriendlyErrorMessage(err.code || err.message));
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setErrorMsg('すべての項目を入力してください。');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('パスワードと確認用パスワードが一致しません。');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await signUpWithEmail(email, password);
    } catch (err: any) {
      setErrorMsg(getFriendlyErrorMessage(err.code || err.message));
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('メールアドレスを入力してください。');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await resetPassword(email);
      setSuccessMsg('パスワード再設定用のメールを送信しました。メールをご確認ください。');
    } catch (err: any) {
      setErrorMsg(getFriendlyErrorMessage(err.code || err.message));
    }
  };

  const switchMode = (newMode: 'login' | 'signup' | 'reset') => {
    setErrorMsg('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
    setMode(newMode);
  };

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100 p-4">
        {/* モックアップ準拠の白いカード型ログインコンテナ */}
        <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-slate-200/60 flex flex-col relative overflow-hidden animate-in fade-in zoom-in duration-300">
          
          {/* 進捗ローディング中の場合の上品なブロック表示 */}
          {isLoggingIn ? (
            <div className="flex flex-col items-center py-16 gap-4 min-h-[380px] justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-primary animate-pulse text-sm">
                ログイン中 / データを同期中...
              </p>
              <p className="text-xs text-foreground/50">そのまま少々お待ちください</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {mode === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col w-full"
                >
                  {/* タイトル */}
                  <h1 className="text-2xl font-black text-slate-800 text-center mb-6">ログイン</h1>

                  {/* エラー・成功メッセージ */}
                  {errorMsg && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-3 text-xs font-bold mb-4">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleEmailLogin} className="flex flex-col w-full">
                    {/* ログインID */}
                    <div className="flex flex-col mb-4">
                      <label className="text-sm font-bold text-slate-700 mb-1.5 align-left text-left">
                        ログインID
                      </label>
                      <input
                        type="email"
                        placeholder="メールアドレスを入力"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition font-medium"
                        required
                      />
                    </div>

                    {/* パスワード */}
                    <div className="flex flex-col mb-2">
                      <label className="text-sm font-bold text-slate-700 mb-1.5 align-left text-left">
                        パスワード
                      </label>
                      <input
                        type="password"
                        placeholder="パスワードを入力"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition font-medium"
                        required
                      />
                    </div>

                    {/* パスワードをお忘れですか？ */}
                    <div className="text-right mb-6">
                      <button
                        type="button"
                        onClick={() => switchMode('reset')}
                        className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline transition"
                      >
                        パスワードをお忘れですか？
                      </button>
                    </div>

                    {/* ログインするボタン */}
                    <button
                      type="submit"
                      className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3.5 rounded-xl shadow-md transition transform active:scale-95 text-center text-sm font-bold mb-3"
                    >
                      ログインする
                    </button>

                    {/* 新規登録ボタン */}
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="w-full bg-white border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#eff6ff] font-bold py-3 rounded-xl transition transform active:scale-95 text-center text-sm font-bold mb-6"
                    >
                      新規登録
                    </button>
                  </form>

                  {/* または Google アカウントでログイン (追加要件) */}
                  <div className="relative flex items-center justify-center my-1 mb-5">
                    <hr className="w-full border-slate-200" />
                    <span className="absolute bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      または Googleアカウントでログイン
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={login}
                    className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl shadow-sm transition transform active:scale-95 flex items-center justify-center gap-2 mb-6"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2-3.428 0-6.22-2.793-6.22-6.22s2.792-6.22 6.22-6.22c1.558 0 2.973.576 4.07 1.522l3.057-3.057C19.23 2.87 15.932 1.4 12.24 1.4 6.27 1.4 1.4 6.27 1.4 12.24s4.87 10.84 10.84 10.84c6.262 0 10.428-4.4 10.428-10.628 0-.683-.075-1.344-.22-1.986H12.24z" />
                    </svg>
                    Googleでログイン / 登録
                  </button>

                  {/* ログインせず使用するリンク */}
                  <div className="text-center mt-1">
                    <button
                      type="button"
                      onClick={startGuestMode}
                      className="text-sm font-bold text-sky-600 hover:text-sky-700 underline hover:no-underline transition"
                    >
                      ログインせず使用する
                    </button>
                  </div>
                </motion.div>
              )}

              {mode === 'signup' && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col w-full"
                >
                  <h1 className="text-2xl font-black text-slate-800 text-center mb-6">新規登録</h1>

                  {errorMsg && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-3 text-xs font-bold mb-4">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleEmailSignUp} className="flex flex-col w-full">
                    {/* メールアドレス */}
                    <div className="flex flex-col mb-4">
                      <label className="text-sm font-bold text-slate-700 mb-1.5 align-left text-left">
                        メールアドレス
                      </label>
                      <input
                        type="email"
                        placeholder="メールアドレスを入力"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition font-medium"
                        required
                      />
                    </div>

                    {/* パスワード */}
                    <div className="flex flex-col mb-4">
                      <label className="text-sm font-bold text-slate-700 mb-1.5 align-left text-left">
                        パスワード
                      </label>
                      <input
                        type="password"
                        placeholder="6文字以上のパスワード"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition font-medium"
                        required
                      />
                    </div>

                    {/* 確認用パスワード */}
                    <div className="flex flex-col mb-6">
                      <label className="text-sm font-bold text-slate-700 mb-1.5 align-left text-left">
                        確認用パスワード
                      </label>
                      <input
                        type="password"
                        placeholder="もう一度パスワードを入力"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition font-medium"
                        required
                      />
                    </div>

                    {/* アカウント作成ボタン */}
                    <button
                      type="submit"
                      className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-primary/95 transition flex items-center justify-center gap-2 transform active:scale-95 text-sm mb-4"
                    >
                      アカウントを作成する
                    </button>

                    {/* ログイン画面へ戻る */}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="w-full bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold py-3 rounded-xl transition transform active:scale-95 text-center text-sm font-bold"
                    >
                      ログイン画面に戻る
                    </button>
                  </form>
                </motion.div>
              )}

              {mode === 'reset' && (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col w-full"
                >
                  <h1 className="text-xl font-black text-slate-800 text-center mb-2">パスワード再設定</h1>
                  <p className="text-xs text-slate-400 text-center mb-6 leading-relaxed">
                    登録されているメールアドレス宛に、パスワード再設定用のURLを送付します。
                  </p>

                  {errorMsg && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-3 text-xs font-bold mb-4">
                      {errorMsg}
                    </div>
                  )}

                  {successMsg && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl p-3.5 text-xs font-bold mb-6 leading-relaxed">
                      {successMsg}
                    </div>
                  )}

                  <form onSubmit={handlePasswordReset} className="flex flex-col w-full">
                    {/* メールアドレス */}
                    <div className="flex flex-col mb-6">
                      <label className="text-sm font-bold text-slate-700 mb-1.5 align-left text-left">
                        メールアドレス
                      </label>
                      <input
                        type="email"
                        placeholder="メールアドレスを入力"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition font-medium"
                        required
                      />
                    </div>

                    {/* 送信ボタン */}
                    <button
                      type="submit"
                      className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3.5 rounded-xl shadow-md transition transform active:scale-95 text-center text-sm font-bold mb-4"
                    >
                      リセットメールを送信する
                    </button>

                    {/* ログイン画面へ戻る */}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="w-full bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold py-3 rounded-xl transition transform active:scale-95 text-center text-sm font-bold"
                    >
                      ログイン画面に戻る
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
