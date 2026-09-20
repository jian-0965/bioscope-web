export type GlossaryEntry = {
  term: string;
  en: string;
  domain: string;
  definition: string;
};

export const glossaryEntries: GlossaryEntry[] = [
  { term: "动作电位", en: "Action potential", domain: "神经科学", definition: "可兴奋细胞膜电位快速、短暂而可传播的变化。" },
  { term: "突触", en: "Synapse", domain: "神经科学", definition: "一个神经元向另一个细胞传递信息的连接区域。" },
  { term: "稳态", en: "Homeostasis", domain: "人体生理", definition: "生物体通过调节机制把内部环境维持在相对稳定范围内。" },
  { term: "激素", en: "Hormone", domain: "内分泌", definition: "由细胞或腺体释放、可影响其他细胞功能的化学信号分子。" },
  { term: "抗体", en: "Antibody", domain: "免疫学", definition: "B 细胞分化产生的免疫球蛋白，可特异性识别抗原。" },
  { term: "细胞膜", en: "Cell membrane", domain: "细胞生物学", definition: "主要由脂质双层和膜蛋白构成，界定细胞并调节物质与信息交换。" },
  { term: "线粒体", en: "Mitochondrion", domain: "细胞生物学", definition: "真核细胞中的重要细胞器，参与细胞呼吸和 ATP 生成等过程。" },
  { term: "核糖体", en: "Ribosome", domain: "分子生物学", definition: "负责翻译 mRNA 并合成多肽的核糖核蛋白复合体。" },
  { term: "DNA", en: "Deoxyribonucleic acid", domain: "遗传学", definition: "多数生物储存遗传信息的核酸分子。" },
  { term: "基因", en: "Gene", domain: "遗传学", definition: "能够产生功能性产物并受到调控的遗传信息单位。" },
  { term: "转录", en: "Transcription", domain: "分子生物学", definition: "以 DNA 为模板合成 RNA 的过程。" },
  { term: "翻译", en: "Translation", domain: "分子生物学", definition: "核糖体根据 mRNA 序列合成多肽的过程。" },
  { term: "酶", en: "Enzyme", domain: "生物化学", definition: "能够催化生化反应、通常具有底物特异性的生物分子。" },
  { term: "ATP", en: "Adenosine triphosphate", domain: "生物化学", definition: "细胞中常见的能量耦联分子，可驱动许多需要能量的过程。" },
  { term: "光合作用", en: "Photosynthesis", domain: "植物科学", definition: "利用光能合成有机物并储存化学能的一系列过程。" },
  { term: "气孔", en: "Stoma", domain: "植物科学", definition: "植物表皮上由保卫细胞调节的孔隙，参与气体交换与蒸腾。" },
  { term: "自然选择", en: "Natural selection", domain: "进化", definition: "可遗传差异造成繁殖成功差异，从而改变种群性状频率的过程。" },
  { term: "遗传漂变", en: "Genetic drift", domain: "进化", definition: "有限种群中等位基因频率因随机抽样而发生的变化。" },
  { term: "种群", en: "Population", domain: "生态", definition: "一定时间和空间中属于同一物种的一组个体。" },
  { term: "生态系统", en: "Ecosystem", domain: "生态", definition: "生物群落与其非生物环境相互作用形成的系统。" },
];
