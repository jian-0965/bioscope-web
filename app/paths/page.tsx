import Link from "next/link";
import { ArrowLeft, ArrowRight, Route } from "lucide-react";
import { learningPaths } from "@/data/learningPaths";

export default function PathsPage() {
  return (
    <main className="paths-page">
      <header className="atlas-hero paths-hero">
        <Link href="/" className="atlas-back"><ArrowLeft size={15} /> 返回首页</Link>
        <span className="eyebrow"><Route size={15} /> BioScope Learning Paths</span>
        <h1>不知道从哪里学？<br />沿着一条路线走就好</h1>
        <p>路线把跨章节知识按因果和尺度串起来，比随机翻知识卡更容易建立完整理解。</p>
      </header>

      <section className="paths-grid">
        {learningPaths.map((path) => (
          <article className="path-card" key={path.slug}>
            <div className="path-card-head">
              <span>{path.steps.length} 步</span>
              <h2>{path.name}</h2>
              <p>{path.description}</p>
            </div>
            <div className="path-steps">
              {path.steps.map((step, index) => (
                <Link href={step.href} key={step.label}>
                  <b>{index + 1}</b>
                  <span><strong>{step.label}</strong><small>{step.note}</small></span>
                  <ArrowRight size={15} />
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
