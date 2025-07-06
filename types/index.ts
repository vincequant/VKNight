export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'STUDENT' | 'PARENT';
  level: number;
  coins: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Progress {
  id: string;
  userId: string;
  topic: string;
  difficulty: Difficulty;
  correct: number;
  total: number;
  streak: number;
  bestStreak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  price: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  itemId: string;
  purchaseDate: Date;
  item?: StoreItem;
}

export interface Achievement {
  id: string;
  userId: string;
  type: string;
  name: string;
  description: string;
  unlockedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  questionsAnswered: number;
  correctAnswers: number;
  coinsEarned: number;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
export type ItemCategory = 'PET' | 'AVATAR' | 'BACKGROUND' | 'POWERUP' | 'SCENE';

export interface Question {
  id: string;
  type: 'addition' | 'subtraction' | 'multiplication' | 'division';
  difficulty: Difficulty;
  question: string;
  answer: number;
  options?: number[];
  visualElements?: VisualElement[];
}

export interface VisualElement {
  type: 'number-block' | 'group' | 'animation';
  value: number;
  position?: { x: number; y: number };
  color?: string;
}

export interface GameState {
  currentUser?: User;
  currentQuestion?: Question;
  sessionId?: string;
  streak: number;
  questionsAnswered: number;
  correctAnswers: number;
  coinsEarned: number;
}

export interface AnimationStep {
  type: 'move' | 'merge' | 'split' | 'highlight';
  elements: string[];
  duration: number;
  description?: string;
}