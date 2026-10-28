import { NextResponse } from 'next/server';
import { LEVELS } from '@/store/useGameStore';

export async function POST(req: Request) {
  try {
    const { levelId, messages } = await req.json();

    const currentLevel = LEVELS.find((l) => l.id === levelId) || LEVELS[0];

    const lastUserMessage = messages && messages.length > 0 
      ? messages[messages.length - 1].text 
      : '';

    if (currentLevel.forbiddenKeywords && currentLevel.forbiddenKeywords.length > 0) {
      const lowerInput = lastUserMessage.toLowerCase();
      const detectedForbidden = currentLevel.forbiddenKeywords.filter((word) =>
        lowerInput.includes(word.toLowerCase())
      );

      if (detectedForbidden.length > 0) {
        return NextResponse.json({
          response: `⚠️ GÜVENLİK FİLTRESİ ENGELLENDİ!\nMesajınızda yasaklı kelime tespit edildi: [${detectedForbidden.join(', ')}]. Lütfen bu kelimeleri kullanmadan tekrar deneyin.`
        });
      }
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY tanımlanmamış!' },
        { status: 500 }
      );
    }

    const apiMessages = [
      { role: 'system', content: currentLevel.systemPrompt },
      ...(messages || []).map((m: { sender: string; text: string }) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://breakthellm.netlify.app',
        'X-Title': 'BreakTheLLM'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: apiMessages,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter API Hatası:', data);
      return NextResponse.json(
        { error: data.error?.message || 'OpenRouter API hatası oluştu.' },
        { status: response.status }
      );
    }

    const aiResponse = data.choices?.[0]?.message?.content || 'Yanıt alınamadı.';

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error('Route Handler Error:', error);
    return NextResponse.json(
      { error: 'Sunucu tarafında bir hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}
