export type LearningPath = {
  slug: string;
  name: string;
  description: string;
  steps: { label: string; href: string; note: string }[];
};

export const learningPaths: LearningPath[] = [
  {
    slug: "human-systems",
    name: "人体系统入门",
    description: "从器官系统开始，逐步进入细胞和神经电活动。",
    steps: [
      { label: "人体系统总览", href: "/atlas/human", note: "先建立循环、呼吸、神经、内分泌与免疫的整体地图。" },
      { label: "神经系统", href: "/atlas/human/nervous", note: "理解信息如何在人体中快速传递。" },
      { label: "细胞膜与运输", href: "/atlas/cell/membrane", note: "进入神经电活动背后的膜与离子层级。" },
      { label: "神经元实验", href: "/#lab", note: "改变通道状态和刺激强度，观察动作电位。" },
    ],
  },
  {
    slug: "gene-to-protein",
    name: "从 DNA 到蛋白质",
    description: "沿着遗传信息流，从 DNA 进入基因表达与蛋白质功能。",
    steps: [
      { label: "DNA 与染色体", href: "/atlas/genetics/dna", note: "理解遗传信息如何储存。" },
      { label: "基因表达", href: "/atlas/genetics/gene-expression", note: "学习转录与翻译。" },
      { label: "核糖体与细胞器", href: "/atlas/cell/organelles", note: "把分子过程放回细胞空间中。" },
      { label: "酶与催化", href: "/atlas/biochemistry/enzymes", note: "理解蛋白质如何成为生命反应的执行者。" },
    ],
  },
  {
    slug: "energy-of-life",
    name: "生命的能量",
    description: "比较动物细胞的呼吸作用与植物的光合作用。",
    steps: [
      { label: "细胞器", href: "/atlas/cell/organelles", note: "先认识线粒体和叶绿体所在的细胞背景。" },
      { label: "细胞呼吸", href: "/atlas/biochemistry/respiration", note: "理解 ATP 如何被生产。" },
      { label: "光合作用", href: "/atlas/biochemistry/photosynthesis", note: "理解光能如何转化成化学能。" },
      { label: "植物运输", href: "/atlas/plants/transport", note: "把能量与水、矿物质和糖的运输联系起来。" },
    ],
  },
  {
    slug: "evolution-ecology",
    name: "从进化到生态",
    description: "从种群中的遗传变化一路看到群落与生态系统。",
    steps: [
      { label: "自然选择", href: "/atlas/evolution/natural-selection", note: "理解适应性变化的核心机制。" },
      { label: "遗传漂变", href: "/atlas/evolution/drift", note: "看到随机性在进化中的作用。" },
      { label: "物种形成", href: "/atlas/evolution/speciation", note: "理解种群如何逐渐分化。" },
      { label: "食物网", href: "/atlas/ecology/food-webs", note: "把物种放回生态系统的相互作用网络。" },
      { label: "物质循环", href: "/atlas/ecology/cycles", note: "理解生态系统中的碳、氮与水如何循环。" },
    ],
  },
];
