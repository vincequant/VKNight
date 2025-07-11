'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Character } from '@/types/game';
import { deserializeCharacter, saveCharacter } from '@/utils/characterStorage';
import { EQUIPMENT_DATA } from '@/data/equipment';
import { calculateCharacterStats } from '@/types/game';

export default function FixEquipmentPage() {
  const router = useRouter();
  const [status, setStatus] = useState<string>('');
  const [character, setCharacter] = useState<Character | null>(null);
  const [ownedEquipment, setOwnedEquipment] = useState<string[]>([]);

  useEffect(() => {
    checkAndFixEquipment();
  }, []);

  const checkAndFixEquipment = async () => {
    setStatus('Checking Josh\'s equipment...\n');
    
    const user = 'josh';
    const savedCharacter = localStorage.getItem(`character_${user}`);
    
    if (!savedCharacter) {
      setStatus(prev => prev + 'No Josh character data found.\n');
      return;
    }

    try {
      const char = deserializeCharacter(savedCharacter);
      setCharacter(char);
      
      // Load owned equipment
      const owned = JSON.parse(localStorage.getItem(`ownedEquipment_${user}`) || '[]');
      setOwnedEquipment(owned);
      
      setStatus(prev => prev + `Josh's current state:\n`);
      setStatus(prev => prev + `- Level: ${char.level}\n`);
      setStatus(prev => prev + `- ETH: ${char.eth / BigInt(1000000000000000000)}n\n`);
      setStatus(prev => prev + `- Weapon: ${char.weapon ? char.weapon.name : 'None'}\n`);
      setStatus(prev => prev + `- Armor: ${char.armor ? char.armor.name : 'None'}\n`);
      setStatus(prev => prev + `- Shield: ${char.shield ? char.shield.name : 'None'}\n`);
      setStatus(prev => prev + `- Owned Equipment IDs: ${owned.join(', ') || 'None'}\n\n`);
      
      // Check if equipment is missing
      if (owned.length > 0 && (!char.weapon && !char.armor && !char.shield)) {
        setStatus(prev => prev + 'Equipment is missing! Attempting to auto-equip best available items...\n');
        
        // Auto-equip the best items from owned equipment
        let updatedChar = { ...char };
        
        // Find best weapon
        const ownedWeapons = EQUIPMENT_DATA.filter(item => 
          item.type === 'weapon' && owned.includes(item.id) && item.levelRequirement <= char.level
        ).sort((a, b) => b.tier - a.tier);
        
        if (ownedWeapons.length > 0) {
          updatedChar.weapon = ownedWeapons[0];
          setStatus(prev => prev + `- Equipped weapon: ${ownedWeapons[0].name}\n`);
        }
        
        // Find best armor
        const ownedArmor = EQUIPMENT_DATA.filter(item => 
          item.type === 'armor' && owned.includes(item.id) && item.levelRequirement <= char.level
        ).sort((a, b) => b.tier - a.tier);
        
        if (ownedArmor.length > 0) {
          updatedChar.armor = ownedArmor[0];
          setStatus(prev => prev + `- Equipped armor: ${ownedArmor[0].name}\n`);
        }
        
        // Find best shield
        const ownedShields = EQUIPMENT_DATA.filter(item => 
          item.type === 'shield' && owned.includes(item.id) && item.levelRequirement <= char.level
        ).sort((a, b) => b.tier - a.tier);
        
        if (ownedShields.length > 0) {
          updatedChar.shield = ownedShields[0];
          setStatus(prev => prev + `- Equipped shield: ${ownedShields[0].name}\n`);
        }
        
        // Calculate stats and save
        const calculatedChar = calculateCharacterStats(updatedChar);
        await saveCharacter(calculatedChar);
        setCharacter(calculatedChar);
        
        setStatus(prev => prev + '\nEquipment restored successfully!\n');
      } else if (char.weapon || char.armor || char.shield) {
        setStatus(prev => prev + 'Equipment is already equipped. No fix needed.\n');
      } else {
        setStatus(prev => prev + 'No owned equipment found to restore.\n');
      }
      
    } catch (error) {
      setStatus(prev => prev + `Error: ${error}\n`);
    }
  };

  const manuallyAddEquipment = async () => {
    if (!character) return;
    
    // Add some basic equipment to owned list
    const basicEquipment = ['wooden-sword', 'leather-armor', 'wooden-shield'];
    const currentOwned = JSON.parse(localStorage.getItem(`ownedEquipment_josh`) || '[]');
    const newOwned = [...new Set([...currentOwned, ...basicEquipment])];
    
    localStorage.setItem(`ownedEquipment_josh`, JSON.stringify(newOwned));
    setOwnedEquipment(newOwned);
    
    setStatus(prev => prev + '\nAdded basic equipment to inventory. Refresh to re-check.\n');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Equipment Fix Tool</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{status}</pre>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={checkAndFixEquipment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            Re-check Equipment
          </button>
          
          <button
            onClick={manuallyAddEquipment}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            Add Basic Equipment
          </button>
          
          <button
            onClick={() => router.push('/equipment')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            Go to Equipment Page
          </button>
          
          <button
            onClick={() => router.push('/hub')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-bold"
          >
            Back to Hub
          </button>
        </div>
      </div>
    </div>
  );
}