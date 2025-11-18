import React, { useState, useMemo } from "react";
import quizData from "../data/quiz.json";
import "../Flashcards.css";


type Topic = "Alle" | "Muskeln" | "Skelett" | "Kreislaufsystem" | "Organe";

export default function Flashcards() {
  const [topic, setTopic] = useState<Topic>("Alle");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [fading, setFading] = useState(false);

  // 🧠 Filtere Fragen nach gewähltem Themengebiet
  const questions = useMemo(() => {
    const filtered = quizData.questions.filter((q: any) =>
      topic === "Alle" ? true : q.topic === topic
    );
    return filtered.length > 0 ? filtered : quizData.questions;
  }, [topic]);

  const current = questions[index];
  if (!current) {
    return (
      <div style={{ textAlign: "center", marginTop: "4rem", color: "var(--muted)" }}>
        <h2>Keine Karteikarten gefunden</h2>
        <p>Bitte wähle ein anderes Themengebiet aus.</p>
      </div>
    );
  }

  function handleFlip() {
    if (fading) return;

    // 🔊 Flip-Sound abspielen
    const audio = new Audio("/sounds/swoosh.mp3");  // Pfad zur Datei im public-Ordner
    audio.play();
    audio.volume = 0.05;

    setFlipped((prev) => !prev);
  }


  // ✨ Wechsel zur nächsten Karte (sofort neuer Inhalt)
  function nextCard() {
    setFading(true);
    setFlipped(false);

    // kurz ausblenden (200ms = CSS Fade-Out)
    setTimeout(() => {
      setIndex((i) => (i + 1) % questions.length);
      setFading(false);
    }, 150);
  }

  function handleRating(rating: "repeat" | "good" | "great") {
    console.log(`Bewertung: ${rating}`);
    nextCard();
  }

  return (
    <div className="flashcards-page">
      <h1 className="title">Karteikarten</h1>
      <p className="lead flashcards-lead">
        Wähle ein Themengebiet, klicke für die Antwort auf die Karte und bewerte dein Wissen.
      </p>


      {/* Themenauswahl */}
      <div className="flashcards-topic-row">
        {["Alle", "Muskeln", "Skelett", "Kreislaufsystem", "Organe"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTopic(t as Topic);
              setIndex(0);
              setFlipped(false);
            }}
            className={`ctrl-btn ${topic === t ? "active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Karte */}
      <div
        className={`flashcard ${flipped ? "flipped" : ""} ${fading ? "fade" : ""}`}
        onClick={handleFlip}
      >
        <div className="front">
          <p className="question">{!flipped && current?.question}</p>
        </div>
        <div className="back">
          <p className="answer">
            {flipped && <strong>{current?.answers[current?.correct]}</strong>}
          </p>
        </div>
      </div>

      {/* Bewertungsbuttons */}
      <div className="rating-row">
        <button className="rating-btn repeat" onClick={() => handleRating("repeat")}>
          Wiederholen
        </button>
        <button className="rating-btn good" onClick={() => handleRating("good")}>
          Gut
        </button>
        <button className="rating-btn great" onClick={() => handleRating("great")}>
          Sehr gut
        </button>
      </div>
    </div>
  );
}