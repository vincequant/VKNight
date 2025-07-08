import { Question, Difficulty } from '@/types';

export class ComparisonGenerator {
  private static generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // 比大小
  static generateComparison(difficulty: Difficulty): Question {
    let num1: number, num2: number;
    let answer: string;
    
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

  // 排序题
  static generateSorting(difficulty: Difficulty): Question {
    let numbers: number[] = [];
    let sortType: 'asc' | 'desc';
    
    switch (difficulty) {
      case 'EASY':
        // 3个一位数排序
        numbers = Array.from({length: 3}, () => Math.floor(Math.random() * 10) + 1);
        sortType = 'asc';
        break;
        
      case 'MEDIUM':
        // 4个两位数排序
        numbers = Array.from({length: 4}, () => Math.floor(Math.random() * 90) + 10);
        sortType = Math.random() > 0.5 ? 'asc' : 'desc';
        break;
        
      case 'HARD':
        // 5个三位数排序
        numbers = Array.from({length: 5}, () => Math.floor(Math.random() * 900) + 100);
        sortType = Math.random() > 0.5 ? 'asc' : 'desc';
        break;
        
      case 'EXPERT':
        // 6个混合数字（包括小数）
        numbers = Array.from({length: 6}, () => {
          if (Math.random() > 0.5) {
            return Math.floor(Math.random() * 1000) + 1;
          } else {
            return Math.round((Math.random() * 100 + 1) * 10) / 10;
          }
        });
        sortType = Math.random() > 0.5 ? 'asc' : 'desc';
        break;
    }
    
    // 确保没有重复
    numbers = [...new Set(numbers)];
    while (numbers.length < (difficulty === 'EASY' ? 3 : difficulty === 'MEDIUM' ? 4 : difficulty === 'HARD' ? 5 : 6)) {
      const newNum = difficulty === 'EASY' ? Math.floor(Math.random() * 10) + 1 :
                     difficulty === 'MEDIUM' ? Math.floor(Math.random() * 90) + 10 :
                     difficulty === 'HARD' ? Math.floor(Math.random() * 900) + 100 :
                     Math.floor(Math.random() * 1000) + 1;
      if (!numbers.includes(newNum)) {
        numbers.push(newNum);
      }
    }
    
    const sortedNumbers = [...numbers].sort((a, b) => sortType === 'asc' ? a - b : b - a);
    const answer = sortedNumbers.join(', ');
    
    // 生成错误选项
    const options = [answer];
    
    // 错误选项1：反向排序
    const reversed = [...sortedNumbers].reverse().join(', ');
    if (reversed !== answer) {
      options.push(reversed);
    }
    
    // 错误选项2：部分正确
    const partial = [...numbers];
    const temp = partial[0];
    partial[0] = partial[1];
    partial[1] = temp;
    options.push(partial.join(', '));
    
    // 错误选项3：随机顺序
    const random = [...numbers].sort(() => Math.random() - 0.5);
    const randomStr = random.join(', ');
    if (!options.includes(randomStr)) {
      options.push(randomStr);
    } else {
      // 如果重复了，交换最后两个
      const temp = random[random.length - 1];
      random[random.length - 1] = random[random.length - 2];
      random[random.length - 2] = temp;
      options.push(random.join(', '));
    }
    
    return {
      id: this.generateId(),
      type: 'comparison',
      difficulty,
      question: `将下列数字${sortType === 'asc' ? '从小到大' : '从大到小'}排序：${numbers.join(', ')}`,
      answer,
      options: options.sort(() => Math.random() - 0.5),
      category: 'logic',
      hint: difficulty === 'EASY' ? '先找出最小的数字' : undefined
    };
  }
}