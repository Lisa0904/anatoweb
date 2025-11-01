import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div>
      <div style={{display:"flex",gap:28,alignItems:"center",justifyContent:"space-between"}}>
        <div style={{maxWidth:680}}>
          <h1 className="title">Explore the Human Body</h1>
          <p className="lead">Interaktive Lernplattform zur Anatomie. Drehe Modelle, klicke Organe an und vertiefe dein Wissen mit unserem Quiz.</p>
          <div style={{display:"flex",gap:12,marginTop:18}}>
            <Link to="/model" className="ctrl-btn">3D-Modell</Link>
            <Link to="/flashcards" className="ctrl-btn">Karteikarten</Link>
            <Link to="/quiz" className="ctrl-btn">Quiz</Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}