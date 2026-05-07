'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreference, WeekMenu, Recipe } from '../types';

interface AppState {
  userPreference: UserPreference | null;
  setUserPreference: (prefs: UserPreference) => void;
  weekMenu: WeekMenu | null;
  setWeekMenu: (menu: WeekMenu) => void;
  favoriteRecipes: Recipe[];
  setFavoriteRecipes: (recipes: Recipe[]) => void;
  toggleFavorite: (recipe: Recipe) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPreference, setUserPreferenceState] = useState<UserPreference | null>(null);
  const [weekMenu, setWeekMenuState] = useState<WeekMenu | null>(null);
  const [favoriteRecipes, setFavoriteRecipesState] = useState<Recipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回マウント時にlocalStorageから復元
  useEffect(() => {
    const storedPrefs = localStorage.getItem('userPreference');
    const storedMenu = localStorage.getItem('weekMenu');
    const storedFavs = localStorage.getItem('favoriteRecipes');
    
    if (storedPrefs) setUserPreferenceState(JSON.parse(storedPrefs));
    if (storedMenu) setWeekMenuState(JSON.parse(storedMenu));
    if (storedFavs) setFavoriteRecipesState(JSON.parse(storedFavs));
    
    setIsLoaded(true);
  }, []);

  const setUserPreference = (prefs: UserPreference) => {
    setUserPreferenceState(prefs);
    localStorage.setItem('userPreference', JSON.stringify(prefs));
  };

  const setWeekMenu = (menu: WeekMenu) => {
    setWeekMenuState(menu);
    localStorage.setItem('weekMenu', JSON.stringify(menu));
  };

  const setFavoriteRecipes = (recipes: Recipe[]) => {
    setFavoriteRecipesState(recipes);
    localStorage.setItem('favoriteRecipes', JSON.stringify(recipes));
  };

  const toggleFavorite = (recipe: Recipe) => {
    const isFav = favoriteRecipes.some(r => r.id === recipe.id);
    if (isFav) {
      setFavoriteRecipes(favoriteRecipes.filter(r => r.id !== recipe.id));
    } else {
      setFavoriteRecipes([...favoriteRecipes, recipe]);
    }
  };

  // サーバーサイドレンダリングとのハイドレーションミスマッチを防ぐ
  if (!isLoaded) return null;

  return (
    <AppContext.Provider value={{ 
      userPreference, setUserPreference, 
      weekMenu, setWeekMenu,
      favoriteRecipes, setFavoriteRecipes, toggleFavorite 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
