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

      setTimeout(() => {
        function step() {
          if (!v) return;
          if (v.currentTime <= 0) {
            reversing = false;
            v.play();
            return;
          }
          v.currentTime -= 1 / 60;
          animationFrame = requestAnimationFrame(step);
        }
        step();
      }, 400);
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
    <div> {/* Text & Buttons */}
      <div style={{ maxWidth: 900, margin: "0 auto", marginBottom: "2rem", textAlign: "left" }}>
        <h1 className="title">Explore the Human Body</h1>
        <p className="lead" style={{ textAlign: "left" }}>
          Interaktive Lernplattform zur Anatomie. Drehe Modelle, klicke Organe an und vertiefe
          dein Wissen mit unserem Quiz.
        </p>
      </div>

      {/* 🎥 Videobox mit Overlay */}
      <div
        className="video-container"
        style={{
          position: "relative",
          borderRadius: "14px",
          overflow: "hidden",
          marginBottom: "28px",
          background: "rgba(34, 197, 94, 0.15)", // sanftes AnatoWeb-Grün
          boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
          maxWidth: "800px",
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginTop: 28,
        }}
      >
        <Link to="/model" className="ctrl-btn" style={{ minWidth: "160px", textAlign: "center" }}>
          3D-Modell
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