import { Howl } from 'howler';

class SoundManager {
  private sounds: Map<string, Howl> = new Map();
  private enabled: boolean = true;

  constructor() {
    this.preloadSounds();
  }

  private preloadSounds() {
    const soundFiles = {
      // 原有音效
      correct: '/sounds/correct.mp3',
      incorrect: '/sounds/incorrect.mp3',
      coin: '/sounds/coin.mp3',
      levelUp: '/sounds/level-up.mp3',
      buttonClick: '/sounds/click.mp3',
      drag: '/sounds/drag.mp3',
      drop: '/sounds/drop.mp3',
      achievement: '/sounds/achievement.mp3',
      background: '/sounds/background-music.mp3',
      
      // 战斗音效
      swordSwing: '/sounds/sword-swing.mp3',
      bowShoot: '/sounds/bow-shoot.mp3',
      magicSparkle: '/sounds/magic-sparkle.mp3',
      hitSoft: '/sounds/hit-soft.mp3',
      shieldBlock: '/sounds/shield-block.mp3',
      playerHurt: '/sounds/player-hurt.mp3',
      
      // ETH系统音效
      ethCollect: '/sounds/eth-collect.mp3',
      ethSpend: '/sounds/eth-spend.mp3',
      transactionComplete: '/sounds/transaction-complete.mp3',
      
      // 升级与成就
      levelUpFanfare: '/sounds/level-up-fanfare.mp3',
      achievementUnlock: '/sounds/achievement-unlock.mp3',
      questComplete: '/sounds/quest-complete.mp3',
      
      // 装备音效
      equipArmor: '/sounds/equip-armor.mp3',
      equipWeapon: '/sounds/equip-weapon.mp3',
      unequip: '/sounds/unequip.mp3',
      
      // 界面音效
      menuSelect: '/sounds/menu-select.mp3',
      menuHover: '/sounds/menu-hover.mp3',
      pageTurn: '/sounds/page-turn.mp3',
      
      // 特殊音效
      comboHit: '/sounds/combo-hit.mp3',
      criticalStrike: '/sounds/critical-strike.mp3',
      mathCorrect: '/sounds/math-correct.mp3',
      mathIncorrect: '/sounds/math-incorrect.mp3',
    };

    Object.entries(soundFiles).forEach(([key, src]) => {
      this.sounds.set(key, new Howl({
        src: [src],
        preload: false, // 改为false，避免加载空文件时报错
        loop: key === 'background',
        volume: key === 'background' ? 0.3 : 0.7,
        onloaderror: () => {
          console.log(`音效文件 ${src} 未找到，游戏将在静音模式下运行`);
        },
      }));
    });
  }

  play(soundName: string) {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.play();
    }
  }

  stop(soundName: string) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.stop();
    }
  }

  toggleMusic() {
    const bgMusic = this.sounds.get('background');
    if (bgMusic) {
      if (bgMusic.playing()) {
        bgMusic.pause();
      } else {
        bgMusic.play();
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.sounds.forEach(sound => sound.stop());
    }
  }

  setVolume(soundName: string, volume: number) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.volume(volume);
    }
  }
}

export const soundManager = new SoundManager();