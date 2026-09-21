import { biologyDomains } from "@/data/biologyAtlas";

export type BioRagDocument = {
  id: string;
  title: string;
  domain: string;
  text: string;
  href: string;
  evidence?: string;
  whatIf?: string;
  keywords: string[];
};

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function buildBioRagDocuments(): BioRagDocument[] {
  return biologyDomains.flatMap((domain) =>
    domain.subtopics.map((topic) => ({
      id: domain.slug + ":" + topic.slug,
      title: topic.name,
      domain: domain.name,
      text: [topic.summary, ...topic.keyPoints, ...(topic.related ?? [])].join("。"),
      href: "/atlas/" + domain.slug + "/" + topic.slug,
      evidence: topic.evidence,
      whatIf: topic.whatIf,
      keywords: [topic.name, topic.en, domain.name, domain.en, ...topic.keyPoints, ...(topic.related ?? [])],
    })),
  );
}

function scoreDocument(query: string, doc: BioRagDocument) {
  const q = normalize(query);
  let score = 0;

  for (const keyword of doc.keywords) {
    const k = normalize(keyword);
    if (!k) continue;
    if (q.includes(k)) score += Math.min(18, 6 + k.length * 1.4);
    const chars = [...new Set(k.replace(/[\s，。、“”()（）-]/g, ""))];
    const overlap = chars.filter((char) => q.includes(char)).length;
    score += Math.min(4, overlap * 0.35);
  }

  if (q.includes(normalize(doc.title))) score += 25;
  if (q.includes(normalize(doc.domain))) score += 7;

  return score;
}

export function retrieveBioKnowledge(query: string, limit = 4) {
  return buildBioRagDocuments()
    .map((doc) => ({ doc, score: scoreDocument(query, doc) }))
    .filter((item) => item.score > 0.8)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.doc);
}

export function makeFallbackAnswer(query: string, docs: BioRagDocument[]) {
  if (!docs.length) {
    return "我暂时没有在 BioScope 知识库里找到足够匹配的条目。你可以换一个更具体的生物学关键词，例如“线粒体内膜”“B 细胞”“动作电位”或“光合作用”。";
  }

  const first = docs[0];
  const second = docs[1];
  const q = query.toLowerCase();

  if ((q.includes("区别") || q.includes("不同")) && second) {
    return [
      "可以把它们放在同一条机制链里比较：",
      "• " + first.title + "：" + first.text.split("。").slice(0, 2).join("。") + "。",
      "• " + second.title + "：" + second.text.split("。").slice(0, 2).join("。") + "。",
      "最关键的是比较“结构、输入、输出、发生位置”这四项，而不是只背定义。",
    ].join("\n");
  }

  if (q.includes("如果") || q.includes("会怎样") || q.includes("失效")) {
    return first.whatIf
      ? first.whatIf + "\n\n你可以继续打开“如果……会怎样”知识卡，并用互动实验改变变量验证趋势。"
      : "如果这个环节被削弱，通常会沿着它所在的机制链影响后续步骤。建议先定位它的直接上游和下游，再判断最终表型。";
  }

  if (q.includes("证据") || q.includes("怎么知道") || q.includes("实验")) {
    return (first.evidence || "这个知识点需要通过可重复的观察、对照实验和定量测量来建立证据。") +
      "\n\nBioScope 会优先把“结论”和“我们怎么知道”分开呈现，避免把解释当成证据。";
  }

  if (q.includes("为什么") || q.includes("原理") || q.includes("机制")) {
    return first.title + " 的核心机制可以这样抓：" +
      "\n1. " + first.text.split("。").filter(Boolean).slice(0, 1).join("。") + "。" +
      "\n2. 关键节点：" + first.keywords.slice(2, 6).join("、") + "。" +
      "\n3. 理解时重点追踪“结构 → 功能 → 结果”的因果链。";
  }

  return first.title + "：\n" +
    first.text.split("。").filter(Boolean).slice(0, 3).join("。") + "。" +
    (first.evidence ? "\n\n证据提示：" + first.evidence : "") +
    "\n\n如果你愿意，我可以继续按“结构、功能、机制、失效后果”四步解释。";
}
