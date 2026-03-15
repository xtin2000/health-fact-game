import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ onClose }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('highScore', 'desc'),
      limit(20)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        setError('Could not load leaderboard. Check Firestore rules.');
        setLoading(false);
        console.warn('Leaderboard error:', err.message);
      }
    );
    return unsub;
  }, []);

  return (
    <div className="lb-overlay">
      <div className="lb-card">
        <div className="lb-header">
          <h2 className="lb-title">🏆 Leaderboard</h2>
          <button className="lb-close" onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <p className="fetching-banner">Loading…</p>
        ) : error ? (
          <p className="fetching-banner" style={{ color: '#ef4444' }}>{error}</p>
        ) : entries.length === 0 ? (
          <p className="fetching-banner">No scores yet — be the first!</p>
        ) : (
          <div className="lb-list">
            <div className="lb-row lb-row-header">
              <span className="lb-col-rank">#</span>
              <span className="lb-col-name">Player</span>
              <span className="lb-col-score">Best</span>
              <span className="lb-col-games">Games</span>
            </div>
            {entries.map((e, i) => (
              <div
                key={e.id}
                className={`lb-row${e.id === user?.uid ? ' lb-mine' : ''}`}
              >
                <span className="lb-col-rank">
                  {i < 3 ? MEDALS[i] : i + 1}
                </span>
                <span className="lb-col-name">{e.username}</span>
                <span className="lb-col-score">{e.highScore}</span>
                <span className="lb-col-games">{e.gamesPlayed}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
