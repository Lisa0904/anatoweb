import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div>
      <div style={{display:"flex",gap:28,alignItems:"center",justifyContent:"space-between"}}>
        <div style={{maxWidth:680}}>
          <h1 className="title">Explore the Human Body</h1>
          <p className="lead">Interaktive Lernplattform zur Anatomie. Drehe Modelle, klicke Organe an und vertiefe dein Wissen mit unserem Quiz.</p>
          <div style={{display:"flex",gap:12,marginTop:18}}>
            <Link to="/model" className="ctrl-btn">3D-Modell erkunden</Link>
            <Link to="/quiz" className="ctrl-btn">Zum Quiz</Link>
          </div>
        </div>
        <div style={{width:320, textAlign:"right", color:"var(--muted)"}}>
          <div style={{fontWeight:700,fontSize:20}}>AnatoWeb</div>
          <div style={{marginTop:8}}>Multimedia Seminar — WiSe 2025/26</div>
        </div>
      </div>
    </div>
  );
}