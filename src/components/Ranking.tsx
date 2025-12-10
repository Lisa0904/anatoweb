// src/components/Ranking.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

interface RankEntry {
  id: string;
  username: string;
  score: number;
  max_questions: number;
  topic: string;
  created_at: string;
}

// Die Komponente nimmt einen 'trigger' entgegen. 
// Wenn sich dieser Wert ändert, lädt die Liste neu.
export default function Ranking({ refreshTrigger }: { refreshTrigger: number }) {
  const [ranking, setRanking] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, [refreshTrigger]); // 🔥 Lädt neu, wenn sich der Trigger ändert!

  async function fetchRanking() {
    setLoading(true);
    const { data, error } = await supabase
      .from('quiz_scores')
      .select(`
        id, score, max_questions, topic, created_at, 
        profiles (username)
      `)
      .order('score', { ascending: false })
      .limit(10);

    if (!error && data) {
      const formatted = data.map((item: any) => ({
        id: item.id,
        username: item.profiles?.username || 'Anonym',
        score: item.score,
        max_questions: item.max_questions,
        topic: item.topic,
        created_at: item.created_at,
      }));
      setRanking(formatted);
    }
    setLoading(false);
  }

  return (
    <div style={{ marginTop: '60px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Top 10 Bestenliste</h3>
      
      <div className="section-box panel" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: 20, textAlign: 'center', color: 'var(--muted)' }}>Lade Rangliste...</p>
        ) : (
          <table className="ranking-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 15px', textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>Rang</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>Name</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>Thema</th>
                <th style={{ padding: '12px 15px', textAlign: 'right', background: 'rgba(255,255,255,0.05)' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {ranking.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: 'var(--muted)' }}>Noch keine Einträge. Sei der/die Erste!</td></tr>
              ) : (
                ranking.map((entry, i) => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '12px 15px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1 + '.'}</td>
                    <td style={{ padding: '12px 15px', fontWeight: 600, color: 'var(--text-strong)' }}>{entry.username}</td>
                    <td style={{ padding: '12px 15px', color: 'var(--muted)', fontSize: '0.9rem' }}>{entry.topic}</td>
                    <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: 'bold', color: 'var(--accent)' }}>{entry.score}/{entry.max_questions}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}