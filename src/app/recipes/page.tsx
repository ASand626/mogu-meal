'use client';

import { useState } from 'react';
import { recipes } from '../../data/recipes';
import { Recipe } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  // Scale Modal State
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [scaledIngredients, setScaledIngredients] = useState<Recipe['ingredients'] | null>(null);
  const [isScaling, setIsScaling] = useState(false);

  // Collect all unique tags
  const allTags = Array.from(new Set(recipes.flatMap(r => r.tags)));
  const filterTags = ['メイン', '副菜', '肉', '魚', '野菜', '洋食', '和食', '中華', '時短'];

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.name.includes(searchTerm) || r.ingredients.some(i => i.name.includes(searchTerm));
    const matchesTag = selectedTag ? r.tags.includes(selectedTag) || (selectedTag === 'メイン' && r.id.startsWith('m')) || (selectedTag === '副菜' && r.id.startsWith('s')) : true;
    return matchesSearch && matchesTag;
  });

  const handleScale = async () => {
    if (!selectedRecipe) return;
    setIsScaling(true);
    
    // 基本の計算式 (大人2人、子供1人(0.5換算) = 2.5 を基準 1.0 とする)
    // ※レシピは基本的に「大人2人＋子供1人」の分量で書かれているという前提
    const targetRatio = (adults + children * 0.5) / 2.5;

    try {
      const res = await fetch('/api/scale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            recipeId: selectedRecipe.id,
            ingredients: selectedRecipe.ingredients,
            targetRatio
          }]
        })
      });
      const data = await res.json();
      
      if (data.skipped) {
        // APIキーがない場合は単純な掛け算で簡易対応
        const simpleScaled = selectedRecipe.ingredients.map(ing => {
          const numMatch = ing.amount.match(/([0-9.]+)/);
          if (numMatch && ing.amount.match(/g|ml|cc|個|本|枚/)) {
            const num = parseFloat(numMatch[1]);
            const newNum = Math.round(num * targetRatio * 10) / 10;
            return { name: ing.name, amount: ing.amount.replace(numMatch[1], newNum.toString()) };
          }
          return ing;
        });
        setScaledIngredients(simpleScaled);
      } else if (data.scaled && data.scaled[0]) {
        setScaledIngredients(data.scaled[0].ingredients);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsScaling(false);
    }
  };

  const openRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setScaledIngredients(null);
    setAdults(2);
    setChildren(1);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">📖 レシピ図鑑</h1>
          <p className="text-sm opacity-70 mt-1">登録されている全レシピを検索し、人数に合わせた分量を確認できます</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="🔍 レシピ名や食材で検索..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border-2 border-border/50 rounded-xl p-3 focus:outline-none focus:border-primary transition font-medium"
        />
        <div className="flex flex-wrap gap-2 items-center">
          <button 
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${!selectedTag ? 'bg-primary text-white shadow-md' : 'bg-secondary/30 hover:bg-secondary'}`}
          >
            すべて
          </button>
          {filterTags.map(tag => (
            <button 
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedTag === tag ? 'bg-primary text-white shadow-md' : 'bg-secondary/30 hover:bg-secondary'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <motion.div 
            key={recipe.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            onClick={() => openRecipe(recipe)}
            className="bg-card text-card-foreground p-5 rounded-2xl shadow-sm border border-border cursor-pointer flex flex-col h-full"
          >
            <div className="mb-2 flex flex-wrap gap-1">
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${recipe.id.startsWith('m') ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                {recipe.id.startsWith('m') ? 'メイン' : '副菜'}
              </span>
              {recipe.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs bg-secondary/50 px-2 py-1 rounded-md text-foreground/70">{tag}</span>
              ))}
            </div>
            <h3 className="font-bold text-lg leading-tight mb-2 flex-1 text-primary">{recipe.name}</h3>
            <div className="text-xs opacity-70 flex items-center gap-4 border-t border-border/50 pt-3 mt-auto">
              <span className="flex items-center gap-1">⏱ {recipe.cookingTime}分</span>
              <span className="flex items-center gap-1">🍳 {recipe.appliance[0]}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredRecipes.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <p className="text-lg font-bold">条件に一致するレシピがありません</p>
        </div>
      )}

      {/* レシピ詳細モーダル */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRecipe(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-primary/5 border-b border-border p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-primary">{selectedRecipe.name}</h2>
                  <div className="flex gap-4 mt-2 text-sm opacity-70 font-medium">
                    <span>⏱ {selectedRecipe.cookingTime}分</span>
                    <span>🍳 {selectedRecipe.appliance.join(', ')}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedRecipe(null)} className="p-2 bg-secondary/50 hover:bg-secondary rounded-full transition">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto p-6 space-y-8">
                
                {/* 人数調整UI */}
                <div className="bg-secondary/20 p-5 rounded-2xl border border-border">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
                    人数に合わせて分量を計算
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 font-bold text-sm">
                      大人
                      <input type="number" min="1" max="10" value={adults} onChange={e => setAdults(parseInt(e.target.value)||1)} className="w-16 p-2 rounded-lg border text-center" />
                      人
                    </label>
                    <label className="flex items-center gap-2 font-bold text-sm">
                      子供
                      <input type="number" min="0" max="10" value={children} onChange={e => setChildren(parseInt(e.target.value)||0)} className="w-16 p-2 rounded-lg border text-center" />
                      人
                    </label>
                    <button 
                      onClick={handleScale} 
                      disabled={isScaling}
                      className="ml-auto bg-primary text-white px-5 py-2 rounded-xl font-bold hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
                    >
                      {isScaling ? '計算中...' : '再計算する'}
                    </button>
                  </div>
                </div>

                {/* 材料 */}
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2 border-b border-border/50 pb-2">
                    🛒 材料
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                    {(scaledIngredients || selectedRecipe.ingredients).map((ing, i) => (
                      <li key={i} className="flex justify-between border-b border-border/30 py-2 items-center gap-4">
                        <span className="font-medium text-sm md:text-base">{ing.name}</span>
                        <span className={`text-sm md:text-base px-2 py-0.5 rounded ${scaledIngredients ? 'bg-primary/10 text-primary font-bold' : 'font-medium'}`}>{ing.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 手順 */}
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2 border-b border-border/50 pb-2">
                    👩‍🍳 作り方
                  </h3>
                  <ol className="space-y-4">
                    {selectedRecipe.steps.map((step, i) => (
                      <li key={i} className="flex gap-4">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">{i + 1}</span>
                        <p className="leading-relaxed text-sm md:text-base pt-0.5">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
