import { biologyDomains } from "@/data/biologyAtlas";

export type KnowledgeScale =
  | "organism"
  | "system"
  | "organ"
  | "tissue"
  | "cell"
  | "organelle"
  | "molecule"
  | "population"
  | "ecosystem";

export type KnowledgeNode = {
  id: string;
  label: string;
  en: string;
  domain: string;
  scale?: KnowledgeScale;
  summary: string;
  parentId: string | null;
  children: string[];
  related: string[];
};

export const scaleOrder: KnowledgeScale[] = [
  "ecosystem",
  "population",
  "organism",
  "system",
  "organ",
  "tissue",
  "cell",
  "organelle",
  "molecule",
];

const domainNodes: KnowledgeNode[] = biologyDomains.map((domain) => ({
  id: domain.slug,
  label: domain.name,
  en: domain.en,
  domain: domain.slug,
  summary: domain.description,
  parentId: null,
  children: domain.subtopics.map((topic) => domain.slug + "/" + topic.slug),
  related: [],
}));

const topicNodes: KnowledgeNode[] = biologyDomains.flatMap((domain) =>
  domain.subtopics.map((topic) => ({
    id: domain.slug + "/" + topic.slug,
    label: topic.name,
    en: topic.en,
    domain: domain.slug,
    scale: topic.scale,
    summary: topic.summary,
    parentId: domain.slug,
    children: [],
    related: topic.related ?? [],
  })),
);

export const knowledgeNodes = [...domainNodes, ...topicNodes];

export const knowledgeNodeMap = new Map(knowledgeNodes.map((node) => [node.id, node]));

export function getKnowledgeNode(id: string) {
  return knowledgeNodeMap.get(id);
}

export function getDomainTopics(domain: string) {
  return topicNodes.filter((node) => node.domain === domain);
}

export function getScaleTopics(scale: KnowledgeScale) {
  return topicNodes.filter((node) => node.scale === scale);
}

export const crossDomainConnections = [
  ["human/nervous", "cell/membrane"],
  ["cell/membrane", "molecular/signaling"],
  ["molecular/protein-structure", "biochemistry/enzymes"],
  ["genetics/gene-expression", "molecular/protein-structure"],
  ["genetics/mutation", "evolution/natural-selection"],
  ["microbiology/microbiome", "human/digestion"],
  ["plants/photosynthesis", "biochemistry/photosynthesis"],
  ["development/cell-fate", "genetics/epigenetics"],
  ["evolution/natural-selection", "ecology/populations"],
  ["ecology/cycles", "microbiology/archaea"],
  ["biotech/gene-editing", "genetics/mutation"],
  ["bioinformatics/structure-prediction", "molecular/protein-structure"],
] as const;
