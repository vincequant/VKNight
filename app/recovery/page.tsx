'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Character } from '@/types/game';
import { deserializeCharacter, saveCharacter } from '@/utils/characterStorage';

function RecoveryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [level, setLevel] = useState('');
  const [experience, setExperience] = useState('');
  const [eth, setEth] = useState('');
  const [characterType, setCharacterType] = useState<'josh' | 'abby'>('josh');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [stagesCleared, setStagesCleared] = useState('');
  
  useEffect(() => {
    // 从URL参数读取估算值
    const urlLevel = searchParams.get('level');
    const urlEth = searchParams.get('eth');
    const urlStages = searchParams.get('stages');
    
    if (urlLevel) setLevel(urlLevel);
    if (urlEth) setEth(urlEth);
    if (urlStages) setStagesCleared(urlStages);
  }, [searchParams]);

  const handleRestore = async () => {
    try {
      // Get existing character data or create new one
      const key = `character_${characterType}`;
      const savedData = localStorage.getItem(key);
      
      let character: Character;
      
      if (savedData) {
        character = deserializeCharacter(savedData);
      } else {
        // Create new character if none exists
        character = {
          id: characterType,
          type: characterType,
          level: 1,
          experience: 0,
          expToNextLevel: 100,
          eth: BigInt(0),
          hp: 100,
          maxHp: 100,
          attack: characterType === 'josh' ? 25 : 20,
          defense: characterType === 'josh' ? 15 : 10,
          baseHp: 100,
          baseAttack: characterType === 'josh' ? 25 : 20,
          baseDefense: characterType === 'josh' ? 15 : 10,
          inventory: [],
          stagesCleared: [],
        };
      }
      
      // Restore with user input values
      const restoredCharacter: Character = {
        ...character,
        level: level ? parseInt(level) : character.level,
        experience: experience ? parseInt(experience) : character.experience,
        eth: eth ? BigInt(Math.floor(parseFloat(eth) * 1000)) : character.eth,
      };

      // Parse stages cleared if provided
      if (stagesCleared) {
        try {
          const stageNumbers = stagesCleared.split(',').map(s => s.trim()).filter(s => s);
          restoredCharacter.stagesCleared = stageNumbers.map(n => `stage-${n}`);
        } catch {
          // Keep existing stages if parsing fails
        }
      }

      // Recalculate exp to next level
      restoredCharacter.expToNextLevel = restoredCharacter.level * 100;
      
      // Recalculate stats based on level
      const levelBonus = restoredCharacter.level - 1;
      restoredCharacter.baseHp = 100 + (levelBonus * 10);
      restoredCharacter.baseAttack = (characterType === 'josh' ? 25 : 20) + (levelBonus * 2);
      restoredCharacter.baseDefense = (characterType === 'josh' ? 15 : 10) + (levelBonus * 1);
      restoredCharacter.hp = restoredCharacter.baseHp;
      restoredCharacter.maxHp = restoredCharacter.baseHp;
      restoredCharacter.attack = restoredCharacter.baseAttack;
      restoredCharacter.defense = restoredCharacter.baseDefense;
      
      // Ensure inventory exists
      if (!restoredCharacter.inventory) {
        restoredCharacter.inventory = [];
      }

      // Save restored character
      await saveCharacter(restoredCharacter, true); // Create backup
      
      setMessage(`成功恢复 ${characterType === 'josh' ? '约什' : '艾比'} 的进度！`);
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/hub');
      }, 2000);
    } catch (error) {
      console.error('Recovery error:', error);
      setMessage('恢复失败，请检查输入的数据');
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 p-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-lg p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-white mb-6 text-center">游戏进度恢复</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">选择角色</label>
            <select
              value={characterType}
              onChange={(e) => setCharacterType(e.target.value as 'josh' | 'abby')}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
            >
              <option value="josh">约什 (Josh)</option>
              <option value="abby">艾比 (Abby)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">等级（留空保持原值）</label>
            <input
              type="number"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="例如: 10"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              min="1"
              max="100"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">经验值（留空保持原值）</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="例如: 500"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              min="0"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">ETH数量（留空保持原值）</label>
            <input
              type="number"
              value={eth}
              onChange={(e) => setEth(e.target.value)}
              placeholder="例如: 0.5"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              min="0"
              step="0.001"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">已通过的关卡（用逗号分隔）</label>
            <input
              type="text"
              value={stagesCleared}
              onChange={(e) => setStagesCleared(e.target.value)}
              placeholder="例如: 1,2,3,4,5"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestore}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 rounded-lg font-bold"
          >
            恢复进度
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/hub')}
            className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold"
          >
            返回游戏中心
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/recovery/estimate')}
            className="w-full bg-purple-700 text-white py-3 rounded-lg font-bold"
          >
            使用估算工具
          </motion.button>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg text-center ${
              success ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            <p className="text-white font-bold">{message}</p>
          </motion.div>
        )}

        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-yellow-400 font-bold mb-2">使用说明：</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• 选择要恢复的角色</li>
            <li>• 输入记得的等级、经验值或ETH数量</li>
            <li>• 输入已通过的关卡编号（如: 1,2,3）</li>
            <li>• 留空的项目将保持当前值</li>
            <li>• 如果角色数据完全丢失，会创建新角色</li>
            <li>• 点击恢复进度即可</li>
          </ul>
          
          <div className="mt-4 p-3 bg-blue-900/50 rounded">
            <p className="text-blue-300 text-xs">
              提示：系统会根据你的等级自动计算相应的属性值（生命值、攻击力、防御力）
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function RecoveryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">加载中...</div>
      </div>
    }>
      <RecoveryContent />
    </Suspense>
  );
}