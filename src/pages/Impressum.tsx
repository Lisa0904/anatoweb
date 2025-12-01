export default function Impressum() {
  return (
    <div className="page-container">
      <h1 className="title">Impressum</h1>

      <p className="lead">
        Angaben gemäß § 5 TMG für das studentische Projekt <strong>AnatoWeb</strong>.
      </p>

      <div className="section-box">
        <h3>Projektverantwortliche</h3>
        <p className="info-text">
          AnatoWeb – Lernplattform für menschliche Anatomie<br />
          Erstellt im Rahmen des Moduls <strong>KMMB4732 – Multimedia</strong><br />
          Hochschule Karlsruhe
        </p>
      </div>

      <div className="section-box">
        <h3>Kontakt</h3>
        <p className="info-text">
          E-Mail: <a href="mailto:kontakt@anatoweb.de">kontakt@anatoweb.de</a><br />
          Verantwortliche Studierende: Anne Eppendorfer, Moritz Münch, Lisa Taljanovic
        </p>
      </div>

      <div className="section-box">
        <h3>Haftungsausschluss</h3>
        <p className="info-text">
          Dies ist ein <strong>studentisches Projekt</strong>.  
          Es besteht kein Anspruch auf Vollständigkeit, medizinische Korrektheit
          oder permanente Verfügbarkeit. Die Inhalte dienen ausschließlich
          der <em>Lehre und Demonstration moderner Webtechnologien</em>.
        </p>
      </div>
    </div>
  );
}