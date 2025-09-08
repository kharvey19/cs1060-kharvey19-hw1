import React from 'react';
import { Heart, Star, Zap, Clock, Target } from 'lucide-react';
import { GameState } from '../types/game';

interface GameStatsProps {
  gameState: GameState;
}

const GameStats: React.FC<GameStatsProps> = ({ gameState }) => {
  const getPowerUpIcon = () => {
    switch (gameState.powerUp) {
      case 'doublePoints':
        return <Star className="w-5 h-5 text-yellow-400" />;
      case 'freezeTime':
        return <Clock className="w-5 h-5 text-blue-400" />;
      case 'slowMotion':
        return <Target className="w-5 h-5 text-green-400" />;
      default:
        return null;
    }
  };

  const getPowerUpName = () => {
    switch (gameState.powerUp) {
      case 'doublePoints':
        return 'Double Points';
      case 'freezeTime':
        return 'Freeze Time';
      case 'slowMotion':
        return 'Slow Motion';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-green-200">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Score */}
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {gameState.score.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Score</div>
        </div>

        {/* Lives */}
        <div className="text-center">
          <div className="flex justify-center space-x-1 mb-1">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${
                  i < gameState.lives
                    ? 'text-red-500 fill-red-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600">Lives</div>
        </div>

        {/* Level */}
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {gameState.level}
          </div>
          <div className="text-sm text-gray-600">Level</div>
        </div>

        {/* Combo */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-1">
            <Zap className="w-5 h-5 text-orange-500" />
            <span className="text-2xl font-bold text-orange-600">
              {gameState.combo}
            </span>
          </div>
          <div className="text-sm text-gray-600">Combo</div>
        </div>

        {/* Timer */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-1">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className={`text-2xl font-bold ${gameState.timeLeft <= 5000 ? 'text-red-600' : 'text-blue-600'}`}>
              {Math.ceil(gameState.timeLeft / 1000)}
            </span>
          </div>
          <div className="text-sm text-gray-600">Time</div>
        </div>
      </div>

      {/* Power-up indicator */}
      {gameState.powerUp && gameState.powerUpTimeLeft > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getPowerUpIcon()}
              <span className="font-semibold text-purple-800">
                {getPowerUpName()}
              </span>
            </div>
            <div className="text-sm text-purple-600">
              {(gameState.powerUpTimeLeft / 1000).toFixed(1)}s
            </div>
          </div>
          <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-100"
              style={{
                width: `${(gameState.powerUpTimeLeft / 5000) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStats;