import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';

const PROMPT = (excludeIds) => `You are creating content for an educational health fact-checking game.
Generate 10 NEW social media posts about global health and vaccines.
Roughly 5 should be REAL (accurate) and 5 should be FAKE (plausible misinformation).

Topics: vaccine safety, childhood vaccines, COVID-19 vaccines, herd immunity, WHO guidelines,
disease outbreaks, flu vaccines, polio, measles, nutrition myths, mRNA technology.

${excludeIds.length > 0 ? `Do NOT reuse these existing card IDs: ${excludeIds.slice(-20).join(', ')}` : ''}

Return ONLY a valid JSON array with no other text, no markdown, no code fences.
Each object must have exactly these fields:
{
  "id": a unique string like "card_live_XXX",
  "text": "the post text (1-3 sentences, realistic social media tone)",
  "source": "Platform · @Handle",
  "isReal": true or false,
  "explanation": "1-2 sentences explaining why it's real or fake",
  "category": one of "vaccines" | "disease" | "nutrition" | "WHO",
  "difficulty": one of "easy" | "medium" | "hard"
}`;

export async function fetchMoreCards(existingIds = []) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not set in .env');

  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: PROMPT(existingIds) }],
  });

  const text = response.content.find(b => b.type === 'text')?.text ?? '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('No JSON array in Claude response');

  const cards = JSON.parse(jsonMatch[0]);
  return cards.map(c => ({ ...c, id: c.id || uuidv4() }));
}
