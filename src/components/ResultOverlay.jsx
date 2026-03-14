import { motion, AnimatePresence } from 'framer-motion';

export default function ResultOverlay({ result }) {
  return (
    <AnimatePresence>
      {result && (
        <motion.div
          className="result-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`result-icon ${result.correct ? 'result-correct' : 'result-wrong'}`}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            {result.correct ? '✓' : '✗'}
          </motion.div>

          <div className={`result-verdict ${result.correct ? 'result-correct' : 'result-wrong'}`}>
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
