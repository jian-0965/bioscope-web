import Link from "next/link";
import { ArrowLeft, Beaker, BookOpen, CircleHelp, Microscope } from "lucide-react";
import { notFound } from "next/navigation";
import TopicProgress from "@/components/TopicProgress";
import MascotGuide from "@/components/MascotGuide";
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
        message={"这一页先抓住“" + topic.keyPoints.slice(0, 2).join("、") + "”这几个核心词，再去看如果系统被扰动会发生什么。"}
        compact
      />

      <section className="topic-layout">
        <article className="topic-main-card">
          <span className="topic-card-label"><Microscope size={16} /> 核心概念</span>
          <h2>先抓住这几个关键词</h2>
          <div className="topic-key-grid">
            {topic.keyPoints.map((point, index) => (
              <div key={point}><b>{String(index + 1).padStart(2, "0")}</b><span>{point}</span></div>
            ))}
          </div>
        </article>

        <article className="topic-side-card what-if-card">
          <span className="topic-card-label"><CircleHelp size={16} /> 如果……会怎样？</span>
          <p>{topic.whatIf}</p>
        </article>

        <article className="topic-side-card evidence-card-v2">
          <span className="topic-card-label"><Beaker size={16} /> 我们怎么知道？</span>
          <p>{topic.evidence}</p>
        </article>
      </section>

      <TopicProgress topicKey={domain.slug + ":" + topic.slug} />

      <section className="topic-next">
        <BookOpen size={20} />
        <div>
          <strong>这是一张“知识骨架”页面</strong>
          <span>后续互动实验、动画、论文和科学史可以直接挂在这个主题下面，不需要重新设计网站结构。</span>
        </div>
      </section>
    </main>
  );
}
