import { Recipe, DayMenu, UserPreference, WeekMenu, Appliance, WeeklyConfig } from '../types';
import { recipes } from '../data/recipes';
import { scaleIngredients } from './aiCalculator';

const BASE_TOTAL_PORTIONS = 2.5; // 大人2 + 子供1(0.5)

// ランダムに配列をシャッフルするユーティリティ
const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// 特定の日に1日分のメニューを生成する関数（AI分量調整含むため非同期）
export const generateDayMenu = async (
  date: string,
  prefs: UserPreference,
  excludeRecipeIds: string[] = [], 
  mustIncludeIngredients: string = '',
  isFishDay: boolean = false,
  adults: number = 2,
  children: number = 1,
  targetMainAppliances?: Appliance[],
  targetSideAppliances?: Appliance[],
  skipScaling: boolean = false
): Promise<DayMenu> => {
  
  let mainCandidates = recipes.filter(r => r.id.startsWith('m') && !excludeRecipeIds.includes(r.id));
  let sideCandidates = recipes.filter(r => r.id.startsWith('s') && !excludeRecipeIds.includes(r.id));

  // 1. 条件による絞り込み
  if (isFishDay) {
    const fishMains = mainCandidates.filter(r => r.tags.includes('魚'));
    if (fishMains.length > 0) mainCandidates = fishMains;
  }
  if (mustIncludeIngredients) {
    const ingredientsList = mustIncludeIngredients.split(',').map(s => s.trim()).filter(Boolean);
    if (ingredientsList.length > 0) {
      const matchedMains = mainCandidates.filter(r => 
        ingredientsList.some(mustIng => r.ingredients.some(ing => ing.name.includes(mustIng)))
      );
      if (matchedMains.length === 0) {
        // --- 🤖 ハイブリッドAI：データベースに見つからない場合は新規生成 ---
        try {
          const allDisliked = prefs.children.flatMap(c => c.dislikedIngredients);
          // 絶対パスまたはlocation.originを使用する必要があるが、ここはサーバー・クライアント両方で動く可能性がある
          // クライアントで動いていると想定し、相対パスで叩く
          const res = await fetch('/api/generate-recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              targetIngredients: mustIncludeIngredients,
              adults,
              children,
              targetAppliances: targetMainAppliances || prefs.appliances,
              dislikedIngredients: allDisliked
            })
          });
          
          if (!res.ok) {
             throw new Error('AI生成APIがエラーを返しました');
          }
          
          const data = await res.json();
          if (data.recipe) {
            // 生成されたレシピを候補として扱う
            mainCandidates = [data.recipe];
          } else if (data.error) {
            throw new Error(data.error);
          } else {
             throw new Error('レシピが取得できませんでした');
          }
        } catch (e: any) {
          console.error("AIによる新規レシピ生成に失敗しました", e);
          throw new Error(`${mustIncludeIngredients} を使ったメインレシピはデータベースになく、AIによる生成も失敗しました。詳細: ${e.message}`);
        }
      } else {
        mainCandidates = matchedMains;
      }
    }
  }

  // 2. 器具による絞り込み (主菜)
  const allowedMainAppliances = targetMainAppliances && targetMainAppliances.length > 0 ? targetMainAppliances : prefs.appliances;
  if (allowedMainAppliances && allowedMainAppliances.length > 0) {
    const matchedMains = mainCandidates.filter(r => r.appliance.some(a => allowedMainAppliances.includes(a)));
    if (matchedMains.length > 0) mainCandidates = matchedMains;
  }

  if (mainCandidates.length === 0) {
    mainCandidates = recipes.filter(r => r.id.startsWith('m') && !excludeRecipeIds.includes(r.id));
  }

  // 3. スコアリング
  const scoreRecipe = (r: Recipe) => {
    let score = 0;
    prefs.children.forEach(child => {
      r.ingredients.forEach(ing => {
        if (child.likedIngredients.some(l => ing.name.includes(l))) score += 2;
        if (child.dislikedIngredients.some(d => ing.name.includes(d))) score -= 3;
      });
    });
    if (r.tags.includes('子供向け')) score += 3;

    if (prefs.appliancePriorities && prefs.appliancePriorities.length > 0) {
      const bestRank = Math.min(...r.appliance.map(a => {
        const rank = prefs.appliancePriorities!.indexOf(a);
        return rank === -1 ? 99 : rank;
      }));
      if (bestRank !== 99) score += Math.max(0, 5 - bestRank * 2);
    }
    return score;
  };

  mainCandidates.sort((a, b) => scoreRecipe(b) - scoreRecipe(a));
  // クローンして使用（APIで分量書き換えるため元のデータを汚染しない）
  const selectedMain = JSON.parse(JSON.stringify(shuffle(mainCandidates.slice(0, 3))[0] || recipes[0]));

  // 4. 副菜の器具指定と被り防止（厳密な排他制御）
  const allowedSideAppliances = targetSideAppliances && targetSideAppliances.length > 0 ? targetSideAppliances : prefs.appliances;
  if (allowedSideAppliances && allowedSideAppliances.length > 0) {
    sideCandidates = sideCandidates.filter(r => r.appliance.some(a => allowedSideAppliances.includes(a)));
  }
  
  const mainAppliances = selectedMain.appliance;
  
  // ユーザーが意図的に主菜と副菜に同じ器具を指定した場合（例：どちらもホットクック）を除外しない
  const isIntentionalOverlap = targetMainAppliances && targetSideAppliances && 
    targetMainAppliances.some(a => targetSideAppliances.includes(a));

  if (!isIntentionalOverlap) {
    // 主菜と全く同じ器具を使わないレシピだけを残す（同時調理を可能にするため）
    const strictIndependentSides = sideCandidates.filter(r => !r.appliance.some((a: Appliance) => mainAppliances.includes(a)));
    
    if (strictIndependentSides.length > 0) {
      sideCandidates = strictIndependentSides;
    } else if (sideCandidates.length === 0) {
      // 万が一候補が見つからなかった場合のフォールバック
      sideCandidates = recipes.filter(r => r.id.startsWith('s') && !excludeRecipeIds.includes(r.id));
      const fallbackIndependentSides = sideCandidates.filter(r => !r.appliance.some((a: Appliance) => mainAppliances.includes(a)));
      if (fallbackIndependentSides.length > 0) {
        sideCandidates = fallbackIndependentSides;
      }
    }
  }

  sideCandidates.sort((a, b) => scoreRecipe(b) - scoreRecipe(a));
  const selectedSide = JSON.parse(JSON.stringify(shuffle(sideCandidates.slice(0, 3))[0] || recipes.find(r => r.id.startsWith('s'))!));

  // 5. 分岐提案の選定
  const appliedBranches = [];
  const allDislikes = prefs.children.flatMap(c => c.dislikedIngredients);

  for (const branch of selectedMain.branchOptions) {
    if (branch.targetDislikedIngredients.length === 0 || 
        branch.targetDislikedIngredients.some((d: string) => allDislikes.some(userDislike => d.includes(userDislike) || userDislike.includes(d)))) {
      appliedBranches.push(branch);
      if (appliedBranches.length >= 2) break;
    }
  }

  if (appliedBranches.length < 2) {
    for (const branch of selectedSide.branchOptions) {
      if (branch.targetDislikedIngredients.length === 0 || 
          branch.targetDislikedIngredients.some((d: string) => allDislikes.some(userDislike => d.includes(userDislike) || userDislike.includes(d)))) {
        appliedBranches.push(branch);
        if (appliedBranches.length >= 2) break;
      }
    }
  }

  const dayMenu: DayMenu = {
    date,
    adults,
    children,
    main: selectedMain,
    side: selectedSide,
    appliedBranches
  };

  // 6. 単発生成時のAI分量調整
  const targetTotal = adults + children * 0.5;
  const ratio = parseFloat((targetTotal / BASE_TOTAL_PORTIONS).toFixed(2));
  
  if (!skipScaling && ratio !== 1.0) {
    const requests = [
      { recipeId: selectedMain.id, name: selectedMain.name, ingredients: selectedMain.ingredients, targetRatio: ratio },
      { recipeId: selectedSide.id, name: selectedSide.name, ingredients: selectedSide.ingredients, targetRatio: ratio }
    ];
    try {
      const scaledResponses = await scaleIngredients(requests);
      
      if (scaledResponses && scaledResponses.length > 0) {
        dayMenu.isScaled = true;
        scaledResponses.forEach(res => {
          if (res.recipeId === selectedMain.id) dayMenu.main.ingredients = res.ingredients;
          if (res.recipeId === selectedSide.id) dayMenu.side.ingredients = res.ingredients;
        });
      }
    } catch (e) {
      console.log('AI分量調整をスキップしました', e);
    }
  }

  return dayMenu;
};

