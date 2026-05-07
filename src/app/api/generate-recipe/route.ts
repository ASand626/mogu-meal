import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return NextResponse.json(
        { error: 'APIキーが設定されていないため、新規レシピ生成をスキップしました。' },
        { status: 401 }
      );
    }

    const { targetIngredients, excludeRecipeIds, adults, children, targetAppliances, dislikedIngredients } = await request.json();

    const prompt = `
あなたは日本の家庭料理のプロフェッショナルです。
以下の条件を満たす、最高に美味しくて確実な日本の家庭料理レシピを1品だけ考案し、指定されたJSON形式で出力してください。

【条件】
- メインで使用する食材: ${targetIngredients}
- 避けるべき食材（子供の好き嫌いなど）: ${dislikedIngredients ? dislikedIngredients.join(', ') : '特になし'}
- 使用可能な調理器具: ${targetAppliances ? targetAppliances.join(', ') : 'すべて可'}
- 想定人数: 大人 ${adults}人, 子供 ${children}人
- 奇抜な組み合わせは避け、クックパッドやクラシルにあるような「王道で間違いなく美味しい味付け」にすること。

【期待される出力形式（必ずこの形式のJSONのみを返すこと）】
{
  "id": "ai_generated_" + 乱数文字列,
  "name": "レシピのタイトル",
  "ingredients": [
    { "name": "材料名", "amount": "分量（想定人数に合わせた量）" }
  ],
  "steps": [
    "手順1",
    "手順2"
  ],
  "cookingTime": 15,
  "appliance": ["フライパン"],
  "tags": ["AI生成", "メイン"],
  "branchOptions": []
}
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional chef. Output ONLY valid JSON, without any markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errData.error?.message || 'OpenAI APIのエラーが発生しました。' },
        { status: response.status }
      );
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    if (content.startsWith('\`\`\`')) {
      content = content.replace(/^\`\`\`(json)?\n/, '').replace(/\n\`\`\`$/, '');
    }

    const recipe = JSON.parse(content);
    return NextResponse.json({ recipe });

  } catch (error: any) {
    console.error('Recipe Generation API Error:', error);
    return NextResponse.json(
      { error: 'サーバー内部エラーが発生しました。' },
      { status: 500 }
    );
  }
}
