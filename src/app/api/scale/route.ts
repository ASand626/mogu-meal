import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return NextResponse.json({ skipped: true, scaled: [] });
    }

    const { requests } = await request.json();

    if (!requests || !Array.isArray(requests)) {
      return NextResponse.json({ error: '無効なリクエストです。' }, { status: 400 });
    }

    const prompt = `
あなたは日本の家庭料理のプロフェッショナルです。
以下のレシピの材料について、指定された倍率（targetRatio）に合わせて分量を計算し直してください。

【ルール】
1. targetRatioが 1.0 の場合は変更不要です。
2. 小数になる場合は、料理として自然な表現にしてください（例：「卵 1.2個」ではなく「卵 1個と少し」など）。
3. 「少々」「適量」「お好みで」などは倍率に関わらずそのままにしてください。
4. 出力は必ず以下のJSON形式のみとし、マークダウン記法（\`\`\`json など）は絶対に含めないでください。

【入力データ】
${JSON.stringify(requests, null, 2)}

【期待される出力形式（必ずこの形式のJSON配列で返すこと）】
[
  {
    "recipeId": "m1",
    "ingredients": [
      { "name": "豚肉", "amount": "400g" }
    ]
  }
]
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
          { role: 'system', content: 'You are a helpful culinary assistant that outputs strictly valid JSON arrays without markdown wrappers.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
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

    const parsed = JSON.parse(content);
    return NextResponse.json({ scaled: parsed });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json(
      { error: 'サーバー内部エラーが発生しました。' },
      { status: 500 }
    );
  }
}
