export type ChallengeQuestion = {
  id: string;
  domain: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const challengeQuestions: ChallengeQuestion[] = [
  {
    id: "human-oxygen",
    domain: "人体生理",
    question: "肺泡与毛细血管之间最主要进行什么交换？",
    options: ["葡萄糖与脂肪", "氧气与二氧化碳", "抗体与病原体", "激素与神经递质"],
    answer: 1,
    explanation: "肺泡是气体交换的主要场所，氧气进入血液，二氧化碳从血液进入肺泡后被呼出。",
  },
  {
    id: "human-neuron",
    domain: "人体生理",
    question: "神经元动作电位的快速上升相主要与哪种离子通透性增加有关？",
    options: ["Na⁺", "K⁺", "CaCO₃", "Cl₂"],
    answer: 0,
    explanation: "经典动作电位上升相主要由电压门控 Na⁺ 通道开放、Na⁺ 内流造成。",
  },
  {
    id: "cell-membrane",
    domain: "细胞生物学",
    question: "细胞膜“选择性通透”的含义更接近哪一种？",
    options: ["所有分子自由通过", "只有水可以通过", "不同物质通过膜的能力不同", "膜永远完全封闭"],
    answer: 2,
    explanation: "脂质双层和膜蛋白让不同物质具有不同的跨膜方式与通透能力。",
  },
  {
    id: "cell-cycle",
    domain: "细胞生物学",
    question: "细胞周期检查点的重要作用是什么？",
    options: ["让细胞永远停止分裂", "帮助确保关键步骤完成后再继续", "产生所有 ATP", "制造细胞壁"],
    answer: 1,
    explanation: "检查点会监控 DNA 状态、复制是否完成以及染色体分离条件等。",
  },
  {
    id: "genetics-cross",
    domain: "遗传与基因",
    question: "Aa × Aa 的子代中，aa 基因型的理论概率是多少？",
    options: ["0%", "25%", "50%", "75%"],
    answer: 1,
    explanation: "两亲本都可产生 A 或 a 配子，组合为 AA、Aa、Aa、aa，因此 aa 占 1/4。",
  },
  {
    id: "genetics-expression",
    domain: "遗传与基因",
    question: "蛋白质合成过程中，核糖体直接参与哪个步骤？",
    options: ["DNA 复制", "翻译", "有丝分裂", "脂质双层形成"],
    answer: 1,
    explanation: "核糖体读取 mRNA 上的遗传信息，并协助连接氨基酸形成多肽。",
  },
  {
    id: "biochem-enzyme",
    domain: "生物化学与代谢",
    question: "酶通常通过什么方式加快反应？",
    options: ["增加反应物总能量", "降低活化能", "永久改变平衡常数", "把所有底物变成 ATP"],
    answer: 1,
    explanation: "酶提供更低活化能的反应路径，从而提高反应速率。",
  },
  {
    id: "biochem-atp",
    domain: "生物化学与代谢",
    question: "细胞呼吸中大量 ATP 生成与哪一过程密切相关？",
    options: ["氧化磷酸化", "DNA 转录", "细胞吞噬", "染色体凝缩"],
    answer: 0,
    explanation: "电子传递链建立质子梯度，ATP 合酶利用该梯度合成 ATP。",
  },
  {
    id: "microbe-virus",
    domain: "微生物世界",
    question: "病毒与多数细胞生物相比，一个重要特点是什么？",
    options: ["能够完全独立完成复制", "必须利用宿主细胞完成复制", "一定具有细胞核", "一定能用普通培养基独立培养"],
    answer: 1,
    explanation: "病毒缺乏完整的独立复制与代谢系统，需要依赖宿主细胞。",
  },
  {
    id: "plant-stomata",
    domain: "植物科学",
    question: "气孔关闭通常会直接降低哪一种过程？",
    options: ["二氧化碳进入叶片", "DNA 复制", "根细胞分裂", "种子遗传变异"],
    answer: 0,
    explanation: "气孔关闭减少气体交换，可降低水分散失，但也限制 CO₂ 进入。",
  },
  {
    id: "evolution-selection",
    domain: "进化生物学",
    question: "自然选择直接作用于什么？",
    options: ["个体表现出的可遗传差异", "物种的主观需求", "未来才会出现的突变", "环境的目标"],
    answer: 0,
    explanation: "选择通过个体间生存与繁殖差异，改变可遗传变异在种群中的频率。",
  },
  {
    id: "ecology-energy",
    domain: "生态与环境",
    question: "为什么能量在食物链中通常逐级减少？",
    options: ["能量被完全循环利用", "生物活动和代谢会以热等形式散失能量", "消费者不需要能量", "生产者不含能量"],
    answer: 1,
    explanation: "能量流动并非完全循环，生命活动会把大量能量转化并以热等形式散失。",
  },
];
