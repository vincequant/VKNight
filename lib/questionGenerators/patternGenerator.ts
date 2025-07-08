import { Question, Difficulty } from '@/types';

export class PatternGenerator {
  private static generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // 找规律填数
  static generateNumberPattern(difficulty: Difficulty): Question {
    let pattern: number[] = [];
    let missingIndex: number;
    let answer: number;
    
    switch (difficulty) {
      case 'EASY':
        // 简单递增模式 (+1, +2)
        const step1 = Math.random() > 0.5 ? 1 : 2;
        const start1 = Math.floor(Math.random() * 5) + 1;
        pattern = Array.from({length: 5}, (_, i) => start1 + i * step1);
        break;
        
      case 'MEDIUM':
        // 中等递增模式 (+3, +5, 或简单乘法)
        if (Math.random() > 0.5) {
          const step2 = [3, 4, 5][Math.floor(Math.random() * 3)];
          const start2 = Math.floor(Math.random() * 10) + 1;
          pattern = Array.from({length: 5}, (_, i) => start2 + i * step2);
        } else {
          // 乘2模式
          const start2 = Math.floor(Math.random() * 3) + 1;
          pattern = Array.from({length: 5}, (_, i) => start2 * Math.pow(2, i));
        }
        break;
        
      case 'HARD':
        // 复杂模式：斐波那契简化版或平方数
        if (Math.random() > 0.5) {
          // 斐波那契
          pattern = [1, 1, 2, 3, 5, 8];
          pattern = pattern.slice(0, 5);
        } else {
          // 平方数
          pattern = Array.from({length: 5}, (_, i) => (i + 1) * (i + 1));
        }
        break;
        
      case 'EXPERT':
        // 专家模式：二次差或复合规律
        const type = Math.floor(Math.random() * 3);
        if (type === 0) {
          // 二次差数列：1, 3, 6, 10, 15 (差为1,2,3,4,5)
          pattern = [];
          let sum = 0;
          for (let i = 1; i <= 5; i++) {
            sum += i;
            pattern.push(sum);
          }
        } else if (type === 1) {
          // 交替规律
          pattern = [2, 5, 4, 9, 6, 13]; // +3, -1, +5, -3, +7
          pattern = pattern.slice(0, 5);
        } else {
          // 乘加混合
          pattern = [1, 3, 7, 15, 31]; // ×2+1
        }
        break;
    }
    
    // 随机选择要隐藏的位置
    missingIndex = Math.floor(Math.random() * (pattern.length - 1)) + 1; // 不隐藏第一个
    answer = pattern[missingIndex];
    
    // 创建显示的模式（用_代替缺失的数字）
    const displayPattern = [...pattern];
    displayPattern[missingIndex] = -999; // 用特殊值标记
    
    const questionText = displayPattern.map(n => n === -999 ? '_' : n).join(', ');
    
    // 生成选项
    const options = this.generateOptions(answer, difficulty);
    
    return {
      id: this.generateId(),
      type: 'pattern',
      difficulty,
      question: `找规律填数：${questionText}`,
      answer,
      options,
      category: 'pattern',
      hint: difficulty === 'EASY' ? '观察相邻数字之间的差值' : undefined
    };
  }

  // 图形规律
  static generateShapePattern(difficulty: Difficulty): Question {
    const shapes = ['○', '△', '□', '◇', '☆', '♡'];
    let pattern: string[] = [];
    let answer: string;
    
    switch (difficulty) {
      case 'EASY':
        // 简单重复模式 AB或ABC
        const basePattern1 = shapes.slice(0, 2);
        pattern = [];
        for (let i = 0; i < 6; i++) {
          pattern.push(basePattern1[i % 2]);
        }
        break;
        
      case 'MEDIUM':
        // ABC或ABCD模式
        const basePattern2 = shapes.slice(0, 3);
        pattern = [];
        for (let i = 0; i < 6; i++) {
          pattern.push(basePattern2[i % 3]);
        }
        break;
        
      case 'HARD':
        // ABBA或ABCBA模式
        pattern = ['○', '△', '△', '○', '○', '△'];
        break;
        
      case 'EXPERT':
        // 复杂递增模式
        pattern = ['○', '○△', '○△□', '○△□◇'];
        break;
    }
    
    // 对于EXPERT难度，特殊处理
    if (difficulty === 'EXPERT') {
      answer = pattern[3];
      pattern[3] = '?';
      
      return {
        id: this.generateId(),
        type: 'pattern',
        difficulty,
        question: `找规律：${pattern.join(' → ')}`,
        answer,
        options: [
          '○△□◇',
          '○△□□',
          '○△△□',
          '△□◇☆'
        ],
        category: 'pattern'
      };
    }
    
    // 其他难度：隐藏最后一个
    answer = pattern[pattern.length - 1];
    const displayPattern = pattern.slice(0, -1).join(' ');
    
    const wrongShapes = shapes.filter(s => s !== answer);
    const options = [answer];
    while (options.length < 4) {
      const wrongShape = wrongShapes[Math.floor(Math.random() * wrongShapes.length)];
      if (!options.includes(wrongShape)) {
        options.push(wrongShape);
      }
    }
    
    // 打乱选项
    options.sort(() => Math.random() - 0.5);
    
    return {
      id: this.generateId(),
      type: 'pattern',
      difficulty,
      question: `接下来是什么图形？${displayPattern} _`,
      answer,
      options,
      category: 'pattern',
      visualElements: pattern.slice(0, -1).map(shape => ({
        type: 'shape' as const,
        content: shape
      }))
    };
  }

  private static generateOptions(correctAnswer: number, difficulty: Difficulty): number[] {
    const options = [correctAnswer];
    const range = difficulty === 'EASY' ? 5 : 
                  difficulty === 'MEDIUM' ? 10 : 
                  difficulty === 'HARD' ? 20 : 30;
    
    while (options.length < 4) {
      let option: number;
      if (Math.random() > 0.5) {
        // 接近正确答案的选项
        option = correctAnswer + Math.floor(Math.random() * range) - Math.floor(range / 2);
      } else {
        // 可能的错误模式
        const errorType = Math.floor(Math.random() * 3);
        if (errorType === 0) {
          option = correctAnswer + 1; // 差1错误
        } else if (errorType === 1) {
          option = correctAnswer - 1; // 差1错误
        } else {
          option = correctAnswer * 2; // 翻倍错误
        }
      }
      
      if (option > 0 && !options.includes(option)) {
        options.push(option);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  }
}