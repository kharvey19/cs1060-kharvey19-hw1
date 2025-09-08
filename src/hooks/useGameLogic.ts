import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Mole, MoleType, PowerUpType } from '../types/game';

const INITIAL_STATE: GameState = {
  score: 0,
  lives: 3,
  gameRunning: false,
  gameStarted: false,
  level: 1,
  combo: 0,
  powerUp: null,
  powerUpTimeLeft: 0,
};

const HOLES_COUNT = 9;

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [moles, setMoles] = useState<Mole[]>([]);
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const powerUpTimerRef = useRef<NodeJS.Timeout>();

  const initializeMoles = useCallback(() => {
    const initialMoles: Mole[] = Array.from({ length: HOLES_COUNT }, (_, i) => ({
      id: i,
      type: 'normal',
      visible: false,
      timeLeft: 0,
      hit: false,
    }));
    setMoles(initialMoles);
  }, []);

  const getRandomMoleType = (): MoleType => {
    const rand = Math.random();
    if (rand < 0.1) return 'golden';
    if (rand < 0.35) return 'normal';
    return 'bomb';
  };

  const spawnMole = useCallback(() => {
    if (!gameState.gameRunning) return;

    setMoles(prevMoles => {
      const visibleMoles = prevMoles.filter(mole => mole.visible);
      if (visibleMoles.length >= 2) return prevMoles;

      const availableHoles = prevMoles.filter(mole => !mole.visible);
      if (availableHoles.length === 0) return prevMoles;

      const randomIndex = Math.floor(Math.random() * availableHoles.length);
      const holeToUse = availableHoles[randomIndex];

      const newMoles = [...prevMoles];
      const moleIndex = newMoles.findIndex(mole => mole.id === holeToUse.id);
      
      if (moleIndex !== -1) {
        const moleType = getRandomMoleType();
        newMoles[moleIndex] = {
          ...newMoles[moleIndex],
          type: moleType,
          visible: true,
          timeLeft: (moleType === 'normal' || moleType === 'golden')
            ? (Math.random() < 0.5 ? 1000 : 800)
            : gameState.powerUp === 'slowMotion'
              ? 2250
              : 1500,
          hit: false,
        };
      }

      return newMoles;
    });
  }, [gameState.gameRunning, gameState.powerUp]);

  const updateMoles = useCallback(() => {
    if (!gameState.gameRunning || gameState.powerUp === 'freezeTime') return;

    setMoles(prevMoles => {
      return prevMoles.map(mole => {
        if (!mole.visible || mole.hit) return mole;

        const newTimeLeft = mole.timeLeft - 100;
        if (newTimeLeft <= 0) {
          return { ...mole, visible: false, timeLeft: 0 };
        }

        return { ...mole, timeLeft: newTimeLeft };
      });
    });
  }, [gameState.gameRunning, gameState.powerUp]);

  const hitMole = useCallback((holeId: number) => {
    if (!gameState.gameRunning) return;

    const mole = moles.find(m => m.id === holeId && m.visible && !m.hit);
    if (!mole) return;

    setMoles(prevMoles => {
      return prevMoles.map(m => 
        m.id === holeId ? { ...m, hit: true, visible: false } : m
      );
    });

    setGameState(prevState => {
      let newState = { ...prevState };

      if (mole.type === 'bomb') {
        newState.lives = Math.max(0, prevState.lives - 1);
        newState.combo = 0;
        
        if (newState.lives === 0) {
          newState.gameRunning = false;
        }
      } else {
        let points = mole.type === 'normal' ? 100 : 300;
        const comboMultiplier = Math.min(1 + (prevState.combo * 0.1), 3);
        points = Math.floor(points * comboMultiplier);
        
        if (prevState.powerUp === 'doublePoints') {
          points *= 2;
        }

        newState.score = prevState.score + points;
        newState.combo = prevState.combo + 1;
        newState.level = Math.floor(newState.score / 1000) + 1;

        if (mole.type === 'golden') {
          const powerUps: PowerUpType[] = ['doublePoints', 'freezeTime', 'slowMotion'];
          const randomPowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
          newState.powerUp = randomPowerUp;
          newState.powerUpTimeLeft = 5000;
        }
      }

      return newState;
    });
  }, [gameState.gameRunning, moles]);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...INITIAL_STATE,
      gameRunning: true,
      gameStarted: true,
    }));
    initializeMoles();
  }, [initializeMoles]);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
    initializeMoles();
  }, [initializeMoles]);

  // Game loop
  useEffect(() => {
    if (!gameState.gameRunning) return;

    const interval = setInterval(() => {
      updateMoles();
      
      if (Math.random() < 0.2) {
        spawnMole();
      }
    }, 100);

    gameLoopRef.current = interval;

    return () => clearInterval(interval);
  }, [gameState.gameRunning, updateMoles, spawnMole]);

  // Power-up timer
  useEffect(() => {
    if (gameState.powerUp && gameState.powerUpTimeLeft > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          powerUpTimeLeft: Math.max(0, prev.powerUpTimeLeft - 100),
        }));
      }, 100);

      powerUpTimerRef.current = timer;
    } else if (gameState.powerUpTimeLeft === 0 && gameState.powerUp) {
      setGameState(prev => ({ ...prev, powerUp: null }));
    }

    return () => {
      if (powerUpTimerRef.current) {
        clearTimeout(powerUpTimerRef.current);
      }
    };
  }, [gameState.powerUp, gameState.powerUpTimeLeft]);

  return {
    gameState,
    moles,
    hitMole,
    startGame,
    resetGame,
  };
};