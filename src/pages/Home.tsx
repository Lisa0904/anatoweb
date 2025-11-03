import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div style={{ paddingTop: "30px" }}> {/* Abstand nach Navbar */}
      {/* Textblock */}
      <div style={{
        maxWidth: "800px",
        margin: "0 auto 3rem",
        textAlign: "center"  // zentriert wirkt eleganter
      }}>
        <h1 className="title">Anatomie interaktiv erleben</h1>
        <p className="lead" style={{ fontSize: "17px", lineHeight: 1.7 }}>
          Entdecke den menschlichen Körper in 3D. Interaktive Modelle, Karteikarten und Quizfragen – alles an einem Ort.
        </p>
      </div>

      {/* 🎥 Videobox mit Overlay */}
      <div
        className="video-container"
        style={{
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "40px",
          background: "rgba(255,255,255,0.02)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          backdropFilter: "blur(6px)",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <video
          ref={videoRef}
          src="/anatoweb_animation.mp4"
          autoPlay
          muted
          playsInline
          style={{ width: "100%", height: "auto", display: "block" }}
        ></video>

        {/* 🌙 Overlay für Fade-Effekt */}
        <div
          ref={overlayRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            opacity: 0,
            transition: "opacity 0.4s ease-in-out",
            pointerEvents: "none",
          }}
        ></div>
      </div>

      {/* Buttons */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "16px",
        marginTop: "32px",
        flexWrap: "wrap"
      }}>
        <Link to="/model" className="ctrl-btn" style={{ minWidth: "160px", textAlign: "center" }}>
          Anatomie-Viewer
        </Link>
        <Link to="/flashcards" className="ctrl-btn" style={{ minWidth: "160px", textAlign: "center" }}>
          Karteikarten
        </Link>
        <Link to="/quiz" className="ctrl-btn" style={{ minWidth: "160px", textAlign: "center" }}>
          Quiz
        </Link>
      </div>
    </div>
  );
}