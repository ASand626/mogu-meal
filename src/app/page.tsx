'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import { generateWeekMenu } from '../utils/menuGenerator';
import { WeeklyConfig, WeeklyDayConfig } from '../types';
import { motion } from 'framer-motion';

export default function WeeklySetupPage() {
  const router = useRouter();
  const { userPreference, setWeekMenu } = useAppContext();

  // カレンダー用の簡単な日付生成
  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' });
      days.push(dateStr);
    }
    return days;
  };

  const [availableDates] = useState<string[]>(getUpcomingDays());
  const [weeklyConfig, setWeeklyConfig] = useState<WeeklyConfig>({
    days: [],
    fishDaysCount: 2
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // UserPreferenceがない場合は初期設定画面へリダイレクト
  useEffect(() => {
    if (userPreference === null) {
      router.push('/settings');
    }
  }, [userPreference, router]);

  if (!userPreference) return null;

  const toggleDateSelection = (date: string) => {
    const existingIndex = weeklyConfig.days.findIndex(d => d.date === date);
    if (existingIndex >= 0) {
      // 削除
      const newDays = [...weeklyConfig.days];
      newDays.splice(existingIndex, 1);
      setWeeklyConfig({ ...weeklyConfig, days: newDays });
    } else {
      // 追加（デフォルトは基本設定の人数）
      setWeeklyConfig({ 
        ...weeklyConfig, 
        days: [...weeklyConfig.days, { 
          date, 
          ingredients: '', 
          adults: userPreference.adultCount, 
          children: userPreference.childCount 
        }] 
      });
    }
  };

  const updateDayConfig = (date: string, field: 'ingredients' | 'adults' | 'children', value: string | number) => {
    const newDays = weeklyConfig.days.map(d => {
      if (d.date === date) {
        return { ...d, [field]: value };
      }
      return d;
    });
    setWeeklyConfig({ ...weeklyConfig, days: newDays });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (weeklyConfig.days.length === 0) {
      alert('献立をつくる日付を1日以上選択してください。');
      return;
    }
    
    setIsGenerating(true);
    try {
      // 生成ロジックの呼び出し（非同期）
      const newMenu = await generateWeekMenu(userPreference, weeklyConfig);
      setWeekMenu(newMenu);
      router.push('/menu');
    } catch (error: any) {
      alert(error.message);
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-8 pb-12"
    >
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">📅 今週の献立作成</h1>
          <p className="text-foreground opacity-70 mt-2">対象の日付と使いたい食材を選んでください</p>
        </div>
        <button onClick={() => router.push('/settings')} className="text-sm bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-bold hover:bg-slate-300 transition shadow-sm">
          ⚙️ 基本設定変更
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ステップ1：対象日の選択 */}
        <section className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="bg-primary text-white p-1 px-2.5 rounded-lg text-sm">STEP 1</span>
            献立を作る日を選ぶ
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {availableDates.map(date => {
              const isSelected = weeklyConfig.days.some(d => d.date === date);
              return (
                <div 
                  key={date}
                  onClick={() => toggleDateSelection(date)}
                  className={`cursor-pointer border-2 rounded-xl p-3 text-center transition font-bold select-none
                    ${isSelected 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border bg-background hover:bg-secondary/30 opacity-60'}`}
                >
                  {date}
                </div>
              );
            })}
          </div>
        </section>

        {/* ステップ2：個別設定 */}
        {weeklyConfig.days.length > 0 && (
          <section className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border space-y-6 animate-in fade-in">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-primary text-white p-1 px-2.5 rounded-lg text-sm">STEP 2</span>
              日付ごとの条件を指定する
            </h2>
            
            <div className="space-y-4">
              {weeklyConfig.days.map((dayConfig) => (
                <div key={dayConfig.date} className="bg-secondary/20 p-4 rounded-xl border border-border/50 flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="bg-white px-3 py-2 rounded-lg font-bold border border-border min-w-[6rem] text-center shadow-sm text-primary">
                    {dayConfig.date}
                  </div>
                  
                  <div className="flex-1 w-full space-y-1">
                    <label className="text-xs font-bold opacity-70">使いたい食材（カンマ区切り）</label>
                    <input 
                      type="text" 
                      placeholder="例: 豚肉, キャベツ" 
                      value={dayConfig.ingredients}
                      onChange={e => updateDayConfig(dayConfig.date, 'ingredients', e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:outline-primary transition"
                    />
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70 block text-center">大人</label>
                      <div className="flex items-center bg-white border border-border rounded-lg overflow-hidden">
                        <input 
                          type="number" min="0" max="10"
                          value={dayConfig.adults}
                          onChange={e => updateDayConfig(dayConfig.date, 'adults', parseInt(e.target.value) || 0)}
                          className="w-12 p-2 text-center text-sm font-bold focus:outline-primary"
                        />
                        <span className="text-xs font-bold pr-2 opacity-70">人</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold opacity-70 block text-center">子供</label>
                      <div className="flex items-center bg-white border border-border rounded-lg overflow-hidden">
                        <input 
                          type="number" min="0" max="10"
                          value={dayConfig.children}
                          onChange={e => updateDayConfig(dayConfig.date, 'children', parseInt(e.target.value) || 0)}
                          className="w-12 p-2 text-center text-sm font-bold focus:outline-primary"
                        />
                        <span className="text-xs font-bold pr-2 opacity-70">人</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </section>
        )}

        <button 
          type="submit" 
          disabled={weeklyConfig.days.length === 0 || isGenerating}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-teal-700 hover:shadow-xl transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              MoguMogu...
            </>
          ) : (
            `✨ ${weeklyConfig.days.length}日分の献立をつくる`
          )}
        </button>
      </form>
      
      {/* オーバーレイ */}
      {isGenerating && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95">
            <div className="text-4xl animate-bounce">🤖</div>
            <p className="font-bold text-slate-800 text-center">
              献立を作成し、人数に合わせて<br />分量を計算しています...<br />
              <span className="text-sm font-normal text-slate-500">※最大10秒ほどかかる場合があります</span>
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
