import { motion } from 'framer-motion';

export default function GameOver({ score, accuracy, totalAnswered, onRestart }) {
  const grade =
    accuracy >= 90 ? 'S' :
    accuracy >= 75 ? 'A' :
    accuracy >= 60 ? 'B' :
    accuracy >= 45 ? 'C' : 'D';

  const gradeColor =
    grade === 'S' ? '#ffd700' :
    grade === 'A' ? '#22c55e' :
    grade === 'B' ? '#4facfe' :
    grade === 'C' ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      className="game-over"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Game Over</h2>

      <div className="final-score">{score}</div>
      <div className="final-score-label">points</div>

      <div className="grade" style={{ color: gradeColor }}>
        Grade: {grade}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalAnswered}</div>
          <div className="stat-label">Cards played</div>
        </div>
      </div>

      <button className="restart-btn" onClick={onRestart}>
        Play Again
      </button>
    </motion.div>
  );
}
