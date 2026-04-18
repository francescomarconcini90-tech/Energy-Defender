import { useEffect, useRef, useState } from 'react';
import { GameEngine, GameState } from './game/engine';
import { CONFIG } from './game/constants';
import { audioManager } from './game/audio';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameEngine | null>(null);
  
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    levelIndex: 0,
    isPaused: false,
    isTransitioning: false,
    isGameOver: false,
    phase: "enemies",
    hp: 5,
  });

  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSimplified, setQuizSimplified] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState("");
  const [showContinue, setShowContinue] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [correctOption, setCorrectOption] = useState<number | null>(null);

  useEffect(() => {
    if (canvasRef.current && !gameRef.current) {
      canvasRef.current.width = CONFIG.WIDTH;
      canvasRef.current.height = CONFIG.HEIGHT;
      
      gameRef.current = new GameEngine(
        canvasRef.current,
        (state) => setGameState(state),
        (quiz) => {
          setCurrentQuiz(quiz);
          setShowQuiz(true);
          setQuizSimplified(false);
          setQuizFeedback("");
          setShowContinue(false);
          setShowHint(false);
          setDisabledOptions([]);
          setCorrectOption(null);
        }
      );
      gameRef.current.loop();
    }
  }, []);

  const handleRestart = () => {
    if (gameRef.current) {
      gameRef.current.reset();
      gameRef.current.loop();
    }
  };

  const handleOptionClick = (index: number) => {
    if (correctOption !== null) return;

    const isCorrect = quizSimplified 
      ? index === currentQuiz.tf_correct 
      : index === currentQuiz.correct;

    if (isCorrect) {
      setCorrectOption(index);
      audioManager.playPowerUp();
      setQuizFeedback("ESATTO! BRAVISSIMO! 🌟");
      setShowContinue(true);
    } else {
      setDisabledOptions(prev => [...prev, index]);
      if (!quizSimplified) {
        if (gameRef.current) {
          gameRef.current.consecutiveWrongCount++;
          if (gameRef.current.consecutiveWrongCount >= 2) {
            handleSimplifyQuiz();
          }
        }
      }
    }
  };

  const handleSimplifyQuiz = () => {
    // Simplified quiz logic (True/False)
    // We add a small delay for the transition effect
    setTimeout(() => {
      setQuizSimplified(true);
      setDisabledOptions([]);
      setQuizFeedback("");
    }, 800);
  };

  const handleContinue = () => {
    setShowQuiz(false);
    if (gameRef.current) {
      gameRef.current.resumeWithPowerUp();
    }
  };

  const getLeaderboard = () => {
    return JSON.parse(localStorage.getItem("energyDefenderScores") || "[]");
  };

  const currentLevel = CONFIG.LEVELS[gameState.levelIndex];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] text-white">
      <div id="game-container" className="relative">
        <canvas ref={canvasRef} className="block max-w-full max-h-screen object-contain" />

        {/* Level Transition Overlay */}
        <div className={`overlay ${gameState.isTransitioning ? 'visible' : ''}`}>
          <h1 className="text-6xl font-bold text-[#f1c40f] animate-pulse whitespace-pre-wrap">
            {`LIVELLO ${gameState.levelIndex + 1}\n${currentLevel?.name}`}
          </h1>
        </div>

        {/* Quiz Overlay */}
        <div className={`overlay ${showQuiz ? 'visible' : ''}`}>
          <div id="quiz-container" className="transition-opacity duration-700" style={{ opacity: quizSimplified && quizFeedback === "" ? 0 : 1 }}>
            <h2 className="text-2xl font-bold mb-4">LO SAPEVI CHE...</h2>
            <div className="notion-box">{currentQuiz?.text}</div>
            <p className="font-bold text-xl mb-6 text-center">
              {quizSimplified ? currentQuiz?.tf_q : currentQuiz?.q}
            </p>
            
            <div className="quiz-options">
              {(quizSimplified ? ["✅ VERO", "❌ FALSO"] : currentQuiz?.options || []).map((opt: string, i: number) => (
                <button
                  key={i}
                  className={`option-btn ${correctOption === i ? 'correct' : ''} ${disabledOptions.includes(i) ? 'wrong shake' : ''}`}
                  onClick={() => handleOptionClick(i)}
                  disabled={disabledOptions.includes(i) || (correctOption !== null && correctOption !== i)}
                >
                  {opt}
                </button>
              ))}
            </div>

            {!quizSimplified && !showContinue && (
              <button
                className="btn-action mt-4 !text-sm !py-2 !px-4 bg-[#16a085]"
                onClick={() => setShowHint(true)}
              >
                SUGGERIMENTO
              </button>
            )}

            {showHint && !quizSimplified && !showContinue && (
              <div className="bg-[#16a085] p-3 rounded mt-3 text-sm uppercase text-center w-full">
                SUGGERIMENTO: {currentQuiz?.text?.split('.')[0]}...
              </div>
            )}

            <div className="mt-5 font-bold text-2xl h-8 text-center">{quizFeedback}</div>
            
            {showContinue && (
              <button className="btn-action" onClick={handleContinue}>
                SUPER POTERE OTTENUTO! 🚀
              </button>
            )}
          </div>
        </div>

        {/* Game Over / Victory Overlay */}
        <div className={`overlay ${gameState.isGameOver ? 'visible' : ''}`}>
          <h1 className="text-4xl font-bold mb-4">
            {gameState.hp <= 0 ? "HAI PERSO! ⚖️" : "VITTORIA TOTALE! 🏆"}
          </h1>
          {gameState.hp > 0 && <div className="text-8xl mb-4">🏆</div>}
          <p className="text-xl mb-6 whitespace-pre-wrap text-center">
            {gameState.hp <= 0 
              ? `Punteggio: ${gameState.score}` 
              : `Sei un Master dell'Equilibrio!\nPunteggio Finale: ${gameState.score}`
            }
          </p>
          
          <div id="leaderboard" className="bg-white/10 p-4 rounded w-full max-w-[300px] mb-6">
            <h3 className="font-bold border-bottom border-white/10 mb-2">CLASSIFICA</h3>
            <div className="space-y-1">
              {getLeaderboard().map((s: any, i: number) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b border-white/10 last:border-0">
                  <span>{i + 1}. {s.date}</span>
                  <span>{s.score}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button className="btn-action" onClick={handleRestart}>GIOCA ANCORA</button>
        </div>
      </div>
    </div>
  );
}
