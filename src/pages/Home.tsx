import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HeroModel from "../components/HeroModel";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  /*useEffect(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay) return;

    video.playbackRate = 0.6;
    video.play();

    let reversing = false;
    let animationFrame: number;



    // 🎬 Rückwärts-Animation (manuell)
    function smoothReverse() {
      const v = videoRef.current;
      if (!v) return;
      let speed = 1 / 90; // etwas sanfter als 1/60
      function step() {
        if (!v) return;
        if (v.currentTime <= 0) {
          reversing = false;
          v.play();
          return;
        }
        v.currentTime -= speed;
        animationFrame = requestAnimationFrame(step);
      }
      step();
    }

    function handleEnded() {
      const v = videoRef.current;
      if (!v || reversing) return;

      reversing = true;
      v.pause();
      smoothReverse();
    }

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      cancelAnimationFrame(animationFrame);
    };
  }, []);*/

  return (
    <div className="home page-wrapper"> {/* Abstand & zentrierter Container via CSS */}
      {/* Textblock  */}
      <div className="hero-text">
       {/*   <img src="/public/logo_weiß.png" alt="AnatoWeb Logo" className="logo"  style={{ width: "800px", height: "auto", textAlign: "center" }}/> */}
        <div className="hero-eyebrow">Interaktiv · Wissenschaftlich · Modern</div>
        <h1 className="title gradient">Die Anatomie des Menschen</h1>
       {/* <p className="lead hero-lead">
  Entdecke den menschlichen Körper in 3D
</p>*/}
      </div>

     {/* 🎥 Videobox mit Overlay (auskommentiert)
      <Link to="/model" className="video-container home-video" style={{ display: "block" }}>
        <video
          ref={videoRef}
          src="/Animation.mp4"
          autoPlay
          muted
          playsInline
          className="hero-video"
        />
        <div ref={overlayRef} className="hero-overlay" />
      </Link>*/}

      {/* 🧠 3D Hero Model (Wireframe) aktivieren */}
      {/* ✅ NEU: Link-Wrapper um das Modell für die Navigation */}
<Link to="/model" style={{ display: 'block', pointerEvents: 'auto' }}>
  <HeroModel />
</Link>

      

      {/* Buttons */}
      <div className="home-actions">
        {/* ✅ FIX 1: Der Explorer Button wird zum Primary CTA */}
        <Link to="/model" className="ctrl-btn home-action-btn primary-cta-two">
          Anatomie-Explorer
        </Link>
        <Link to="/flashcards" className="ctrl-btn home-action-btn">
          Karteikarten
        </Link>
        <Link to="/quiz" className="ctrl-btn home-action-btn">
          Quiz
        </Link>
      </div>
    </div>
  );
}