import { Question, Difficulty } from '@/types';

export class LogicGenerator {
  private static generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // 逻辑推理题
  static generateLogicPuzzle(difficulty: Difficulty): Question {
    switch (difficulty) {
      case 'EASY':
        return this.generateSimpleComparison();
      case 'MEDIUM':
        return this.generateClassification();
      case 'HARD':
        return this.generateMultiCondition();
      case 'EXPERT':
        return this.generateComplexLogic();
    }
  }

  // 简单比较推理
  private static generateSimpleComparison(): Question {
    const names = ['小明', '小红', '小李'];
    const attributes = ['高', '矮', '重', '轻', '快', '慢'];
    const attribute = attributes[Math.floor(Math.random() * attributes.length / 2) * 2];
    const opposite = attributes[attributes.indexOf(attribute) + 1];
    
    const order = [...names].sort(() => Math.random() - 0.5);
    
    const question = `${order[0]}比${order[1]}${attribute}，${order[1]}比${order[2]}${attribute}，谁最${attribute}？`;
    const answer = order[0];
    
    return {
      id: this.generateId(),
      type: 'logic',
      difficulty: 'EASY',
      question,
      answer,
      options: names.sort(() => Math.random() - 0.5),
      category: 'logic',
      hint: '按顺序排列他们的关系'
    };
  }

  // 分类题
  private static generateClassification(): Question {
    const categories = [
      {
        name: '水果',
        items: ['苹果', '香蕉', '橙子', '葡萄', '西瓜'],
        notItems: ['胡萝卜', '土豆', '西红柿', '黄瓜']
      },
      {
        name: '动物',
        items: ['狗', '猫', '兔子', '老虎', '大象'],
        notItems: ['玫瑰', '汽车', '飞机', '桌子']
      },
      {
        name: '交通工具',
        items: ['汽车', '火车', '飞机', '自行车', '船'],
        notItems: ['房子', '树', '电脑', '书']
      }
    ];
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    const correctItems = category.items.slice(0, 3);
    const wrongItem = category.notItems[Math.floor(Math.random() * category.notItems.length)];
    
    const allItems = [...correctItems, wrongItem].sort(() => Math.random() - 0.5);
    
    return {
      id: this.generateId(),
      type: 'logic',
      difficulty: 'MEDIUM',
      question: `下面哪个不是${category.name}？${allItems.join('、')}`,
      answer: wrongItem,
      options: allItems,
      category: 'logic'
    };
  }

  // 多条件推理
  private static generateMultiCondition(): Question {
    const colors = ['红色', '蓝色', '黄色', '绿色'];
    const items = ['帽子', '衣服', '鞋子', '书包'];
    const names = ['小明', '小红', '小李', '小王'];
    
    // 随机分配
    const assignments: {[key: string]: {color: string, item: string}} = {};
    const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    
    names.forEach((name, index) => {
      assignments[name] = {
        color: shuffledColors[index],
        item: shuffledItems[index]
      };
    });
    
    // 生成条件
    const conditions: string[] = [];
    const usedNames = names.slice(0, 3);
    
    conditions.push(`${usedNames[0]}有${assignments[usedNames[0]].color}的${assignments[usedNames[0]].item}`);
    conditions.push(`${usedNames[1]}的${assignments[usedNames[1]].item}不是${colors.find(c => c !== assignments[usedNames[1]].color)}`);
    conditions.push(`${usedNames[2]}没有${items.find(i => i !== assignments[usedNames[2]].item)}`);
    
    const question = `${conditions.join('，')}。请问${names[3]}有什么？`;
    const answer = `${assignments[names[3]].color}的${assignments[names[3]].item}`;
    
    // 生成选项
    const options = [answer];
    for (let i = 0; i < 3; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const option = `${randomColor}的${randomItem}`;
      if (!options.includes(option)) {
        options.push(option);
      }
    }
    
    return {
      id: this.generateId(),
      type: 'logic',
      difficulty: 'HARD',
      question,
      answer,
      options: options.slice(0, 4).sort(() => Math.random() - 0.5),
      category: 'logic'
    };
  }

  // 复杂逻辑题
  private static generateComplexLogic(): Question {
    const puzzleTypes = [
      this.generateTruthLiarPuzzle,
      this.generateSequencePuzzle,
      this.generateRelationshipPuzzle
    ];
    
    return puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)]();
  }

  // 真话假话题
  private static generateTruthLiarPuzzle(): Question {
    const scenarios = [
      {
        question: '有三个人，A说："B在说谎"，B说："C在说谎"，C说："A和B都在说谎"。如果只有一个人说真话，谁说了真话？',
        answer: 'B',
        options: ['A', 'B', 'C', '无法确定']
      },
      {
        question: '甲说："我没拿"，乙说："丙拿了"，丙说："乙在说谎"。如果只有一个人说真话，谁拿了东西？',
        answer: '甲',
        options: ['甲', '乙', '丙', '都没拿']
      }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    return {
      id: this.generateId(),
      type: 'logic',
      difficulty: 'EXPERT',
      question: scenario.question,
      answer: scenario.answer,
      options: scenario.options,
      category: 'logic'
    };
  }

  // 序列谜题
  private static generateSequencePuzzle(): Question {
    return {
      id: this.generateId(),
      type: 'logic',
      difficulty: 'EXPERT',
      question: '一个密码锁有4位数字。已知：第一位比第三位大2，第二位是第四位的2倍，所有数字之和是16，第三位是偶数。密码是什么？',
      answer: '6428',
      options: ['6428', '7319', '5437', '8246'],
      category: 'logic',
      explanation: '设四位数为ABCD。A=C+2，B=2D，A+B+C+D=16，C是偶数。解得：C=4，A=6，D=2，B=4。'
    };
  }

  // 关系谜题
  private static generateRelationshipPuzzle(): Question {
    return {
      id: this.generateId(),
      type: 'logic',
      difficulty: 'EXPERT',
      question: '在一个家庭聚会上，小明对小红说："你爸爸是我爸爸的儿子，但我不是你的兄弟。"小明和小红是什么关系？',
      answer: '小明是小红的姑姑/阿姨',
      options: ['小明是小红的姑姑/阿姨', '小明是小红的叔叔', '小明是小红的表哥', '小明是小红的爷爷'],
      category: 'logic'
    };
  }
}