import { Character } from '@/types/game';
import { Equipment } from '@/types/game';
import { createBackup } from './backup';

// Helper to serialize character data with bigint support
export function serializeCharacter(character: Character): string {
  return JSON.stringify(character, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString() + 'n'; // Add 'n' suffix to indicate bigint
    }
    return value;
  });
}

// Helper to deserialize character data with bigint support
export function deserializeCharacter(data: string): Character {
  return JSON.parse(data, (key, value) => {
    // Only convert to BigInt if it's a string ending with 'n' AND the rest is a valid number
    if (typeof value === 'string' && value.endsWith('n')) {
      const numStr = value.slice(0, -1);
      // Check if it's a valid number before converting
      if (/^\d+$/.test(numStr)) {
        try {
          return BigInt(numStr);
        } catch (e) {
          // If conversion fails, return the original value
          return value;
        }
      }
    }
    return value;
  });
}

// Save character to localStorage and cloud
export async function saveCharacter(character: Character, createBackupFlag: boolean = false): Promise<void> {
  // Use consistent key - either character.id or character.type
  const key = `character_${character.id || character.type}`;
  localStorage.setItem(key, serializeCharacter(character));
  
  // Also save owned equipment if present
  // Note: owned equipment is managed separately in the store/equipment pages
  // This function focuses on saving the character data including equipped items
  
  // Create backup on important events
  if (createBackupFlag) {
    createBackup(character);
  }
  
  // Try to save to cloud
  try {
    window.dispatchEvent(new Event('cloud-sync-start'));
    
    const response = await fetch('/api/character/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(character),
    });
    
    if (!response.ok) {
      console.error('Failed to save to cloud');
      window.dispatchEvent(new Event('cloud-sync-error'));
    } else {
      window.dispatchEvent(new Event('cloud-sync-success'));
    }
  } catch (error) {
    console.error('Error saving to cloud:', error);
    window.dispatchEvent(new Event('cloud-sync-error'));
  }
}

// Load character from localStorage
export function loadCharacter(userId: string): Character | null {
  const key = `character_${userId}`;
  const data = localStorage.getItem(key);
  if (!data) return null;
  
  try {
    return deserializeCharacter(data);
  } catch (error) {
    console.error('Error loading character:', error);
    return null;
  }
}

// Load character with cloud fallback
export async function loadCharacterWithCloud(characterType: string): Promise<Character | null> {
  try {
    // 总是优先从云端加载
    const response = await fetch(`/api/character/load?type=${characterType}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.character) {
        const character = data.character;
        // Convert string bigints back to bigint
        character.eth = BigInt(character.eth);
        if (character.weapon) {
          character.weapon.price = BigInt(character.weapon.price);
        }
        if (character.armor) {
          character.armor.price = BigInt(character.armor.price);
        }
        if (character.shield) {
          character.shield.price = BigInt(character.shield.price);
        }
        
        // 保存到localStorage作为离线缓存
        localStorage.setItem(`character_${character.type}`, serializeCharacter(character));
        
        return character;
      }
    }
  } catch (error) {
    console.error('Error loading from cloud:', error);
  }
  
  // 如果云端加载失败，尝试从本地缓存加载
  return loadCharacter(characterType);
}