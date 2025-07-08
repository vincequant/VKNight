'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionGenerator } from '@/lib/questionGenerator';
import { ComprehensiveQuestionGeneratorV2 } from '@/lib/comprehensiveQuestionGeneratorV2';
import { soundManager } from '@/lib/sounds';
import { Question, Difficulty } from '@/types';
import { Character, Stage, Enemy as GameEnemy, calculateCharacterStats, BattleState, GameProgress } from '@/types/game';
import { getStageById } from '@/data/stages';
import { ACHIEVEMENTS, Achievement, STORY_SEGMENTS, StorySegment } from '@/data/story';
import { getConsumableById, Consumable } from '@/data/consumables';
import ETHDisplay from '@/components/ETHDisplay';
import CharacterAvatar from '@/components/CharacterAvatar';
import QuestionTimer from '@/components/QuestionTimer';
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
  const [showInventory, setShowInventory] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('currentUser') || 'abby';
    const userDifficulty = localStorage.getItem('userDifficulty') as Difficulty || 'EASY';
    setCurrentUser(user);
    
    // Force easy mode for vince (god mode)
    if (user === 'vince') {
      setDifficulty('EASY');
    } else {
      setDifficulty(userDifficulty);
    }
    
    // Load stage
    const stage = getStageById(stageId);
    if (!stage) {
      router.push('/hub');
      return;
    }
    setCurrentStage(stage);
    
    // Initialize character
    const initCharacter = async () => {
      console.log('Initializing character for user:', user);
      
      // Special handling for vince (god mode)
      if (user === 'vince') {
        const vinceData = localStorage.getItem('character_vince');
        console.log('Vince data from localStorage:', vinceData);
        if (vinceData) {
          try {
            const vinceChar = deserializeCharacter(vinceData);
            console.log('Deserialized vince character:', vinceChar);
            const calculatedChar = calculateCharacterStats(vinceChar);
            console.log('Calculated vince character:', calculatedChar);
            setCharacter(calculatedChar);
            
            // Set first enemy after character is loaded
            if (stage.enemies.length > 0) {
              setCurrentEnemy({ ...stage.enemies[0] });
              console.log('Set first enemy:', stage.enemies[0]);
            }
            
            // Generate question after everything is loaded
            setTimeout(() => {
              console.log('Generating question for vince');
              generateNewQuestionForUser('vince', 'EASY');
            }, 100);
            
            return;
          } catch (error) {
            console.error('Error deserializing vince character:', error);
          }
        }
      }
      
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
          mp: 0,
          maxMp: 0,
          attack: user === 'josh' ? 25 : 20,
          defense: user === 'josh' ? 15 : 10,
          baseHp: user === 'josh' ? 120 : 100,
          baseMp: 0,
          baseAttack: user === 'josh' ? 25 : 20,
          baseDefense: user === 'josh' ? 15 : 10,
          stagesCleared: [],
          stagesPaidFor: [],
          inventory: [] // 确保inventory已初始化
        };
        
        // Show intro story
        const introStory = STORY_SEGMENTS.find(s => s.id === `game-start-${user}`);
        if (introStory) {
          setShowStory(introStory);
        }
      }
      
      // 确保inventory和stagesPaidFor存在
      if (!char.inventory) {
        char.inventory = [];
      }
      if (!char.stagesPaidFor) {
        char.stagesPaidFor = [];
      }
      
      const calculatedChar = calculateCharacterStats(char);
      setCharacter(calculatedChar);
      
      // Set first enemy after character is loaded
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
      
      // Generate question after everything is loaded
      // Pass user and difficulty directly since state might not be updated yet
      setTimeout(() => {
        generateNewQuestionForUser(user, userDifficulty);
      }, 100);
    };
    
    initCharacter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewQuestionForUser = (user: string, difficultyOverride?: Difficulty) => {
    try {
      const baseDifficulty = difficultyOverride || difficulty;
      const characterType = user as 'josh' | 'abby';
      
      // 使用新的综合题目生成器
      const question = ComprehensiveQuestionGeneratorV2.generateQuestion(
        stageId,
        characterType,
        baseDifficulty
      );
      
      setCurrentQuestion(question);
    } catch (error) {
      console.error('Error generating question:', error);
      // 如果出错，生成一个简单的加法题作为后备
      const fallbackQuestion = QuestionGenerator.generateAddition('EASY');
      setCurrentQuestion(fallbackQuestion);
    }
  };

  const generateNewQuestion = () => {
    if (!currentUser) return;
    generateNewQuestionForUser(currentUser);
  };

  const handleTimeout = () => {
    // 超时当作答错处理
    if (!currentQuestion || battleState.mode !== 'question') return;
    
    soundManager.play('incorrect');
    
    // 更新进度
    const newProgress = { ...gameProgress };
    newProgress.totalQuestionsAnswered++;
    newProgress.currentStreak = 0;
    setGameProgress(newProgress);
    setComboMultiplier(1);
    
    // 敌人攻击
    setBattleState({ ...battleState, mode: 'enemy-turn' });
    
    // 执行敌人攻击动画
    setTimeout(() => {
      if (currentEnemy && character) {
        const damage = Math.max(1, currentEnemy.attack - character.defense);
        dealDamageToPlayer(damage);
        
        setTimeout(() => {
          if (character.hp - damage > 0) {
            generateNewQuestion();
            setBattleState({ ...battleState, mode: 'question' });
          }
        }, 1000);
      }
    }, 500);
  };

  const handleAnswer = (answer: number | string) => {
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
    let newLevel = char.level;
    let currentExp = char.experience;
    let expRequired = char.expToNextLevel;
    let hpGain = 0;
    let attackGain = 0;
    let defenseGain = 0;
    
    // Handle multiple level ups if experience is very high
    while (currentExp >= expRequired) {
      currentExp = currentExp - expRequired;
      newLevel++;
      expRequired = 100 * newLevel * Math.floor(newLevel / 2 + 1);
      hpGain += 10;
      attackGain += 3;
      defenseGain += 2;
    }
    
    const levelUpChar = {
      ...char,
      level: newLevel,
      experience: currentExp,
      expToNextLevel: expRequired,
      baseHp: char.baseHp + hpGain,
      baseAttack: char.baseAttack + attackGain,
      baseDefense: char.baseDefense + defenseGain
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

  const usePotion = (consumableId: string) => {
    if (!character || battleState.mode !== 'question') return;
    
    const itemInInventory = character.inventory.find(item => item.id === consumableId);
    if (!itemInInventory || itemInInventory.quantity <= 0) return;
    
    const consumable = getConsumableById(consumableId);
    if (!consumable) return;
    
    soundManager.play('coin');
    
    // Apply effect
    let newHp = character.hp;
    let newMp = character.mp;
    
    if (consumable.effect.hp) {
      if (consumable.effect.percentage) {
        newHp = Math.min(character.maxHp, character.hp + Math.floor(character.maxHp * consumable.effect.hp / 100));
      } else {
        newHp = Math.min(character.maxHp, character.hp + consumable.effect.hp);
      }
    }
    
    if (consumable.effect.mp) {
      if (consumable.effect.percentage) {
        newMp = Math.min(character.maxMp, character.mp + Math.floor(character.maxMp * consumable.effect.mp / 100));
      } else {
        newMp = Math.min(character.maxMp, character.mp + consumable.effect.mp);
      }
    }
    
    // Update inventory
    const newInventory = character.inventory.map(item => 
      item.id === consumableId 
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ).filter(item => item.quantity > 0);
    
    const updatedChar = {
      ...character,
      hp: newHp,
      mp: newMp,
      inventory: newInventory
    };
    
    setCharacter(updatedChar);
    saveCharacter(updatedChar);
    setShowInventory(false);
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
  
  // 根据关卡区域选择背景
  const getBackgroundImage = () => {
    switch (currentStage.area) {
      case '森林':
        return '/images/backgrounds/forest_arena.png';
      case '火山':
        return '/images/backgrounds/volcano_arena.png';
      case '地下城':
      case '魔界':
        return '/images/backgrounds/cave_arena.png';
      default:
        return '/images/backgrounds/forest_arena.png';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${getBackgroundImage()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* 顶部UI */}
        <div className="bg-black/80 border-b-2 border-yellow-600 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/hub'}
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
                <div className="w-32 bg-gray-700 rounded-full h-2 overflow-hidden relative">
                  <motion.div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300 absolute inset-y-0 left-0"
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
                className="mb-4"
              >
                <CharacterAvatar character={character.type} size="xl" />
              </motion.div>
              
              {/* 玩家血条 */}
              <div className="w-48">
                <div className="text-white text-sm mb-1">
                  {character.type === 'josh' ? 'Josh' : 
                   character.type === 'abby' ? 'Abby' : 
                   character.type === 'vince' ? 'Vince' : character.type}
                </div>
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
            <div className="max-w-4xl mx-auto relative">
              {/* 倒计时组件 */}
              {currentQuestion.timeLimit && (
                <QuestionTimer
                  timeLimit={currentQuestion.timeLimit}
                  onTimeout={handleTimeout}
                  isActive={battleState.mode === 'question'}
                />
              )}
              
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
              
              {/* Potion Button */}
              <div className="mt-6 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInventory(!showInventory)}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-bold flex items-center gap-2"
                >
                  <span className="text-xl">🧪</span> 使用药水
                </motion.button>
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
      
      {/* Inventory Modal */}
      <AnimatePresence>
        {showInventory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInventory(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-gray-800 border-2 border-yellow-600 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">药水背包</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {character?.inventory.map((item) => {
                  const consumable = getConsumableById(item.id);
                  if (!consumable) return null;
                  
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-3xl">{consumable.icon}</span>
                        <span className="text-gray-400 text-sm">x{item.quantity}</span>
                      </div>
                      <h4 className="text-white font-bold mb-1">{consumable.name}</h4>
                      <p className="text-gray-400 text-sm mb-3">{consumable.description}</p>
                      
                      <button
                        onClick={() => usePotion(item.id)}
                        className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-bold transition-colors"
                      >
                        使用
                      </button>
                    </motion.div>
                  );
                })}
                
                {(!character?.inventory || character.inventory.length === 0) && (
                  <div className="col-span-full text-center text-gray-400 py-8">
                    <p className="text-xl mb-2">背包空空如也</p>
                    <p className="text-sm">去商店购买一些药水吧！</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowInventory(false)}
                className="mt-6 w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg text-white font-bold"
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