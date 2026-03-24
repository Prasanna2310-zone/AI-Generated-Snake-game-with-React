import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 80;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef(direction);
  
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood([{ x: 10, y: 10 }]));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }
      
      if (e.key === ' ' || e.key === 'Escape') {
        setIsPaused(prev => !prev);
        e.preventDefault();
        return;
      }

      if (isPaused) return;

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isPaused]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(30, INITIAL_SPEED - Math.floor(score / 50) * 5);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-between w-full mb-4 px-2 border-b-2 border-fuchsia-500 pb-2">
        <div 
          className="text-cyan-400 font-digital text-3xl glitch-text"
          data-text={`[MEM: ${score.toString().padStart(4, '0')}]`}
        >
          [MEM: {score.toString().padStart(4, '0')}]
        </div>
        <div className="text-fuchsia-500 font-digital text-3xl">
          [MAX: {highScore.toString().padStart(4, '0')}]
        </div>
      </div>

      <div 
        className="relative bg-[#020202] border-4 border-cyan-400 overflow-hidden"
        style={{ 
          width: 'min(100%, 500px)', 
          aspectRatio: '1/1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
             style={{
               backgroundImage: 'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)',
               backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
             }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const tailProgress = index / Math.max(snake.length, 1);
          const opacity = 1 - (tailProgress * 0.6);
          const scale = isHead ? 1.1 : 1 - (tailProgress * 0.4);

          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${isHead ? 'bg-cyan-300 z-10' : 'bg-cyan-500'} rounded-none`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                opacity: opacity,
                transform: `scale(${scale})`,
                boxShadow: isHead ? '0 0 10px #00ffff' : 'none'
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="bg-fuchsia-500 rounded-none animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            boxShadow: '0 0 15px #ff00ff'
          }}
        />

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 bg-[#020202]/90 flex flex-col items-center justify-center z-20">
            <h2 
              className="text-fuchsia-500 text-6xl font-glitch mb-4 tracking-widest glitch-text"
              data-text="FATAL_ERR"
            >
              FATAL_ERR
            </h2>
            <p className="text-cyan-400 font-digital text-3xl mb-8">SECTORS CORRUPTED: {score}</p>
            <button 
              onClick={resetGame}
              className="p-4 bg-[#020202] border-2 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-[#020202] transition-all group flex items-center gap-2 font-digital text-2xl uppercase"
              title="Reboot Sequence"
            >
              <RotateCcw size={28} className="group-hover:-rotate-180 transition-transform duration-500" />
              EXEC_REBOOT
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-[#020202]/80 flex items-center justify-center z-20">
            <h2 
              className="text-cyan-400 text-5xl font-glitch tracking-widest glitch-text"
              data-text="SYSTEM_HALT"
            >
              SYSTEM_HALT
            </h2>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-fuchsia-500 text-xl font-digital text-center uppercase tracking-widest">
        INPUT: <span className="text-cyan-400">WASD / ARROWS</span> | INTERRUPT: <span className="text-cyan-400">SPACE</span>
      </div>
    </div>
  );
}
