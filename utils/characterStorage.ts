import { Character } from '@/types/game';
import { Equipment } from '@/types/game';

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
    if (typeof value === 'string' && value.endsWith('n')) {
      return BigInt(value.slice(0, -1));
    }
    return value;
  });
}

// Save character to localStorage and cloud
export async function saveCharacter(character: Character): Promise<void> {
  const key = `character_${character.type}`;
  localStorage.setItem(key, serializeCharacter(character));
  
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
    // Try to load from cloud first
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
        
        // Save to localStorage for offline access
        saveCharacter(character);
        
        return character;
      }
    }
  } catch (error) {
    console.error('Error loading from cloud:', error);
  }
  
  // Fall back to localStorage
  return loadCharacter(characterType);
}