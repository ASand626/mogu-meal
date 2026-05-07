import { Recipe } from '../types';

interface ScaleRequest {
  recipeId: string;
  name: string;
  ingredients: { name: string; amount: string }[];
  targetRatio: number;
}

interface ScaleResponse {
  recipeId: string;
  ingredients: { name: string; amount: string }[];
}

export const scaleIngredients = async (
  requests: ScaleRequest[]
): Promise<ScaleResponse[]> => {
  if (requests.length === 0) return [];

  try {
    const response = await fetch('/api/scale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || '分量計算APIへのアクセスに失敗しました。');
    }

    const data = await response.json();
    return data.scaled as ScaleResponse[];
  } catch (error: any) {
    console.error('AI Calculation Error:', error);
    throw new Error(error.message || '分量の自動計算に失敗しました。');
  }
};
