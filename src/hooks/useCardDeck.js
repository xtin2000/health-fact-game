import { useState, useEffect, useRef } from 'react';
import initialCards from '../data/posts.json';
import { auth, db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

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
  const ROUND_SIZE = 20;
  const [deck, setDeck] = useState(() => shuffle(initialCards).slice(0, ROUND_SIZE));
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastResult, setLastResult] = useState(null);
  const [isFetching] = useState(false);
  const seenIds = useRef(new Set(initialCards.map(c => c.id)));
  const savedRef = useRef(false); // prevent double-save on re-render

  // localStorage — load on first render
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem('hfg_highScore') || '0', 10)
  );
  const [gamesPlayed, setGamesPlayed] = useState(
    () => parseInt(localStorage.getItem('hfg_gamesPlayed') || '0', 10)
  );



  // Save score to Firestore when game ends
  const isGameOver = deck.length === 0 && !isFetching;
  useEffect(() => {
    if (!isGameOver || savedRef.current) return;
    const user = auth.currentUser;
    if (!user) return;
    savedRef.current = true;
    const newGamesPlayed = gamesPlayed + 1;
    setDoc(doc(db, 'leaderboard', user.uid), {
      username: user.displayName || 'Anonymous',
      highScore,
      gamesPlayed: newGamesPlayed,
      updatedAt: serverTimestamp(),
    }, { merge: true }).catch(err => console.warn('Leaderboard save failed:', err.message));
  }, [isGameOver]);

  function swipe(direction, card) {
    const guessedReal = direction === 'right';
    const correct = guessedReal === card.isReal;
    const newStreak = correct ? streak + 1 : 0;
    const multiplier = getMultiplier(newStreak);
    const points = correct ? 10 * multiplier : 0;
    const newScore = score + points;

    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('hfg_highScore', String(newScore));
    }

    setScore(newScore);
    setStreak(newStreak);
    setResults(prev => [...prev, { correct }]);
    setLastResult({ correct, card, points, multiplier });
    setDeck(prev => prev.slice(1));
  }

  function restart() {
    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);
    localStorage.setItem('hfg_gamesPlayed', String(newGamesPlayed));
    savedRef.current = false;

    setDeck(shuffle(initialCards).slice(0, ROUND_SIZE));
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

  const isNewRecord = isGameOver && score > 0 && score >= highScore;

  return {
    deck,
    score,
    streak,
    lastResult,
    isFetching,
    isGameOver,
    accuracy,
    totalAnswered: results.length,
    highScore,
    gamesPlayed,
    isNewRecord,
    swipe,
    restart,
  };
}
