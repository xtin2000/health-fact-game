import { useAnimation } from 'framer-motion';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const THRESHOLD = 100;

export default function SwipeCard({ card, isTop, stackIndex, onSwipe }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-22, 22]);
  const realOpacity = useTransform(x, [20, 90], [0, 1], { clamp: true });
  const fakeOpacity = useTransform(x, [-90, -20], [1, 0], { clamp: true });
  const controls = useAnimation();

  const scale = 1 - stackIndex * 0.05;
  const translateY = stackIndex * 12;

  async function handleDragEnd(_, { offset }) {
    if (offset.x > THRESHOLD) {
      await controls.start({
        x: 650,
        opacity: 0,
        transition: { duration: 0.28, ease: 'easeOut' },
      });
      onSwipe('right');
    } else if (offset.x < -THRESHOLD) {
      await controls.start({
        x: -650,
        opacity: 0,
        transition: { duration: 0.28, ease: 'easeOut' },
      });
      onSwipe('left');
    } else {
      controls.start({
        x: 0,
        transition: { type: 'spring', stiffness: 400, damping: 28 },
      });
    }
  }

  return (
    <motion.div
      className="swipe-card"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        scale,
        y: translateY,
        zIndex: 10 - stackIndex,
        cursor: isTop ? 'grab' : 'default',
      }}
      animate={isTop ? controls : { scale, y: translateY }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileTap={isTop ? { cursor: 'grabbing' } : {}}
    >
      {/* REAL label — appears when dragging right */}
      {isTop && (
        <motion.div className="label label-real" style={{ opacity: realOpacity }}>
          REAL ✓
        </motion.div>
      )}
      {/* FAKE label — appears when dragging left */}
      {isTop && (
        <motion.div className="label label-fake" style={{ opacity: fakeOpacity }}>
          FAKE ✗
        </motion.div>
      )}

      <div className="card-source">{card.source}</div>
      <p className="card-text">{card.text}</p>
      <div className="card-footer">
        <span className="card-category">{card.category}</span>
        <span className={`card-difficulty diff-${card.difficulty}`}>{card.difficulty}</span>
      </div>
    </motion.div>
  );
}
