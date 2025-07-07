'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Character } from '@/types/game';
import { ethToWei } from '@/utils/ethereum';
import { saveCharacter } from '@/utils/characterStorage';
import { calculateCharacterStats } from '@/types/game';
import { ALL_STAGES } from '@/data/stages';

export default function VincePage() {
  const router = useRouter();

  useEffect(() => {
    const initGodMode = async () => {
      // Create a super character for testing
      const godCharacter: Character = {
        id: 'vince',
        type: 'josh', // Use Josh as base
        level: 99,
        experience: 0,
        expToNextLevel: 999999,
        eth: ethToWei(100000), // 100,000 ETH
        hp: 9999,
        maxHp: 9999,
        mp: 9999,
        maxMp: 9999,
        attack: 999,
        defense: 999,
        baseHp: 9999,
        baseMp: 9999,
        baseAttack: 999,
        baseDefense: 999,
        stagesCleared: ALL_STAGES.map(stage => stage.id), // All stages cleared
        stagesPaidFor: ALL_STAGES.map(stage => stage.id), // All entrance fees paid
        inventory: [
          { id: 'small-health-potion', quantity: 99 },
          { id: 'medium-health-potion', quantity: 99 },
          { id: 'large-health-potion', quantity: 99 },
          { id: 'super-health-potion', quantity: 99 },
          { id: 'full-health-potion', quantity: 20 },
        ],
        // Best equipment
        weapon: {
          id: 'legendary-sword',
          name: '传奇之剑',
          type: 'weapon',
          tier: 5,
          price: ethToWei(100),
          hpBonus: 200,
          attackBonus: 150,
          defenseBonus: 50,
          icon: '🗡️',
          description: '传说中的神器',
          levelRequirement: 50,
        },
        armor: {
          id: 'legendary-armor',
          name: '传奇护甲',
          type: 'armor',
          tier: 5,
          price: ethToWei(100),
          hpBonus: 300,
          attackBonus: 50,
          defenseBonus: 200,
          icon: '🛡️',
          description: '无坚不摧的护甲',
          levelRequirement: 50,
        },
        shield: {
          id: 'legendary-shield',
          name: '传奇盾牌',
          type: 'shield',
          tier: 5,
          price: ethToWei(100),
          hpBonus: 200,
          attackBonus: 30,
          defenseBonus: 150,
          icon: '🔰',
          description: '坚不可摧的防御',
          levelRequirement: 50,
        },
      };

      // Calculate final stats
      const finalCharacter = calculateCharacterStats(godCharacter);
      
      // Save to localStorage with special key
      localStorage.setItem('currentUser', 'vince');
      localStorage.setItem(`character_vince`, JSON.stringify(finalCharacter));
      
      // Also set as Josh for compatibility
      await saveCharacter({ ...finalCharacter, type: 'josh' as 'josh' | 'abby' });
      
      // Save owned equipment
      const allEquipmentIds = [
        'wooden-sword', 'iron-sword', 'steel-sword', 'mythril-sword', 'legendary-sword',
        'leather-armor', 'iron-armor', 'steel-armor', 'mythril-armor', 'legendary-armor',
        'wooden-shield', 'iron-shield', 'steel-shield', 'mythril-shield', 'legendary-shield',
      ];
      localStorage.setItem('ownedEquipment_josh', JSON.stringify(allEquipmentIds));
      localStorage.setItem('ownedEquipment_vince', JSON.stringify(allEquipmentIds));
      
      // Set difficulty to EASY for easier testing
      localStorage.setItem('userDifficulty', 'EASY');
      
      // Log success
      console.log('God mode activated!');
      console.log('Character:', finalCharacter);
      
      // Redirect to hub
      router.push('/hub');
    };

    initGodMode();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">⚡ 无敌模式激活中 ⚡</h1>
        <p className="text-white text-xl">正在创建测试角色...</p>
        <div className="mt-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto"></div>
        </div>
        <div className="mt-8 text-gray-400">
          <p>等级: 99</p>
          <p>ETH: 100,000</p>
          <p>所有关卡已解锁</p>
          <p>最强装备已装备</p>
        </div>
      </div>
    </div>
  );
}