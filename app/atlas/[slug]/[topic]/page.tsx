import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import TopicProgress from "@/components/TopicProgress";
import MascotGuide from "@/components/MascotGuide";
import TopicKnowledgeWorkbench from "@/components/TopicKnowledgeWorkbench";
import ImmuneBattleLab from "@/components/ImmuneBattleLab";
import CellStructureExplorer from "@/components/CellStructureExplorer";
import { biologyDomains, getDomain, getSubtopic } from "@/data/biologyAtlas";

export function generateStaticParams() {
  return biologyDomains.flatMap((domain) =>
    domain.subtopics.map((topic) => ({ slug: domain.slug, topic: topic.slug })),
  );
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}) {
  const { slug, topic: topicSlug } = await params;
  const domain = getDomain(slug);
  const topic = getSubtopic(slug, topicSlug);
  if (!domain || !topic) notFound();

  const isImmunity = domain.slug === "human" && topic.slug === "immunity";
  const isOrganelles = domain.slug === "cell" && topic.slug === "organelles";
  const isNervous = domain.slug === "human" && topic.slug === "nervous";

  return (
    <main className={"topic-page topic-" + domain.accent}>
      <header className="topic-hero">
        <Link href={"/atlas/" + domain.slug} className="atlas-back">
          <ArrowLeft size={15} /> {domain.name}
        </Link>
        <span className="topic-parent">{domain.emoji} {domain.en}</span>
        <p className="atlas-en">{topic.en}</p>
        <h1>{topic.name}</h1>
        <p>{topic.summary}</p>
      </header>

      <MascotGuide
        mentor="boy"
        message={isImmunity
          ? "先释放病原体，看免疫细胞如何移动和协作；再点开每一种细胞，认识它的结构与功能。"
          : "这一页不是静态课本。点开每一个关键词、做扰动实验，再用“我们怎么知道”检查证据。"}
        compact
      />

      {isImmunity && <ImmuneBattleLab />}

      {isOrganelles && (
        <section className="topic-special-explorers">
          <CellStructureExplorer category="cell" initialId="animal-cell" />
          <CellStructureExplorer category="organelle" initialId="mitochondrion" />
        </section>
      )}

      {isNervous && (
        <section className="topic-special-explorers">
          <CellStructureExplorer initialId="neuron" />
        </section>
      )}

      <TopicKnowledgeWorkbench domain={domain.slug} domainName={domain.name} topic={topic} />
      <TopicProgress topicKey={domain.slug + ":" + topic.slug} />
    </main>
  );
}
