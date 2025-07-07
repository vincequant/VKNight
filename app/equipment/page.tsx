'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundManager } from '@/lib/sounds';
import { Character, Equipment, calculateCharacterStats } from '@/types/game';
import { EQUIPMENT_DATA } from '@/data/equipment';
import ETHDisplay from '@/components/ETHDisplay';
import { useRouter } from 'next/navigation';
import { migrateCharacterData } from '@/lib/characterMigration';
import { saveCharacter, deserializeCharacter } from '@/utils/characterStorage';

interface EquipmentSlot {
  type: 'weapon' | 'armor' | 'shield';
  equipment: Equipment | null;
}

export default function EquipmentPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [ownedEquipment, setOwnedEquipment] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'weapon' | 'armor' | 'shield'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser') || 'abby';
    
    // Special handling for vince (god mode)
    if (user === 'vince') {
      const vinceData = localStorage.getItem('character_vince');
      if (vinceData) {
        const vinceChar = migrateCharacterData(JSON.parse(vinceData));
        setCharacter(calculateCharacterStats(vinceChar));
        
        // All equipment owned for vince
        const allOwned = EQUIPMENT_DATA.map(item => item.id);
        setOwnedEquipment(allOwned);
        return;
      }
    }
    
    const savedCharacter = localStorage.getItem(`character_${user}`);
    
    if (savedCharacter) {
      let char;
      try {
        char = migrateCharacterData(deserializeCharacter(savedCharacter));
      } catch {
        // Fallback for old format
        char = migrateCharacterData(JSON.parse(savedCharacter));
      }
      setCharacter(calculateCharacterStats(char));
      
      // Load owned equipment
      const owned = JSON.parse(localStorage.getItem(`ownedEquipment_${user}`) || '[]');
      setOwnedEquipment(owned);
    } else {
      router.push('/');
    }
  }, [router]);

  const getOwnedEquipmentItems = () => {
    return EQUIPMENT_DATA.filter(item => ownedEquipment.includes(item.id));
  };

  const getFilteredEquipment = () => {
    const owned = getOwnedEquipmentItems();
    if (selectedCategory === 'all') return owned;
    return owned.filter(item => item.type === selectedCategory);
  };

  const equipItem = (item: Equipment) => {
    if (!character) return;

    soundManager.play('coin');
    
    const updatedChar = { ...character };
    
    // Equip the item based on its type
    switch (item.type) {
      case 'weapon':
        updatedChar.weapon = item;
        break;
      case 'armor':
        updatedChar.armor = item;
        break;
      case 'shield':
        updatedChar.shield = item;
        break;
    }

    const calculatedChar = calculateCharacterStats(updatedChar);
    setCharacter(calculatedChar);
    saveCharacter(updatedChar);
  };

  const unequipItem = (type: 'weapon' | 'armor' | 'shield') => {
    if (!character) return;

    soundManager.play('drop');
    
    const updatedChar = { ...character };
    
    switch (type) {
      case 'weapon':
        updatedChar.weapon = undefined;
        break;
      case 'armor':
        updatedChar.armor = undefined;
        break;
      case 'shield':
        updatedChar.shield = undefined;
        break;
    }

    const calculatedChar = calculateCharacterStats(updatedChar);
    setCharacter(calculatedChar);
    saveCharacter(updatedChar);
  };

  const calculateStatChange = (item: Equipment) => {
    if (!character) return { hp: 0, attack: 0, defense: 0 };

    const currentEquipment = character[item.type as keyof Character] as Equipment | undefined;
    
    return {
      hp: item.hpBonus - (currentEquipment?.hpBonus || 0),
      attack: item.attackBonus - (currentEquipment?.attackBonus || 0),
      defense: item.defenseBonus - (currentEquipment?.defenseBonus || 0)
    };
  };

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const equipmentSlots: EquipmentSlot[] = [
    { type: 'weapon', equipment: character.weapon || null },
    { type: 'armor', equipment: character.armor || null },
    { type: 'shield', equipment: character.shield || null }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-black/30 rounded-lg p-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/hub')}
            className="text-3xl bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center"
          >
            ↩️
          </motion.button>
          
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            装备管理
          </h1>
          
          <ETHDisplay amount={character.eth} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Character Stats & Equipment Slots */}
          <div className="space-y-6">
            {/* Character Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/80 rounded-lg p-6 border border-gray-700"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                {character.type === 'josh' ? 'Josh 骑士' : 'Abby 魔法师'}
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">等级</span>
                  <span className="text-yellow-400 font-bold">{character.level}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">生命值</span>
                    <span className="text-green-400 font-bold">{character.maxHp}</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: '100%' }} />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">攻击力</span>
                  <span className="text-red-400 font-bold">{character.attack}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">防御力</span>
                  <span className="text-blue-400 font-bold">{character.defense}</span>
                </div>
              </div>
            </motion.div>

            {/* Equipment Slots */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">当前装备</h3>
              {equipmentSlots.map((slot, index) => (
                <motion.div
                  key={slot.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/80 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center text-3xl">
                        {slot.equipment ? slot.equipment.icon : '❓'}
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 capitalize">
                          {slot.type === 'weapon' ? '武器' : slot.type === 'armor' ? '护甲' : '盾牌'}
                        </p>
                        <p className="font-bold text-white">
                          {slot.equipment ? slot.equipment.name : '未装备'}
                        </p>
                        {slot.equipment && (
                          <div className="flex gap-4 text-xs mt-1">
                            {slot.equipment.hpBonus > 0 && (
                              <span className="text-green-400">+{slot.equipment.hpBonus} HP</span>
                            )}
                            {slot.equipment.attackBonus > 0 && (
                              <span className="text-red-400">+{slot.equipment.attackBonus} ATK</span>
                            )}
                            {slot.equipment.defenseBonus > 0 && (
                              <span className="text-blue-400">+{slot.equipment.defenseBonus} DEF</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {slot.equipment && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => unequipItem(slot.type)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm"
                      >
                        卸下
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Owned Equipment */}
          <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex gap-2 justify-center">
              {(['all', 'weapon', 'armor', 'shield'] as const).map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-4 py-2 rounded-lg font-bold transition-colors
                    ${selectedCategory === category 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }
                  `}
                >
                  {category === 'all' ? '全部' : 
                   category === 'weapon' ? '武器' : 
                   category === 'armor' ? '护甲' : '盾牌'}
                </motion.button>
              ))}
            </div>

            {/* Equipment List */}
            <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700 max-h-[600px] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-4">已拥有装备</h3>
              
              {getFilteredEquipment().length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  暂无{selectedCategory !== 'all' ? '此类' : ''}装备
                </p>
              ) : (
                <div className="space-y-3">
                  {getFilteredEquipment().map((item) => {
                    const isEquipped = (
                      character.weapon?.id === item.id ||
                      character.armor?.id === item.id ||
                      character.shield?.id === item.id
                    );
                    const statChanges = calculateStatChange(item);
                    
                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedEquipment(item)}
                        className={`
                          bg-gray-900 rounded-lg p-4 cursor-pointer border-2 transition-all
                          ${isEquipped ? 'border-green-500' : 'border-gray-700 hover:border-purple-500'}
                          ${selectedEquipment?.id === item.id ? 'ring-2 ring-purple-400' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{item.icon}</div>
                            <div>
                              <p className="font-bold text-white flex items-center gap-2">
                                {item.name}
                                {isEquipped && <span className="text-xs text-green-400">(装备中)</span>}
                              </p>
                              <p className="text-xs text-gray-400">{item.description}</p>
                              <div className="flex gap-2 mt-1">
                                {Array.from({ length: item.tier }).map((_, i) => (
                                  <span key={i} className="text-yellow-400 text-xs">⭐</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {!isEquipped && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                equipItem(item);
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold text-sm"
                            >
                              装备
                            </motion.button>
                          )}
                        </div>
                        
                        {/* Stat Changes Preview */}
                        {!isEquipped && selectedEquipment?.id === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-gray-700"
                          >
                            <p className="text-xs text-gray-400 mb-2">装备后属性变化：</p>
                            <div className="flex gap-4 text-sm">
                              {statChanges.hp !== 0 && (
                                <span className={statChanges.hp > 0 ? 'text-green-400' : 'text-red-400'}>
                                  HP {statChanges.hp > 0 ? '+' : ''}{statChanges.hp}
                                </span>
                              )}
                              {statChanges.attack !== 0 && (
                                <span className={statChanges.attack > 0 ? 'text-green-400' : 'text-red-400'}>
                                  ATK {statChanges.attack > 0 ? '+' : ''}{statChanges.attack}
                                </span>
                              )}
                              {statChanges.defense !== 0 && (
                                <span className={statChanges.defense > 0 ? 'text-green-400' : 'text-red-400'}>
                                  DEF {statChanges.defense > 0 ? '+' : ''}{statChanges.defense}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}