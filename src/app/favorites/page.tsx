'use client';

import { useAppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function FavoritesPage() {
  const router = useRouter();
  const { favoriteRecipes, toggleFavorite } = useAppContext();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">❤️ お気に入りレシピ</h2>
          <p className="text-sm opacity-70 mt-1">保存したレシピの一覧です。タップして詳細を確認できます。</p>
        </div>
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="bg-card text-center py-20 rounded-2xl border border-border shadow-sm">
          <p className="text-6xl mb-4">🍽️</p>
          <h3 className="text-xl font-bold mb-2">まだお気に入りがありません</h3>
          <p className="text-sm opacity-70">献立画面で「❤️」ボタンを押すと、ここに保存されます。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favoriteRecipes.map((recipe, idx) => (
            <motion.div 
              key={recipe.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-primary leading-tight">{recipe.name}</h3>
                <button 
                  onClick={() => toggleFavorite(recipe)}
                  className="hover:scale-110 transition-transform focus:outline-none ml-4"
                  title="お気に入り解除"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded font-bold">
                  ⏱️ {recipe.cookingTime}分
                </span>
                {recipe.appliance.map(app => (
                  <span key={app} className="text-xs border border-border px-2 py-1 rounded text-foreground/80">
                    {app}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-border">
                <h5 className="font-bold text-sm mb-2 opacity-80">材料</h5>
                <p className="text-sm opacity-90 line-clamp-2">
                  {recipe.ingredients.map(i => i.name).join('、')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
