export type BiologySubtopic = {
  slug: string;
  name: string;
  en: string;
  summary: string;
  keyPoints: string[];
  whatIf: string;
  evidence: string;
};

export type BiologyDomain = {
  slug: string;
  name: string;
  en: string;
  emoji: string;
  tagline: string;
  description: string;
  accent: string;
  subtopics: BiologySubtopic[];
};

export const biologyDomains: BiologyDomain[] = [
  {
    slug: "human",
    name: "人体生理",
    en: "Human Physiology",
    emoji: "🫀",
    tagline: "系统如何协同，让一个人保持生命活动",
    description: "从循环、呼吸、神经、内分泌、免疫到消化与泌尿，理解人体内部的分工与协作。",
    accent: "rose",
    subtopics: [
      {
        slug: "circulation",
        name: "循环系统",
        en: "Circulatory System",
        summary: "心脏、血管和血液共同完成物质运输，把氧气、营养、激素送往全身。",
        keyPoints: ["心脏泵血", "动脉与静脉", "毛细血管交换", "血压与血流"],
        whatIf: "如果心输出量显著下降，组织首先会面临氧和营养供应不足。",
        evidence: "血压测量、心电图、超声心动图和血流成像让循环过程可以被观察与量化。",
      },
      {
        slug: "respiration",
        name: "呼吸系统",
        en: "Respiratory System",
        summary: "空气经气道进入肺，肺泡完成氧气和二氧化碳交换。",
        keyPoints: ["通气", "肺泡", "气体交换", "血红蛋白"],
        whatIf: "如果肺泡交换面积下降，即使正常呼吸，血液获得氧气的效率也会降低。",
        evidence: "肺功能检查、血气分析和显微结构观察共同揭示了肺的工作方式。",
      },
      {
        slug: "nervous",
        name: "神经系统",
        en: "Nervous System",
        summary: "神经系统接收刺激、处理信息并快速控制行为与器官活动。",
        keyPoints: ["大脑", "脊髓", "神经元", "突触", "动作电位"],
        whatIf: "如果电压门控 Na⁺ 通道失去功能，神经元难以形成正常的快速动作电位。",
        evidence: "电生理记录、脑成像和神经解剖让信息传递过程逐步变得可测量。",
      },
      {
        slug: "endocrine",
        name: "内分泌系统",
        en: "Endocrine System",
        summary: "内分泌腺通过激素进行全身性调节，影响代谢、生长、应激和生殖。",
        keyPoints: ["激素", "垂体", "甲状腺", "肾上腺", "反馈调节"],
        whatIf: "如果负反馈失灵，某些激素水平可能持续偏高或偏低，影响稳态。",
        evidence: "激素测定、受体实验和反馈干预实验帮助建立内分泌调节模型。",
      },
      {
        slug: "immunity",
        name: "免疫系统",
        en: "Immune System",
        summary: "先天免疫快速应答，适应性免疫通过 T、B 细胞产生更有针对性的反应与记忆。",
        keyPoints: ["巨噬细胞", "T 细胞", "B 细胞", "抗体", "免疫记忆"],
        whatIf: "如果免疫系统过弱会增加感染风险，过强或错误识别则可能伤害自身组织。",
        evidence: "细胞培养、流式细胞术、抗体检测和感染模型构成现代免疫学的重要证据来源。",
      },
      {
        slug: "digestion",
        name: "消化系统",
        en: "Digestive System",
        summary: "消化道和附属器官把食物分解成小分子并吸收入体内。",
        keyPoints: ["胃", "小肠", "肝脏", "胰腺", "肠道微生物"],
        whatIf: "如果小肠绒毛表面积减少，营养吸收效率会下降。",
        evidence: "内镜、组织切片、示踪实验和代谢检测帮助理解消化与吸收。",
      },
    ],
  },
  {
    slug: "cell",
    name: "细胞生物学",
    en: "Cell Biology",
    emoji: "🔬",
    tagline: "生命最基本的结构与功能单位",
    description: "进入细胞膜、细胞器、细胞骨架与细胞周期，理解细胞如何维持自身、沟通和分裂。",
    accent: "teal",
    subtopics: [
      {
        slug: "membrane",
        name: "细胞膜与运输",
        en: "Membranes & Transport",
        summary: "脂质双层和膜蛋白共同控制物质进出，并参与信号接收。",
        keyPoints: ["脂质双层", "扩散", "主动运输", "通道", "受体"],
        whatIf: "如果膜失去选择性通透性，离子梯度和细胞稳态会迅速崩溃。",
        evidence: "膜片钳、荧光标记和人工膜实验揭示了膜蛋白的功能。",
      },
      {
        slug: "organelles",
        name: "细胞器",
        en: "Organelles",
        summary: "细胞核、内质网、高尔基体、溶酶体和线粒体承担不同的细胞任务。",
        keyPoints: ["细胞核", "内质网", "高尔基体", "溶酶体", "线粒体"],
        whatIf: "如果蛋白质运输系统失灵，许多蛋白无法抵达正确位置。",
        evidence: "电子显微镜、细胞分级和荧光蛋白让细胞器动态可被直接观察。",
      },
      {
        slug: "cytoskeleton",
        name: "细胞骨架",
        en: "Cytoskeleton",
        summary: "微管、微丝和中间丝维持形态，并参与运输、运动与分裂。",
        keyPoints: ["微管", "肌动蛋白", "马达蛋白", "细胞运动"],
        whatIf: "如果微管动态被完全抑制，细胞分裂和胞内运输都会受到影响。",
        evidence: "活细胞成像与药理干预展示了细胞骨架不断重组的特性。",
      },
      {
        slug: "cell-cycle",
        name: "细胞周期",
        en: "Cell Cycle",
        summary: "细胞周期通过检查点确保 DNA 复制和染色体分离按顺序进行。",
        keyPoints: ["G1", "S 期", "G2", "有丝分裂", "检查点"],
        whatIf: "如果细胞周期检查点失效，带有损伤的细胞可能继续分裂。",
        evidence: "同步培养、遗传筛选与蛋白活性测定建立了周期调控网络。",
      },
    ],
  },
  {
    slug: "genetics",
    name: "遗传与基因",
    en: "Genetics & Genomics",
    emoji: "🧬",
    tagline: "信息如何被储存、复制、表达和遗传",
    description: "从 DNA、基因表达、孟德尔遗传到基因组与变异，理解生命信息的连续性与多样性。",
    accent: "violet",
    subtopics: [
      {
        slug: "dna",
        name: "DNA 与染色体",
        en: "DNA & Chromosomes",
        summary: "DNA 以碱基序列储存遗传信息，并被组织在染色体中。",
        keyPoints: ["双螺旋", "碱基配对", "复制", "染色质"],
        whatIf: "如果复制校对能力下降，突变积累速度通常会增加。",
        evidence: "X 射线衍射、生化实验和测序技术共同建立了 DNA 结构与功能模型。",
      },
      {
        slug: "gene-expression",
        name: "基因表达",
        en: "Gene Expression",
        summary: "遗传信息通过转录和翻译转化为功能性 RNA 与蛋白质。",
        keyPoints: ["转录", "RNA", "翻译", "核糖体", "调控"],
        whatIf: "如果某个基因的启动子无法被正确识别，该基因的转录水平会降低。",
        evidence: "RNA 测序、报告基因和核糖体研究揭示了表达调控。",
      },
      {
        slug: "mendel",
        name: "孟德尔遗传",
        en: "Mendelian Genetics",
        summary: "等位基因在配子形成和受精过程中按概率组合，形成可预测的遗传比例。",
        keyPoints: ["等位基因", "显性与隐性", "分离定律", "独立分配"],
        whatIf: "如果两个杂合个体 Aa × Aa，子代基因型并不是平均分成两类，而是 1:2:1。",
        evidence: "孟德尔的豌豆杂交实验奠定了经典遗传学的定量基础。",
      },
      {
        slug: "genomics",
        name: "基因组与变异",
        en: "Genomics & Variation",
        summary: "基因组层面的变异塑造个体差异，也是进化与疾病研究的重要基础。",
        keyPoints: ["SNP", "结构变异", "测序", "基因组比较"],
        whatIf: "同一个变异在不同遗传背景和环境中，影响可能并不相同。",
        evidence: "大规模测序与群体研究可以连接变异、表型和进化历史。",
      },
    ],
  },
  {
    slug: "biochemistry",
    name: "生物化学与代谢",
    en: "Biochemistry & Metabolism",
    emoji: "⚗️",
    tagline: "分子反应如何为生命提供能量与材料",
    description: "理解酶、ATP、细胞呼吸、光合作用和代谢网络，让分子层面的生命过程连成系统。",
    accent: "amber",
    subtopics: [
      {
        slug: "enzymes",
        name: "酶与催化",
        en: "Enzymes",
        summary: "酶降低反应所需的活化能，并通过结构与环境响应调控反应速率。",
        keyPoints: ["活性位点", "底物", "温度", "pH", "抑制剂"],
        whatIf: "温度过高可能破坏酶的三维结构，使催化活性下降。",
        evidence: "动力学曲线、结构生物学与突变实验用于分析酶的工作机制。",
      },
      {
        slug: "respiration",
        name: "细胞呼吸",
        en: "Cellular Respiration",
        summary: "细胞通过糖酵解、三羧酸循环和氧化磷酸化获取 ATP。",
        keyPoints: ["糖酵解", "TCA", "电子传递链", "ATP"],
        whatIf: "如果电子传递链受阻，氧化磷酸化产生 ATP 的能力会显著下降。",
        evidence: "氧耗测定、线粒体分离和同位素示踪建立了代谢路径。",
      },
      {
        slug: "photosynthesis",
        name: "光合作用",
        en: "Photosynthesis",
        summary: "植物和藻类将光能转化为化学能，并固定二氧化碳。",
        keyPoints: ["叶绿体", "光反应", "ATP/NADPH", "卡尔文循环"],
        whatIf: "如果缺乏有效光照，光反应供给的能量和还原力会减少。",
        evidence: "气体交换、色素光谱和同位素示踪揭示了光合作用的步骤。",
      },
      {
        slug: "metabolic-networks",
        name: "代谢网络",
        en: "Metabolic Networks",
        summary: "代谢不是孤立反应，而是由大量相互连接和反馈调节的通路组成。",
        keyPoints: ["分解代谢", "合成代谢", "反馈抑制", "代谢流"],
        whatIf: "一个关键酶被抑制后，代谢物可能在上游积累并迫使细胞改走其他路径。",
        evidence: "代谢组学和同位素示踪可以估计代谢物浓度与通量。",
      },
    ],
  },
  {
    slug: "microbiology",
    name: "微生物世界",
    en: "Microbiology",
    emoji: "🦠",
    tagline: "看不见的生命如何影响环境、健康与进化",
    description: "认识细菌、古菌、病毒与微生物群落，理解感染、共生和微生物生态。",
    accent: "cyan",
    subtopics: [
      {
        slug: "bacteria",
        name: "细菌",
        en: "Bacteria",
        summary: "细菌是结构相对简单但代谢能力极其多样的原核生物。",
        keyPoints: ["细胞壁", "二分裂", "代谢多样性", "水平基因转移"],
        whatIf: "抗生素会形成选择压力，使耐药变异在群体中更容易保留下来。",
        evidence: "培养、显微镜、基因测序和抗菌敏感性实验用于研究细菌。",
      },
      {
        slug: "viruses",
        name: "病毒",
        en: "Viruses",
        summary: "病毒依赖宿主细胞完成复制，其遗传物质可以是 DNA 或 RNA。",
        keyPoints: ["衣壳", "宿主", "复制", "突变", "免疫"],
        whatIf: "病毒进入细胞并不一定立即导致细胞死亡，不同病毒具有不同复制策略。",
        evidence: "细胞培养、电子显微镜、PCR 和测序是病毒学的重要工具。",
      },
      {
        slug: "microbiome",
        name: "微生物组",
        en: "Microbiome",
        summary: "人体和环境中的微生物群落与代谢、免疫和生态过程相互作用。",
        keyPoints: ["菌群", "共生", "16S", "宏基因组"],
        whatIf: "菌群改变不必然等同于疾病原因，需要实验和纵向研究区分相关与因果。",
        evidence: "宏基因组测序、无菌动物与代谢研究帮助解析微生物群落功能。",
      },
    ],
  },
  {
    slug: "plants",
    name: "植物科学",
    en: "Plant Biology",
    emoji: "🌿",
    tagline: "从根到叶，理解植物如何感知和利用环境",
    description: "探索植物结构、运输、激素、光合作用和生长发育。",
    accent: "green",
    subtopics: [
      {
        slug: "transport",
        name: "植物运输",
        en: "Plant Transport",
        summary: "木质部运输水和矿物质，韧皮部运输糖等有机物。",
        keyPoints: ["木质部", "韧皮部", "蒸腾", "气孔"],
        whatIf: "如果气孔长期完全关闭，植物虽然减少失水，但二氧化碳进入也会受限。",
        evidence: "染料示踪、压力测量和气体交换实验用于研究植物运输。",
      },
      {
        slug: "hormones",
        name: "植物激素",
        en: "Plant Hormones",
        summary: "生长素、赤霉素、脱落酸等信号共同调节生长和环境响应。",
        keyPoints: ["生长素", "赤霉素", "脱落酸", "乙烯"],
        whatIf: "激素作用通常依赖浓度、组织和发育阶段，并非单一开关。",
        evidence: "突变体、外源激素处理和报告基因揭示了信号通路。",
      },
      {
        slug: "development",
        name: "植物生长发育",
        en: "Plant Development",
        summary: "分生组织持续产生新器官，使植物在整个生命周期中保持可塑性。",
        keyPoints: ["分生组织", "根", "叶", "花", "向性"],
        whatIf: "如果顶端优势被解除，侧芽往往更容易生长。",
        evidence: "切除、激素处理和遗传学实验帮助解释植物形态形成。",
      },
    ],
  },
  {
    slug: "evolution",
    name: "进化生物学",
    en: "Evolution",
    emoji: "🦋",
    tagline: "生命为何如此多样，又为何彼此相连",
    description: "从自然选择、遗传漂变、物种形成到生命树，理解种群如何随时间改变。",
    accent: "indigo",
    subtopics: [
      {
        slug: "natural-selection",
        name: "自然选择",
        en: "Natural Selection",
        summary: "可遗传差异与繁殖成功差异会改变种群中性状和等位基因的频率。",
        keyPoints: ["变异", "适应度", "选择压力", "遗传"],
        whatIf: "个体不会因为“需要”某种性状而主动进化，选择作用在已有可遗传变异上。",
        evidence: "野外长期研究、实验进化和基因组数据可以测量选择效应。",
      },
      {
        slug: "drift",
        name: "遗传漂变",
        en: "Genetic Drift",
        summary: "有限种群中，等位基因频率会因随机抽样而波动。",
        keyPoints: ["随机性", "瓶颈", "奠基者效应", "有效种群大小"],
        whatIf: "在很小的种群里，即使某个等位基因没有适应优势，也可能偶然变得常见。",
        evidence: "群体遗传模型与自然种群数据用于估计漂变影响。",
      },
      {
        slug: "speciation",
        name: "物种形成",
        en: "Speciation",
        summary: "当基因交流长期受限，种群可能逐渐形成生殖隔离。",
        keyPoints: ["隔离", "基因流", "生殖隔离", "分化"],
        whatIf: "地理隔离并不保证一定形成新物种，它只是减少基因交流的一种方式。",
        evidence: "比较基因组、杂交实验和地理分布提供物种形成证据。",
      },
    ],
  },
  {
    slug: "ecology",
    name: "生态与环境",
    en: "Ecology",
    emoji: "🌍",
    tagline: "个体、种群、群落和环境如何组成生态系统",
    description: "从食物网、能量流动、种群动态到生态系统循环，理解生命与环境的联系。",
    accent: "earth",
    subtopics: [
      {
        slug: "food-webs",
        name: "食物网与能量流动",
        en: "Food Webs",
        summary: "生态系统中的能量从生产者传向消费者，并在不同营养级间逐级减少。",
        keyPoints: ["生产者", "消费者", "分解者", "营养级"],
        whatIf: "移除一个关键物种可能通过食物网引发级联效应，但结果取决于网络结构。",
        evidence: "野外调查、稳定同位素和排除实验用于解析食物关系。",
      },
      {
        slug: "populations",
        name: "种群动态",
        en: "Population Dynamics",
        summary: "出生、死亡、迁入和迁出共同决定种群数量随时间的变化。",
        keyPoints: ["增长率", "承载力", "密度制约", "迁移"],
        whatIf: "指数增长通常不能无限持续，资源限制会改变增长轨迹。",
        evidence: "长期监测、标记重捕和数学模型用于研究种群变化。",
      },
      {
        slug: "cycles",
        name: "物质循环",
        en: "Biogeochemical Cycles",
        summary: "碳、氮、水等物质在生物体与环境之间不断循环。",
        keyPoints: ["碳循环", "氮循环", "水循环", "分解"],
        whatIf: "改变一个大型物质库的输入或输出，可能影响整个生态系统的平衡。",
        evidence: "同位素、遥感和生态系统通量测量用于追踪物质循环。",
      },
    ],
  },
];

export function getDomain(slug: string) {
  return biologyDomains.find((domain) => domain.slug === slug);
}

export function getSubtopic(domainSlug: string, topicSlug: string) {
  return getDomain(domainSlug)?.subtopics.find((topic) => topic.slug === topicSlug);
}
