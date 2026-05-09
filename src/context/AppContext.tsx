'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreference, WeekMenu, Recipe } from '../types';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User, getAdditionalUserInfo } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AppState {
  userPreference: UserPreference | null;
  setUserPreference: (prefs: UserPreference) => void;
  weekMenu: WeekMenu | null;
  setWeekMenu: (menu: WeekMenu) => void;
  favoriteRecipes: Recipe[];
  setFavoriteRecipes: (recipes: Recipe[]) => void;
  toggleFavorite: (recipe: Recipe) => void;
  user: User | null;
  loadingAuth: boolean;
  login: (isSignUp?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPreference, setUserPreferenceState] = useState<UserPreference | null>(null);
  const [weekMenu, setWeekMenuState] = useState<WeekMenu | null>(null);
  const [favoriteRecipes, setFavoriteRecipesState] = useState<Recipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Firestoreにデータを保存するヘルパー
  const saveToFirestore = async (uid: string, key: string, data: any) => {
    try {
      await setDoc(doc(db, 'users', uid), { [key]: data }, { merge: true });
    } catch (e) {
      console.error("Error writing document: ", e);
    }
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoadingAuth(true);
      
      if (currentUser) {
        // ログイン状態：Firestoreからデータ取得
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.userPreference) setUserPreferenceState(data.userPreference);
            if (data.weekMenu) setWeekMenuState(data.weekMenu);
            if (data.favoriteRecipes) setFavoriteRecipesState(data.favoriteRecipes);
          } else {
            // Firestoreにデータがない場合、LocalStorageから移行（あれば）
            const storedPrefs = localStorage.getItem('userPreference');
            const storedMenu = localStorage.getItem('weekMenu');
            const storedFavs = localStorage.getItem('favoriteRecipes');
            
            const initialData: any = {};
            if (storedPrefs) { initialData.userPreference = JSON.parse(storedPrefs); setUserPreferenceState(initialData.userPreference); }
            if (storedMenu) { initialData.weekMenu = JSON.parse(storedMenu); setWeekMenuState(initialData.weekMenu); }
            if (storedFavs) { initialData.favoriteRecipes = JSON.parse(storedFavs); setFavoriteRecipesState(initialData.favoriteRecipes); }
            
            if (Object.keys(initialData).length > 0) {
              await setDoc(docRef, initialData, { merge: true });
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // 未ログイン状態：LocalStorageから復元
        const storedPrefs = localStorage.getItem('userPreference');
        const storedMenu = localStorage.getItem('weekMenu');
        const storedFavs = localStorage.getItem('favoriteRecipes');
        
        if (storedPrefs) setUserPreferenceState(JSON.parse(storedPrefs));
        if (storedMenu) setWeekMenuState(JSON.parse(storedMenu));
        if (storedFavs) setFavoriteRecipesState(JSON.parse(storedFavs));
      }
      
      setUser(currentUser);
      setLoadingAuth(false);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const setUserPreference = (prefs: UserPreference) => {
    setUserPreferenceState(prefs);
    if (user) {
      saveToFirestore(user.uid, 'userPreference', prefs);
    } else {
      localStorage.setItem('userPreference', JSON.stringify(prefs));
    }
  };

  const setWeekMenu = (menu: WeekMenu) => {
    setWeekMenuState(menu);
    if (user) {
      saveToFirestore(user.uid, 'weekMenu', menu);
    } else {
      localStorage.setItem('weekMenu', JSON.stringify(menu));
    }
  };

  const setFavoriteRecipes = (recipes: Recipe[]) => {
    setFavoriteRecipesState(recipes);
    if (user) {
      saveToFirestore(user.uid, 'favoriteRecipes', recipes);
    } else {
      localStorage.setItem('favoriteRecipes', JSON.stringify(recipes));
    }
  };

  const toggleFavorite = (recipe: Recipe) => {
    const isFav = favoriteRecipes.some(r => r.id === recipe.id);
    let newFavs;
    if (isFav) {
      newFavs = favoriteRecipes.filter(r => r.id !== recipe.id);
    } else {
      newFavs = [...favoriteRecipes, recipe];
    }
    setFavoriteRecipes(newFavs);
  };

  const login = async (isSignUp: boolean = false) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const details = getAdditionalUserInfo(result);
      
      if (!isSignUp && details?.isNewUser) {
        // ログインボタンを押したのに新規ユーザーだった場合
        await result.user.delete();
        throw new Error('NOT_REGISTERED');
      }
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.message === 'NOT_REGISTERED') {
        alert("このGoogleアカウントに紐づくMoguMealアカウントは登録されていません。「はじめての方（アカウント作成）」から登録してください。");
      } else if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        alert("エラーが発生しました: " + (error.message || error.code || "不明なエラー"));
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // ログアウト時にローカルステートをクリア（またはローカルストレージの値に戻す）
      setUserPreferenceState(null);
      setWeekMenuState(null);
      setFavoriteRecipesState([]);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  // クライアントサイドでのみレンダリング（ハイドレーションエラー防止）
  if (!isLoaded) return null;

  return (
    <AppContext.Provider value={{ 
      userPreference, setUserPreference, 
      weekMenu, setWeekMenu,
      favoriteRecipes, setFavoriteRecipes, toggleFavorite,
      user, loadingAuth, login, logout
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
