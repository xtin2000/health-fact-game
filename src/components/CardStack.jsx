import SwipeCard from './SwipeCard';

export default function CardStack({ deck, onSwipe }) {
  // Show top 3 cards; render in reverse so index 0 is on top visually
  const visible = deck.slice(0, 3);

  if (visible.length === 0) return null;

  return (
    <div className="card-stack">
      {[...visible].reverse().map((card, reversedIndex) => {
        const stackIndex = visible.length - 1 - reversedIndex;
        return (
          <SwipeCard
            key={card.id}
            card={card}
            isTop={stackIndex === 0}
            stackIndex={stackIndex}
            onSwipe={(dir) => onSwipe(dir, card)}
          />
        );
      })}
    </div>
  );
}
