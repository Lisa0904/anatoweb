import { NavLink } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabase";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<{ user: { id: string } } | null>(null);
  const [username, setUsername] = useState("Profil");

  // ✅ Optimierung: useCallback verhindert doppelten Fetch
  const fetchSessionAndProfile = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    setSession(session);

    if (session?.user) {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        setUsername(profileData.username);
      } else {
        setUsername("Profil");
        console.error("Profil nicht gefunden:", error);
      }
    } else {
      setUsername("Login");
    }
  }, []);

  useEffect(() => {
    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          fetchSessionAndProfile();
        } else {
          setUsername("Login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchSessionAndProfile]);


  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setOpen(false);
  }, []);


     const linkClass = useCallback(({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? "active" : ""}`, []);



  return (
    <nav className="nav">
      {/* Logo */}
      <div className="brand">
        <NavLink to="/" className="logo-link" end>
          <img src="/logo.png" alt="AnatoWeb Logo" className="logo" />
        </NavLink>
      </div>

      {/* Desktop Links */}
      <div className="links desktop-only">
                <NavLink to="/model" className={linkClass}>Anatomie-Explorer</NavLink>
        <NavLink to="/flashcards" className={linkClass}>Karteikarten</NavLink>
        <NavLink to="/quiz" className={linkClass}>Quiz</NavLink>
        <NavLink to="/about" className={linkClass}>Über Uns</NavLink>



        {/* ---------------------------------------------------- */}
        {/* ✅ DYNAMISCHER PROFIL / LOGIN BUTTON */}
        {/* ---------------------------------------------------- */}
        {session ? (
          // Wenn eingeloggt: Nur den Profil-Button anzeigen
          <NavLink
            to="/profile"
            className="ctrl-btn primary-cta"
            // Verwende den Profilnamen als Text, hebt sich farblich ab
                       style={{ marginLeft: 24, padding: '10px 20px' }}

          >
             {username}
          </NavLink>
        ) : (
          // Wenn nicht eingeloggt: Nur den Login-Button anzeigen
          <NavLink 
            to="/login" 
            className="ctrl-btn primary-cta" 
                       style={{ marginLeft: 24, padding: '10px 20px' }}

          >
            Login
          </NavLink>
        )}
      </div>

      {/* Hamburger Icon (only mobile) */}
      <button className="hamburger mobile-only" onClick={() => setOpen(true)}>
        ☰
      </button>

      {/* Mobile Slide-In Menü */}
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setOpen(false)}>×</button>

        <NavLink onClick={() => setOpen(false)} to="/model" className={linkClass}>Anatomie-Explorer</NavLink>
        <NavLink onClick={() => setOpen(false)} to="/flashcards" className={linkClass}>Karteikarten</NavLink>
        <NavLink onClick={() => setOpen(false)} to="/quiz" className={linkClass}>Quiz</NavLink>
        <NavLink onClick={() => setOpen(false)} to="/about" className={linkClass}>Über uns</NavLink>
        {session ? (
      <>
        <NavLink onClick={() => setOpen(false)} to="/profile" className={linkClass}>Profil ({username})</NavLink>
        <button onClick={handleLogout} className="ctrl-btn" style={{ padding: '8px 15px', background: 'rgba(255, 255, 255, 0.08)', width: '100%' }}>
          Logout
        </button>
      </>
  ) : (
      <>
        <NavLink onClick={() => setOpen(false)} to="/login" className={linkClass}>Login</NavLink>
        <NavLink onClick={() => setOpen(false)} to="/register" className={linkClass}>Registrieren</NavLink>
      </>
  )}
        
      </div>
    </nav>
  );
}