import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }
      
      // Fehler: Navbar.tsx:30 Profil nicht gefunden: ...
      // Korrektur: select * wählen und den Fehler bei Nicht-Existenz abfangen
      const { data, error } = await supabase
        .from('profiles')
        .select('*') // Lade alle Spalten (id, username, created_at)
        .eq('id', user.id)
        .single(); // Erwartet genau eine Zeile

      if (data) {
        setUsername(data.username);
        setEmail(user.email || "Nicht verfügbar");
      } else if (error && error.code === 'PGRST116') {
        // Fehlercode PGRST116 ist 'Keine Zeilen gefunden'.
        // Der Benutzer ist zwar eingeloggt, aber das Profil fehlt.
        setUsername("Profil fehlt (bitte wenden Sie sich an den Admin)");
        setEmail(user.email || "Nicht verfügbar");
        // Der Admin muss den profiles-Eintrag erstellen.
      } else if (error) {
        console.error("Fehler beim Laden des Profils:", error);
        setUsername("Fehler beim Laden");
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
        
        {/* --- Highscores Teaser --- */}
        <div className="section-box panel" style={{ padding: '35px', textAlign: 'center', opacity: 0.8 }}>
            <h3 style={{ marginBottom: '15px' }}>Deine Erfolge</h3>
            <p style={{ color: 'var(--muted)', marginBottom: '20px' }}>
                Hier erscheinen bald deine besten Quiz-Ergebnisse.
            </p>
            <button 
                onClick={() => navigate('/quiz')} 
                className="ctrl-btn primary-cta"
            >
                Jetzt Quiz starten
            </button>
        </div>

    </div>
  );
}