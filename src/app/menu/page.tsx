'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import { generateDayMenu } from '../../utils/menuGenerator';
import { Appliance } from '../../types';
import { motion } from 'framer-motion';

export default function MenuPage() {
  const router = useRouter();
  const { userPreference, weekMenu, setWeekMenu, favoriteRecipes, toggleFavorite } = useAppContext();
  
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [adjustmentTarget, setAdjustmentTarget] = useState({ 
    ingredients: '', 
    adults: 2,
    children: 1,
    appliances: [] as Appliance[] 
  });
  
  // アコーディオンの開閉状態
  const [expandedDays, setExpandedDays] = useState<number[]>([0]);

  // マウント時にデータの存在をチェック
  useEffect(() => {
    if (!userPreference || !weekMenu) {
      router.push('/');
    }
  }, [userPreference, weekMenu, router]);

  if (!userPreference || !weekMenu) return null;

  const toggleDay = (index: number) => {
    if (expandedDays.includes(index)) {
      setExpandedDays(expandedDays.filter(i => i !== index));
    } else {
      setExpandedDays([...expandedDays, index]);
    }
  };

  const openAdjustmentModal = (idx: number) => {
    setSelectedDayIndex(idx);
    setAdjustmentTarget({
      ingredients: '',
      adults: weekMenu[idx].adults,
      children: weekMenu[idx].children,
      appliances: [...userPreference.appliances] // デフォルトはユーザー全体設定
    });
  };

  const handleApplianceToggle = (appliance: Appliance) => {
    const current = adjustmentTarget.appliances;
    if (current.includes(appliance)) {
      setAdjustmentTarget({ ...adjustmentTarget, appliances: current.filter(a => a !== appliance) });
    } else {
      setAdjustmentTarget({ ...adjustmentTarget, appliances: [...current, appliance] });
    }
  };

  const handleRegenerateDay = async () => {
    if (selectedDayIndex === null) return;
    
    setIsRegenerating(true);
    // 現在使われているレシピID（再生成対象以外）
    const usedRecipeIds = weekMenu.flatMap((day, idx) => 
      idx === selectedDayIndex ? [] : [day.main.id, day.side.id]
    );

    const day = weekMenu[selectedDayIndex];
    try {
      const newDayMenu = await generateDayMenu(
        day.date, 
        userPreference, 
        usedRecipeIds, 
        adjustmentTarget.ingredients, 
        false, // isFishDay は基本維持しないかランダム、今回は false でシンプルに
        adjustmentTarget.adults,
        adjustmentTarget.children,
        adjustmentTarget.appliances
      );

      const newWeekMenu = [...weekMenu];
      newWeekMenu[selectedDayIndex] = newDayMenu;
      setWeekMenu(newWeekMenu);
      setSelectedDayIndex(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsRegenerating(false);
    }
  };

  const availableAppliances: Appliance[] = ['ホットクック', 'ヘルシオ（オーブン/レンジ機能）', 'フライパン', '鍋'];

  // 基本的な基準人数（データベースのレシピ想定量）
  const baseAdults = userPreference.adultCount || 2;
  const baseChildren = userPreference.childCount || 1;

  const calculateRatio = (adults: number, children: number) => {
    const currentTotal = adults + children * 0.5;
    const baseTotal = baseAdults + baseChildren * 0.5;
    if (baseTotal === 0) return 1;
    return (currentTotal / baseTotal).toFixed(1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">生成された献立</h2>
          <p className="text-sm opacity-70 mt-1">タップして材料と作り方を確認できます</p>
        </div>
        <button onClick={() => router.push('/shopping-list')} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-md hover:bg-teal-700 transition font-bold flex items-center justify-center gap-2">
          <span>🛒 買い物リストへ</span>
        </button>
      </div>

      <div className="space-y-6">
        {weekMenu.map((day, idx) => {
          const isExpanded = expandedDays.includes(idx);
          const ratio = calculateRatio(day.adults, day.children);
          // AIによって分量調整されていなければ警告が必要
          const needsAdjustment = !day.isScaled && ratio !== "1.0";
          
          const isMainFav = favoriteRecipes.some(r => r.id === day.main.id);
          const isSideFav = favoriteRecipes.some(r => r.id === day.side.id);

          return (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden transition-all duration-300"
            >
              <div 
                className="bg-secondary/30 hover:bg-secondary/50 p-4 md:p-6 cursor-pointer flex items-center justify-between transition-colors"
                onClick={() => toggleDay(idx)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg text-lg min-w-[5rem] text-center shadow-sm">
                    {day.date.split('(')[0]} <span className="text-sm opacity-80">({day.date.split('(')[1] || ''}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded font-bold">大人{day.adults}人・子供{day.children}人</span>
                      {needsAdjustment && (
                        <span className="text-[10px] text-red-600 font-bold border border-red-200 bg-red-50 px-1.5 py-0.5 rounded">
                          分量注意
                        </span>
                      )}
                      {day.isScaled && ratio !== "1.0" && (
                        <span className="text-[10px] text-primary font-bold border border-primary/30 bg-primary/10 px-1.5 py-0.5 rounded">
                          ✨ AI分量調整済み
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg md:text-xl truncate max-w-[180px] md:max-w-md">{day.main.name}</h3>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(day.main); }}
                        className="hover:scale-110 transition-transform focus:outline-none"
                      >
                        {isMainFav ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-foreground/30 hover:text-primary transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm opacity-70 truncate max-w-[180px] md:max-w-md">＋ {day.side.name}</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(day.side); }}
                        className="hover:scale-110 transition-transform focus:outline-none"
                      >
                        {isSideFav ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-foreground/30 hover:text-primary transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openAdjustmentModal(idx); }} 
                    className="text-xs bg-white text-primary border border-primary px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition shadow-sm hidden sm:block"
                  >
                    🔄 再生成
                  </button>
                  <span className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 md:p-8 space-y-10 border-t border-border animate-in slide-in-from-top-4">
                  
                  {needsAdjustment && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-5 shadow-sm">
                      <p className="text-sm font-bold text-red-700 flex items-center gap-2">
                        <span>⚠️</span> 【分量の調整について】
                      </p>
                      <p className="text-xs text-red-800 mt-2 leading-relaxed">
                        本日は人数が基本設定と異なるため、記載されている材料の分量を<strong>約 {ratio} 倍</strong>に計算して調理してください。
                      </p>
                    </div>
                  )}

                  {day.appliedBranches.length > 0 && (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 md:p-5 shadow-sm">
                      <p className="text-sm font-bold text-teal-800 mb-3 flex items-center gap-2">
                        <span>💡</span> 子供向けアレンジ提案
                      </p>
                      <ul className="space-y-3">
                        {day.appliedBranches.map((branch, bIdx) => (
                          <li key={bIdx} className="text-sm bg-white p-3 rounded-lg border border-teal-100 flex gap-3 items-start shadow-sm">
                            <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-[11px] font-bold shrink-0 mt-0.5">
                              {branch.type}
                            </span>
                            <span className="leading-relaxed text-teal-900">{branch.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-2 gap-2">
                      <h4 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <span className="text-sm bg-primary text-white px-2 py-1 rounded-md mb-1 align-middle">主菜</span>
                        {day.main.name}
                      </h4>
                      <div className="text-sm font-medium opacity-80 flex gap-3">
                        <span className="bg-secondary px-2 py-1 rounded-md">実働時間: {day.main.cookingTime}分</span>
                        <span className="bg-secondary px-2 py-1 rounded-md">使う器具: {day.main.appliance.join(', ')}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="md:col-span-1 bg-secondary/10 p-5 rounded-xl border border-border">
                        <h5 className="font-bold mb-4 text-lg border-b pb-2">材料</h5>
                        <ul className="space-y-3">
                          {day.main.ingredients.map((ing, iIdx) => (
                            <li key={iIdx} className="flex justify-between text-sm border-b border-border/50 pb-1 border-dashed">
                              <span>{ing.name}</span>
                              <span className="font-medium text-right">{ing.amount}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="md:col-span-2">
                        <h5 className="font-bold mb-4 text-lg border-b pb-2">作り方</h5>
                        <div className="space-y-3 text-sm md:text-base leading-relaxed">
                          {day.main.steps.map((step, sIdx) => (
                            <div key={sIdx} className="flex gap-3">
                              <span className="font-bold text-primary shrink-0">{sIdx + 1}.</span>
                              <p>{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-2 gap-2">
                      <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <span className="text-sm bg-slate-200 text-slate-700 px-2 py-1 rounded-md mb-1 align-middle">副菜</span>
                        {day.side.name}
                      </h4>
                      <div className="text-sm font-medium opacity-80 flex gap-3">
                        <span className="bg-secondary px-2 py-1 rounded-md">実働時間: {day.side.cookingTime}分</span>
                        <span className="bg-secondary px-2 py-1 rounded-md">使う器具: {day.side.appliance.join(', ')}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="md:col-span-1 bg-secondary/10 p-5 rounded-xl border border-border">
                        <h5 className="font-bold mb-4 text-lg border-b pb-2">材料</h5>
                        <ul className="space-y-3">
                          {day.side.ingredients.map((ing, iIdx) => (
                            <li key={iIdx} className="flex justify-between text-sm border-b border-border/50 pb-1 border-dashed">
                              <span>{ing.name}</span>
                              <span className="font-medium text-right">{ing.amount}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="md:col-span-2">
                        <h5 className="font-bold mb-4 text-lg border-b pb-2">作り方</h5>
                        <div className="space-y-3 text-sm md:text-base leading-relaxed">
                          {day.side.steps.map((step, sIdx) => (
                            <div key={sIdx} className="flex gap-3">
                              <span className="font-bold text-slate-500 shrink-0">{sIdx + 1}.</span>
                              <p>{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="sm:hidden pt-4 border-t border-border text-center">
                    <button 
                      onClick={() => openAdjustmentModal(idx)} 
                      className="w-full text-sm bg-white text-primary border border-primary py-3 rounded-xl shadow-sm font-bold"
                    >
                      🔄 この日の献立を再生成する
                    </button>
                  </div>
                  
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {selectedDayIndex !== null && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card text-card-foreground p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-6">
            <h3 className="font-bold text-xl border-b pb-2">{weekMenu[selectedDayIndex].date} の献立を変更</h3>
            <p className="text-sm opacity-80">他の曜日や同じ日の主菜・副菜と被らないように別の献立を生成します。</p>
            
            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm mb-1 font-bold">この日に使いたい器具（複数選択可）</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableAppliances.map(app => (
                    <label key={app} className="flex items-center space-x-2 p-2 rounded-lg border border-border bg-secondary/10 hover:bg-secondary/30 cursor-pointer transition text-xs font-bold">
                      <input 
                        type="checkbox" 
                        checked={adjustmentTarget.appliances.includes(app)}
                        onChange={() => handleApplianceToggle(app)}
                        className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary" 
                      />
                      <span className="select-none truncate" title={app}>{app}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1 font-bold">使いたい食材（自由入力）</label>
                <input type="text" placeholder="例: 豚肉, キャベツ" 
                       value={adjustmentTarget.ingredients} 
                       onChange={e => setAdjustmentTarget({...adjustmentTarget, ingredients: e.target.value})}
                       className="w-full p-3 rounded-xl border border-border bg-background/50 text-sm focus:outline-primary focus:ring-2 ring-primary/20 transition" />
              </div>
              
              <div className="flex gap-4">
                <div className="space-y-1 flex-1">
                  <label className="block text-sm font-bold">大人（人数）</label>
                  <input 
                    type="number" min="0" max="10"
                    value={adjustmentTarget.adults}
                    onChange={e => setAdjustmentTarget({...adjustmentTarget, adults: parseInt(e.target.value) || 0})}
                    className="w-full p-3 rounded-xl border border-border bg-background/50 text-sm focus:outline-primary focus:ring-2 ring-primary/20 transition"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <label className="block text-sm font-bold">子供（人数）</label>
                  <input 
                    type="number" min="0" max="10"
                    value={adjustmentTarget.children}
                    onChange={e => setAdjustmentTarget({...adjustmentTarget, children: parseInt(e.target.value) || 0})}
                    className="w-full p-3 rounded-xl border border-border bg-background/50 text-sm focus:outline-primary focus:ring-2 ring-primary/20 transition"
                  />
                </div>
              </div>

            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <button onClick={() => setSelectedDayIndex(null)} disabled={isRegenerating} className="flex-1 py-3 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition font-bold text-slate-600 disabled:opacity-50">
                キャンセル
              </button>
              <button onClick={handleRegenerateDay} disabled={isRegenerating} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-teal-700 transition shadow-md disabled:opacity-50 flex items-center justify-center">
                {isRegenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成中...
                  </>
                ) : '再生成する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
