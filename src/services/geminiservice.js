import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../constants/config';

const getTodayKey = () => {
  const today = new Date().toISOString().split('T')[0];
  return `ai_searches_${today}`;
};

export const getAISearchCount = async () => {
  try {
    const count = await AsyncStorage.getItem(getTodayKey());
    return count ? parseInt(count) : 0;
  } catch {
    return 0;
  }
};

export const incrementAISearchCount = async () => {
  try {
    const count = await getAISearchCount();
    await AsyncStorage.setItem(getTodayKey(), String(count + 1));
  } catch (error) {
    console.error('Error incrementing count:', error);
  }
};

export const askGemini = async (query) => {
  try {
    const count = await getAISearchCount();
    if (count >= config.MAX_AI_SEARCHES_PER_DAY) {
      return {
        success: false,
        answer: `You have used all ${config.MAX_AI_SEARCHES_PER_DAY} free AI searches for today. Come back tomorrow!`,
        limitReached: true,
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.GEMINI_MODEL}:generateContent?key=${config.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are Ominx AI, a helpful browser assistant. Answer this query in 3-4 short sentences. Be direct and informative. No markdown, no bullet points, no asterisks. Plain text only. Query: ${query}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
          topP: 0.8,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return {
        success: false,
        answer: `AI Error: ${errorData?.error?.message || 'Unknown error'}`,
        limitReached: false,
      };
    }

    const data = await response.json();

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      return {
        success: false,
        answer: 'No answer returned. Please try again.',
        limitReached: false,
      };
    }

    await incrementAISearchCount();

    return {
      success: true,
      answer: answer.trim(),
      limitReached: false,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        answer: 'AI request timed out. Please try again.',
        limitReached: false,
      };
    }
    console.error('Gemini error:', error);
    return {
      success: false,
      answer: 'AI unavailable right now. Please try again.',
      limitReached: false,
    };
  }
};