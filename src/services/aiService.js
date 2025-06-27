/* services/aiService.js */

// Load API key from environment variable for security
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callMistral(prompt) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-small',
      messages: [
        { role: 'system', content: 'You are a helpful exam generator.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  // Check for HTTP errors
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('OpenRouter API error:', res.status, err);
    throw new Error(`OpenRouter API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';

  // Extract JSON array
  const start = text.indexOf('[');
  const end   = text.lastIndexOf(']');
  if (start === -1 || end === -1) {
    console.error('Response did not include JSON array:', text);
    throw new Error('Invalid response format: no JSON array found');
  }

  const raw = text.slice(start, end + 1).trim();
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse JSON from AI response:', raw);
    throw new Error('Failed to parse JSON from AI response');
  }
}

export async function generateQuestions(topic, difficulty, config) {
  const { mcq = 0, short = 0, long = 0, code = 0 } = config || {};
  const types = [];
  if (mcq) types.push(`Generate ${mcq} MCQ questions`);
  if (short) types.push(`Generate ${short} ShortAnswer questions`);
  if (long) types.push(`Generate ${long} LongAnswer questions`);
  if (code) types.push(`Generate ${code} Coding questions`);

  const prompt = `Output only JSON. Do not include any explanations.\nTopic: ${topic}\nDifficulty: ${difficulty}\n${types.join('\n')}\nReturn an array in JSON with fields: type, question, options (for MCQ), answer, explanation.`;
  return await callMistral(prompt);
}

export async function evaluateAnswers(userAnswers) {
  const prompt = `Output only JSON array.\nEvaluate these answers (assign scores out of respective points). For each answer, return: type, question, userAnswer, score, outOf, feedback, suggestion.\nData: ${JSON.stringify(userAnswers)}`;
  return await callMistral(prompt);
}
