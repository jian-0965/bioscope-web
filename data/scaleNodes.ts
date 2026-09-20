export type ScaleNode = {
  id: string;
  label: string;
  subtitle: string;
  scale: string;
  description: string;
  facts: string[];
  links: string[];
};

export const scaleNodes: ScaleNode[] = [
  {
    id: "human",
    label: "人体",
    subtitle: "Human body",
    scale: "~1 m",
    description: "从一个完整生命体出发，逐层进入器官、组织、细胞与分子。",
    facts: ["人体由多个器官系统协同工作", "尺度探索器会保留你当前的观察路径"],
    links: ["大脑", "心脏", "肺"],
  },
  {
    id: "brain",
    label: "大脑",
    subtitle: "Brain",
    scale: "~15 cm",
    description: "大脑由神经元和胶质细胞等组成，负责信息处理、调节和行为控制。",
    facts: ["大脑皮层拥有高度组织化的神经网络", "不同区域承担不同但相互协作的功能"],
    links: ["大脑皮层", "神经组织", "神经元"],
  },
  {
    id: "neuron",
    label: "神经元",
    subtitle: "Neuron",
    scale: "~10–100 μm",
    description: "神经元通过电信号与化学信号在神经系统中传递信息。",
    facts: ["树突主要接收输入", "轴突可将动作电位传向远处", "突触负责细胞间信息传递"],
    links: ["细胞膜", "轴突", "突触"],
  },
  {
    id: "membrane",
    label: "细胞膜",
    subtitle: "Cell membrane",
    scale: "~7–10 nm",
    description: "细胞膜维持细胞内外环境差异，并通过离子通道调节电活动。",
    facts: ["膜由脂质双层和蛋白质构成", "选择性通透性决定离子流动"],
    links: ["Na⁺通道", "K⁺通道", "Na⁺/K⁺泵"],
  },
  {
    id: "ion-channel",
    label: "离子通道",
    subtitle: "Ion channel",
    scale: "~5–10 nm",
    description: "离子通道像可控的分子闸门，决定 Na⁺、K⁺ 等离子何时跨膜流动。",
    facts: ["电压门控通道会响应膜电位变化", "通道开放与关闭共同塑造动作电位"],
    links: ["Na⁺", "K⁺", "动作电位"],
  },
];
