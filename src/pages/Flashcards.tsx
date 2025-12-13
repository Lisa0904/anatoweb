import React, { useState, useMemo } from "react";
import quizData from "../data/quiz.json";
import "../Flashcards.css";
import { useEffect } from "react";
import { type AnatomyTopic as Topic, TOPIC_OPTIONS_ALL } from "../utils/constants";
import { useNavigate } from "react-router-dom";


export default function Flashcards() {
  const [topic, setTopic] = useState<Topic>("Alle");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [fading, setFading] = useState(false);
  
  const [showFinished, setShowFinished] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const navigate = useNavigate();


  // 🧠 Filtere Fragen nach gewähltem Themengebiet
  const questions = useMemo(() => {
    const filtered = quizData.questions.filter((q: any) =>
      topic === "Alle" ? true : q.topic === topic
    );
    return filtered.length > 0 ? filtered : quizData.questions;
  }, [topic]);

  const [deck, setDeck] = useState(questions);

  

  useEffect(() => {
  setDeck(questions);
  setIndex(0);
  setFlipped(false); 
}, [questions]);


  const current = deck[index];
  const finished = showFinished || deck.length === 0;

 

  function handleFlip() {
    if (fading) return;

   // 🔊 Flip-Sound abspielen (nur wenn nicht gemutet)
if (!isMuted) {
  const audio = new Audio("/sounds/swoosh.mp3"); // Pfad zur Datei im public-Ordner
  audio.volume = 0.05;
  audio.play();
}

    setFlipped((prev) => !prev);
  }


  // ✨ Wechsel zur nächsten Karte (sofort neuer Inhalt)
  function nextCard() {
  setFading(true);
  setFlipped(false);

  setTimeout(() => {
    setIndex((i) => (i + 1 >= deck.length ? 0 : i + 1));
    setFading(false);
  }, 150);
}


  function handleRating(rating: "repeat" | "good" | "great") {
  const card = deck[index];

  // === Repeat: Karte wieder hinten anhängen ===
  if (rating === "repeat") {
    setDeck((d) => [...d, card]);
    setIndex((i) => (i + 1 >= deck.length ? 0 : i + 1));
    setFlipped(false);
    return;
  }

// === Good: Karte ans Ende verschieben (Spaced Repetition) ===
if (rating === "good") {
  setDeck((d) => {
    const newDeck = d.filter((_, i) => i !== index);
    return [...newDeck, card]; // Karte kommt ans Ende
  });
  // Index bleibt gleich, da die nächste Karte automatisch an die Position rückt
  setFlipped(false);
  return;
}

  // === Great: Karte wird gelöscht ===
  if (rating === "great") {
    setDeck((d) => {
      const newDeck = d.filter((_, i) => i !== index);

      // Wenn jetzt 0 Karten übrig → fertig
      if (newDeck.length === 0) {
        setShowFinished(true);
        return [];
      }

      // Wenn wir auf der letzten waren → Index korrigieren
      setIndex((i) =>
        i >= newDeck.length ? newDeck.length - 1 : i
      );

      return newDeck;
    });

    setFlipped(false);
    return;
  }
}



  return (
    <div className="flashcards-page">
      <h1 className="title">Karteikarten</h1>
      <p className="lead flashcards-lead">
        Wähle ein Themengebiet, klicke für die Antwort auf die Karte und bewerte dein Wissen.
      </p>


      {/* Themenauswahl */}
      <div className="flashcards-topic-row">
       {TOPIC_OPTIONS_ALL.map((t) => (
          <button
            key={t}
            onClick={() => {
              setShowFinished(false);
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
  onClick={!finished ? handleFlip : undefined}
  style={{ cursor: finished ? "default" : "pointer" }}
>


  {!finished ? (
    <>
      <div className="front">
        <p className="question">{!flipped && current?.question}</p>
      </div>
      <div className="back">
        <p className="answer">
          {flipped && <strong>{current?.answers[current?.correct]}</strong>}
        </p>
      </div>
    </>
  ) : (
    <div className="flashcards-finished">
  <h2>Geschafft!</h2>
  <p className="finished-main">
    Du hast alle Karten von diesem Themengebiet gelernt:
    <br />
    <strong>{topic}</strong>
  </p>
  <p className="finished-sub">
    Wähle oben ein anderes Themengebiet, um weiterzulernen.
  </p>
</div>
  )}
</div>


      {/* Bewertungsbuttons */}
      {/* Bewertungsbuttons – nur anzeigen, wenn noch Karten übrig */}
{!finished && (
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
)}

<div className="utility-buttons-row" style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
    {/* Sound Button */}
    <button 
      onClick={() => setIsMuted((prev) => !prev)} 
      className="sound-toggle-btn" 
      aria-label="Toggle Sound"
      title={isMuted ? 'Ton anschalten' : 'Ton ausschalten'}
    >
      {isMuted ? '🔇 Ton ist aus' : '🔊 Ton ist an'}
    </button>

    {/* ✅ NEU: Memory Button */}
    <button 
      onClick={() => navigate('/memory')} 
      className="ctrl-btn"
      // Style angepasst an die Mute-Taste, aber als normale ctrl-btn
      style={{ fontSize: '0.9rem', padding: '6px 14px', borderRadius: '20px', fontWeight: 500 }}
    >
      Anatomemory
    </button>
</div>

    </div>
  );
}