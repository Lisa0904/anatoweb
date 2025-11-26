// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "active" : "";

  return (
    <nav className="nav">
      <div className="brand">
        <NavLink to="/" className="logo-link" end>
          <img src="/logo.png" alt="AnatoWeb Logo" className="logo" />
        </NavLink>
      </div>

      <div className="links">

        <NavLink to="/model" className={linkClass}>
          Anatomie-Explorer
        </NavLink>

        <NavLink to="/flashcards" className={linkClass}>
          Karteikarten
        </NavLink>

        <NavLink to="/quiz" className={linkClass}>
          Quiz
        </NavLink>

        <NavLink to="/about" className={linkClass}>
          Über uns
        </NavLink>
      </div>
    </nav>
  );
}