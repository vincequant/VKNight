'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionGenerator } from '@/lib/questionGenerator';
import { soundManager } from '@/lib/sounds';
import { Question, Difficulty } from '@/types';
import { Character, Stage, Enemy as GameEnemy, calculateCharacterStats, BattleState, GameProgress } from '@/types/game';
import { getStageById } from '@/data/stages';
import { ACHIEVEMENTS, Achievement, STORY_SEGMENTS, StorySegment } from '@/data/story';
import ETHDisplay from '@/components/ETHDisplay';
import { useRouter, useSearchParams } from 'next/navigation';
import { migrateCharacterData } from '@/lib/characterMigration';
import { ethToWei, formatWeiCompact } from '@/utils/ethereum';
import { saveCharacter as saveCharacterToStorage, deserializeCharacter, loadCharacterWithCloud } from '@/utils/characterStorage';




function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stageId = searchParams.get('stage') || 'forest-1';
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('EASY');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [questionsAnswered] = useState(0);
  
  // Character and Battle State
  const [character, setCharacter] = useState<Character | null>(null);
  const [battleState, setBattleState] = useState<BattleState>({
    mode: 'question',
    currentEnemyIndex: 0,
    enemiesDefeated: 0
  });
  const [currentStage, setCurrentStage] = useState<Stage | null>(null);
  const [currentEnemy, setCurrentEnemy] = useState<GameEnemy | null>(null);
  const [showDamage, setShowDamage] = useState<{ amount: number; type: 'player' | 'enemy' } | null>(null);
  
  // Game Progress & Rewards
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    totalEnemiesDefeated: 0,
    currentStreak: 0,
    bestStreak: 0
  });
  const [showStory, setShowStory] = useState<StorySegment | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [showCombo, setShowCombo] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser') || 'abby';
    const userDifficulty = localStorage.getItem('userDifficulty') as Difficulty || 'EASY';
    setCurrentUser(user);
    setDifficulty(userDifficulty);
    
    // Load stage
    const stage = getStageById(stageId);
    if (!stage) {
      router.push('/hub');
      return;
    }
    setCurrentStage(stage);
    
    // Initialize character
    const initCharacter = async () => {
      let char = await loadCharacterWithCloud(user);
      
      if (!char) {
        // Create new character
        char = {
          id: user,
          type: user as 'josh' | 'abby',
          level: 1,
          experience: 0,
          expToNextLevel: 100,
          eth: ethToWei(1),
          hp: user === 'josh' ? 120 : 100,
          maxHp: user === 'josh' ? 120 : 100,
          attack: user === 'josh' ? 25 : 20,
          defense: user === 'josh' ? 15 : 10,
          baseHp: user === 'josh' ? 120 : 100,
          baseAttack: user === 'josh' ? 25 : 20,
          baseDefense: user === 'josh' ? 15 : 10,
          stagesCleared: []
        };
        
        // Show intro story
        const introStory = STORY_SEGMENTS.find(s => s.id === `game-start-${user}`);
        if (introStory) {
          setShowStory(introStory);
        }
      }
      
      const calculatedChar = calculateCharacterStats(char);
      setCharacter(calculatedChar);
    };
    
    initCharacter();
    
    // Set first enemy
    if (stage.enemies.length > 0) {
      setCurrentEnemy({ ...stage.enemies[0] });
    }
    
    // Load progress
    const savedProgress = localStorage.getItem('gameProgress');
    if (savedProgress) {
      setGameProgress(JSON.parse(savedProgress));
    }
    
    // Load achievements
    const savedAchievements = localStorage.getItem('unlockedAchievements');
    if (savedAchievements) {
      setUnlockedAchievements(JSON.parse(savedAchievements));
    }
    
    generateNewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewQuestion = () => {
    let types: ('addition' | 'subtraction' | 'multiplication' | 'division')[];
    
    // 根据基础难度决定题目类型
    const baseDifficulty = difficulty;
    if (baseDifficulty === 'EASY' || baseDifficulty === 'MEDIUM') {
      types = ['addition', 'subtraction'];
    } else {
      types = ['addition', 'subtraction', 'multiplication', 'division'];
    }
    
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    // Abby的难度自动降低一级
    let actualDifficulty = difficulty;
    if (currentUser === 'abby') {
      const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
      const currentIndex = difficulties.indexOf(difficulty);
      actualDifficulty = currentIndex > 0 ? difficulties[currentIndex - 1] : difficulties[0];
    }
    
    const question = QuestionGenerator.generateQuestion(randomType, actualDifficulty);
    setCurrentQuestion(question);
  };

  const handleAnswer = (answer: number) => {
    if (!currentQuestion || battleState.mode !== 'question' || !character || !currentEnemy) return;

    const isCorrect = answer === currentQuestion.answer;
    
    // Update progress
    const newProgress = { ...gameProgress };
    newProgress.totalQuestionsAnswered++;
    
    if (isCorrect) {
      soundManager.play('correct');
      setScore(score + 1);
      newProgress.totalCorrectAnswers++;
      newProgress.currentStreak++;
      
      // Update combo multiplier
      const newCombo = Math.min(newProgress.currentStreak, 5);
      setComboMultiplier(newCombo);
      if (newCombo > 1) {
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 1000);
      }
      
      if (newProgress.currentStreak > newProgress.bestStreak) {
        newProgress.bestStreak = newProgress.currentStreak;
      }
      
      setBattleState({ ...battleState, mode: 'attack' });
      
      // Player attack with combo bonus
      setTimeout(() => {
        const baseDamage = character.attack + Math.floor(Math.random() * 10);
        const damage = Math.floor(baseDamage * (1 + (comboMultiplier - 1) * 0.2));
        const newEnemyHp = Math.max(0, currentEnemy.hp - damage);
        setCurrentEnemy({ ...currentEnemy, hp: newEnemyHp });
        setShowDamage({ amount: damage, type: 'enemy' });
        
        setTimeout(() => {
          setShowDamage(null);
          if (newEnemyHp <= 0) {
            // Enemy defeated
            newProgress.totalEnemiesDefeated++;
            setBattleState({ ...battleState, mode: 'victory' });
            
            // Calculate rewards with combo bonus
            const ethEarned = BigInt(Math.floor(Number(currentEnemy.ethDrop) * comboMultiplier));
            const expEarned = Math.floor(currentEnemy.expDrop * comboMultiplier);
            
            const updatedChar = { 
              ...character, 
              eth: character.eth + ethEarned,
              experience: character.experience + expEarned
            };
            
            // Check level up
            if (updatedChar.experience >= updatedChar.expToNextLevel) {
              handleLevelUp(updatedChar);
            } else {
              setCharacter(updatedChar);
              saveCharacter(updatedChar);
            }
            
            // Check achievements
            checkAchievements(newProgress, updatedChar);
            
            setTimeout(() => {
              // Next enemy or stage complete
              if (battleState.currentEnemyIndex < currentStage!.enemies.length - 1) {
                const nextIndex = battleState.currentEnemyIndex + 1;
                setBattleState({
                  ...battleState,
                  mode: 'question',
                  currentEnemyIndex: nextIndex,
                  enemiesDefeated: battleState.enemiesDefeated + 1
                });
                setCurrentEnemy({ ...currentStage!.enemies[nextIndex] });
                generateNewQuestion();
              } else {
                // Stage complete!
                handleStageComplete();
              }
            }, 2000);
          } else {
            setBattleState({ ...battleState, mode: 'enemy-turn' });
            setTimeout(() => {
              enemyAttack();
            }, 1000);
          }
        }, 1000);
      }, 500);
    } else {
      soundManager.play('incorrect');
      newProgress.currentStreak = 0;
      setComboMultiplier(1);
      setBattleState({ ...battleState, mode: 'enemy-turn' });
      
      setTimeout(() => {
        enemyAttack();
      }, 1000);
    }
    
    setGameProgress(newProgress);
    localStorage.setItem('gameProgress', JSON.stringify(newProgress));
  };

  const enemyAttack = () => {
    if (!character || !currentEnemy) return;
    
    const baseDamage = Math.max(1, currentEnemy.attack - Math.floor(character.defense / 2));
    const damage = baseDamage + Math.floor(Math.random() * 5);
    const newHp = Math.max(0, character.hp - damage);
    const updatedChar = { ...character, hp: newHp };
    setCharacter(updatedChar);
    setShowDamage({ amount: damage, type: 'player' });
    
    setTimeout(() => {
      setShowDamage(null);
      if (newHp <= 0) {
        setBattleState({ ...battleState, mode: 'defeat' });
        // Save progress even on defeat
        saveCharacter(updatedChar);
        setTimeout(() => {
          router.push('/hub');
        }, 3000);
      } else {
        setBattleState({ ...battleState, mode: 'question' });
        generateNewQuestion();
      }
    }, 1000);
  };
  
  const handleLevelUp = (char: Character) => {
    const newLevel = char.level + 1;
    const levelUpChar = {
      ...char,
      level: newLevel,
      experience: char.experience - char.expToNextLevel,
      expToNextLevel: 100 * newLevel * Math.floor(newLevel / 2 + 1),
      baseHp: char.baseHp + 10,
      baseAttack: char.baseAttack + 3,
      baseDefense: char.baseDefense + 2
    };
    
    const calculatedChar = calculateCharacterStats(levelUpChar);
    calculatedChar.hp = calculatedChar.maxHp; // Full heal on level up
    
    setCharacter(calculatedChar);
    saveCharacter(calculatedChar);
    
    // Show level up animation
    soundManager.play('levelUp');
    
    // Check for level milestone story
    const levelStory = STORY_SEGMENTS.find(
      s => s.trigger === 'level-up' && s.id.includes(newLevel.toString())
    );
    if (levelStory) {
      setShowStory(levelStory);
    }
  };
  
  const handleStageComplete = () => {
    if (!character || !currentStage) return;
    
    // Update character's cleared stages
    const updatedChar = {
      ...character,
      stagesCleared: [...character.stagesCleared, currentStage.id],
      eth: character.eth + currentStage.ethReward,
      experience: character.experience + currentStage.expReward
    };
    
    // Check level up from stage completion
    if (updatedChar.experience >= updatedChar.expToNextLevel) {
      handleLevelUp(updatedChar);
    } else {
      setCharacter(updatedChar);
      saveCharacter(updatedChar);
    }
    
    // Show victory screen
    setTimeout(() => {
      router.push(`/hub?completed=${currentStage.id}`);
    }, 3000);
  };
  
  const checkAchievements = (progress: GameProgress, char: Character) => {
    ACHIEVEMENTS.forEach(achievement => {
      if (unlockedAchievements.includes(achievement.id)) return;
      
      let unlocked = false;
      
      switch (achievement.condition.type) {
        case 'streak':
          unlocked = progress.currentStreak >= achievement.condition.value;
          break;
        case 'total-correct':
          unlocked = progress.totalCorrectAnswers >= achievement.condition.value;
          break;
        case 'enemies-defeated':
          unlocked = progress.totalEnemiesDefeated >= achievement.condition.value;
          break;
        case 'gold-earned':
          unlocked = char.eth >= achievement.condition.value;
          break;
        case 'level-reached':
          unlocked = char.level >= achievement.condition.value;
          break;
      }
      
      if (unlocked) {
        const newUnlocked = [...unlockedAchievements, achievement.id];
        setUnlockedAchievements(newUnlocked);
        localStorage.setItem('unlockedAchievements', JSON.stringify(newUnlocked));
        
        // Show achievement popup
        setShowAchievement(achievement);
        soundManager.play('achievement');
        
        // Apply rewards
        if (achievement.reward.gold || achievement.reward.exp) {
          const rewardChar = {
            ...char,
            eth: char.eth + BigInt(achievement.reward.gold || 0),
            experience: char.experience + (achievement.reward.exp || 0)
          };
          setCharacter(rewardChar);
          saveCharacter(rewardChar);
        }
        
        setTimeout(() => setShowAchievement(null), 3000);
      }
    });
  };
  
  const saveCharacter = async (char: Character) => {
    await saveCharacterToStorage(char);
  };

  const adjustDifficulty = () => {
    // Abby保持在简单模式
    if (currentUser === 'abby') return;
    
    // Josh可以升级难度
    if (questionsAnswered > 0 && questionsAnswered % 10 === 0) {
      const successRate = score / questionsAnswered;
      if (successRate > 0.8 && difficulty !== 'EXPERT') {
        const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
        const currentIndex = difficulties.indexOf(difficulty);
        if (currentIndex < difficulties.length - 1) {
          setDifficulty(difficulties[currentIndex + 1]);
          soundManager.play('levelUp');
        }
      }
    }
  };

  useEffect(() => {
    adjustDifficulty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsAnswered]);

  if (!character || !currentStage || !currentEnemy) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* 地下城背景 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,.02) 50px, rgba(255,255,255,.02) 100px)`,
        }}></div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* 顶部UI */}
        <div className="bg-black/80 border-b-2 border-yellow-600 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
              className="bg-gray-800 border border-gray-600 rounded px-4 py-2 text-gray-300 hover:bg-gray-700"
            >
              <span className="text-xl">↩️</span> 返回
            </motion.button>
            
            <div className="flex items-center gap-6">
              <div className="text-white">
                <div className="text-sm text-gray-400">{currentStage.area}</div>
                <div className="font-bold">{currentStage.name}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">Lv.{character.level}</span>
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-blue-500 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(character.experience / character.expToNextLevel) * 100}%` }}
                  />
                </div>
              </div>
              
              <ETHDisplay amount={character.eth} />
              
              {comboMultiplier > 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: showCombo ? 1.2 : 1 }}
                  className="text-orange-400 font-bold"
                >
                  {comboMultiplier}x Combo!
                </motion.div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/store'}
              className="bg-gray-800 border border-gray-600 rounded px-4 py-2 text-gray-300 hover:bg-gray-700"
            >
              商店 <span className="text-xl">🏪</span>
            </motion.button>
          </div>
        </div>

        {/* 战斗场景 */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex items-center justify-between px-20">
            {/* 玩家区域 */}
            <div className="relative">
              <motion.div
                animate={battleState.mode === 'attack' ? { x: [0, 200, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="text-8xl mb-4"
              >
                {character.type === 'josh' ? '🗡️' : '🏹'}
              </motion.div>
              
              {/* 玩家血条 */}
              <div className="w-48">
                <div className="text-white text-sm mb-1">{character.type === 'josh' ? 'Josh' : 'Abby'}</div>
                <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: `${(character.hp / character.maxHp) * 100}%` }}
                    className="bg-gradient-to-r from-green-500 to-green-600 h-full"
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">HP: {character.hp}/{character.maxHp}</div>
              </div>

              {/* 伤害显示 */}
              <AnimatePresence>
                {showDamage?.type === 'player' && (
                  <motion.div
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: -50, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-red-500"
                  >
                    -{showDamage.amount}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* VS标志 */}
            <div className="text-4xl font-bold text-yellow-400" style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}>
              VS
            </div>

            {/* 敌人区域 */}
            <div className="relative">
              <motion.div
                animate={battleState.mode === 'enemy-turn' ? { x: [0, -200, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="text-8xl mb-4"
              >
                {currentEnemy.sprite}
              </motion.div>
              
              {/* 敌人血条 */}
              <div className="w-48">
                <div className="text-white text-sm mb-1">{currentEnemy.name}</div>
                <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%` }}
                    className="bg-gradient-to-r from-red-500 to-red-600 h-full"
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">HP: {currentEnemy.hp}/{currentEnemy.maxHp}</div>
              </div>

              {/* 伤害显示 */}
              <AnimatePresence>
                {showDamage?.type === 'enemy' && (
                  <motion.div
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: -50, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-yellow-500"
                  >
                    -{showDamage.amount}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 题目区域 */}
        <div className="bg-black/80 border-t-2 border-yellow-600 p-6">
          {battleState.mode === 'question' && currentQuestion && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">
                  {currentQuestion.question}
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {currentQuestion.options?.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswer(option)}
                    className="bg-gray-800 border-2 border-yellow-600 rounded-lg py-4 px-6 text-2xl font-bold text-yellow-300 hover:bg-gray-700 transition-all"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {battleState.mode === 'victory' && (
            <div className="text-center">
              <motion.h2 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-3xl font-bold text-green-400 mb-2"
              >
                胜利！
              </motion.h2>
              <p className="text-yellow-300">
                获得 {formatWeiCompact(BigInt(Math.floor(Number(currentEnemy.ethDrop) * comboMultiplier)))} ETH！
                {comboMultiplier > 1 && ` (${comboMultiplier}x连击加成)`}
              </p>
              <p className="text-blue-300">
                获得 {Math.floor(currentEnemy.expDrop * comboMultiplier)} 经验值！
              </p>
            </div>
          )}

          {battleState.mode === 'defeat' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-400 mb-2">战败...</h2>
              <p className="text-gray-300">不要放弃！返回大厅准备再战！</p>
              <p className="text-sm text-gray-400 mt-2">提示：去商店购买更好的装备会让战斗更轻松哦！</p>
            </div>
          )}

          {(battleState.mode === 'attack' || battleState.mode === 'enemy-turn') && (
            <div className="text-center">
              <p className="text-2xl text-yellow-300">
                {battleState.mode === 'attack' ? '你的攻击！' : '敌人的回合！'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Story Popup */}
      <AnimatePresence>
        {showStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowStory(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-gray-800 border-2 border-yellow-600 rounded-lg p-6 max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">{showStory.title}</h3>
              {showStory.dialogue.map((line, idx) => (
                <p key={idx} className="text-white mb-2">{line}</p>
              ))}
              {showStory.rewards && (
                <div className="mt-4 text-yellow-300">
                  获得奖励：
                  {showStory.rewards.gold && ` ${(showStory.rewards.gold * 0.001).toFixed(3)} ETH`}
                  {showStory.rewards.exp && ` ${showStory.rewards.exp} 经验值`}
                </div>
              )}
              <button
                onClick={() => setShowStory(null)}
                className="mt-4 bg-yellow-600 text-black px-4 py-2 rounded font-bold hover:bg-yellow-500"
              >
                继续冒险
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-black px-6 py-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{showAchievement.icon}</span>
                <div>
                  <h4 className="font-bold">成就解锁！</h4>
                  <p className="text-sm">{showAchievement.name}</p>
                  {showAchievement.reward.gold && (
                    <p className="text-xs">+{showAchievement.reward.gold} 金币</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}