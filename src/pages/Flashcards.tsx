import { useState, useMemo, useCallback, useEffect } from "react";
import quizData from "../data/quiz.json";
import "../Flashcards.css";
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
     const filtered = quizData.questions.filter((q) =>
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

 

    const handleFlip = useCallback(() => {
    if (fading) return;

    // 🔊 Flip-Sound abspielen (nur wenn nicht gemutet)
    if (!isMuted) {
      const audio = new Audio("/sounds/swoosh.mp3");
      audio.volume = 0.05;
      audio.play();
    }

    setFlipped((prev) => !prev);
  }, [fading, isMuted]);



  // ✨ Wechsel zur nächsten Karte (sofort neuer Inhalt)
  const nextCard = useCallback(() => {
    setFading(true);
    setFlipped(false);

    setTimeout(() => {
      setIndex((i) => (i + 1 >= deck.length ? 0 : i + 1));
      setFading(false);
    }, 150);
  }, [deck.length]);



  const handleRating = useCallback((rating: "repeat" | "good" | "great") => {
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
        return [...newDeck, card];
      });
      setFlipped(false);
      return;
    }

    // === Great: Karte wird gelöscht ===
    if (rating === "great") {
      setDeck((d) => {
        const newDeck = d.filter((_, i) => i !== index);

        if (newDeck.length === 0) {
          setShowFinished(true);
          return [];
        }

        setIndex((i) =>
          i >= newDeck.length ? newDeck.length - 1 : i
        );

        return newDeck;
      });

      setFlipped(false);
      return;
    }
  }, [deck, index]);




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
              setTopic(t);
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

  <button 
    className="ctrl-btn primary-cta" 
    style={{ marginTop: '1.5rem' }}
    onClick={() => {
      setShowFinished(false);
      setDeck(questions);
      setIndex(0);
    }}
  >
    Erneut üben
  </button>
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
      Gelernt
    </button>
  </div>
)}

<div className="utility-buttons-row">
    {/* Sound Button */}
    <button 
      onClick={() => setIsMuted((prev) => !prev)} 
      className="sound-toggle-btn" 
      aria-label="Toggle Sound"
    >
      {isMuted ? '🔇 Ton aus' : '🔊 Ton an'}
    </button>

    {/* Anatomemory Button */}
    <button 
      onClick={() => navigate('/memory')} 
      className="memory-link-btn"
    >
      Anatomemory
    </button>
</div>

    </div>
  );
}