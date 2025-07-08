import { Question, Difficulty } from '@/types';

export class ComparisonGenerator {
  private static generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // 比大小
  static generateComparison(difficulty: Difficulty, config?: any): Question {
    let num1: number, num2: number;
    let answer: string;
    
    const maxNum = config?.maxNum;
    
    if (maxNum !== undefined) {
      num1 = Math.floor(Math.random() * maxNum) + 1;
      num2 = Math.floor(Math.random() * maxNum) + 1;
      while (num1 === num2) {
        num2 = Math.floor(Math.random() * maxNum) + 1;
      }
    } else {
      switch (difficulty) {
        case 'EASY':
          // 1-20的数字比较
          num1 = Math.floor(Math.random() * 20) + 1;
          num2 = Math.floor(Math.random() * 20) + 1;
          while (num1 === num2) {
            num2 = Math.floor(Math.random() * 20) + 1;
          }
          break;
        
        case 'MEDIUM':
          // 1-100的数字比较
          num1 = Math.floor(Math.random() * 100) + 1;
          num2 = Math.floor(Math.random() * 100) + 1;
          while (num1 === num2) {
            num2 = Math.floor(Math.random() * 100) + 1;
          }
          break;
          
        case 'HARD':
          // 三位数比较
          num1 = Math.floor(Math.random() * 900) + 100;
          num2 = Math.floor(Math.random() * 900) + 100;
          break;
          
        case 'EXPERT':
          // 四位数或小数比较
          if (Math.random() > 0.5) {
            num1 = Math.floor(Math.random() * 9000) + 1000;
            num2 = Math.floor(Math.random() * 9000) + 1000;
          } else {
            // 小数比较
            num1 = Math.round((Math.random() * 10 + 1) * 10) / 10;
            num2 = Math.round((Math.random() * 10 + 1) * 10) / 10;
          }
          break;
      }
    }
    
    if (num1 > num2) {
      answer = '>';
    } else if (num1 < num2) {
      answer = '<';
    } else {
      answer = '=';
    }
    
    return {
      id: this.generateId(),
      type: 'comparison',
      difficulty,
      question: `${num1} ○ ${num2}，○里应该填什么？`,
      answer,
      options: ['>', '<', '='],
      category: 'logic'
    };
  }
}