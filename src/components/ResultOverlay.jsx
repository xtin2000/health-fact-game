import { motion, AnimatePresence } from 'framer-motion';

export default function ResultOverlay({ result }) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          className={`result-overlay ${result.correct ? 'result-overlay--correct' : 'result-overlay--wrong'}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.25 }}
        >
          <div className={`result-verdict ${result.correct ? 'result-correct' : 'result-wrong'}`}>
            {result.correct ? '✓' : '✗'}{' '}
            {result.correct
              ? `Correct!${result.points > 10 ? ` +${result.points} (${result.multiplier}× streak!)` : ` +${result.points}`}`
              : `Wrong — it was ${result.card.isReal ? 'REAL' : 'FAKE'}`}
          </div>

          <div className="result-explanation">
            {result.card.explanation}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
