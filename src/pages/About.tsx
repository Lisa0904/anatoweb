import React from "react";

export default function About() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 className="title">Über uns</h1>

      <p className="lead">
        <strong>AnatoWeb</strong> ist ein studentisches Projekt im Rahmen des
        Multimedia-Seminars <em>KMMB4732</em>. <br/>Entwickelt von Anne Eppendorfer, Moritz Münch und Lisa Taljanovic.
      </p>

      <div style={{ marginTop: 18 }}>
        <h3>Ziel</h3>
        <p className="info-text">
          Unser Ziel ist es, eine interaktive Lernplattform zu schaffen, die
          komplexe anatomische Strukturen verständlich und anschaulich
          visualisiert.
        </p>
      </div>

      <div style={{ marginTop: 18 }}>
        <h3>Vision</h3>
        <p className="info-text">
          Wir möchten das Lernen der menschlichen Anatomie modern, digital und
          zugänglich gestalten – für Schüler:innen, Studierende, Lehrende und alle
          Wissbegierigen.
        </p>
      </div>
       <div style={{ marginTop: 18 }}>
        <h3>Technische Umsetzung</h3>
        <p className="info-text">
          Die Website wurde von uns eigenständig mit <strong>TypeScript</strong> und dem modernen
          Build-Tool <strong>Vite</strong> entwickelt. <br />
          Durch den Einsatz aktueller Webtechnologien können wir eine schnelle, 
          interaktive und performante Benutzererfahrung gewährleisten.
        </p>
      </div>
    </div>
  );
}
