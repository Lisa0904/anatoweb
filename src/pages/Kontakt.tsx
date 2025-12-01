export default function Kontakt() {
  return (
    <div className="page-container">
      <h1 className="title">Kontakt</h1>

      <p className="lead">
        Du hast Fragen, Feedback oder Verbesserungsvorschläge?  
        Wir freuen uns über jede Nachricht!
      </p>

      <div className="section-box">
        <h3>Kontaktmöglichkeiten</h3>
        <p className="info-text">
          E-Mail: <a href="mailto:kontakt@anatoweb.de">kontakt@anatoweb.de</a> <br />
          Hochschule Karlsruhe – Modul KMMB4732
        </p>
      </div>

      <div className="section-box">
        <h3>Projektteam</h3>
        <p className="info-text">
          ● Anne Eppendorfer<br />
          ● Moritz Münch<br />
          ● Lisa Taljanovic
        </p>
      </div>

      <div className="section-box">
        <h3>Hinweis</h3>
        <p className="info-text">
          Dieses Kontaktformular dient ausschließlich für Anfragen
          im Rahmen des Studienprojekts.<br />
          Wir antworten in der Regel innerhalb weniger Tage.
        </p>
      </div>
    </div>
  );
}