import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, FlaskConical, Lightbulb } from "lucide-react";
import { notFound } from "next/navigation";
import { biologyDomains, getDomain } from "@/data/biologyAtlas";

export function generateStaticParams() {
  return biologyDomains.map((domain) => ({ slug: domain.slug }));
}

export default async function DomainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const domain = getDomain(slug);
  if (!domain) notFound();

  return (
    <main className={"domain-page domain-" + domain.accent}>
      <header className="domain-hero">
        <Link href="/atlas" className="atlas-back"><ArrowLeft size={15} /> 生物学全景</Link>
        <div className="domain-emoji">{domain.emoji}</div>
        <p className="atlas-en">{domain.en}</p>
        <h1>{domain.name}</h1>
        <p className="domain-lead">{domain.description}</p>
      </header>

      <section className="domain-topic-grid">
        {domain.subtopics.map((topic, index) => (
          <article className="domain-topic-card" key={topic.slug}>
            <div className="domain-topic-index">{String(index + 1).padStart(2, "0")}</div>
            <p className="atlas-en">{topic.en}</p>
            <h2>{topic.name}</h2>
            <p>{topic.summary}</p>
            <div className="domain-keypoints">
              {topic.keyPoints.map((point) => <span key={point}>{point}</span>)}
            </div>
            <Link href={"/atlas/" + domain.slug + "/" + topic.slug}>
              深入探索 <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </section>

      <section className="domain-learning-principles">
        <article><BookOpen size={20} /><strong>结构与功能</strong><span>先知道它是什么，再理解为什么这样设计。</span></article>
        <article><Lightbulb size={20} /><strong>如果……会怎样？</strong><span>通过扰动系统理解正常机制。</span></article>
        <article><FlaskConical size={20} /><strong>证据与实验</strong><span>每个知识点都追问：我们怎么知道？</span></article>
      </section>
    </main>
  );
}
