// src/pages/MemoryPage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import anatomyData from "../data/anatomyData.json"; // ✅ Korrekte Datenquelle verwenden

// Eigene Shuffle-Funktion (Fisher-Yates)
const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Struktur für die Kartendaten
interface CardData {
  id: number;
  content: string; 
  type: "part" | "function"; // Körperteil oder Funktion
  matchId: number; // ID des passenden Gegenstücks
}

// Memory-Daten aus anatomyData.json generieren
const generateMemoryCards = (): CardData[] => {
  const allCards: CardData[] = [];
  let matchCounter = 1;
  
  // 1. Alle thematisch passenden Schlüssel (ohne "Unterhose") holen
  const filteredKeys = Object.keys(anatomyData).filter(key => key !== "Unterhose"); 
  
  // 2. ✅ NEU: Schlüssel zufällig mischen
  const shuffledKeys = shuffle(filteredKeys); 

  // 3. Nur die ersten 8 Paare (16 Karten) auswählen
  const selectedKeys = shuffledKeys.slice(0, 8); 

  selectedKeys.forEach((part, index) => {
    const data = anatomyData[part as keyof typeof anatomyData];
    
    // Karte 1: Körperteil
    allCards.push({
      id: index * 2,
      content: part, 
      type: "part",
      matchId: matchCounter,
    });

    // Karte 2: Funktion
    allCards.push({
      id: index * 2 + 1,
      content: data.function.split('. ')[0] + '.', // Nur den ersten Satz der Funktion
      type: "function",
      matchId: matchCounter,
    });
    matchCounter++;
  });

  // 4. Karten mischen (innerhalb des Spielfelds)
  return shuffle(allCards); 
};

export default function MemoryPage() {
  const [cards, setCards] = useState<CardData[]>(generateMemoryCards);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(true); // Optional: Mute State beibehalten

  // 🔊 Soundeffekte (falls vorhanden)
  const playFlipSound = () => {
    if (soundEnabled) {
      const audio = new Audio("/sounds/swoosh.mp3"); 
      audio.volume = 0.05;
      audio.play();
    }
  };
  const playMatchSound = () => {
    if (soundEnabled) {
        // Angenommen, du hast einen Match-Sound
    }
  };


  // Prüfen auf Übereinstimmung
  useEffect(() => {
    if (flippedIndices.length === 2) {
      setLocked(true);
      const [idx1, idx2] = flippedIndices;
      const card1 = cards[idx1];
      const card2 = cards[idx2];

      if (card1.matchId === card2.matchId) {
        // Match gefunden!
        playMatchSound();
        setTimeout(() => {
          setMatchedIds(prev => [...prev, card1.matchId]);
          setFlippedIndices([]);
          setLocked(false);
        }, 800);
      } else {
        // Kein Match
        setTimeout(() => {
          setFlippedIndices([]); // Karten zurückdrehen
          setLocked(false);
        }, 1200);
      }
    }
  }, [flippedIndices, cards]);

  const gameFinished = matchedIds.length === cards.length / 2;


  const handleCardClick = (index: number) => {
    if (locked || flippedIndices.includes(index) || matchedIds.includes(cards[index].matchId)) {
      return;
    }
    
    playFlipSound(); // Sound beim Umdrehen
    setFlippedIndices(prev => [...prev, index]);
  };
  
  const resetGame = () => {
    setCards(generateMemoryCards());
    setFlippedIndices([]);
    setMatchedIds([]);
    setLocked(false);
  };
  
  const getCardStyle = (index: number) => {
    const isFlipped = flippedIndices.includes(index) || matchedIds.includes(cards[index].matchId);
    return isFlipped ? "card-inner flipped" : "card-inner";
  };
  
  return (
    <div className="page-container memory-page">
      <h1 className="title gradient" style={{letterSpacing: '-0.02em'}}>Anatomie Memory</h1>
      <p className="lead">Finde {cards.length / 2} Paare aus Körperteil und der entsprechenden Funktion. Paare gefunden: {matchedIds.length}.</p>
      
      {gameFinished && (
        <div className="game-finished-overlay">
          <div className="section-box panel" style={{padding: '40px', maxWidth: '400px'}}>
              <h2>🎉 Geschafft!</h2>
              <p style={{marginTop: '10px'}}>Du hast alle Paare gefunden!</p>
              <button onClick={resetGame} className="ctrl-btn primary-cta" style={{marginTop: '25px'}}>
                Neues Spiel starten
              </button>
          </div>
        </div>
      )}

      <div className="memory-grid">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`memory-card ${matchedIds.includes(card.matchId) ? 'matched' : ''}`}
            onClick={() => handleCardClick(index)}
            style={{pointerEvents: gameFinished ? 'none' : 'auto'}}
          >
            <div className={getCardStyle(index)}>
              <div className="card-face card-front">
                <span style={{fontSize: '1.2rem'}}>AnatoWeb</span>
              </div>
              <div className="card-face card-back">
                <p className={`card-content ${card.type}`}>{card.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{marginTop: '30px', textAlign: 'center'}}>
        <button onClick={() => navigate('/flashcards')} className="ctrl-btn" style={{marginRight: '10px'}}>Zurück zu den Karteikarten</button>
        <button onClick={resetGame} className="ctrl-btn">Mischen / Neustart</button>
      </div>
    </div>
  );
}