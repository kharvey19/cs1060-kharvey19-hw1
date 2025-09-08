import React from 'react';
import { Trophy, RotateCcw, Target } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  level: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, level, onRestart }) => {
  const getScoreMessage = () => {
    if (score >= 5000) return "Mole Master! 🏆";
    if (score >= 2000) return "Great Job! 🎯";
    if (score >= 1000) return "Well Done! 👍";
    if (score >= 500) return "Not Bad! 👌";
    return "Keep Trying! 💪";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 transform">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Game Over!</h1>
          <p className="text-lg text-gray-600 mb-6">{getScoreMessage()}</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {score.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{level}</div>
                <div className="text-sm text-gray-600">Level Reached</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again</span>
          </button>
          
          <div className="mt-4 text-xs text-gray-500">
            💡 Tip: Hit golden moles for power-ups and avoid the bombs!
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;