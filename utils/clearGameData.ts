// Clear all game data utility
export function clearAllGameData() {
  try {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    
    // Filter game-related keys
    const gameKeys = keys.filter(key => {
      return key.includes('character') || 
             key.includes('ownedEquipment') || 
             key.includes('gameProgress') ||
             key.includes('unlockedAchievements') ||
             key.includes('currentUser') ||
             key.includes('userDifficulty') ||
             key.includes('vknight');
    });
    
    console.log('Found game keys to clear:', gameKeys);
    
    // Remove each game-related key
    gameKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log('Removed:', key);
    });
    
    console.log('All game data cleared successfully!');
    return true;
  } catch (error) {
    console.error('Error clearing game data:', error);
    return false;
  }
}

// Clear data for a specific user
export function clearUserData(username: string) {
  try {
    const keysToRemove = [
      `character_${username}`,
      `ownedEquipment_${username}`,
      `vknight_character_1`, // Old format
    ];
    
    // Also remove all backups for this user
    const allKeys = Object.keys(localStorage);
    const backupKeys = allKeys.filter(key => key.includes(`character_backup_${username}`));
    keysToRemove.push(...backupKeys);
    
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log('Removed:', key);
      }
    });
    
    console.log(`Data for user ${username} cleared successfully!`);
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    return false;
  }
}