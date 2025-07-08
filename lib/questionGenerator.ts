import { Question, Difficulty } from '@/types';

export class QuestionGenerator {
  private static generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  static generateAddition(difficulty: Difficulty, config?: any): Question {
    let num1: number, num2: number;
    
    // 使用配置的范围或默认值
    const minNum = config?.minNum;
    const maxNum = config?.maxNum;
    
    if (minNum !== undefined && maxNum !== undefined) {
      num1 = Math.floor(Math.random() * (maxNum - minNum)) + minNum;
      num2 = Math.floor(Math.random() * (maxNum - minNum)) + minNum;
    } else {
      switch (difficulty) {
        case 'EASY':
          // 基础加法：1-20
          num1 = Math.floor(Math.random() * 10) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
          break;
        case 'MEDIUM':
          // 中等加法：20-100
          num1 = Math.floor(Math.random() * 40) + 20;
          num2 = Math.floor(Math.random() * 40) + 20;
          break;
        case 'HARD':
          // 困难加法：50-200
          num1 = Math.floor(Math.random() * 100) + 50;
          num2 = Math.floor(Math.random() * 100) + 50;
          break;
        case 'EXPERT':
          // 专家加法：100-999（三位数加法）
          num1 = Math.floor(Math.random() * 900) + 100;
          num2 = Math.floor(Math.random() * 900) + 100;
          break;
      }
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

  static generateSubtraction(difficulty: Difficulty, config?: any): Question {
    let num1: number, num2: number;
    
    // 使用配置的范围或默认值
    const minNum = config?.minNum;
    const maxNum = config?.maxNum;
    
    if (minNum !== undefined && maxNum !== undefined) {
      num1 = Math.floor(Math.random() * (maxNum - minNum)) + minNum;
      num2 = Math.floor(Math.random() * (num1 - minNum)) + minNum;
      // 确保结果为正
      if (num2 >= num1) {
        [num1, num2] = [num2, num1];
      }
    } else {
      switch (difficulty) {
        case 'EASY':
          // 基础减法：20以内，结果为正
          num1 = Math.floor(Math.random() * 15) + 5;
          num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
          break;
        case 'MEDIUM':
          // 中等减法：100以内
          num1 = Math.floor(Math.random() * 60) + 40;
          num2 = Math.floor(Math.random() * (num1 - 10)) + 1;
          break;
        case 'HARD':
          // 困难减法：200以内，可能需要借位
          num1 = Math.floor(Math.random() * 100) + 100;
          num2 = Math.floor(Math.random() * 80) + 20;
          break;
        case 'EXPERT':
          // 专家减法：1000以内，多次借位
          num1 = Math.floor(Math.random() * 700) + 300;
          num2 = Math.floor(Math.random() * 200) + 100;
          break;
      }
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

  static generateMultiplication(difficulty: Difficulty, config?: any): Question {
    let num1: number, num2: number;
    
    // 使用配置的范围或默认值
    const minNum = config?.minNum;
    const maxNum = config?.maxNum;
    
    if (minNum !== undefined && maxNum !== undefined) {
      // 如果指定了范围，使用较小的数字避免结果过大
      const range = Math.min(maxNum - minNum, 20);
      num1 = Math.floor(Math.random() * range) + minNum;
      num2 = Math.floor(Math.random() * Math.min(10, range)) + 1;
    } else {
      switch (difficulty) {
        case 'EASY':
          // 乘法表基础：1-5
          num1 = Math.floor(Math.random() * 5) + 1;
          num2 = Math.floor(Math.random() * 5) + 1;
          break;
        case 'MEDIUM':
          // 乘法表进阶：2-10
          num1 = Math.floor(Math.random() * 9) + 2;
          num2 = Math.floor(Math.random() * 9) + 2;
          break;
        case 'HARD':
          // 两位数乘一位数：10-20 × 2-9
          num1 = Math.floor(Math.random() * 11) + 10;
          num2 = Math.floor(Math.random() * 8) + 2;
          break;
        case 'EXPERT':
          // 两位数乘两位数：10-50 × 10-20
          num1 = Math.floor(Math.random() * 41) + 10;
          num2 = Math.floor(Math.random() * 11) + 10;
          break;
      }
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

  static generateDivision(difficulty: Difficulty, config?: any): Question {
    let num1: number, num2: number, answer: number;
    
    switch (difficulty) {
      case 'EASY':
        // 除法表基础：结果1-10，除数1-5
        answer = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 5) + 1;
        num1 = answer * num2;
        break;
      case 'MEDIUM':
        // 除法表进阶：结果1-20，除数2-10
        answer = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 9) + 2;
        num1 = answer * num2;
        break;
      case 'HARD':
        // 两位数除法：结果10-50，除数2-10
        answer = Math.floor(Math.random() * 41) + 10;
        num2 = Math.floor(Math.random() * 9) + 2;
        num1 = answer * num2;
        break;
      case 'EXPERT':
        // 三位数除法：结果10-99，除数2-20
        answer = Math.floor(Math.random() * 90) + 10;
        num2 = Math.floor(Math.random() * 19) + 2;
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