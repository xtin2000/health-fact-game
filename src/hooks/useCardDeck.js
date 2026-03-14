import { useState, useEffect, useRef } from 'react';
import initialCards from '../data/posts.json';
import { fetchMoreCards } from '../api/generateCards';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getMultiplier(streak) {
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}

export function useCardDeck() {
  const [deck, setDeck] = useState(() => shuffle(initialCards));
  const [results, setResults] = useState([]); // { correct: bool }
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastResult, setLastResult] = useState(null); // shown by ResultOverlay
  const [isFetching, setIsFetching] = useState(false);
  const seenIds = useRef(new Set(initialCards.map(c => c.id)));

  // Auto-dismiss result overlay after 2.5 s
  useEffect(() => {
    if (!lastResult) return;
    const t = setTimeout(() => setLastResult(null), 2500);
    return () => clearTimeout(t);
  }, [lastResult]);

  // Fetch more cards from Claude when deck runs low
  useEffect(() => {
    const hasApiKey = !!import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (deck.length < 5 && !isFetching && hasApiKey) {
      setIsFetching(true);
      fetchMoreCards([...seenIds.current])
        .then(newCards => {
          newCards.forEach(c => seenIds.current.add(c.id));
          setDeck(prev => [...prev, ...shuffle(newCards)]);
        })
        .catch(err => console.warn('Could not fetch more cards:', err.message))
        .finally(() => setIsFetching(false));
    }
  }, [deck.length, isFetching]);

  function swipe(direction, card) {
    // right = guessed REAL, left = guessed FAKE
    const guessedReal = direction === 'right';
    const correct = guessedReal === card.isReal;
    const newStreak = correct ? streak + 1 : 0;
    const multiplier = getMultiplier(newStreak);
    const points = correct ? 10 * multiplier : 0;

    setScore(prev => prev + points);
    setStreak(newStreak);
    setResults(prev => [...prev, { correct }]);
    setLastResult({ correct, card, points, multiplier });
    setDeck(prev => prev.slice(1));
  }

  function restart() {
    setDeck(shuffle(initialCards));
    setResults([]);
    setScore(0);
    setStreak(0);
    setLastResult(null);
    seenIds.current = new Set(initialCards.map(c => c.id));
  }

  const accuracy =
    results.length > 0
      ? Math.round((results.filter(r => r.correct).length / results.length) * 100)
      : 0;

  const isGameOver = deck.length === 0 && !isFetching;

  return {
    deck,
    score,
    streak,
    lastResult,
    isFetching,
    isGameOver,
    accuracy,
    totalAnswered: results.length,
    swipe,
    restart,
  };
}
