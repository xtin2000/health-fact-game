import { useCardDeck } from './hooks/useCardDeck';
import CardStack from './components/CardStack';
import ScoreBoard from './components/ScoreBoard';
import ResultOverlay from './components/ResultOverlay';
import GameOver from './components/GameOver';

export default function App() {
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
        />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Health Fact Check</h1>
        <ScoreBoard score={score} streak={streak} highScore={highScore} />
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
    </div>
  );
}
