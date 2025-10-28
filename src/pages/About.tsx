import React from "react";

export default function About(){
  return (
    <div style={{maxWidth:900}}>
      <h1 className="title">Über uns</h1>
      <p className="lead">AnatoWeb — Projekt im Multimedia-Seminar KMMB4732. Team: Anne, Moritz, Lisa.</p>
      <div style={{marginTop:18}}>
        <h3>Ziel</h3>
        <p className="info-text">Interaktive Lernplattform zur Visualisierung der menschlichen Anatomie.</p>
      </div>
    </div>
  );
}