// 選択された日程に基づきメニューを生成する関数（非同期）
export const generateWeekMenu = async (prefs: UserPreference, config: WeeklyConfig): Promise<WeekMenu> => {
  const weekMenu: WeekMenu = [];
  const usedRecipeIds: string[] = [];

  const daysCount = config.days.length;
  const actualFishDaysCount = Math.min(config.fishDaysCount, daysCount);
  const fishDayIndices = shuffle(Array.from({ length: daysCount }, (_, i) => i)).slice(0, actualFishDaysCount);

  for (let i = 0; i < daysCount; i++) {
    const dayConfig = config.days[i];
    const isFishDay = fishDayIndices.includes(i);
    
    const dayMenu = await generateDayMenu(
      dayConfig.date, 
      prefs, 
      usedRecipeIds, 
      dayConfig.ingredients, 
      isFishDay,
      dayConfig.adults,
      dayConfig.children,
      undefined, // targetMainAppliances
      undefined, // targetSideAppliances
      true // skipScaling
    );
    
    weekMenu.push(dayMenu);
    usedRecipeIds.push(dayMenu.main.id, dayMenu.side.id);
  }

  // AI分量調整の一括処理（通信回数を減らすため）
  const scaleRequests: { recipeId: string; name: string; ingredients: any[]; targetRatio: number }[] = [];
  
  weekMenu.forEach(day => {
    const targetTotal = day.adults + day.children * 0.5;
    const ratio = parseFloat((targetTotal / BASE_TOTAL_PORTIONS).toFixed(2));
    
    if (ratio !== 1.0) {
      scaleRequests.push({ recipeId: `${day.date}_${day.main.id}`, name: day.main.name, ingredients: day.main.ingredients, targetRatio: ratio });
      scaleRequests.push({ recipeId: `${day.date}_${day.side.id}`, name: day.side.name, ingredients: day.side.ingredients, targetRatio: ratio });
    }
  });

  if (scaleRequests.length > 0) {
    try {
      const scaledResponses = await scaleIngredients(scaleRequests);
      
      if (scaledResponses && scaledResponses.length > 0) {
        weekMenu.forEach(day => {
          day.isScaled = true;
          scaledResponses.forEach(res => {
            if (res.recipeId === `${day.date}_${day.main.id}`) day.main.ingredients = res.ingredients;
            if (res.recipeId === `${day.date}_${day.side.id}`) day.side.ingredients = res.ingredients;
          });
        });
      }
    } catch (e) {
      console.log('AI分量調整を一括スキップしました', e);
    }
  }

  return weekMenu;
};
