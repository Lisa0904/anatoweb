// src/pages/SnakePage.tsx (Design & UX Upgrade)
import React, { useState, useEffect, useRef } from 'react';

// Konstanten
const GRID_SIZE = 20; 
const TILE_SIZE = 25; 
const INITIAL_SPEED = 150; // Millisekunden

const getRandomPosition = (snake: { x: number; y: number }[]): { x: number; y: number } => {
  let newPos: { x: number; y: number };
  do {
    newPos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(p => p.x === newPos.x && p.y === newPos.y));
  return newPos;
};

// Initialisierungsfunktion
const initializeGame = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    return {
        snake: initialSnake,
        food: getRandomPosition(initialSnake),
        direction: { x: 1, y: 0 },
        gameOver: false,
        score: 0,
        gameStarted: false,
    };
};

export default function SnakePage() {
    const [state, setState] = useState(initializeGame());
    const intervalRef = useRef<number | null>(null);
    const directionRef = useRef(state.direction);

    // ------------------------------------
    // LOGIK: Spiel-Loop und Bewegung
    // ------------------------------------

    useEffect(() => {
        directionRef.current = state.direction;
    }, [state.direction]);

    useEffect(() => {
        if (state.gameOver || !state.gameStarted) {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        const currentSpeed = INITIAL_SPEED - (state.score * 5); 
        
        const gameLoop = () => {
            setState(prevState => {
                if (prevState.gameOver || !prevState.gameStarted) return prevState;

                const currentDir = directionRef.current;
                const newSnake = [...prevState.snake];
                const head = newSnake[0];
                
                const newHead = {
                    x: head.x + currentDir.x,
                    y: head.y + currentDir.y,
                };

                // Kollision prüfen
                if (
                    newHead.x < 0 || newHead.x >= GRID_SIZE ||
                    newHead.y < 0 || newHead.y >= GRID_SIZE ||
                    newSnake.some((p, index) => index !== 0 && p.x === newHead.x && p.y === newHead.y)
                ) {
                    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
                    return { ...prevState, gameOver: true };
                }

                newSnake.unshift(newHead);

                // Futter prüfen
                let newScore = prevState.score;
                let newFood = prevState.food;
                
                if (newHead.x === prevState.food.x && newHead.y === prevState.food.y) {
                    newFood = getRandomPosition(newSnake);
                    newScore = prevState.score + 1;
                } else {
                    newSnake.pop(); // Bewegung
                }

                return {
                    ...prevState,
                    snake: newSnake,
                    food: newFood,
                    score: newScore,
                };
            });
        };

        if (intervalRef.current !== null) {
             window.clearInterval(intervalRef.current);
        }

        intervalRef.current = window.setInterval(gameLoop, Math.max(currentSpeed, 50));
        
        return () => {
             if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
             }
        };

    }, [state.gameStarted, state.gameOver, state.score]); 

    // ------------------------------------
    // TASTENSTEUERUNG (Global)
    // ------------------------------------

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (state.gameOver || !state.gameStarted) return;
            
            const currentDir = directionRef.current;
            let newDir = { x: 0, y: 0 };
            
            switch (e.key) {
                case 'ArrowUp':
                    if (currentDir.y === 0) newDir = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                    if (currentDir.y === 0) newDir = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                    if (currentDir.x === 0) newDir = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    if (currentDir.x === 0) newDir = { x: 1, y: 0 };
                    break;
                default:
                    return;
            }
            
            if (newDir.x !== 0 || newDir.y !== 0) {
                e.preventDefault(); 
                setState(prevState => ({ ...prevState, direction: newDir }));
                directionRef.current = newDir; 
            }
        };

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, [state.gameOver, state.gameStarted]);


    // ------------------------------------
    // UI-HELPER
    // ------------------------------------

    const resetGame = () => {
        setState(initializeGame());
        setState(prevState => ({ ...prevState, gameStarted: true }));
    };

    const startGame = () => {
        setState(prevState => ({ ...prevState, gameStarted: true }));
    };

    const SnakeSegment = ({ x, y, isHead }: { x: number; y: number; isHead: boolean }) => (
        <div
            className={`snake-segment ${isHead ? 'head' : ''}`}
            style={{
                left: x * TILE_SIZE,
                top: y * TILE_SIZE,
                width: TILE_SIZE,
                height: TILE_SIZE,
            }}
        />
    );

    return (
        <div className="page-container snake-page-wrapper">
            <h1 className="title gradient" style={{fontSize: '3rem', marginBottom: 0}}>Axon-Pfad</h1>
            <p className="lead" style={{marginBottom: '40px'}}>Steuere den Axon-Fortsatz, um Synapsen zu erreichen und das Signal zu verstärken.</p>
            
            {/* Hauptcontainer für das Spiel-UI */}
            <div className="game-main-content">

                {/* Spielstatus / Score Panel */}
                <div className="snake-status-panel section-box panel">
                    <h3 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-strong)'}}>Synapsen-Score: {state.score}</h3>
                    <p style={{color: 'var(--muted)', fontSize: '0.9rem', margin: 0}}>Axon-Länge: {state.snake.length}</p>
                </div>

                {/* Spielfeld Container */}
                <div 
                    className="snake-game-area" 
                    style={{ width: GRID_SIZE * TILE_SIZE, height: GRID_SIZE * TILE_SIZE }}
                    tabIndex={0} 
                >
                    {state.snake.map((segment, index) => (
                        <SnakeSegment 
                            key={index} 
                            x={segment.x} 
                            y={segment.y} 
                            isHead={index === 0} 
                        />
                    ))}
                    <div
                        className="food"
                        style={{
                            left: state.food.x * TILE_SIZE,
                            top: state.food.y * TILE_SIZE,
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                        }}
                    />

                    {(!state.gameStarted || state.gameOver) && (
                        <div className="game-overlay">
                            <h2 className="title" style={{fontSize: '2rem', marginBottom: 15}}>{state.gameOver ? 'Signal verloren!' : 'Axon-Pfad'}</h2>
                            <p style={{marginBottom: 30, color: 'var(--text)'}}>{state.gameOver ? 'Dein Ergebnis:' : 'Startanweisung:'}</p>
                            {state.gameOver && <h3 style={{color: 'var(--accent)', fontSize: '1.8rem', margin: '0'}}>{state.score} Synapsen</h3>}
                            <button onClick={state.gameOver ? resetGame : startGame} className="ctrl-btn primary-cta">
                                {state.gameOver ? 'Neues Signal senden' : 'Spiel starten'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}