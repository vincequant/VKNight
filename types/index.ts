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
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  answer: number | string;
  options: (number | string)[];
  visualElements?: VisualElement[];
  hint?: string;
  explanation?: string;
  category?: QuestionCategory;
  timeLimit?: number; // 时间限制（秒）
}

export type QuestionType = 
  | 'addition' 
  | 'subtraction' 
  | 'multiplication' 
  | 'division'
  | 'pattern'          // 找规律
  | 'comparison'       // 比大小
  | 'sequence'         // 数列
  | 'logic'           // 逻辑推理
  | 'geometry'        // 几何
  | 'word-problem'    // 应用题
  | 'time'           // 时间
  | 'money'          // 货币
  | 'data'           // 数据统计
  | 'fraction'       // 分数
  | 'equation'       // 方程
  | 'spatial'        // 空间想象

export type QuestionCategory = 
  | 'arithmetic'      // 基础运算
  | 'pattern'        // 数字规律
  | 'logic'          // 逻辑推理
  | 'geometry'       // 几何空间
  | 'application'    // 应用题
  | 'statistics'     // 数据统计
  | 'time-money'     // 时间货币
  | 'function'       // 初级函数

export interface VisualElement {
  type: 'number-block' | 'group' | 'animation' | 'emoji' | 'shape' | 'graph' | 'clock' | 'money' | 'fraction-pie';
  value?: number;
  content?: string;
  count?: number;
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