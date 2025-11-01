import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div>
      <div style={{display:"flex",gap:28,alignItems:"center",justifyContent:"space-between"}}>
        <div style={{maxWidth: 900, margin: "0 auto"}}>
          <h1 className="title">Explore the Human Body</h1>
          <p className="lead">Interaktive Lernplattform zur Anatomie. Drehe Modelle, klicke Organe an und vertiefe dein Wissen mit unserem Quiz.</p>
          <div style={{display:"flex", flexDirection:"column", gap:12, marginTop:18, alignItems:"flex-start"}}>
            <Link to="/model" className="ctrl-btn" style={{width: "200px"}}>3D-Modell</Link>
            <Link to="/flashcards" className="ctrl-btn" style={{width: "200px"}}>Karteikarten</Link>
            <Link to="/quiz" className="ctrl-btn" style={{width: "200px"}}>Quiz</Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}