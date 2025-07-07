'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CharacterAvatarProps {
  character: 'josh' | 'abby';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function CharacterAvatar({ character, size = 'md', className = '' }: CharacterAvatarProps) {
  const sizeMap = {
    sm: 32,
    md: 64,
    lg: 96,
    xl: 128
  };
  
  const pixelSize = sizeMap[size];
  const [imageError, setImageError] = useState(false);
  
  // Use character images
  const imagePath = character === 'josh' 
    ? '/images/characters/josh/josh_knight.png'
    : '/images/characters/abby/abby_archer.png';
  
  // Fallback to emoji if no image or error
  if (!imagePath || imageError) {
    const emoji = character === 'josh' ? '🗡️' : '🏹';
    const fontSize = size === 'sm' ? 'text-2xl' : size === 'md' ? 'text-4xl' : size === 'lg' ? 'text-6xl' : 'text-8xl';
    return <span className={`${fontSize} ${className}`}>{emoji}</span>;
  }
  
  return (
    <div className={`relative ${className}`} style={{ width: pixelSize, height: pixelSize }}>
      <Image
        src={imagePath}
        alt={character}
        width={pixelSize}
        height={pixelSize}
        className="pixelated"
        style={{ imageRendering: 'pixelated' }}
        priority
        onError={() => setImageError(true)}
      />
    </div>
  );
}