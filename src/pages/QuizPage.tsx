// src/pages/QuizPage.tsx
import React, { useState, useMemo } from "react";
import quizJson from "../data/quiz.json";
import { type AnatomyTopic as Topic, TOPIC_OPTIONS_ALL } from "../utils/constants";


interface Question {
  question: string;
  answers: string[];
  correct: number;
  topic: Topic; // ✅ Jetzt den Alias 'Topic' verwenden
}



export default function QuizPage() {
  const [topic, setTopic] = useState<Topic>("Alle");
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(false);
  const [revealCorrect, setRevealCorrect] = useState<boolean>(false);
  const [autoNextTimer, setAutoNextTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean[]>([]);


  // 💾 Quizdaten filtern & mischen
  const questions = useMemo(() => {
  // Wir stellen sicher, dass quizJson als das erwartete Array typisiert ist.
  const allQuestions: Question[] = (quizJson as any).questions; 

  const filtered = allQuestions.filter((q) =>
    topic === "Alle" ? true : q.topic === topic
  );
    const limit =
      topic === "Alle" ? 10 : ["Muskeln", "Skelett", "Kreislaufsystem", "Organe"].includes(topic)
        ? 6
        : filtered.length;
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }, [topic, resetKey]);

  const q = questions[index];

  function answer(i: number) {
    if (locked) return;
    setSelected(i);
    setLocked(true);

    const isCorrect = i === q.correct;
    if (isCorrect) {
  if (!answeredCorrectly[index]) {
    setScore((s) => s + 1);
    setAnsweredCorrectly((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
  }
}


    // Optional: Soundeffekt (Datei z. B. public/sounds/correct.mp3)
    // const sound = new Audio(isCorrect ? "/sounds/correct.mp3" : "/sounds/wrong.mp3");
    // sound.volume = 0.3;
    // sound.play();

    setRevealCorrect(true);
    const timer = setTimeout(nextQuestion, 8000);
    setAutoNextTimer(timer);
  }

  function nextQuestion() {
    if (autoNextTimer) clearTimeout(autoNextTimer);
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      resetState();
    } else {
      setShowResult(true);
    }
  }

  function prevQuestion() {
    if (autoNextTimer) clearTimeout(autoNextTimer);
    if (index > 0) {
      setIndex((i) => i - 1);
      resetState();
    }
  }

  function resetState() {
    setSelected(null);
    setLocked(false);
    setRevealCorrect(false);
  }

  function resetQuiz() {
    if (autoNextTimer) clearTimeout(autoNextTimer);
    setIndex(0);
    setScore(0);
    setShowResult(false);
    setAnsweredCorrectly([]);
    resetState();
    setResetKey((k) => k + 1);
  }

  const progress = ((index + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 className="title">Anatomie-Quiz</h1>
      <p className="lead">
        Teste dein Wissen zu Muskeln, Organen, Knochen und mehr. <br />
      </p>

      {/* Themenauswahl */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginBottom: 30,
          flexWrap: "wrap",
        }}
      >
        {TOPIC_OPTIONS_ALL.map((t) => (
  <button
    key={t}
    onClick={() => {
      setTopic(t as Topic); // Hinzufügen des Type Casts, da setTopic den Typ erwartet
      resetQuiz();
    }}
    className={`ctrl-btn ${topic === t ? "active" : ""}`}
  >
    {t}
  </button>
))}
      </div>

      {!showResult ? (
        <>
          {/* Fortschrittsanzeige */}
          <div className="quiz-progress-container">
            <div className="quiz-progress" style={{ width: `${progress}%` }} />
          </div>

          {/* Frage-Box */}
          <div className="panel-quiz quiz-question-box">
            <div style={{ color: "var(--muted)" }}>
              Frage {index + 1} / {questions.length} — <strong>{topic}</strong>
            </div>

            <h2 style={{ marginTop: 12, lineHeight: 1.5 }}>{q.question}</h2>

            <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
              {q.answers.map((a: string, i: number) => {
                const isCorrect = revealCorrect && i === q.correct;
                const isWrong = selected === i && selected !== q.correct;
                return (
                  <button
                    key={i}
                    onClick={() => answer(i)}
                    className={`ctrl-btn quiz-answer-btn ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                    style={{ pointerEvents: locked ? "none" : "auto" }}
                    type="button"
                  >
                    {a}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="quiz-nav">
              <div>Punktzahl: {score} / {questions.length}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="ctrl-btn quiz-answer-btn"
                  onClick={prevQuestion}
                  disabled={index === 0}
                  style={{ opacity: index === 0 ? 0.5 : 1 }}
                >
                  ← Zurück
                </button>
                <button className="ctrl-btn quiz-answer-btn" onClick={nextQuestion}>
                  Weiter →
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="panel-quiz" style={{ textAlign: "center", padding: "40px 20px" }}>
          <h2>Quiz beendet!</h2>
          <p style={{ marginTop: 12, color: "var(--muted)" }}>
            Du hast <strong>{score}</strong> von{" "}
            <strong>{questions.length}</strong> Fragen richtig beantwortet.
          </p>

          {/* 💬 Didaktisches Feedback */}
          <p style={{ marginTop: 16, color: "var(--muted)" }}>
            {score / questions.length > 0.8
              ? "Fantastisch! Dein anatomisches Wissen ist beeindruckend."
              : score / questions.length > 0.5
                ? "Gute Arbeit! Mit ein wenig Übung wirst du Anatomie-Profi. "
                : "Nicht aufgeben – Lernen heißt Wiederholen. Probier’s gleich nochmal!"}
          </p>

          <button className="ctrl-btn quiz-answer-btn" style={{ marginTop: 28 }} onClick={resetQuiz}>
            Nochmal spielen 
          </button>
        </div>
      )}
    </div>
  );
}
