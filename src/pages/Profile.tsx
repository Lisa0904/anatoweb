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
    <div className="page-container form-page">
        <h1 className="title gradient">Dein Anatomie-Profil</h1>
        <p className="lead">
            Hallo {username || "Gast"}! Hier siehst du deine Account-Informationen und bald deine besten Quiz-Ergebnisse.
        </p>

        {/* --- Account Details --- */}
        <div className="section-box panel" style={{ padding: '30px', marginTop: '40px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                Account Details
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 30px', textAlign: 'left' }}>
                <div className="input-group">
                    <label style={{ color: 'var(--muted)' }}>Benutzername (Ranglisten-Name)</label>
                    <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-strong)' }}>
                       {username}
                    </p>
                </div>

                <div className="input-group">
                    <label style={{ color: 'var(--muted)' }}>E-Mail</label>
                    <p style={{ fontSize: '1rem', color: 'var(--text)' }}>
                       {email}
                    </p>
                </div>
            </div>
            
            <button onClick={handleLogout} className="ctrl-btn" style={{ 
                marginTop: 35, 
                background: '#d53434e2', 
                color: '#fff', 
                boxShadow: '0 4px 10px rgba(213, 52, 52, 0.4)'
            }}>
                Logout durchführen
            </button>
        </div>
        
        {/* --- Highscores Platzhalter --- */}
        <div className="section-box panel" style={{ padding: '30px', marginTop: '30px' }}>
            <h3 style={{ textAlign: 'center' }}>
                Top Highscores
            </h3>
            <p className="lead" style={{ marginTop: '10px', marginBottom: '0', fontSize: '0.95rem' }}>
                (Wird nach der Integration der Highscore-Logik sichtbar)
            </p>
            <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: '20px' }}>
                Keine Ergebnisse vorhanden. Starte jetzt ein Quiz!
            </p>
        </div>

    </div>
);
}