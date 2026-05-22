'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreference, WeekMenu, Recipe } from '../types';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User, getAdditionalUserInfo, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from 'firebase/auth';
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
  isGuest: boolean;
  isLoggingIn: boolean;
  startGuestMode: () => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<void>;
  changePassword: (current: string, newPass: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPreference, setUserPreferenceState] = useState<UserPreference | null>(null);
  const [weekMenu, setWeekMenuState] = useState<WeekMenu | null>(null);
  const [favoriteRecipes, setFavoriteRecipesState] = useState<Recipe[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
      if (currentUser) {
        setIsGuest(false); // ログイン検知時はゲストモードを自動解除
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
            // 新規登録ユーザーはFirestoreにデータがないためステートを初期化
            setUserPreferenceState(null);
            setWeekMenuState(null);
            setFavoriteRecipesState([]);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // 未ログイン状態：ステートをクリア（ゲストモードでなければリセット）
        setUserPreferenceState(null);
        setWeekMenuState(null);
        setFavoriteRecipesState([]);
      }
      
      setUser(currentUser);
      setLoadingAuth(false);
      setIsLoggingIn(false);
    });

    return () => unsubscribe();
  }, []);

  const startGuestMode = () => {
    setIsGuest(true);
    setUserPreferenceState(null);
    setWeekMenuState(null);
    setFavoriteRecipesState([]);
  };

  const setUserPreference = (prefs: UserPreference) => {
    setUserPreferenceState(prefs);
    if (user) {
      saveToFirestore(user.uid, 'userPreference', prefs);
    }
    // ゲストモード中はローカルストレージには保存せずメモリのみで管理する仕様のため何もしない
  };

  const setWeekMenu = (menu: WeekMenu) => {
    setWeekMenuState(menu);
    if (user) {
      saveToFirestore(user.uid, 'weekMenu', menu);
    }
    // ゲストモード中はローカルストレージには保存せずメモリのみで管理する仕様のため何もしない
  };

  const setFavoriteRecipes = (recipes: Recipe[]) => {
    setFavoriteRecipesState(recipes);
    if (user) {
      saveToFirestore(user.uid, 'favoriteRecipes', recipes);
    }
    // ゲストモード中はローカルストレージには保存せずメモリのみで管理する仕様のため何もしない
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

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsLoggingIn(true);
      await signInWithPopup(auth, provider);
      setIsGuest(false);
    } catch (error: any) {
      setIsLoggingIn(false);
      console.error("Login failed", error);
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        alert("エラーが発生しました: " + (error.message || error.code || "不明なエラー"));
      }
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true);
      await signInWithEmailAndPassword(auth, email, password);
      setIsGuest(false);
    } catch (error: any) {
      setIsLoggingIn(false);
      console.error("Email login failed", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setIsGuest(false);
      if (userCredential.user) {
        try {
          await sendEmailVerification(userCredential.user);
        } catch (verificationError) {
          console.error("Failed to send verification email during signup", verificationError);
        }
      }
    } catch (error: any) {
      setIsLoggingIn(false);
      console.error("Email signup failed", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Password reset failed", error);
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
      } catch (error: any) {
        console.error("Verification email sending failed", error);
        throw error;
      }
    } else {
      throw new Error("ログインユーザーが見つかりません。");
    }
  };

  const reloadUser = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload();
        // auth.currentUserの状態を最新のユーザーにマッピングしてステート更新
        setUser({ ...auth.currentUser });
      } catch (error: any) {
        console.error("Failed to reload user", error);
        throw error;
      }
    }
  };

  const changePassword = async (current: string, newPass: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error("ログインユーザーが見つかりません。");
    }
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, current);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPass);
    } catch (error: any) {
      console.error("Password change failed", error);
      throw error;
    }
  };

  const updateDisplayName = async (name: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("ログインユーザーが見つかりません。");
    }
    try {
      await updateProfile(currentUser, { displayName: name });
      setUser({ ...currentUser });
    } catch (error: any) {
      console.error("Failed to update display name", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserPreferenceState(null);
      setWeekMenuState(null);
      setFavoriteRecipesState([]);
      setIsGuest(false);
      
      // ローカルストレージに残っている古いゴミデータやゲスト用のデータも完全に消去
      localStorage.removeItem('userPreference');
      localStorage.removeItem('weekMenu');
      localStorage.removeItem('favoriteRecipes');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };


  return (
    <AppContext.Provider value={{ 
      userPreference, setUserPreference, 
      weekMenu, setWeekMenu,
      favoriteRecipes, setFavoriteRecipes, toggleFavorite,
      user, loadingAuth, isGuest, isLoggingIn, startGuestMode, login, logout,
      loginWithEmail, signUpWithEmail, resetPassword,
      sendVerificationEmail, reloadUser, changePassword, updateDisplayName
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
