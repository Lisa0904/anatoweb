import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
      </div>
    </nav>
  );
}