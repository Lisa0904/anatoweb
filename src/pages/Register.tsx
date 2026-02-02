import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase"; // Import des Supabase Clients

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Speichere den gewünschten Namen lokal, um ihn nach der E-Mail-Bestätigung zu setzen
    localStorage.setItem('pendingUsername', username.trim()); // ✅ NEU

    // 2. Registrierung bei Supabase Auth (OHNE Metadaten)
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      // Optionen wurden entfernt, da Spalte 'username' in auth.users nicht existiert
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      localStorage.removeItem('pendingUsername'); // Löschen bei Fehler
      return;
    }
    
    // 3. Datenbank-Insert wird vom TRIGGER erledigt (setzt 'PENDING_UPDATE')

    // 4. Erfolg: Navigation
    alert("Fast geschafft! Bitte bestätige deine Registrierung über die E-Mail, die wir dir gesendet haben.");
    navigate("/login"); 
  };

  return (
    <div className="page-container form-page">
      <h1 className="title">Registrieren</h1>
      <p className="lead">
        Erstelle dein AnatoWeb-Konto und nimm an der Quiz-Rangliste teil.
      </p>

      <div className="section-box form-box">
        <form onSubmit={handleRegister}>
          
          <div className="input-group">
            <label htmlFor="username">Dein Benutzername</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              placeholder="Jonas_Anatomie_Profi"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">E-Mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="julia.ottmann@uni.de"
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
              minLength={6}
              placeholder="Mindestens 6 Zeichen"
            />
          </div>

          {error && <p className="form-error">⚠️ Fehler: {error}</p>}

          <button type="submit" className="ctrl-btn primary-cta" disabled={loading}>
            {loading ? "Registrierung läuft..." : "Konto erstellen"}
          </button>
        </form>
      </div>

      <p className="form-footer">
        Du hast bereits ein Konto? <Link to="/login">Jetzt einloggen</Link>
      </p>
    </div>
  );
}