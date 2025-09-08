import React, { useState } from 'react';
import { Mole } from '../types/game';

interface GameHoleProps {
  mole: Mole;
  onHit: (id: number) => void;
}

const GameHole: React.FC<GameHoleProps> = ({ mole, onHit }) => {
  const [isHit, setIsHit] = useState(false);
  const [hitPoints, setHitPoints] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    if (mole.visible && !mole.hit) {
      setIsHit(true);
      
      // Set points based on mole type
      let points = 0;
      switch (mole.type) {
        case 'normal':
          points = 100;
          break;
        case 'golden':
          points = 300;
          break;
        case 'bomb':
          points = 0; // Lives system instead
          break;
      }
      setHitPoints(points);
      
      onHit(mole.id);
      
      setTimeout(() => {
        setIsHit(false);
        setHitPoints(0);
      }, 500);
    }
  };

  const renderCreature = () => {
    if (!mole.visible || mole.hit) return null;

    const baseClasses = "transition-all duration-200";

    switch (mole.type) {
      case 'normal':
        return (
          <div className={`w-20 h-16 bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-full relative ${baseClasses}`}>
            {/* Mole face */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              {/* Eyes */}
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
              {/* Nose */}
              <div className="w-1 h-1 bg-pink-400 rounded-full mx-auto mt-1"></div>
            </div>
            {/* Mole body texture */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-amber-600 rounded-full opacity-50"></div>
          </div>
        );

      case 'golden':
        return (
          <div className={`w-20 h-16 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-full relative ${baseClasses} animate-pulse`}>
            {/* Golden sparkles */}
            <div className="absolute -top-1 left-2 w-1 h-1 bg-white rounded-full animate-ping"></div>
            <div className="absolute -top-1 right-2 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{animationDelay: '0.25s'}}></div>
            
            {/* Golden mole face */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
              </div>
              <div className="w-1 h-1 bg-pink-400 rounded-full mx-auto mt-1"></div>
            </div>
            
            {/* Golden body texture */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-yellow-500 rounded-full opacity-50"></div>
            
            {/* Crown or special marking */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-yellow-200 text-xs">✨</div>
          </div>
        );
      
      case 'bomb':
        return (
          <div className={`w-20 h-16 bg-gradient-to-b from-gray-800 to-black rounded-full relative flex items-center justify-center ${baseClasses} animate-bounce`}>
            {/* Bomb body */}
            <div className="w-16 h-12 bg-gradient-to-b from-gray-700 to-black rounded-full relative">
              {/* Fuse */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full -mt-1 animate-pulse"></div>
              </div>
              {/* Highlight */}
              <div className="absolute top-2 left-3 w-3 h-2 bg-gray-400 rounded-full opacity-60"></div>
              {/* Warning symbol */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-red-400 text-xs font-bold">!</div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* Hole */}
      <div className="w-24 h-24 bg-gradient-to-b from-amber-900 to-amber-950 rounded-full shadow-inner border-4 border-amber-800 flex items-end justify-center overflow-hidden cursor-pointer transform transition-all duration-150 hover:scale-105">
        {/* Hole shadow */}
        <div className="absolute inset-2 bg-black rounded-full opacity-50" />
        
        {/* Hole opening */}
        <div className="absolute inset-3 bg-gray-900 rounded-full shadow-inner" />

        {/* Creature */}
        <div
          className={`transition-transform duration-300 ease-out z-10 ${
            mole.visible ? 'transform translate-y-0' : 'transform translate-y-full'
          }`}
          onClick={handleClick}
          style={{
            animation: mole.visible ? 'molePopUp 0.3s ease-out forwards' : undefined,
          }}
        >
          {renderCreature()}
        </div>
      </div>

      {/* Hit effect */}
      {isHit && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className={`text-2xl font-bold animate-bounce ${
            hitPoints > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {hitPoints > 0 ? `+${hitPoints}` : mole.type === 'bomb' ? '💥' : '💔'}
          </div>
          <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
            hitPoints > 0 ? 'bg-green-300' : 'bg-red-300'
          }`}></div>
        </div>
      )}

      {/* Grass decoration around hole */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
        <div className="w-1 h-3 bg-green-400 transform rotate-12 rounded-t"></div>
        <div className="w-1 h-4 bg-green-500 rounded-t"></div>
        <div className="w-1 h-3 bg-green-400 transform -rotate-12 rounded-t"></div>
      </div>
      
      {/* Additional grass decoration */}
      <div className="absolute top-2 -left-2 flex space-x-1">
        <div className="w-1 h-2 bg-green-400 transform rotate-45 rounded-t"></div>
        <div className="w-1 h-3 bg-green-500 transform rotate-12 rounded-t"></div>
      </div>
      
      <div className="absolute top-2 -right-2 flex space-x-1">
        <div className="w-1 h-3 bg-green-500 transform -rotate-12 rounded-t"></div>
        <div className="w-1 h-2 bg-green-400 transform -rotate-45 rounded-t"></div>
      </div>
    </div>
  );
};

export default GameHole;