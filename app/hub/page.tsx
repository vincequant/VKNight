'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character, Stage } from '@/types/game';
import { getUnlockedStages } from '@/data/stages';
import { calculateCharacterStats } from '@/types/game';
import { soundManager } from '@/lib/sounds';
import ETHDisplay from '@/components/ETHDisplay';
import CloudSyncIndicator from '@/components/CloudSyncIndicator';
import { migrateCharacterData } from '@/lib/characterMigration';
import { ethToWei } from '@/utils/ethereum';
import { deserializeCharacter, loadCharacterWithCloud } from '@/utils/characterStorage';

export default function HubPage() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [availableStages, setAvailableStages] = useState<Stage[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('森林');
  const [showCharacterPanel, setShowCharacterPanel] = useState(false);

  useEffect(() => {
    // Load character data
    const loadCharacterData = async () => {
      // Check if there's saved character data
      const user = localStorage.getItem('currentUser') || 'josh';
      
      // Try to load from cloud first, then fall back to localStorage
      let character = await loadCharacterWithCloud(user);
      
      if (!character) {
        // Create new character
        character = {
          id: '1',
          type: user as 'josh' | 'abby',
          level: 1,
          experience: 0,
          expToNextLevel: 100,
          eth: ethToWei(1),
          hp: 100,
          maxHp: 100,
          attack: 20,
          defense: 10,
          baseHp: 100,
          baseAttack: 20,
          baseDefense: 10,
          stagesCleared: []
        };
      }
      
      const calculatedCharacter = calculateCharacterStats(character);
      setCharacter(calculatedCharacter);
      
      // Get available stages
      const unlockedStages = getUnlockedStages(calculatedCharacter.level, calculatedCharacter.stagesCleared);
      setAvailableStages(unlockedStages);
    };

    loadCharacterData();
  }, []);

  const areas = ['森林', '山脉', '火山', '地下城', '魔界'];
  const areaColors = {
    '森林': 'from-green-600 to-green-800',
    '山脉': 'from-gray-600 to-gray-800',
    '火山': 'from-red-600 to-red-800',
    '地下城': 'from-purple-600 to-purple-800',
    '魔界': 'from-black to-red-900'
  };

  const handleStageSelect = (stage: Stage) => {
    if (stage.locked) {
      soundManager.play('incorrect');
      return;
    }
    
    soundManager.play('buttonClick');
    // Navigate to game with stage parameter
    window.location.href = `/game?stage=${stage.id}`;
  };

  const handleEquipment = () => {
    soundManager.play('buttonClick');
    window.location.href = '/equipment';
  };

  const handleShop = () => {
    soundManager.play('buttonClick');
    window.location.href = '/store';
  };

  if (!character) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/50 backdrop-blur-md border-b border-yellow-600/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Character Info */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowCharacterPanel(!showCharacterPanel)}
              className="flex items-center gap-4 bg-gray-800/80 rounded-lg px-4 py-2 cursor-pointer border border-gray-700 hover:border-yellow-600/50"
            >
              <div className="text-4xl">{character.type === 'josh' ? '⚔️' : '🏹'}</div>
              <div>
                <div className="text-white font-bold">{character.type === 'josh' ? 'Josh' : 'Abby'}</div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-sm">Lv. {character.level}</span>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full"
                      style={{ width: `${(character.experience / character.expToNextLevel) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Resources */}
            <div className="flex items-center gap-6">
              <ETHDisplay amount={character.eth} />
              <CloudSyncIndicator />
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEquipment}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2"
                >
                  <span>🛡️</span> 装备
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShop}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2"
                >
                  <span>🏪</span> 商店
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/'}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-white font-bold"
                >
                  退出
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Character Panel (Slide-out) */}
      <AnimatePresence>
        {showCharacterPanel && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed left-0 top-20 z-50 bg-gray-900/95 backdrop-blur-lg border border-yellow-600/50 rounded-r-lg p-6 w-80"
          >
            <h3 className="text-xl font-bold text-yellow-400 mb-4">角色属性</h3>
            <div className="space-y-3 text-white">
              <div className="flex justify-between">
                <span>❤️ 生命值</span>
                <span className="font-bold">{character.maxHp}</span>
              </div>
              <div className="flex justify-between">
                <span>⚔️ 攻击力</span>
                <span className="font-bold">{character.attack}</span>
              </div>
              <div className="flex justify-between">
                <span>🛡️ 防御力</span>
                <span className="font-bold">{character.defense}</span>
              </div>
              <hr className="border-gray-700" />
              <div className="text-sm text-gray-400">
                <p>🗡️ 武器: {character.weapon?.name || '无'}</p>
                <p>🛡️ 护甲: {character.armor?.name || '无'}</p>
                <p>🛡️ 盾牌: {character.shield?.name || '无'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Area Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {areas.map((area) => (
            <motion.button
              key={area}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedArea(area)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                selectedArea === area
                  ? `bg-gradient-to-r ${areaColors[area as keyof typeof areaColors]} text-white shadow-lg`
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {area}
            </motion.button>
          ))}
        </div>

        {/* Stage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableStages
            .filter(stage => stage.area === selectedArea)
            .map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: stage.locked ? 1 : 1.02 }}
                onClick={() => handleStageSelect(stage)}
                className={`relative cursor-pointer ${
                  stage.locked ? 'opacity-50' : ''
                }`}
              >
                <div className={`bg-gray-800/90 backdrop-blur-sm rounded-lg border-2 ${
                  stage.locked ? 'border-gray-600' : 'border-yellow-600/50 hover:border-yellow-600'
                } overflow-hidden transition-all`}>
                  {/* Stage Header */}
                  <div className={`p-4 bg-gradient-to-r ${areaColors[selectedArea as keyof typeof areaColors]}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{stage.name}</h3>
                        <p className="text-sm text-gray-200">难度: {'⭐'.repeat(stage.difficulty)}</p>
                      </div>
                      <div className="text-4xl">{stage.icon}</div>
                    </div>
                  </div>

                  {/* Stage Info */}
                  <div className="p-4">
                    <p className="text-gray-300 text-sm mb-3">{stage.description}</p>
                    
                    {/* Requirements */}
                    <div className="flex items-center gap-2 text-sm mb-3">
                      <span className="text-gray-400">需要等级:</span>
                      <span className={`font-bold ${
                        character.level >= stage.levelRequirement ? 'text-green-400' : 'text-red-400'
                      }`}>
                        Lv. {stage.levelRequirement}
                      </span>
                    </div>

                    {/* Rewards */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <ETHDisplay amount={stage.ethReward} size="sm" />
                        <span className="text-blue-400">✨ {stage.expReward} EXP</span>
                      </div>
                      {stage.locked && (
                        <span className="text-red-400 text-sm">🔒 未解锁</span>
                      )}
                    </div>

                    {/* Enemy Preview */}
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-2">敌人预览:</p>
                      <div className="flex gap-2">
                        {stage.enemies.slice(0, 3).map((enemy, i) => (
                          <span key={i} className="text-2xl">{enemy.sprite}</span>
                        ))}
                        {stage.enemies.length > 3 && (
                          <span className="text-gray-400">+{stage.enemies.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completed Badge */}
                {character.stagesCleared.includes(stage.id) && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    ✓
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      </main>
    </div>
  );
}