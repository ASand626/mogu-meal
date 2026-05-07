export type Appliance = 'ホットクック' | 'ヘルシオ（オーブン/レンジ機能）' | 'フライパン' | '鍋';
export type BranchType = '味変' | '形状変化' | '取り分け';

export interface BranchOption {
  type: BranchType;
  description: string;
  targetDislikedIngredients: string[]; // どの嫌いな食材に対応した分岐か
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  steps: string[];
  cookingTime: number; // 手作業時間（分）
  appliance: Appliance[];
  tags: string[]; // 例: "子供向け", "時短", "魚", "肉", "野菜"
  branchOptions: BranchOption[];
}

export interface ChildPreference {
  id: string;
  name: string;
  likedIngredients: string[];
  dislikedIngredients: string[];
}

export interface UserPreference {
  adultCount: number;
  childCount: number;
  children: ChildPreference[];
  appliances: Appliance[];
  appliancePriorities?: Appliance[]; // NEW: 優先順位
}

export interface WeeklyDayConfig {
  date: string; // YYYY-MM-DD
  ingredients: string;
  adults: number;
  children: number;
}

export interface WeeklyConfig {
  days: WeeklyDayConfig[];
  fishDaysCount: number;
}

export interface DayMenu {
  date: string; // YYYY-MM-DD or display string
  adults: number;
  children: number;
  main: Recipe;
  side: Recipe;
  appliedBranches: BranchOption[];
  isScaled?: boolean;
}

export type WeekMenu = DayMenu[];
