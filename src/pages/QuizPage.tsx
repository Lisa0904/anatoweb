import React, { useState } from "react";
import quizData from "../data/quiz.json";

export default function QuizPage(){
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const q = quizData.questions[index];

  function answer(i : any){
    if(showResult) return;
    const correct = q.correct === i;
    if(correct) setScore(s => s + 1);
    setShowResult(true);
    setTimeout(()=>{
      setShowResult(false);
      if(index < quizData.questions.length - 1) setIndex(index+1);
      else alert(`Quiz beendet. Punkte: ${score + (correct ? 1:0)} / ${quizData.questions.length}`);
    }, 900);
  }

  return (
    <div style={{maxWidth:900, margin:"0 auto"}}>
      <h1 className="title">Quiz</h1>
      <div style={{background:"var(--panel)", padding:20, borderRadius:12}}>
        <div style={{color:"var(--muted)"}}>Frage {index+1} / {quizData.questions.length}</div>
        <h2 style={{marginTop:8}}>{q.question}</h2>
        <div style={{display:"grid", gap:12, marginTop:18}}>
          {q.answers.map((a, i)=>(
            <button key={i} onClick={()=>answer(i)} className="ctrl-btn" style={{textAlign:"left"}}>
              {a}
            </button>
          ))}
        </div>
        <div style={{marginTop:18,color:"var(--muted)"}}>Aktuelle Punktzahl: {score}</div>
      </div>
    </div>
  );
}