import React, { useState, useMemo } from "react";
import quizData from "../data/quiz.json";
import "../Flashcards.css";
import { useEffect } from "react";


type Topic = "Alle" | "Muskeln" | "Skelett" | "Kreislaufsystem" | "Organe";

export default function Flashcards() {
  const [topic, setTopic] = useState<Topic>("Alle");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [fading, setFading] = useState(false);
  
  const [showFinished, setShowFinished] = useState(false);


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

  // === Good: Karte bleibt, einfach nächste ===
  if (rating === "good") {
    setFlipped(false);
    nextCard();
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
        {["Alle", "Muskeln", "Skelett", "Kreislaufsystem", "Organe"].map((t) => (
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

    </div>
  );
}