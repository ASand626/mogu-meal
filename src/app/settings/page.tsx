'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import { Appliance, ChildPreference } from '../../types';

export default function SettingsPage() {
  const router = useRouter();
  const { userPreference, setUserPreference, user, changePassword, updateDisplayName } = useAppContext();

  // メールアドレスログインユーザーであるかを判定
  const isEmailUser = user?.providerData.some((p) => p.providerId === 'password');

  // アクティブなタブステート (family: 家族・器具, account: アカウント情報)
  const [activeTab, setActiveTab] = useState<'family' | 'account'>('family');

  // ユーザー名設定・変更用ステート
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const [nameUpdating, setNameUpdating] = useState(false);

  // パスワード変更用ステート
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwChanging, setPwChanging] = useState(false);

  // ユーザーオブジェクトがロード・更新されたらユーザー名入力欄を同期
  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  // 優先順位の初期状態として、使えるすべての器具をデフォルトセット
  const defaultAppliances: Appliance[] = ['ホットクック', 'ヘルシオ（オーブン/レンジ機能）', 'フライパン', '鍋'];

  const [familyConfig, setFamilyConfig] = useState(userPreference || {
    adultCount: 2,
    childCount: 1,
    children: [
      { id: '1', name: '子供1', likedIngredients: [], dislikedIngredients: [] }
    ],
    appliances: defaultAppliances,
    appliancePriorities: defaultAppliances // デフォルト優先順位
  });

  // Firestoreからデータがロードされたらフォームのステートを更新する
  useEffect(() => {
    if (userPreference) {
      setFamilyConfig(userPreference);
    }
  }, [userPreference]);

  const handleChildCountChange = (newCount: number) => {
    let newChildren = [...familyConfig.children];
    if (newCount > newChildren.length) {
      // 足りない分を追加
      for (let i = newChildren.length; i < newCount; i++) {
        newChildren.push({
          id: String(i + 1),
          name: `子供${i + 1}`,
          likedIngredients: [],
          dislikedIngredients: []
        });
      }
    } else if (newCount < newChildren.length) {
      // 多い分を削除
      newChildren = newChildren.slice(0, newCount);
    }
    setFamilyConfig({ ...familyConfig, childCount: newCount, children: newChildren });
  };

  const handleChildIngredientChange = (childIndex: number, field: 'likedIngredients' | 'dislikedIngredients', value: string) => {
    const newChildren = [...familyConfig.children];
    newChildren[childIndex][field] = value.split(',').map(s => s.trim()).filter(Boolean);
    setFamilyConfig({ ...familyConfig, children: newChildren });
  };

  const handleApplianceToggle = (appliance: Appliance) => {
    let currentApps = [...familyConfig.appliances];
    let currentPrios = familyConfig.appliancePriorities ? [...familyConfig.appliancePriorities] : [];

    if (currentApps.includes(appliance)) {
      currentApps = currentApps.filter(a => a !== appliance);
      currentPrios = currentPrios.filter(a => a !== appliance);
    } else {
      currentApps.push(appliance);
      currentPrios.push(appliance);
    }
    setFamilyConfig({ ...familyConfig, appliances: currentApps, appliancePriorities: currentPrios });
  };

  const movePriority = (index: number, direction: 'up' | 'down') => {
    const prios = familyConfig.appliancePriorities ? [...familyConfig.appliancePriorities] : [...familyConfig.appliances];
    if (direction === 'up' && index > 0) {
      [prios[index - 1], prios[index]] = [prios[index], prios[index - 1]];
    } else if (direction === 'down' && index < prios.length - 1) {
      [prios[index + 1], prios[index]] = [prios[index], prios[index + 1]];
    }
    setFamilyConfig({ ...familyConfig, appliancePriorities: prios });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // もし Priorities がなければ設定する
    const finalConfig = { ...familyConfig };
    if (!finalConfig.appliancePriorities) {
      finalConfig.appliancePriorities = [...finalConfig.appliances];
    }
    setUserPreference(finalConfig);
    router.push('/'); // 設定完了後はトップ（献立生成カレンダー）へ
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPwError('すべての項目を入力してください。');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwError('新しいパスワードと確認用パスワードが一致しません。');
      return;
    }
    if (newPassword.length < 6) {
      setPwError('新しいパスワードは6文字以上で入力してください。');
      return;
    }

    setPwError('');
    setPwSuccess('');
    setPwChanging(true);

    try {
      await changePassword(currentPassword, newPassword);
      setPwSuccess('パスワードが正常に変更されました。');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      console.error("Password change failed:", err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPwError('現在のパスワードが正しくありません。');
      } else if (err.code === 'auth/weak-password') {
        setPwError('新しいパスワードが脆弱です。6文字以上の別のパスワードを入力してください。');
      } else {
        setPwError('パスワードの変更に失敗しました。現在のパスワードを確認の上、再度お試しください。');
      }
    } finally {
      setPwChanging(false);
    }
  };

  const handleNameChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setNameError('ユーザー名を入力してください。');
      return;
    }
    setNameError('');
    setNameSuccess('');
    setNameUpdating(true);

    try {
      await updateDisplayName(displayName.trim());
      setNameSuccess('ユーザー名を設定・変更しました。');
    } catch (err: any) {
      console.error("Failed to update name:", err);
      setNameError('ユーザー名の更新に失敗しました。もう一度お試しください。');
    } finally {
      setNameUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">設定とマイアカウント</h1>
        <p className="text-foreground opacity-70">ご家庭の設定やアカウント情報を変更・確認できます</p>
      </div>

      {/* タブ切り替えUI */}
      <div className="flex bg-slate-200/60 p-1.5 rounded-2xl max-w-md mx-auto shadow-inner border border-slate-300/30">
        <button
          type="button"
          onClick={() => setActiveTab('family')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-extrabold transition transform duration-200 ${
            activeTab === 'family'
              ? 'bg-white text-slate-800 shadow-md scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
          }`}
        >
          <span>👥</span> 家族・器具設定
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-extrabold transition transform duration-200 ${
            activeTab === 'account'
              ? 'bg-white text-slate-800 shadow-md scale-[1.02]'
              : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
          }`}
        >
          <span>👤</span> マイアカウント
        </button>
      </div>
      
      {/* 1. 家族構成・器具設定タブ */}
      {activeTab === 'family' && (
        <form onSubmit={handleSubmit} className="bg-card text-card-foreground p-6 sm:p-10 rounded-2xl shadow-xl space-y-10 border border-border animate-in fade-in duration-300">
          {/* 家族構成 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2">
              <span className="bg-secondary text-secondary-foreground p-1.5 rounded-lg text-sm">1</span> 家族構成
            </h2>
            <div className="flex flex-wrap gap-8 items-center">
              <div className="flex gap-4 items-center">
                <label className="font-bold w-16 text-right">大人</label>
                <input 
                  type="number" min="1" max="10" 
                  value={familyConfig.adultCount} 
                  onChange={e => setFamilyConfig({...familyConfig, adultCount: parseInt(e.target.value)})}
                  className="w-20 p-2 rounded-xl border border-border bg-background focus:outline-primary focus:ring-2 ring-primary/20 transition text-center" 
                />
                <span>人</span>
              </div>
              <div className="flex gap-4 items-center">
                <label className="font-bold w-16 text-right">子供</label>
                <input 
                  type="number" min="0" max="10" 
                  value={familyConfig.childCount} 
                  onChange={e => handleChildCountChange(parseInt(e.target.value))}
                  className="w-20 p-2 rounded-xl border border-border bg-background focus:outline-primary focus:ring-2 ring-primary/20 transition text-center" 
                />
                <span>人</span>
              </div>
            </div>
          </section>

          {/* 子供の好き嫌い */}
          {familyConfig.children.length > 0 && (
            <section className="space-y-4 animate-in fade-in">
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2">
                <span className="bg-secondary text-secondary-foreground p-1.5 rounded-lg text-sm">2</span> 子供の好み
              </h2>
              {familyConfig.children.map((child, idx) => (
                <div key={idx} className="bg-secondary/30 p-5 rounded-2xl border border-border/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">子供 {idx + 1}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <label>名前:</label>
                      <input 
                        type="text" value={child.name} 
                        onChange={e => {
                          const newChildren = [...familyConfig.children];
                          newChildren[idx].name = e.target.value;
                          setFamilyConfig({...familyConfig, children: newChildren});
                        }}
                        className="w-24 p-1 rounded-md border border-border bg-background text-center"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1 font-bold">好きな食材（カンマ区切り）</label>
                      <input 
                        type="text" placeholder="例: ハンバーグ, コーン, ウインナー" 
                        defaultValue={child.likedIngredients.join(', ')}
                        onBlur={e => handleChildIngredientChange(idx, 'likedIngredients', e.target.value)}
                        className="w-full p-3 rounded-xl border border-border bg-background focus:outline-primary transition text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 font-bold">苦手な食材（カンマ区切り）</label>
                      <input 
                        type="text" placeholder="例: ピーマン, きのこ, ネギ" 
                        defaultValue={child.dislikedIngredients.join(', ')}
                        onBlur={e => handleChildIngredientChange(idx, 'dislikedIngredients', e.target.value)}
                        className="w-full p-3 rounded-xl border border-border bg-background focus:outline-primary transition text-sm" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* 使用する調理器具と優先順位 */}
          <section className="space-y-6">
            <div className="border-b border-border pb-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="bg-secondary text-secondary-foreground p-1.5 rounded-lg text-sm">3</span> 使える調理器具と優先順位
              </h2>
              <p className="text-sm opacity-70 mt-1 ml-9">ご自宅にある器具にチェックを入れ、よく使う順番に並び替えてください。</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {defaultAppliances.map(app => (
                <label key={app} className="flex items-center space-x-3 p-3 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/30 cursor-pointer transition">
                  <input 
                    type="checkbox" 
                    checked={familyConfig.appliances.includes(app)}
                    onChange={() => handleApplianceToggle(app)}
                    className="w-5 h-5 text-primary rounded focus:ring-primary accent-primary" 
                  />
                  <span className="font-bold text-sm select-none truncate" title={app}>{app}</span>
                </label>
              ))}
            </div>

            {/* 優先順位の設定UI */}
            {familyConfig.appliancePriorities && familyConfig.appliancePriorities.length > 0 && (
              <div className="bg-secondary/10 p-4 rounded-xl border border-border space-y-2">
                <h3 className="font-bold text-sm text-primary mb-3">優先的に使いたい順番</h3>
                {familyConfig.appliancePriorities.map((app, index) => (
                  <div key={app} className="flex items-center justify-between bg-white p-3 rounded-lg border border-border shadow-sm">
                    <span className="font-bold text-sm">
                      <span className="text-primary mr-2">{index + 1}.</span>{app}
                    </span>
                    <div className="flex gap-1">
                      <button 
                        type="button" 
                        onClick={() => movePriority(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        🔼
                      </button>
                      <button 
                        type="button" 
                        onClick={() => movePriority(index, 'down')}
                        disabled={index === familyConfig.appliancePriorities!.length - 1}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                      >
                        🔽
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <button type="submit" className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-teal-700 hover:shadow-xl transition transform hover:-translate-y-0.5">
            💾 設定を保存して次へ
          </button>
        </form>
      )}

      {/* 2. マイアカウントタブ */}
      {activeTab === 'account' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* アカウント基本情報 */}
          <div className="bg-card text-card-foreground p-6 sm:p-10 rounded-2xl shadow-xl border border-border space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2">
              ℹ️ アカウント基本情報
            </h2>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-secondary/10 p-4 rounded-xl border border-border/50">
                <span className="font-extrabold text-sm text-slate-500">ログイン中のメールアドレス</span>
                <span className="font-black text-slate-800 text-base break-all">{user?.email || '未設定 (ゲストモード)'}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-secondary/10 p-4 rounded-xl border border-border/50">
                <span className="font-extrabold text-sm text-slate-500">ログイン認証方式</span>
                <div>
                  {isEmailUser ? (
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 shadow-sm">
                      📧 メール・パスワード認証
                    </span>
                  ) : user ? (
                    <span className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200 shadow-sm">
                      🌐 Googleアカウント連携
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                      👤 ゲストモード
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ユーザー名設定・変更 */}
          <div className="bg-card text-card-foreground p-6 sm:p-10 rounded-2xl shadow-xl border border-border space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-border pb-2">
              ✏️ ユーザー名（表示名）の設定
            </h2>
            <p className="text-sm opacity-70">アプリ内で表示されるあなたの名前を設定・変更できます。</p>

            {nameError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-3 text-sm font-bold">
                ⚠️ {nameError}
              </div>
            )}

            {nameSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl p-3.5 text-sm font-bold">
                ✅ {nameSuccess}
              </div>
            )}

            <form onSubmit={handleNameChangeSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <label className="font-bold text-sm sm:text-right">ユーザー名</label>
                <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="新しいユーザー名を入力"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 p-3 rounded-xl border border-border bg-background focus:outline-primary transition text-sm font-medium"
                    required
                  />
                  <button
                    type="submit"
                    disabled={nameUpdating}
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground hover:bg-teal-700 disabled:bg-slate-300 font-bold rounded-xl shadow-md transition transform active:scale-95 disabled:scale-100 flex items-center justify-center gap-2 shrink-0 text-sm"
                  >
                    {nameUpdating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span>保存する</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* パスワード変更（メールログインユーザー限定） */}
          {isEmailUser && (
            <div className="bg-card text-card-foreground p-6 sm:p-10 rounded-2xl shadow-xl border border-border space-y-6">
              <div className="border-b border-border pb-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  🔒 パスワードの変更
                </h2>
                <p className="text-sm opacity-70 mt-1">アカウントのセキュリティを高めるために、パスワードを変更できます。</p>
              </div>

              {pwError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-xl p-3 text-sm font-bold">
                  ⚠️ {pwError}
                </div>
              )}

              {pwSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl p-3.5 text-sm font-bold">
                  ✅ {pwSuccess}
                </div>
              )}

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <label className="font-bold text-sm sm:text-right">現在のパスワード</label>
                  <input
                    type="password"
                    placeholder="現在のパスワードを入力"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="sm:col-span-2 p-3 rounded-xl border border-border bg-background focus:outline-primary transition text-sm font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <label className="font-bold text-sm sm:text-right">新しいパスワード</label>
                  <input
                    type="password"
                    placeholder="6文字以上の新しいパスワード"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="sm:col-span-2 p-3 rounded-xl border border-border bg-background focus:outline-primary transition text-sm font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <label className="font-bold text-sm sm:text-right">新しいパスワード（確認）</label>
                  <input
                    type="password"
                    placeholder="もう一度新しいパスワードを入力"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="sm:col-span-2 p-3 rounded-xl border border-border bg-background focus:outline-primary transition text-sm font-medium"
                    required
                  />
                </div>

                <div className="pt-2 sm:pl-32">
                  <button
                    type="submit"
                    disabled={pwChanging}
                    className="w-full sm:w-auto px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/95 disabled:bg-slate-300 font-bold rounded-xl shadow-md transition transform active:scale-95 disabled:scale-100 flex items-center justify-center gap-2 text-sm"
                  >
                    {pwChanging ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>変更中...</span>
                      </>
                    ) : (
                      <span>🔑 パスワードを更新</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
