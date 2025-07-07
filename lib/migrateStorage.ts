// Migrate old storage keys to new format
export function migrateStorageKeys() {
  try {
    // Migrate vknight_character_1 to character_josh or character_abby
    const oldKey = 'vknight_character_1';
    const oldData = localStorage.getItem(oldKey);
    
    if (oldData) {
      try {
        const parsedData = JSON.parse(oldData);
        const characterType = parsedData.type || localStorage.getItem('currentUser') || 'josh';
        const newKey = `character_${characterType}`;
        
        // Only migrate if new key doesn't exist
        if (!localStorage.getItem(newKey)) {
          localStorage.setItem(newKey, oldData);
          console.log(`Migrated ${oldKey} to ${newKey}`);
        }
        
        // Remove old key after successful migration
        localStorage.removeItem(oldKey);
      } catch (e) {
        console.error('Error migrating storage:', e);
      }
    }
  } catch (e) {
    console.error('Storage migration failed:', e);
  }
}