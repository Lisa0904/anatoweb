// src/components/Navbar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

export default function Navbar(): JSX.Element {
  return (
    <nav className="nav">
      <div className="brand">
        <NavLink to="/" className="logo-link" end>
          <img src="/logo.png" alt="AnatoWeb Logo" className="logo" />
        </NavLink>
      </div>
      <div className="links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Start
        </NavLink>
        <NavLink to="/model" className={({ isActive }) => (isActive ? "active" : "")}>
          Anatomie-Viewer
        </NavLink>
        <NavLink to="/flashcards" className={({ isActive }) => (isActive ? "active" : "")}>
          Karteikarten
        </NavLink>
        <NavLink to="/quiz" className={({ isActive }) => (isActive ? "active" : "")}>
          Quiz
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
          Über uns
        </NavLink>
      </div>
    </nav>
  );
}