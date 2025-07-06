import { Question, Difficulty } from '@/types';

export class QuestionGenerator {
  private static generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  static generateAddition(difficulty: Difficulty): Question {
    let num1: number, num2: number;
    
    switch (difficulty) {
      case 'EASY':
        // 为Abby设计的简单题目：1-20以内的加法
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case 'MEDIUM':
        // Josh的中等难度：10-99的加法
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 50) + 10;
        break;
      case 'HARD':
        num1 = Math.floor(Math.random() * 100) + 50;
        num2 = Math.floor(Math.random() * 100) + 50;
        break;
      case 'EXPERT':
        num1 = Math.floor(Math.random() * 500) + 100;
        num2 = Math.floor(Math.random() * 500) + 100;
        break;
    }

    const answer = num1 + num2;
    const options = this.generateOptions(answer, difficulty);

    return {
      id: this.generateId(),
      type: 'addition',
      difficulty,
      question: `${num1} + ${num2} = ?`,
      answer,
      options,
      visualElements: this.generateVisualElements(num1, num2, 'addition'),
    };
  }

  static generateSubtraction(difficulty: Difficulty): Question {
    let num1: number, num2: number;
    
    switch (difficulty) {
      case 'EASY':
        // 为Abby设计的简单减法：结果为正数，20以内
        num1 = Math.floor(Math.random() * 15) + 5;
        num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
        break;
      case 'MEDIUM':
        // Josh的中等难度
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * (num1 - 10)) + 1;
        break;
      case 'HARD':
        num1 = Math.floor(Math.random() * 100) + 50;
        num2 = Math.floor(Math.random() * num1) + 1;
        break;
      case 'EXPERT':
        num1 = Math.floor(Math.random() * 500) + 200;
        num2 = Math.floor(Math.random() * num1) + 1;
        break;
    }

    const answer = num1 - num2;
    const options = this.generateOptions(answer, difficulty);

    return {
      id: this.generateId(),
      type: 'subtraction',
      difficulty,
      question: `${num1} - ${num2} = ?`,
      answer,
      options,
      visualElements: this.generateVisualElements(num1, num2, 'subtraction'),
    };
  }

  static generateMultiplication(difficulty: Difficulty): Question {
    let num1: number, num2: number;
    
    switch (difficulty) {
      case 'EASY':
        num1 = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
        break;
      case 'MEDIUM':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case 'HARD':
        num1 = Math.floor(Math.random() * 15) + 5;
        num2 = Math.floor(Math.random() * 15) + 5;
        break;
      case 'EXPERT':
        num1 = Math.floor(Math.random() * 25) + 10;
        num2 = Math.floor(Math.random() * 25) + 10;
        break;
    }

    const answer = num1 * num2;
    const options = this.generateOptions(answer, difficulty);

    return {
      id: this.generateId(),
      type: 'multiplication',
      difficulty,
      question: `${num1} × ${num2} = ?`,
      answer,
      options,
    };
  }

  static generateDivision(difficulty: Difficulty): Question {
    let num1: number, num2: number, answer: number;
    
    switch (difficulty) {
      case 'EASY':
        answer = Math.floor(Math.random() * 5) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
        num1 = answer * num2;
        break;
      case 'MEDIUM':
        answer = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        num1 = answer * num2;
        break;
      case 'HARD':
        answer = Math.floor(Math.random() * 15) + 5;
        num2 = Math.floor(Math.random() * 10) + 2;
        num1 = answer * num2;
        break;
      case 'EXPERT':
        answer = Math.floor(Math.random() * 25) + 10;
        num2 = Math.floor(Math.random() * 15) + 2;
        num1 = answer * num2;
        break;
    }

    const options = this.generateOptions(answer, difficulty);

    return {
      id: this.generateId(),
      type: 'division',
      difficulty,
      question: `${num1} ÷ ${num2} = ?`,
      answer,
      options,
    };
  }

  private static generateOptions(correctAnswer: number, difficulty: Difficulty): number[] {
    const options = new Set<number>([correctAnswer]);
    const range = difficulty === 'EASY' ? 5 : difficulty === 'MEDIUM' ? 10 : 20;

    while (options.size < 4) {
      const offset = Math.floor(Math.random() * range * 2) - range;
      const option = correctAnswer + offset;
      if (option > 0) {
        options.add(option);
      }
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
  }

  private static generateVisualElements(num1: number, num2: number, type: 'addition' | 'subtraction') {
    const elements = [];
    
    if (type === 'addition' && num1 <= 20 && num2 <= 20) {
      for (let i = 0; i < num1; i++) {
        elements.push({
          type: 'number-block' as const,
          value: 1,
          position: { x: i * 30, y: 0 },
          color: '#FCD34D',
        });
      }
      
      for (let i = 0; i < num2; i++) {
        elements.push({
          type: 'number-block' as const,
          value: 1,
          position: { x: i * 30, y: 100 },
          color: '#F59E0B',
        });
      }
    }
    
    return elements;
  }

  static generateQuestion(type: 'addition' | 'subtraction' | 'multiplication' | 'division', difficulty: Difficulty): Question {
    switch (type) {
      case 'addition':
        return this.generateAddition(difficulty);
      case 'subtraction':
        return this.generateSubtraction(difficulty);
      case 'multiplication':
        return this.generateMultiplication(difficulty);
      case 'division':
        return this.generateDivision(difficulty);
    }
  }
}