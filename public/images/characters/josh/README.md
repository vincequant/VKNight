# Josh Character Assets Organization

## Folder Structure

### `/base/`
Base character poses for reference and consistency
- `josh_knight_idle_base_v1.png` - Primary reference image

### `/animations/`
Individual animation frames organized by action type:
- **attack/** - Sword attack sequences (3-4 frames)
- **run/** - Running cycle (4-6 frames)
- **jump/** - Jump sequence (3 frames: crouch, mid-air, landing)
- **defend/** - Shield defense poses
- **victory/** - Victory celebration animations
- **hurt/** - Damage reaction animations
- **magic/** - Math magic casting sequences

### `/sprite_sheets/`
Combined sprite sheets for game engine use
- Full animation sheets with all actions
- Grid-based layouts for easy parsing

### `/exports/`
Size-specific exports for different use cases:
- **josh_256x256/** - Standard game size
- **josh_512x512/** - High-resolution version

## Naming Convention
```
josh_[action]_[frame_number].png
```
Examples:
- josh_attack_01.png
- josh_run_03.png
- josh_victory_02.png

## Animation Frame Guidelines
- Attack: 3-4 frames
- Run: 4-6 frames  
- Jump: 3 frames
- Hurt: 2-3 frames
- Victory: 3-4 frames
- Magic: 4-5 frames

## Midjourney Generation Tips
1. Use base image as reference with `--iw 2`
2. Keep seed value consistent: `--seed [number]`
3. Add `--chaos 0` for minimal variation
4. Always include key features: blonde hair, green cap, blue eyes