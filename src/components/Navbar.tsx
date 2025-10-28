import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar(){
  return (
    <nav className="nav">
      <div className="brand">
        <img src="/logo.png" alt="AnatoWeb Logo" className="logo" />
      </div>
      <div className="links">
        <NavLink to="/" end className={({isActive}) => isActive ? "active" : ""}>Start</NavLink>
        <NavLink to="/model" className={({isActive}) => isActive ? "active" : ""}>3D-Modell</NavLink>
        <NavLink to="/quiz" className={({isActive}) => isActive ? "active" : ""}>Quiz</NavLink>
        <NavLink to="/about" className={({isActive}) => isActive ? "active" : ""}>Über uns</NavLink>
      </div>
    </nav>
  );
}