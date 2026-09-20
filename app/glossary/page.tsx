import Link from "next/link";
import { ArrowLeft, Languages } from "lucide-react";
import GlossaryBrowser from "@/components/GlossaryBrowser";

export default function GlossaryPage() {
  return (
    <main className="glossary-page">
      <header className="atlas-hero glossary-hero">
        <Link href="/" className="atlas-back"><ArrowLeft size={15} /> 返回首页</Link>
        <span className="eyebrow"><Languages size={15} /> BioScope Glossary</span>
        <h1>生物学术语，<br />用一句话先讲清楚</h1>
        <p>遇到陌生名词先在这里建立最基本概念，再进入专题理解机制和证据。</p>
      </header>
      <GlossaryBrowser />
    </main>
  );
}
