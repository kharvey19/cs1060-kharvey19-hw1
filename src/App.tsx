import React from 'react';
import { Play } from 'lucide-react';
import GameHole from './components/GameHole';
import GameStats from './components/GameStats';
import GameOverScreen from './components/GameOverScreen';
import { useGameLogic } from './hooks/useGameLogic';

function App() {
  const { gameState, moles, hitMole, startGame, resetGame } = useGameLogic();

  if (!gameState.gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-green-200 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="text-4xl">🐭</div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Whack-a-Mole
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Hit the moles as they pop up! Golden moles give you power-ups, but watch out for bombs - they'll cost you a life!
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <div className="text-2xl mb-2">🐭</div>
              <div className="text-sm font-semibold text-amber-800">Normal Mole</div>
              <div className="text-xs text-amber-600">100 points</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200">
              <div className="text-2xl mb-2">✨🐭</div>
              <div className="text-sm font-semibold text-yellow-800">Golden Mole</div>
              <div className="text-xs text-yellow-600">300 points + power-up</div>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-200">
              <div className="text-2xl mb-2">💣</div>
              <div className="text-sm font-semibold text-red-800">Bomb</div>
              <div className="text-xs text-red-600">Lose a life!</div>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Play className="w-6 h-6" />
            <span>Start Game</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Game Stats */}
        <div className="mb-6">
          <GameStats gameState={gameState} />
        </div>

        {/* Game Board */}
        <div className="bg-green-600/20 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-300/30">
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {moles.map((mole) => (
              <GameHole
                key={mole.id}
                mole={mole}
                onHit={hitMole}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center">
          <p className="text-white/90 text-sm">
            💡 Build combos for higher scores • Golden moles give power-ups • Avoid bombs to keep your lives!
          </p>
        </div>
      </div>

      {/* Game Over Screen */}
      {gameState.gameStarted && !gameState.gameRunning && (gameState.lives === 0 || gameState.timeLeft === 0) && (
        <GameOverScreen
          score={gameState.score}
          level={gameState.level}
          onRestart={resetGame}
        />
      )}
    </div>
  );
}

export default App;