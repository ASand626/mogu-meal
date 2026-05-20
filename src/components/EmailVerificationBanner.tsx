'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function EmailVerificationBanner() {
  const { user, sendVerificationEmail, reloadUser } = useAppContext();
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 再送ボタンのクールダウン用タイマー
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // ユーザーがログインしていない、またはすでに認証済みの場合は表示しない
  if (!user || user.emailVerified) {
    return null;
  }

  // Googleログインユーザーなど、パスワード認証以外のユーザーは対象外
  const isEmailUser = user.providerData.some((p) => p.providerId === 'password');
  if (!isEmailUser) {
    return null;
  }

  const handleResend = async () => {
    if (resending || cooldown > 0) return;
    setResending(true);
    setStatusMsg(null);
    try {
      await sendVerificationEmail();
      setStatusMsg({ type: 'success', text: '認証メールを再送信しました。受信トレイをご確認ください。' });
      setCooldown(30); // 30秒のクールダウンを設定
    } catch (error: any) {
      console.error(error);
      const friendlyMsg = error.code === 'auth/too-many-requests'
        ? '送信回数が多すぎます。しばらく時間をおいてから再試行してください。'
        : 'メールの再送信に失敗しました。もう一度お試しください。';
      setStatusMsg({ type: 'error', text: friendlyMsg });
    } finally {
      setResending(false);
    }
  };

  const handleReload = async () => {
    setStatusMsg(null);
    try {
      await reloadUser();
      // 成功した場合、自動的にemailVerifiedがtrueになり、このバナー自体が非表示になる
    } catch (error) {
      console.error(error);
      setStatusMsg({ type: 'error', text: '状態の更新に失敗しました。' });
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-3 shadow-inner">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl shrink-0" role="img" aria-label="warning">⚠️</span>
          <div className="text-sm font-bold text-center md:text-left">
            メールアドレスの認証が完了していません。届いた確認メールのリンクをクリックして認証を完了してください。
            {statusMsg && (
              <span className={`block md:inline-block md:ml-3 text-xs ${statusMsg.type === 'success' ? 'text-emerald-700 font-extrabold' : 'text-rose-600 font-bold'}`}>
                {statusMsg.text}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-center md:justify-end">
          {/* 再送ボタン */}
          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold text-xs rounded-lg transition transform active:scale-95 disabled:scale-100 shadow-sm focus:outline-none"
          >
            {resending ? '送信中...' : cooldown > 0 ? `再送まで ${cooldown}秒` : 'メールを再送する'}
          </button>

          {/* 状態更新ボタン */}
          <button
            onClick={handleReload}
            className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-lg transition transform active:scale-95 shadow-sm focus:outline-none flex items-center gap-1"
          >
            <span>🔄</span> 認証を確認
          </button>
        </div>
      </div>
    </div>
  );
}
