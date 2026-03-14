/**
 * One-time script to pre-generate the card dataset.
 * Usage: ANTHROPIC_API_KEY=your_key node scripts/generate-dataset.js
 * Output: src/data/posts.json
 */
import Anthropic from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
  console.error('Usage: ANTHROPIC_API_KEY=your_key node scripts/generate-dataset.js');
  process.exit(1);
}

const client = new Anthropic({ apiKey });

const PROMPT = `You are creating content for an educational health fact-checking game.
Generate 40 realistic social media posts about global health and vaccines.
Exactly 20 should be REAL (accurate, fact-based) and 20 should be FAKE (plausible misinformation).

Topics to cover: vaccine safety, childhood vaccines, COVID-19 vaccines, herd immunity,
WHO guidelines, disease outbreaks, flu vaccines, polio, measles, nutrition myths,
natural immunity, mRNA technology, vaccine ingredients.

Return ONLY a valid JSON array with no other text, no markdown, no code fences.
Each object must have exactly these fields:
{
  "id": "card_XXX" (unique, like card_001 through card_040),
  "text": "the post text (1-3 sentences, realistic social media tone, 50-150 words)",
  "source": "Platform · @Handle (e.g. Twitter · @HealthMom2024)",
  "isReal": true or false,
  "explanation": "1-2 sentences explaining why it's real or fake, citing evidence",
  "category": one of "vaccines" | "disease" | "nutrition" | "WHO",
  "difficulty": one of "easy" | "medium" | "hard"
}

Make fake posts plausible-sounding but clearly false when fact-checked.
Make real posts describe genuine health facts with realistic social media language.
Vary difficulty: easy posts have obvious cues, hard posts are subtle.`;

async function generate() {
  console.log('Generating 40 cards via Claude API...');

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 8192,
    thinking: { type: 'adaptive' },
    messages: [{ role: 'user', content: PROMPT }],
  });

  const text = response.content.find(b => b.type === 'text')?.text ?? '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.error('Could not find JSON array in response. Raw output:');
    console.error(text.slice(0, 500));
    process.exit(1);
  }

  let cards = JSON.parse(jsonMatch[0]);
  // Ensure all cards have stable UUIDs
  cards = cards.map(c => ({ ...c, id: c.id || uuidv4() }));

  const outPath = new URL('../src/data/posts.json', import.meta.url).pathname;
  writeFileSync(outPath, JSON.stringify(cards, null, 2));
  console.log(`✓ Wrote ${cards.length} cards to src/data/posts.json`);
}

generate().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
