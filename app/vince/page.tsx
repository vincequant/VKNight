'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VincePage() {
  const router = useRouter();

  useEffect(() => {
    try {
      // Create a super character for testing
      const godCharacter = {
        id: 'vince',
        type: 'josh',
        level: 99,
        experience: 0,
        expToNextLevel: 999999,
        eth: '100000000000000000000000n', // 100,000 ETH as BigInt string
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
        stagesCleared: [
          'forest-1', 'forest-2', 'forest-3', 'forest-4', 'forest-5',
          'mountain-1', 'mountain-2', 'mountain-3', 'mountain-4', 'mountain-5',
          'volcano-1', 'volcano-2', 'volcano-3', 'volcano-4', 'volcano-5',
          'dungeon-1', 'dungeon-2', 'dungeon-3', 'dungeon-4', 'dungeon-5',
          'demon-1', 'demon-2', 'demon-3', 'demon-4', 'demon-5'
        ],
        stagesPaidFor: [
          'forest-1', 'forest-2', 'forest-3', 'forest-4', 'forest-5',
          'mountain-1', 'mountain-2', 'mountain-3', 'mountain-4', 'mountain-5',
          'volcano-1', 'volcano-2', 'volcano-3', 'volcano-4', 'volcano-5',
          'dungeon-1', 'dungeon-2', 'dungeon-3', 'dungeon-4', 'dungeon-5',
          'demon-1', 'demon-2', 'demon-3', 'demon-4', 'demon-5'
        ],
        inventory: [
          { id: 'small-health-potion', quantity: 99 },
          { id: 'medium-health-potion', quantity: 99 },
          { id: 'large-health-potion', quantity: 99 },
          { id: 'super-health-potion', quantity: 99 },
          { id: 'full-health-potion', quantity: 20 },
        ],
        weapon: {
          id: 'legendary-sword',
          name: '传奇之剑',
          type: 'weapon',
          tier: 5,
          price: '100000000000000000000n',
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
          price: '100000000000000000000n',
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
          price: '100000000000000000000n',
          hpBonus: 200,
          attackBonus: 30,
          defenseBonus: 150,
          icon: '🔰',
          description: '坚不可摧的防御',
          levelRequirement: 50,
        },
      };
      
      // Save to localStorage
      localStorage.setItem('currentUser', 'vince');
      localStorage.setItem('character_vince', JSON.stringify(godCharacter));
      localStorage.setItem('character_josh', JSON.stringify(godCharacter));
      
      // Save owned equipment
      const allEquipmentIds = [
        'wooden-sword', 'iron-sword', 'steel-sword', 'mythril-sword', 'legendary-sword',
        'leather-armor', 'iron-armor', 'steel-armor', 'mythril-armor', 'legendary-armor',
        'wooden-shield', 'iron-shield', 'steel-shield', 'mythril-shield', 'legendary-shield',
      ];
      localStorage.setItem('ownedEquipment_josh', JSON.stringify(allEquipmentIds));
      localStorage.setItem('ownedEquipment_vince', JSON.stringify(allEquipmentIds));
      
      // Set difficulty to EASY
      localStorage.setItem('userDifficulty', 'EASY');
      
      // Log success
      console.log('God mode activated!');
      
      // Add a small delay before redirecting
      setTimeout(() => {
        router.push('/hub');
      }, 1000);
      
    } catch (error) {
      console.error('Error activating god mode:', error);
      // If there's an error, still try to redirect
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
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