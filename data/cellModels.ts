export type CellHotspot = {
  id: string;
  name: string;
  x: number;
  y: number;
  function: string;
  detail: string;
};

export type CellModel = {
  id: string;
  name: string;
  en: string;
  category: "cell" | "immune" | "organelle";
  kind: "animal" | "plant" | "bacterium" | "macrophage" | "dendritic" | "bcell" | "tcell" | "plasma" | "neutrophil" | "mitochondrion" | "chloroplast" | "neuron";
  description: string;
  hotspots: CellHotspot[];
};

export const cellModels: CellModel[] = [
  {
    id:"animal-cell",name:"动物细胞",en:"Animal Cell",category:"cell",kind:"animal",
    description:"典型动物细胞没有细胞壁和叶绿体，但具有细胞膜、细胞核和多种膜性细胞器。",
    hotspots:[
      {id:"membrane",name:"细胞膜",x:14,y:50,function:"控制物质进出并接收信号",detail:"脂质双层与膜蛋白共同维持细胞边界和选择性通透。"},
      {id:"nucleus",name:"细胞核",x:49,y:47,function:"储存 DNA 并调控基因表达",detail:"核膜将遗传物质与细胞质分隔，核孔控制物质交换。"},
      {id:"mitochondria",name:"线粒体",x:70,y:65,function:"产生大量 ATP",detail:"内膜上的电子传递链和 ATP 合酶完成氧化磷酸化。"},
      {id:"er",name:"内质网",x:63,y:34,function:"合成蛋白质和脂质",detail:"粗面内质网富含核糖体，滑面内质网参与脂质合成和解毒。"},
      {id:"golgi",name:"高尔基体",x:30,y:68,function:"修饰、分选和包装蛋白质",detail:"蛋白质在膜性囊堆中进一步加工并被送往不同目的地。"},
    ],
  },
  {
    id:"plant-cell",name:"植物细胞",en:"Plant Cell",category:"cell",kind:"plant",
    description:"植物细胞具有细胞壁、大液泡和叶绿体，能进行光合作用并维持较稳定的形态。",
    hotspots:[
      {id:"wall",name:"细胞壁",x:10,y:50,function:"提供机械支撑和保护",detail:"主要由纤维素等多糖构成，位于细胞膜外侧。"},
      {id:"vacuole",name:"中央液泡",x:50,y:52,function:"储水、维持膨压并储存物质",detail:"成熟植物细胞中液泡常占据大部分体积。"},
      {id:"chloroplast",name:"叶绿体",x:28,y:30,function:"进行光合作用",detail:"类囊体膜捕获光能，基质中进行碳同化。"},
      {id:"nucleus",name:"细胞核",x:73,y:36,function:"储存遗传信息",detail:"控制细胞内大量基因的转录活动。"},
      {id:"mitochondria",name:"线粒体",x:76,y:68,function:"进行细胞呼吸并产生 ATP",detail:"植物细胞同样依赖线粒体进行高效能量转换。"},
    ],
  },
  {
    id:"bacterium",name:"细菌",en:"Bacterium",category:"cell",kind:"bacterium",
    description:"细菌是原核生物，没有膜包裹的细胞核，但拥有 DNA、核糖体、细胞膜和通常存在的细胞壁。",
    hotspots:[
      {id:"wall",name:"细胞壁",x:16,y:50,function:"维持形态并抵抗渗透压",detail:"许多细菌的细胞壁含肽聚糖。"},
      {id:"membrane",name:"细胞膜",x:25,y:50,function:"物质交换与能量代谢",detail:"原核细胞的许多代谢过程发生在膜及胞质中。"},
      {id:"nucleoid",name:"拟核",x:50,y:48,function:"存放主要染色体 DNA",detail:"DNA 不被核膜包围，而集中在拟核区域。"},
      {id:"ribosome",name:"核糖体",x:66,y:36,function:"合成蛋白质",detail:"细菌核糖体负责把 mRNA 信息翻译成蛋白质。"},
      {id:"flagellum",name:"鞭毛",x:88,y:53,function:"帮助部分细菌运动",detail:"鞭毛通过旋转推动细菌在液体环境中移动。"},
    ],
  },
  {
    id:"macrophage",name:"巨噬细胞",en:"Macrophage",category:"immune",kind:"macrophage",
    description:"巨噬细胞能吞噬病原体和细胞碎片，并参与抗原呈递和炎症信号释放。",
    hotspots:[
      {id:"pseudopod",name:"伪足",x:16,y:52,function:"包围并吞噬目标",detail:"细胞骨架快速重排，让膜向目标伸展。"},
      {id:"phagosome",name:"吞噬体",x:62,y:58,function:"包裹被吞入的病原体",detail:"吞噬体随后与溶酶体融合，形成降解环境。"},
      {id:"lysosome",name:"溶酶体",x:68,y:33,function:"降解吞噬物",detail:"内部含多种酸性水解酶。"},
      {id:"mhc",name:"MHC II",x:28,y:24,function:"向辅助性 T 细胞呈递抗原片段",detail:"抗原片段被装载到 MHC II 并展示在细胞表面。"},
      {id:"nucleus",name:"细胞核",x:48,y:49,function:"调控免疫基因表达",detail:"感染时可启动炎症因子和抗原呈递相关基因。"},
    ],
  },
  {
    id:"dendritic",name:"树突状细胞",en:"Dendritic Cell",category:"immune",kind:"dendritic",
    description:"树突状细胞是重要的抗原呈递细胞，连接先天免疫与适应性免疫。",
    hotspots:[
      {id:"process",name:"树突状突起",x:15,y:42,function:"扩大环境采样范围",detail:"细长突起帮助细胞捕获周围抗原。"},
      {id:"mhc",name:"MHC 分子",x:78,y:28,function:"展示抗原片段",detail:"成熟后迁移到淋巴结并激活初始 T 细胞。"},
      {id:"nucleus",name:"细胞核",x:50,y:52,function:"控制成熟与迁移程序",detail:"抗原刺激后基因表达发生显著变化。"},
    ],
  },
  {
    id:"b-cell",name:"B 细胞",en:"B Cell",category:"immune",kind:"bcell",
    description:"B 细胞利用 BCR 识别抗原，激活后可形成浆细胞和记忆 B 细胞。",
    hotspots:[
      {id:"bcr",name:"BCR",x:22,y:22,function:"特异性识别抗原",detail:"BCR 本质上是膜结合型免疫球蛋白。"},
      {id:"membrane",name:"细胞膜",x:16,y:54,function:"承载受体与信号分子",detail:"抗原结合后可触发细胞内信号。"},
      {id:"nucleus",name:"细胞核",x:52,y:52,function:"驱动克隆扩增和分化",detail:"活化后的 B 细胞大量增殖并改变基因表达。"},
    ],
  },
  {
    id:"t-cell",name:"T 细胞",en:"T Cell",category:"immune",kind:"tcell",
    description:"T 细胞通过 TCR 识别由 MHC 呈递的抗原肽，参与协调或直接执行细胞免疫。",
    hotspots:[
      {id:"tcr",name:"TCR",x:24,y:20,function:"识别抗原肽-MHC 复合物",detail:"TCR 不直接识别游离抗原，而识别细胞表面的复合结构。"},
      {id:"cd",name:"CD4 / CD8",x:75,y:25,function:"作为共受体帮助识别",detail:"CD4 常见于辅助性 T 细胞，CD8 常见于细胞毒性 T 细胞。"},
      {id:"granule",name:"细胞毒颗粒",x:66,y:64,function:"杀伤靶细胞",detail:"细胞毒性 T 细胞可释放穿孔素和颗粒酶。"},
      {id:"nucleus",name:"细胞核",x:48,y:49,function:"控制活化与克隆扩增",detail:"激活后 T 细胞可快速增殖形成效应与记忆细胞。"},
    ],
  },
  {
    id:"plasma-cell",name:"浆细胞",en:"Plasma Cell",category:"immune",kind:"plasma",
    description:"浆细胞由活化 B 细胞分化而来，专门大量合成并分泌抗体。",
    hotspots:[
      {id:"rer",name:"粗面内质网",x:55,y:38,function:"大量合成抗体蛋白",detail:"丰富的粗面内质网是浆细胞高分泌能力的结构基础。"},
      {id:"golgi",name:"高尔基体",x:65,y:58,function:"加工并包装抗体",detail:"抗体蛋白在此进一步修饰并装入分泌囊泡。"},
      {id:"nucleus",name:"偏位细胞核",x:30,y:55,function:"维持浆细胞基因表达",detail:"成熟浆细胞的细胞核常偏向一侧。"},
      {id:"antibody",name:"抗体",x:86,y:38,function:"特异性结合抗原",detail:"抗体可中和、凝集或帮助其他免疫成分识别病原体。"},
    ],
  },
  {
    id:"neutrophil",name:"中性粒细胞",en:"Neutrophil",category:"immune",kind:"neutrophil",
    description:"中性粒细胞是感染早期快速到达现场的重要吞噬细胞。",
    hotspots:[
      {id:"nucleus",name:"分叶核",x:49,y:48,function:"中性粒细胞典型形态标志",detail:"细胞核通常分成多个相连叶。"},
      {id:"granules",name:"颗粒",x:66,y:36,function:"储存抗菌分子",detail:"颗粒中含有多种酶和抗菌蛋白。"},
      {id:"membrane",name:"细胞膜",x:15,y:52,function:"迁移、黏附和吞噬",detail:"膜上黏附分子帮助其穿出血管并进入感染组织。"},
    ],
  },
  {
    id:"mitochondrion",name:"线粒体",en:"Mitochondrion",category:"organelle",kind:"mitochondrion",
    description:"线粒体把营养物中的能量转换成 ATP，是细胞能量代谢的重要中心。",
    hotspots:[
      {id:"outer",name:"外膜",x:13,y:50,function:"形成线粒体外边界",detail:"允许部分小分子和离子通过。"},
      {id:"inner",name:"内膜",x:35,y:48,function:"进行电子传递和氧化磷酸化",detail:"内膜富含电子传递链复合体和 ATP 合酶。"},
      {id:"crista",name:"嵴",x:57,y:43,function:"增加内膜表面积",detail:"更多内膜面积意味着可以容纳更多能量转换蛋白。"},
      {id:"matrix",name:"基质",x:67,y:62,function:"进行三羧酸循环等反应",detail:"基质中含多种代谢酶以及线粒体 DNA。"},
    ],
  },
  {
    id:"chloroplast",name:"叶绿体",en:"Chloroplast",category:"organelle",kind:"chloroplast",
    description:"叶绿体将光能转化为化学能，并利用二氧化碳合成有机物。",
    hotspots:[
      {id:"envelope",name:"双层膜",x:13,y:50,function:"包围叶绿体内部结构",detail:"外膜和内膜共同形成叶绿体包膜。"},
      {id:"thylakoid",name:"类囊体",x:50,y:42,function:"进行光反应",detail:"叶绿素、光系统和电子传递链位于类囊体膜。"},
      {id:"granum",name:"基粒",x:62,y:42,function:"由多层类囊体堆叠形成",detail:"堆叠结构增加类囊体膜面积。"},
      {id:"stroma",name:"基质",x:48,y:68,function:"进行碳同化",detail:"Calvin 循环相关酶位于叶绿体基质。"},
    ],
  },
  {
    id:"neuron",name:"神经元",en:"Neuron",category:"cell",kind:"neuron",
    description:"神经元以树突接收信息、胞体整合信息，并通过轴突把电信号传向远端。",
    hotspots:[
      {id:"dendrite",name:"树突",x:17,y:35,function:"接收来自其他细胞的输入",detail:"树突具有大量分支，可扩大突触接收面积。"},
      {id:"soma",name:"胞体",x:38,y:50,function:"整合输入并维持细胞代谢",detail:"胞体含细胞核和多数细胞器。"},
      {id:"axon",name:"轴突",x:68,y:50,function:"远距离传导动作电位",detail:"轴突可很长，把信号传到其他神经元或效应器。"},
      {id:"terminal",name:"轴突末梢",x:91,y:50,function:"释放神经递质",detail:"动作电位到达后触发囊泡融合和递质释放。"},
    ],
  },
];

export function getCellModel(id:string){
  return cellModels.find((model)=>model.id===id);
}
