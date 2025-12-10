import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase"; // Import des Supabase Clients

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else if (authData.user) {
      const user = authData.user;
      
      // Holt den temporär gespeicherten Namen
      const pendingUsername = localStorage.getItem('pendingUsername');
      
      // ✅ FINALE UPDATE LOGIK:
      if (pendingUsername) {
         // Wir führen das UPDATE einfach aus, da die RLS-Policy dies erlaubt
         const { error: updateError } = await supabase
            .from('profiles')
            .update({ username: pendingUsername })
            .eq('id', user.id);
            
        if (updateError) {
            console.error("Fehler beim finalen Namen-Update:", updateError);
        } else {
            // Nach erfolgreichem Update den lokalen Speicher löschen
            localStorage.removeItem('pendingUsername');
        }
      }
      
      // 2. Erfolg: Navigation
      navigate("/model"); 
    }
    
    setLoading(false);
  };

  return (
    <div className="page-container form-page">
      <h1 className="title">Login</h1>
      <p className="lead">
        Logge dich ein, um deinen Lernfortschritt und Highscore zu speichern.
      </p>

      <div className="section-box form-box">
        <form onSubmit={handleLogin}>
          
          <div className="input-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="deine.adresse@mail.de"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Dein sicheres Passwort"
            />
          </div>

         {error && <p className="form-error">⚠️ Fehler: {error}</p>}

          <button type="submit" className="ctrl-btn primary-cta" disabled={loading}>
            {loading ? "Wird eingeloggt..." : "Einloggen"}
          </button>
        </form>
      </div>

      <p className="form-footer">
        Noch kein Konto? <Link to="/register">Hier registrieren</Link>
      </p>
    </div>
  );
}