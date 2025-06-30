// src/services/aiService.js
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const LLM_MODEL = 'mistralai/mistral-small-3.2-24b-instruct:free';

async function callModel(userPrompt) {
  const systemPrompt = `You are a JSON generator. Your ONLY output must be a single valid JSON array. Do NOT include any markdown, code blocks, or explanatory text. The JSON array must start with '[' and end with ']'.`;

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0,
      top_p: 1
    })
  });

  console.dir(response.body);

  if (!response.ok) {
    const errText = await response.text();
    console.error('API Error', response.status, errText);
    throw new Error(`API Error: ${response.status}`);
  }

  const { choices } = await response.json();
  let text = (choices?.[0]?.message?.content || '').trim();

  // Remove any stray backticks
  text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');

  // Ensure valid JSON array
  const first = text.indexOf('[');
  const last = text.lastIndexOf(']');
  if (first !== 0 || last !== text.length - 1) {
    console.error('Unexpected format, text:', text);
    throw new Error('Expected raw JSON array with no extra characters');
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('JSON parse error:', e, 'text:', text);
    throw new Error('Failed to parse JSON');
  }
}

export async function generateQuestions(topic, difficulty, config) {
  const { mcq=0, short=0, long=0, code=0 } = config;
  const specs = [];
  if (mcq) specs.push(`${mcq} MCQ`);
  if (short) specs.push(`${short} short-answer`);
  if (long) specs.push(`${long} long-answer`);
  if (code) specs.push(`${code} coding`);

  const userPrompt = `Generate exactly one JSON array of question objects. Each object must have: type, question, options (if MCQ), answer, explanation.\n` +
                     `Topic: ${topic}\nDifficulty: ${difficulty}\nInclude: ${specs.join(', ')} questions.`;
  return callModel(userPrompt);
}

export async function evaluateAnswers(userAnswers) {
  const userPrompt = `Given these answers ${JSON.stringify(userAnswers)}, output exactly one JSON array of objects with: type, question, userAnswer, score, outOf, feedback, suggestion.`;
  return callModel(userPrompt);
}