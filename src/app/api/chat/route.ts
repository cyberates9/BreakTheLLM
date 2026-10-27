import { NextResponse } from 'next/server';
import { LEVELS } from '@/store/useGameStore';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { response: 'API Anahtarı bulunamadı! Lütfen .env.local dosyanıza OPENROUTER_API_KEY ekleyin.' },
        { status: 500 }
      );
    }

    const { levelId, userMessage, chatHistory } = await req.json();

    const currentLevel = LEVELS.find((l) => l.id === levelId);
    if (!currentLevel) {
      return NextResponse.json({ error: 'Geçersiz Seviye' }, { status: 400 });
    }

    // SEVİYE 2: GİRDİ FİLTRELEME (Blacklist)
    if (currentLevel.forbiddenKeywords && currentLevel.forbiddenKeywords.length > 0) {
      const lowerInput = userMessage.toLowerCase();
      const detectedForbidden = currentLevel.forbiddenKeywords.filter((word) =>
        lowerInput.includes(word.toLowerCase())
      );

      if (detectedForbidden.length > 0) {
        return NextResponse.json({
          isBlocked: true,
          response: `⚠️ [GÜVENLİK DUVARI UYARISI]: Mesajınızda yasaklı kelimeler tespit edildi: (${detectedForbidden.join(
            ', '
          )}). İşlem güvenlik protokolleri gereği engellendi.`,
        });
      }
    }

    const messages = [
      { role: 'system', content: currentLevel.systemPrompt },
      ...chatHistory.map((m: { sender: string; text: string }) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
      { role: 'user', content: userMessage },
    ];

    // Otomatik en uygun ücretsiz modeli seçen OpenRouter isteği
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'BreakTheLLM',
      },
      body: JSON.stringify({
        model: 'openrouter/auto', // Otomatik model yönlendirmesi
        messages: messages,
        temperature: 0.7,
        max_tokens: 300, // Kredi aşımını engelleyen token sınırı
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('OpenRouter Hatası:', data);
      return NextResponse.json(
        { response: `API Hatası (${res.status}): ${data?.error?.message || 'Yanıt alınamadı.'}` },
        { status: res.status }
      );
    }

    const botReply = data?.choices?.[0]?.message?.content || 'Üzgünüm, yanıt alınamadı.';

    return NextResponse.json({
      isBlocked: false,
      response: botReply,
    });
  } catch (error: any) {
    console.error('Sunucu Hatası:', error);
    return NextResponse.json(
      { response: `Sunucu Hatası: ${error?.message || 'İstek işlenemedi.'}` },
      { status: 500 }
    );
  }
}