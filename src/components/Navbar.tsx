import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react"; // Füge useEffect hinzu
import { supabase } from "../utils/supabase";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Überprüft beim Start den Login-Status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Abonniert Änderungen am Auth-Status (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false); // Mobile Menü schließen
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : "";

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
        <NavLink to="/about" className={linkClass}>Über uns</NavLink>
        {/* NEU: Login/Register Links als Buttons */}
  <NavLink to="/login" className="ctrl-btn primary-cta" style={{ marginLeft: 10, padding: '8px 15px' }}>
    Login
  </NavLink>
  
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
        <NavLink onClick={() => setOpen(false)} to="/login" className={linkClass}>Login</NavLink>
<NavLink onClick={() => setOpen(false)} to="/register" className={linkClass}>Registrieren</NavLink>
        
      </div>
    </nav>
  );
}