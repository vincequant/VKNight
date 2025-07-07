'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function EstimatePage() {
  const router = useRouter();
  const [playtime, setPlaytime] = useState('');
  const [bossesDefeated, setBossesDefeated] = useState('');
  const [rememberedStage, setRememberedStage] = useState('');
  
  const calculateProgress = () => {
    let estimatedLevel = 1;
    let estimatedStages: number[] = [];
    let estimatedETH = 0;
    
    // 基于游戏时长估算
    if (playtime) {
      const hours = parseFloat(playtime);
      estimatedLevel = Math.max(1, Math.min(50, Math.floor(hours * 2.5))); // 大约每小时2.5级
    }
    
    // 基于击败的BOSS数量调整
    if (bossesDefeated) {
      const bosses = parseInt(bossesDefeated);
      estimatedLevel = Math.max(estimatedLevel, bosses * 5); // 每个BOSS大约5级
      
      // 估算通过的关卡
      for (let i = 1; i <= bosses * 5; i++) {
        estimatedStages.push(i);
      }
    }
    
    // 基于记得的最高关卡
    if (rememberedStage) {
      const stage = parseInt(rememberedStage);
      estimatedLevel = Math.max(estimatedLevel, Math.floor(stage * 1.5)); // 关卡数*1.5约等于等级
      
      // 添加到这个关卡为止的所有关卡
      estimatedStages = [];
      for (let i = 1; i <= stage; i++) {
        estimatedStages.push(i);
      }
    }
    
    // 估算ETH (每级约0.01 ETH)
    estimatedETH = estimatedLevel * 0.01;
    
    // 跳转到恢复页面，带上估算的参数
    const params = new URLSearchParams({
      level: estimatedLevel.toString(),
      eth: estimatedETH.toFixed(3),
      stages: estimatedStages.join(',')
    });
    
    router.push(`/recovery?${params.toString()}`);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 p-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-lg p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-white mb-6 text-center">进度估算工具</h1>
        
        <p className="text-gray-300 mb-6 text-center">
          回答以下问题，系统将估算你的游戏进度
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">大约玩了多少小时？</label>
            <input
              type="number"
              value={playtime}
              onChange={(e) => setPlaytime(e.target.value)}
              placeholder="例如: 2.5"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              min="0"
              step="0.5"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">击败了多少个BOSS？</label>
            <select
              value={bossesDefeated}
              onChange={(e) => setBossesDefeated(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
            >
              <option value="">请选择</option>
              <option value="0">还没有击败BOSS</option>
              <option value="1">1个 (史莱姆王)</option>
              <option value="2">2个 (史莱姆王 + 哥布林酋长)</option>
              <option value="3">3个 (+ 蝙蝠王)</option>
              <option value="4">4个或更多</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">记得的最高关卡是？</label>
            <input
              type="number"
              value={rememberedStage}
              onChange={(e) => setRememberedStage(e.target.value)}
              placeholder="例如: 10"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              min="1"
              max="50"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={calculateProgress}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 rounded-lg font-bold"
          >
            估算并恢复进度
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/recovery')}
            className="w-full bg-gray-700 text-white py-3 rounded-lg font-bold"
          >
            手动输入恢复
          </motion.button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-yellow-400 font-bold mb-2">估算说明：</h3>
          <ul className="text-gray-300 text-xs space-y-1">
            <li>• 基于一般玩家的进度速度估算</li>
            <li>• 实际进度可能有所差异</li>
            <li>• 估算后可以手动调整</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}