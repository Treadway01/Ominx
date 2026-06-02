import config from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        answer: `You've used all ${config.MAX_AI_SEARCHES_PER_DAY} free AI searches for today. Come back tomorrow!`,
        limitReached: true,
      };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.GEMINI_MODEL}:generateContent?key=${config.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a helpful browser assistant for Ominx browser. Answer this query in 3-4 short sentences. Be direct and informative. No markdown formatting. Query: ${query}`
          }]
        }]
      }),
    });

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (answer) {
      await incrementAISearchCount();
      return { success: true, answer, limitReached: false };
    }

    return { success: false, answer: 'Could not get AI answer right now.', limitReached: false };
  } catch (error) {
    console.error('Gemini error:', error);
    return { success: false, answer: 'AI unavailable right now.', limitReached: false };
  }
};