export default function ScoreBoard({ score, streak, highScore }) {
  const multiplier =
    streak >= 5 ? '×3' : streak >= 3 ? '×2' : null;

  return (
    <div className="scoreboard">
      <div className="score-item">
        <div className="score-value">{score}</div>
        <div className="score-label">Score</div>
      </div>
      <div className="score-divider" />
      <div className="score-item">
        <div className={`score-value ${streak >= 3 ? 'streak-hot' : ''}`}>
          {streak >= 1 ? `🔥 ${streak}` : streak}
        </div>
        <div className="score-label">Streak{multiplier ? ` ${multiplier}` : ''}</div>
      </div>
      <div className="score-divider" />
      <div className="score-item">
        <div className="score-value score-best">{highScore}</div>
        <div className="score-label">Best</div>
      </div>
    </div>
  );
}
