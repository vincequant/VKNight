'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character, Stage } from '@/types/game';
import { getUnlockedStages } from '@/data/stages';
import { calculateCharacterStats } from '@/types/game';
import { soundManager } from '@/lib/sounds';
import ETHDisplay from '@/components/ETHDisplay';
import CloudSyncIndicator from '@/components/CloudSyncIndicator';
import CharacterAvatar from '@/components/CharacterAvatar';
import WorldMap from '@/components/WorldMap';
import SaveLoadModal from '@/components/SaveLoadModal';
import { migrateCharacterData } from '@/lib/characterMigration';
import { ethToWei } from '@/utils/ethereum';
import { deserializeCharacter, loadCharacterWithCloud, saveCharacter } from '@/utils/characterStorage';
import { STAGE_QUESTION_LABELS } from '@/data/stageLabels';

export default function HubPage() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [availableStages, setAvailableStages] = useState<Stage[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('森林');
  const [showCharacterPanel, setShowCharacterPanel] = useState(false);
  const [showWorldMap, setShowWorldMap] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');

  useEffect(() => {
    console.log('HubPage mounted, showSaveLoad:', showSaveLoad);
    // Load character data
    const loadCharacterData = async () => {
      // Note: We now keep local cache and cloud sync will handle updates
      // This ensures battle data persists when returning from game
      
      // Check if there's saved character data
      const user = localStorage.getItem('currentUser') || 'josh';
      setCurrentUser(user);
      
      // Special handling for vince (god mode)
      if (user === 'vince') {
        const vinceData = localStorage.getItem('character_vince');
        if (vinceData) {
          const vinceChar = deserializeCharacter(vinceData);
          setCharacter(calculateCharacterStats(vinceChar));
          const unlockedStages = getUnlockedStages(99, vinceChar.stagesCleared);
          setAvailableStages(unlockedStages);
          return;
        }
      }
      
      // Try to load from cloud first, then fall back to localStorage
      let character = await loadCharacterWithCloud(user);
      
      if (!character) {
        // Create new character
        character = {
          id: user,
          type: user as 'josh' | 'abby',
          level: 1,
          experience: 0,
          expToNextLevel: 100,
          eth: ethToWei(0.1),
          hp: 100,
          maxHp: 100,
          mp: 50,
          maxMp: 50,
          attack: 20,
          defense: 10,
          baseHp: 100,
          baseMp: 50,
          baseAttack: 20,
          baseDefense: 10,
          stagesCleared: [],
          stagesPaidFor: [],
          inventory: []
        };
      }
      
      // Ensure stagesPaidFor exists
      if (!character.stagesPaidFor) {
        character.stagesPaidFor = [];
      }
      
      // Check if character needs to level up
      let characterToUse = character;
      if (character.experience >= character.expToNextLevel) {
        // Auto level up
        let currentExp = character.experience;
        let newLevel = character.level;
        let expRequired = character.expToNextLevel;
        let hpGain = 0;
        let attackGain = 0;
        let defenseGain = 0;
        
        // Handle multiple level ups
        while (currentExp >= expRequired) {
          currentExp = currentExp - expRequired;
          newLevel++;
          expRequired = 100 * newLevel * Math.floor(newLevel / 2 + 1);
          hpGain += 10;
          attackGain += 3;
          defenseGain += 2;
        }
        
        characterToUse = {
          ...character,
          level: newLevel,
          experience: currentExp,
          expToNextLevel: expRequired,
          baseHp: character.baseHp + hpGain,
          baseAttack: character.baseAttack + attackGain,
          baseDefense: character.baseDefense + defenseGain
        };
        
        // Full heal after level up
        characterToUse.hp = characterToUse.baseHp + (characterToUse.weapon?.hpBonus || 0) + 
                           (characterToUse.armor?.hpBonus || 0) + (characterToUse.shield?.hpBonus || 0);
        
        // Save the leveled up character using consistent key
        await saveCharacter(characterToUse);
      }
      
      const calculatedCharacter = calculateCharacterStats(characterToUse);
      // Don't auto-heal unless we just leveled up
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

  const handleStageSelect = async (stage: Stage) => {
    if (stage.locked || stage.comingSoon) {
      soundManager.play('incorrect');
      return;
    }
    
    // Check if this is a new stage that requires entrance fee
    const needsEntranceFee = stage.entranceFee > 0n && 
      character && 
      !character.stagesPaidFor?.includes(stage.id);
    
    // Check if player has enough ETH for entrance fee
    if (needsEntranceFee && character && character.eth < stage.entranceFee) {
      soundManager.play('incorrect');
      alert('ETH不足！需要 ' + (Number(stage.entranceFee) / 1e18).toFixed(2) + ' ETH 才能进入此关卡。');
      return;
    }
    
    soundManager.play('buttonClick');
    
    // Deduct entrance fee if needed
    if (character && needsEntranceFee) {
      const updatedCharacter = {
        ...character,
        eth: character.eth - stage.entranceFee,
        stagesPaidFor: [...(character.stagesPaidFor || []), stage.id]
      };
      
      // Save using consistent key and proper serialization
      await saveCharacter(updatedCharacter);
    }
    
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

  const handleLoad = async (characterData: Character) => {
    try {
      // 直接保存传入的角色数据
      await saveCharacter(characterData);
      // 刷新页面以显示新数据
      window.location.reload();
    } catch (error) {
      console.error('Load error:', error);
      alert('加载存档时出错');
    }
  };

  if (!character) return null;

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/backgrounds/game_hub.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
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
            {/* Left side - Character Info */}
            <div className="flex items-center gap-8">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowCharacterPanel(!showCharacterPanel)}
                className="flex items-center gap-4 bg-gray-800/80 rounded-lg px-4 py-2 cursor-pointer border border-gray-700 hover:border-yellow-600/50"
              >
                <CharacterAvatar character={character.type} size="md" />
                <div>
                  <div className="text-white font-bold">
                    {currentUser === 'vince' ? 'Vince' : 
                     character.type === 'josh' ? 'Josh' : 
                     character.type === 'abby' ? 'Abby' : 
                     character.type === 'vince' ? 'Vince' : character.type}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-sm">Lv. {character.level}</span>
                    <div className="w-24 bg-gray-700 rounded-full h-2 overflow-hidden relative">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-300 absolute inset-y-0 left-0"
                        style={{ width: `${(character.experience / character.expToNextLevel) * 100}%` }}
                      />
                    </div>
                  </div>
                  {/* HP Bar */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-red-400 text-xs">HP</span>
                    <div className="w-24 bg-gray-700 rounded-full h-2 overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 absolute inset-y-0 left-0 ${
                          character.hp <= character.maxHp * 0.3 ? 'bg-red-500' : 'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{character.hp}/{character.maxHp}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right side - Resources */}
            <div className="flex items-center gap-4">
              <ETHDisplay amount={character.eth} />
              <CloudSyncIndicator />
              
              {/* Action Buttons */}
              {console.log('Rendering action buttons')}
              <div className="flex gap-2 items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSaveLoad(true)}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2 shadow-lg border-2 border-purple-500"
                >
                  <span className="text-xl">💾</span> 
                  <span>存档</span>
                </motion.button>
                
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
                <span>🏆 等级</span>
                <span className="font-bold">{character.level}</span>
              </div>
              <div className="flex justify-between">
                <span>❤️ 生命值</span>
                <span className="font-bold">{character.hp} / {character.maxHp}</span>
              </div>
              <div className="flex justify-between">
                <span>⚔️ 攻击力</span>
                <span className="font-bold">{character.attack}</span>
              </div>
              <div className="flex justify-between">
                <span>🛡️ 防御力</span>
                <span className="font-bold">{character.defense}</span>
              </div>
              <div className="flex justify-between">
                <span>⭐ 经验值</span>
                <span className="font-bold">{character.experience} / {character.expToNextLevel}</span>
              </div>
              <hr className="border-gray-700" />
              <div className="text-sm text-gray-400">
                <p>🗡️ 武器: {character.weapon?.name || '无'}</p>
                <p>🦺 护甲: {character.armor?.name || '无'}</p>
                <p>🛡️ 盾牌: {character.shield?.name || '无'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Low HP Warning */}
        {character && character.hp < character.maxHp * 0.5 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/50 border border-red-600 rounded-lg p-3 mb-4 flex items-center justify-between max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-red-200 font-bold">生命值较低！</p>
                <p className="text-red-300 text-sm">
                  当前生命值: {character.hp}/{character.maxHp} ({Math.round((character.hp / character.maxHp) * 100)}%)
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShop}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2"
            >
              <span>🧪</span> 购买药水
            </motion.button>
          </motion.div>
        )}
        
        {/* Map Toggle Button */}
        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowWorldMap(!showWorldMap)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg text-white font-bold flex items-center gap-2 shadow-lg"
          >
            <span className="text-xl">🗺️</span>
            {showWorldMap ? '关闭世界地图' : '查看世界地图'}
          </motion.button>
        </div>

        {/* World Map or Area Tabs */}
        {showWorldMap ? (
          <WorldMap
            availableStages={availableStages}
            onStageSelect={handleStageSelect}
            clearedStages={character.stagesCleared}
            className="mb-8"
          />
        ) : (
          <>
            {/* Area Tabs */}
            <div className="flex justify-center gap-2 mb-8">
              {areas.map((area) => {
                const areaStages = availableStages.filter(s => s.area === area);
                const isComingSoon = areaStages.length > 0 && areaStages.every(s => s.comingSoon);
                
                return (
                  <motion.button
                    key={area}
                    whileHover={{ scale: isComingSoon ? 1 : 1.05 }}
                    whileTap={{ scale: isComingSoon ? 1 : 0.95 }}
                    onClick={() => !isComingSoon && setSelectedArea(area)}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      isComingSoon
                        ? 'bg-purple-900/50 text-purple-400 cursor-not-allowed border border-purple-700'
                        : selectedArea === area
                        ? `bg-gradient-to-r ${areaColors[area as keyof typeof areaColors]} text-white shadow-lg`
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {area}
                    {isComingSoon && ' 🚧'}
                  </motion.button>
                );
              })}
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
                whileHover={{ scale: stage.locked || stage.comingSoon ? 1 : 1.02 }}
                onClick={() => handleStageSelect(stage)}
                className={`relative ${
                  stage.comingSoon ? 'cursor-not-allowed' : stage.locked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
              >
                <div className={`bg-gray-800/90 backdrop-blur-sm rounded-lg border-2 ${
                  stage.comingSoon 
                    ? 'border-purple-600 bg-purple-900/20' 
                    : stage.locked 
                    ? 'border-gray-600' 
                    : 'border-yellow-600/50 hover:border-yellow-600'
                } overflow-hidden transition-all`}>
                  {/* Stage Header */}
                  <div className={`p-4 bg-gradient-to-r ${areaColors[selectedArea as keyof typeof areaColors]}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {stage.name}
                          {stage.comingSoon && ' 🚧'}
                        </h3>
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

                    {/* Entrance Fee */}
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <span className="text-gray-400">入场费:</span>
                      {character.stagesPaidFor?.includes(stage.id) ? (
                        <span className="text-green-400">✓ 已支付</span>
                      ) : (
                        <ETHDisplay amount={stage.entranceFee} size="sm" />
                      )}
                    </div>

                    {/* Mining Rewards */}
                    <div className="text-gray-400 text-sm mb-1">挖矿奖励:</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <ETHDisplay amount={stage.ethReward} size="sm" />
                        <span className="text-blue-400">✨ {stage.expReward} EXP</span>
                      </div>
                      {stage.comingSoon ? (
                        <span className="text-purple-400 text-sm">🚧 即将开放</span>
                      ) : stage.locked && (
                        <span className="text-red-400 text-sm">🔒 未解锁</span>
                      )}
                    </div>

                    {/* Question Types */}
                    {(() => {
                      // 获取角色特定的题型标签
                      const labelKey = character.type === 'abby' && 
                        (stage.id === 'forest-1' || stage.id === 'forest-2') 
                        ? `${stage.id}-abby` 
                        : stage.id;
                      const labels = STAGE_QUESTION_LABELS[labelKey] || stage.questionTypes || [];
                      
                      return labels.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <p className="text-xs text-gray-400 mb-2">题型标签:</p>
                          <div className="flex flex-wrap gap-1">
                            {labels.map((type, i) => (
                              <span 
                                key={i} 
                                className="bg-gray-700 text-xs px-2 py-1 rounded-full text-yellow-300"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

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
                
                {/* Coming Soon Overlay */}
                {stage.comingSoon && (
                  <div className="absolute inset-0 bg-purple-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-5xl mb-2 block">🚧</span>
                      <p className="text-purple-300 font-bold text-lg">即将开放</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            </div>
          </>
        )}
      </main>

      {/* Save/Load Modal */}
      {showSaveLoad && (
        <SaveLoadModal
          isOpen={showSaveLoad}
          onClose={() => setShowSaveLoad(false)}
          character={character}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
}