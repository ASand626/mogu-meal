'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';

export default function ShoppingListPage() {
  const router = useRouter();
  const { weekMenu } = useAppContext();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  useEffect(() => {
    if (weekMenu && selectedDates.length === 0) {
      // 初期状態はすべての日付を選択
      setSelectedDates(weekMenu.map(day => day.date));
    }
  }, [weekMenu]);

  // 買い物リストの集計ロジック
  const shoppingList = useMemo(() => {
    if (!weekMenu) return {};

    const list: Record<string, string[]> = {};
    const activeMenu = weekMenu.filter(day => selectedDates.includes(day.date));

    activeMenu.forEach(day => {
      [day.main, day.side].forEach(recipe => {
        recipe.ingredients.forEach(ing => {
          if (!list[ing.name]) {
            list[ing.name] = [];
          }
          list[ing.name].push(ing.amount);
        });
      });
    });

    // カテゴリ分け（簡易的な判定）
    const categories: Record<string, {name: string, amounts: string[]}[]> = {
      'お肉・お魚': [],
      '野菜・きのこ': [],
      'その他（調味料・加工品など）': []
    };

    const meatFishWords = ['肉', '鮭', 'サバ', 'ツナ', '魚'];
    const vegWords = ['玉ねぎ', 'にんじん', 'ピーマン', 'しめじ', 'えのき', '白菜', '生姜', 'じゃがいも', 'ほうれん草', 'かぼちゃ', 'トマト', 'もやし', 'きゅうり', 'ニンニク'];

    Object.entries(list).forEach(([name, amounts]) => {
      let matched = false;
      if (meatFishWords.some(w => name.includes(w))) {
        categories['お肉・お魚'].push({ name, amounts });
        matched = true;
      } else if (vegWords.some(w => name.includes(w))) {
        categories['野菜・きのこ'].push({ name, amounts });
        matched = true;
      }
      
      if (!matched) {
        categories['その他（調味料・加工品など）'].push({ name, amounts });
      }
    });

    return categories;
  }, [weekMenu, selectedDates]);

  if (!weekMenu) {
    return (
      <div className="text-center mt-20">
        <p>献立がありません。</p>
        <button onClick={() => router.push('/menu')} className="mt-4 text-primary underline">戻る</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold">🛒 買い物リスト</h2>
          <p className="text-sm opacity-70 mt-1">選択した日付の献立に必要な材料を集計しています</p>
        </div>
        <button onClick={() => router.push('/menu')} className="text-sm border border-border px-4 py-2 rounded-xl hover:bg-secondary/50 transition font-bold shadow-sm bg-white">
          ← 献立に戻る
        </button>
      </div>

      <div className="bg-card p-5 rounded-2xl shadow-sm border border-border">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <span>📅</span> リストに表示する日付を選択
        </h3>
        <div className="flex flex-wrap gap-2">
          {weekMenu.map(day => {
            const isSelected = selectedDates.includes(day.date);
            return (
              <label key={day.date} className={`cursor-pointer px-4 py-2 rounded-xl border text-sm font-bold transition-all flex items-center gap-2 select-none ${isSelected ? 'bg-primary text-white border-primary shadow-md' : 'bg-background text-foreground/70 border-border hover:bg-secondary/50'}`}>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={isSelected}
                  onChange={() => {
                    if (isSelected) {
                      setSelectedDates(selectedDates.filter(d => d !== day.date));
                    } else {
                      setSelectedDates([...selectedDates, day.date]);
                    }
                  }}
                />
                {isSelected ? '✓ ' : ''}{day.date.split('(')[0]}
              </label>
            );
          })}
        </div>
        {selectedDates.length === 0 && (
          <p className="text-xs text-red-500 mt-3 font-bold">※日付を1つ以上選択してください</p>
        )}
      </div>

      <div className="space-y-8">
        {Object.entries(shoppingList).map(([category, items]) => (
          items.length > 0 && (
            <section key={category} className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden">
              <h3 className="bg-primary text-white font-bold p-3 px-5">{category}</h3>
              <ul className="divide-y divide-border/50">
                {items.map((item, idx) => (
                  <li key={idx} className="p-4 px-5 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-secondary/20 transition gap-2">
                    <span className="font-bold text-lg sm:text-base">{item.name}</span>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {item.amounts.map((amount, aIdx) => (
                        <span key={aIdx} className="font-medium bg-secondary/80 text-secondary-foreground px-2.5 py-1 rounded-md text-sm border border-border">
                          {amount}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )
        ))}
      </div>
    </div>
  );
}
