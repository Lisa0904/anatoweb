import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="page-container">
      <h1 className="title">Über uns</h1>

      <p className="lead">
        <strong>AnatoWeb</strong> ist ein studentisches Projekt im Rahmen des
        Multimedia-Seminars <em>KMMB4732</em>. <br />
        Entwickelt von Anne Eppendorfer, Moritz Münch und Lisa Taljanovic.
      </p>

      <div className="section-box">
        <h3>Ziel</h3>
        <p className="info-text">
          Unser Ziel ist es, eine interaktive Lernplattform zu schaffen, die
          komplexe anatomische Strukturen verständlich und anschaulich visualisiert.
        </p>
      </div>

      <div className="section-box">
        <h3>Vision</h3>
        <p className="info-text">
          Wir möchten das Lernen der menschlichen Anatomie modern, digital und
          zugänglich gestalten – für Schüler:innen, Studierende, Lehrende und alle
          Wissbegierigen.
        </p>
      </div>

      <div className="section-box">
        <h3 >Technische Umsetzung</h3>
        <p className="info-text">
          Die Website wurde von uns eigenständig mit <strong>TypeScript</strong> und dem modernen
          Build-Tool <strong>Vite</strong> entwickelt. <br />
          Durch den Einsatz aktueller Webtechnologien können wir eine schnelle,
          interaktive und performante Benutzererfahrung gewährleisten.
        </p>
      </div> 


    <div className="section-box">
      {/* Team-Sektion */}
      
      <div className="team-section">
        <h3>Team</h3>

        <div className="team-container">
          {/* Person 1 - Klickbar machen */}
          <div className="team-member" onClick={() => navigate('/snake')} style={{ cursor: 'pointer' }}>
            <div className="team-image">
              <img src="/public/Bitmoji_Anne.jpg" alt="Anne" />
            </div>
            <h4>Anne Eppendorfer</h4>
            <p>Gestaltung, UI/UX & technische Umsetzung</p>
          </div>
 
          {/* Person 2 - Klickbar machen */}
          <div className="team-member" onClick={() => navigate('/snake')} style={{ cursor: 'pointer' }}>
            <div className="team-image">
              <img src="/public/Bitmoji_Moritz.jpg" alt="Moritz" />
            </div>
            <h4>Moritz Münch</h4>
            <p>Interaktive Features & technische Umsetzung</p>
          </div>

          {/* Person 3 - Klickbar machen */}
          <div className="team-member" onClick={() => navigate('/snake')} style={{ cursor: 'pointer' }}>
            <div className="team-image">
              <img src="/public/Bitmoji_Lisa.jpg" alt="Lisa" />
            </div>
            <h4>Lisa Taljanovic</h4>
            <p>Content Creation, visuelle Konzepte & technische Umsetzung</p>
          </div>
        </div>
      </div>
      </div>
    </div>
 );
}