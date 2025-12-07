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

    // 1. Registrierung bei Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Erstellen des Profiles mit dem Benutzernamen (für die Rangliste)
    if (data?.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        { id: data.user.id, username: username.trim() }
      ]);

      if (profileError) {
        // Wenn das Profil fehlschlägt, ist das kritisch, da die Rangliste nicht funktioniert.
        // Wir setzen den Fehler und loggen den Benutzer ggf. wieder aus.
        setError("Registrierung erfolgreich, aber Benutzername konnte nicht gespeichert werden: " + profileError.message);
        await supabase.auth.signOut(); // Sicherheitshalber ausloggen
        setLoading(false);
        return;
      }
    }

    // 3. Erfolg: Navigation (Supabase sendet standardmäßig eine Bestätigungs-E-Mail)
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
            <label htmlFor="username">Dein Benutzername (für die Rangliste)</label>
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