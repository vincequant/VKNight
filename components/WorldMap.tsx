'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Stage } from '@/types/game';
import ETHDisplay from '@/components/ETHDisplay';

interface WorldMapProps {
  availableStages: Stage[];
  onStageSelect: (stage: Stage) => void;
  clearedStages: string[];
  className?: string;
}

interface AreaInfo {
  name: string;
  position: { x: string; y: string };
  icon: string;
  description: string;
}

const areas: AreaInfo[] = [
  {
    name: '森林',
    position: { x: '20%', y: '60%' },
    icon: '🌲',
    description: '新手冒险者的起点'
  },
  {
    name: '山脉',
    position: { x: '40%', y: '30%' },
    icon: '⛰️',
    description: '充满挑战的高地'
  },
  {
    name: '火山',
    position: { x: '70%', y: '40%' },
    icon: '🌋',
    description: '炽热的危险地带'
  },
  {
    name: '地下城',
    position: { x: '30%', y: '70%' },
    icon: '🏰',
    description: '黑暗的地下迷宫'
  },
  {
    name: '魔界',
    position: { x: '60%', y: '20%' },
    icon: '👹',
    description: '最终的挑战之地'
  }
];

export default function WorldMap({ availableStages, onStageSelect, clearedStages, className = '' }: WorldMapProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const getAreaStages = (areaName: string) => {
    return availableStages.filter(stage => stage.area === areaName);
  };

  const getAreaProgress = (areaName: string) => {
    const areaStages = getAreaStages(areaName);
    const clearedCount = areaStages.filter(stage => clearedStages.includes(stage.id)).length;
    return {
      cleared: clearedCount,
      total: areaStages.length,
      percentage: areaStages.length > 0 ? (clearedCount / areaStages.length) * 100 : 0
    };
  };

  return (
    <div className={`relative ${className}`}>
      {/* World Map Background */}
      <div 
        className="relative w-full h-[600px] rounded-lg overflow-hidden"
        style={{
          backgroundImage: 'url(/images/ui/world_map.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better visibility */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Area Markers */}
        {areas.map((area) => {
          const progress = getAreaProgress(area.name);
          const isAccessible = getAreaStages(area.name).some(stage => !stage.locked);
          
          return (
            <motion.div
              key={area.name}
              className="absolute cursor-pointer"
              style={{
                left: area.position.x,
                top: area.position.y,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setHoveredArea(area.name)}
              onMouseLeave={() => setHoveredArea(null)}
              onClick={() => isAccessible && setSelectedArea(area.name)}
              animate={{
                scale: hoveredArea === area.name ? 1.2 : 1,
              }}
            >
              {/* Area Icon with Glow */}
              <div className={`
                relative flex items-center justify-center w-16 h-16 rounded-full
                ${isAccessible ? 'bg-yellow-600/80' : 'bg-gray-600/80'}
                ${hoveredArea === area.name ? 'shadow-lg shadow-yellow-400/50' : ''}
                transition-all duration-200
              `}>
                <span className="text-2xl">{area.icon}</span>
                
                {/* Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="30"
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="30"
                    stroke="#10b981"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress.percentage / 100)}`}
                    className="transition-all duration-500"
                  />
                </svg>
              </div>

              {/* Area Name */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className={`
                  text-sm font-bold px-2 py-1 rounded
                  ${isAccessible ? 'bg-black/80 text-yellow-400' : 'bg-black/60 text-gray-400'}
                `}>
                  {area.name}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredArea && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/90 rounded-lg p-4 max-w-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{areas.find(a => a.name === hoveredArea)?.icon}</span>
                <div>
                  <h3 className="text-yellow-400 font-bold">{hoveredArea}</h3>
                  <p className="text-gray-300 text-sm">{areas.find(a => a.name === hoveredArea)?.description}</p>
                  {(() => {
                    const progress = getAreaProgress(hoveredArea);
                    return (
                      <p className="text-green-400 text-xs mt-1">
                        进度: {progress.cleared}/{progress.total} 关卡完成
                      </p>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stage Selection Modal */}
      <AnimatePresence>
        {selectedArea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedArea(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border-2 border-yellow-600 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <span className="text-3xl">{areas.find(a => a.name === selectedArea)?.icon}</span>
                {selectedArea} - 选择关卡
              </h2>

              <div className="grid gap-3">
                {getAreaStages(selectedArea).map(stage => (
                  <motion.div
                    key={stage.id}
                    whileHover={{ scale: stage.locked ? 1 : 1.02 }}
                    onClick={() => !stage.locked && onStageSelect(stage)}
                    className={`
                      p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${stage.locked 
                        ? 'bg-gray-800/50 border-gray-700 opacity-50' 
                        : 'bg-gray-800 border-yellow-600/50 hover:border-yellow-600'
                      }
                      ${clearedStages.includes(stage.id) ? 'ring-2 ring-green-500/50' : ''}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                          {stage.name}
                          {clearedStages.includes(stage.id) && (
                            <span className="text-green-400 text-sm">✓ 已完成</span>
                          )}
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">{stage.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-yellow-400">难度: {'⭐'.repeat(stage.difficulty)}</span>
                          <span className="text-blue-400">需要等级: {stage.levelRequirement}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-gray-400">入场费:</span>
                          <ETHDisplay amount={stage.entranceFee} size="sm" />
                        </div>
                      </div>
                      <div className="text-4xl">{stage.icon}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => setSelectedArea(null)}
                className="mt-6 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-bold transition-colors"
              >
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}