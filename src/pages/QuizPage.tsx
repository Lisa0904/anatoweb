// src/pages/QuizPage.tsx
import React, { useState, useMemo } from "react";
import quizJson from "../data/quiz.json";

type Topic = "Alle" | "Muskeln" | "Skelett" | "Kreislaufsystem" | "Organe";

interface Question {
  question: string;
  answers: string[];
  correct: number;
  topic: Topic;
}

interface QuizData {
  questions: Question[];
}

const quizData: QuizData = quizJson as unknown as QuizData;

export default function QuizPage() {
  const [topic, setTopic] = useState<Topic>("Alle");
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(false);
  const [revealCorrect, setRevealCorrect] = useState<boolean>(false);

  const questions = useMemo(() => {
    const filtered = quizData.questions.filter((q) =>
      topic === "Alle" ? true : q.topic === topic
    );
    return filtered.length > 0 ? filtered : quizData.questions;
  }, [topic]);

  const q = questions[index];

  function answer(i: number) {
    if (locked) return;
    setSelected(i);
    setLocked(true);

    const isCorrect = i === q.correct;
    if (isCorrect) setScore((s) => s + 1);

    // ✨ Wenn falsch → erst leicht verzögert die richtige zeigen
    if (!isCorrect) {
      setTimeout(() => setRevealCorrect(true), 300);
    } else {
      setRevealCorrect(true);
    }

    // ⏳ Dann nach 1.5 s zur nächsten Frage
    setTimeout(() => {
      nextQuestion();
    }, 2500);
  }

  function nextQuestion() {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setShowResult(true);
    }
    resetState();
  }

  function prevQuestion() {
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
    setIndex(0);
    setScore(0);
    setShowResult(false);
    resetState();
  }

  const progress = ((index + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 className="title">Quiz</h1>
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>
        Wähle ein Themengebiet, beantworte die Fragen und prüfe dein Wissen.
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
        {["Alle", "Muskeln", "Skelett", "Kreislaufsystem", "Organe"].map((t) => (
          <button
            key={t}
            onClick={() => {
              setTopic(t as Topic);
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
          <div
            style={{
              width: "100%",
              height: "8px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "4px",
              overflow: "hidden",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg, var(--accent), #34d399)",
                borderRadius: "4px",
                transition: "width 0.6s ease",
              }}
            />
          </div>

          <div
            style={{
              background: "var(--panel)",
              padding: 28,
              borderRadius: 14,
              boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ color: "var(--muted)" }}>
              Frage {index + 1} / {questions.length} — <strong>{topic}</strong>
            </div>

            <h2 style={{ marginTop: 12, lineHeight: 1.4 }}>{q.question}</h2>

            <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
              {q.answers.map((a, i) => {
                const isCorrect = revealCorrect && i === q.correct;
                const isWrong = selected === i && selected !== q.correct;

                return (
                  <button
                    key={i}
                    onClick={() => answer(i)}
                    className="ctrl-btn"
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      border:
                        isCorrect
                          ? "1px solid var(--accent)"
                          : isWrong
                          ? "1px solid #ff5c5c"
                          : "1px solid rgba(255,255,255,0.05)",
                      background:
                        isCorrect
                          ? "rgba(34,197,94,0.15)"
                          : isWrong
                          ? "rgba(255,92,92,0.15)"
                          : "rgba(255,255,255,0.03)",
                      color:
                        isCorrect
                          ? "var(--accent)"
                          : isWrong
                          ? "#ff5c5c"
                          : "var(--text)",
                      pointerEvents: locked ? "none" : "auto",
                      transition: "all 0.25s ease",
                    }}
                    type="button"
                  >
                    {a}
                  </button>
                );
              })}
            </div>

            {/* Punktzahl + Navigation */}
            <div
              style={{
                marginTop: 28,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "var(--muted)",
              }}
            >
              <div>
                Punktzahl: {score} / {questions.length}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="ctrl-btn"
                  onClick={prevQuestion}
                  disabled={index === 0}
                  style={{
                    opacity: index === 0 ? 0.5 : 1,
                    cursor: index === 0 ? "default" : "pointer",
                  }}
                >
                  ← Zurück
                </button>
                <button className="ctrl-btn" onClick={nextQuestion}>
                  Weiter →
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <h2>Quiz beendet 🎉</h2>
          <p style={{ marginTop: 12, color: "var(--muted)" }}>
            Du hast <strong>{score}</strong> von{" "}
            <strong>{questions.length}</strong> Fragen richtig beantwortet.
          </p>
          <button
            className="ctrl-btn"
            style={{ marginTop: 28 }}
            onClick={resetQuiz}
          >
            Nochmal spielen 🔄
          </button>
        </div>
      )}
    </div>
  );
}
