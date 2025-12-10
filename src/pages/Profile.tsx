import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

  // Interface für die Score-Daten
interface UserScore {
  id: string;
  topic: string;
  score: number;
  max_questions: number;
  created_at: string;
}

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [myScores, setMyScores] = useState<UserScore[]>([]);



 useEffect(() => {
    async function getProfile() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }
      
      // 1. Profil laden (Benutzername)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setUsername(profileData.username);
        setEmail(user.email || "Nicht verfügbar");
      } else if (profileError) {
        console.error("Fehler beim Laden des Profils:", profileError);
        setUsername("Gast");
      }

      // 2. ✅ NEU: Eigene Scores laden
      const { data: scoreData, error: scoreError } = await supabase
        .from('quiz_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) // Neueste zuerst
        .limit(5); // Nur die letzten 5 anzeigen

      if (scoreData) {
        setMyScores(scoreData);
      } else if (scoreError) {
        console.error("Fehler beim Laden der Scores:", scoreError);
      }

      setLoading(false);
    }

    getProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="page-container" style={{ textAlign: "center", marginTop: 50 }}><p>Lade Profil...</p></div>;
  }

  return (
      // Zentrierter Container mit angenehmer maximaler Breite
      <div className="page-container" style={{ maxWidth: '700px', margin: '0 auto' }}> 
          
          {/* Header Bereich mit etwas mehr Abstand nach unten */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 className="title" style={{ fontSize: '3rem', marginBottom: '10px' }}>Dein Profil</h1>
              <p className="lead" style={{ fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
                  Hi, <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{username || "Gast"}</span>!
              </p>
          </div>

          {/* --- Account Details Box --- */}
          <div className="section-box panel" style={{ padding: '35px', marginBottom: '30px' }}>
              <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '25px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '15px'
              }}>
                  <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Account</h3>
                  <span className="ctrl-btn" style={{ fontSize: '0.8rem', padding: '4px 10px', pointerEvents: 'none', boxShadow: 'none'}}>
                      Verifiziert
                  </span>
              </div>
              
              {/* Responsives Grid: Bricht auf Mobile um */}
              <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '30px' 
              }}>
                  <div>
                      <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '5px' }}>
                          Benutzername
                      </label>
                      <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-strong)' }}>
                        {username}
                      </div>
                  </div>

                  <div>
                      <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '5px' }}>
                          E-Mail Adresse
                      </label>
                      <div style={{ fontSize: '1.1rem', color: 'var(--text)' }}>
                        {email}
                      </div>
                  </div>
              </div>
              
              {/* Dezenterer Logout Button */}
              <div style={{ marginTop: '35px', textAlign: 'right' }}>
                  <button onClick={handleLogout} className="ctrl-btn" style={{ 
                      background: 'transparent',
                      border: '1px solid rgba(220, 38, 38, 0.5)',
                      color: '#ef4444', // Helles Rot
                      padding: '10px 20px',
                      fontSize: '0.95rem'
                  }}>
                      Abmelden
                  </button>
              </div>
          </div>
          
          {/* --- Deine Erfolge / Historie --- */}
          <div className="section-box panel" style={{ padding: '30px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.2rem' }}>Deine letzten Quiz-Ergebnisse</h3>
              
              {myScores.length === 0 ? (
                  // Fall: Keine Scores vorhanden
                  <>
                      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                          Noch keine Quiz-Ergebnisse gespeichert.
                      </p>
                      <button 
                          onClick={() => navigate('/quiz')} 
                          className="ctrl-btn primary-cta"
                          style={{ width: '100%' }}
                      >
                          Jetzt erstes Quiz starten
                      </button>
                  </>
              ) : (
                  // Fall: Scores vorhanden -> Liste anzeigen
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {myScores.map((score) => (
                          <div key={score.id} style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              padding: '12px 15px',
                              background: 'rgba(255,255,255,0.03)',
                              borderRadius: '8px',
                              border: '1px solid rgba(255,255,255,0.05)'
                          }}>
                              <div style={{ textAlign: 'left' }}>
                                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{score.topic}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                                      {new Date(score.created_at).toLocaleDateString()}
                                  </div>
                              </div>
                              
                              <div style={{ 
                                  fontWeight: 'bold', 
                                  color: score.score === score.max_questions ? 'var(--accent)' : 'var(--text)',
                                  fontSize: '1rem'
                              }}>
                                  {score.score} / {score.max_questions}
                              </div>
                          </div>
                      ))}
                      
                      <button 
                          onClick={() => navigate('/quiz')} 
                          className="ctrl-btn"
                          style={{ marginTop: '15px', width: '100%', fontSize: '0.9rem' }}
                      >
                          Neues Quiz starten
                      </button>
                  </div>
              )}
          </div>

      </div>
    );
  }