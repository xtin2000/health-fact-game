import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useCardDeck } from './hooks/useCardDeck';
import Auth from './components/Auth';
import CardStack from './components/CardStack';
import ScoreBoard from './components/ScoreBoard';
import ResultOverlay from './components/ResultOverlay';
import GameOver from './components/GameOver';
import Leaderboard from './components/Leaderboard';

export default function App() {
  const { user, username, logout } = useAuth();
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const {
    deck,
    score,
    streak,
    lastResult,
    isFetching,
    isGameOver,
    accuracy,
    totalAnswered,
    highScore,
    gamesPlayed,
    isNewRecord,
    swipe,
    restart,
  } = useCardDeck();

  if (!user) return <Auth />;

  if (isGameOver) {
    return (
      <div className="app">
        <GameOver
          score={score}
          accuracy={accuracy}
          totalAnswered={totalAnswered}
          highScore={highScore}
          gamesPlayed={gamesPlayed}
          isNewRecord={isNewRecord}
          onRestart={restart}
          onLeaderboard={() => setShowLeaderboard(true)}
        />
        {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Health Fact Check</h1>
        <ScoreBoard score={score} streak={streak} highScore={highScore} />
        <div className="user-bar">
          <span className="user-name">👤 {username}</span>
          <button className="lb-btn" onClick={() => setShowLeaderboard(true)}>🏆</button>
          <button className="logout-btn" onClick={logout}>Sign out</button>
        </div>
      </header>

      <div className="instructions">
        <span className="inst-fake">← FAKE</span>
        <span className="inst-hint">Swipe to judge</span>
        <span className="inst-real">REAL →</span>
      </div>

      <CardStack deck={deck} onSwipe={swipe} />

      {isFetching && (
        <div className="fetching-banner">Loading more cards…</div>
      )}

      {deck.length === 0 && isFetching && (
        <div className="loading-spinner">Fetching cards from AI…</div>
      )}

      <ResultOverlay result={lastResult} />

      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
}
