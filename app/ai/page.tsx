import Link from "next/link";
import { ArrowLeft, CalendarCheck2, Sparkles } from "lucide-react";
import StudyPlanBuilder from "@/components/StudyPlanBuilder";

export default function AIPage() {
  return (
    <main className="ai-page">
      <header className="ai-page-hero">
        <Link href="/" className="atlas-back"><ArrowLeft size={15}/> 返回首页</Link>
        <span><CalendarCheck2 size={17}/> BioScope 学习计划</span>
        <h1>不是每个阶段，都该用同一种方法。</h1>
        <p>系统会结合学习阶段、知识类型与近期表现，在十种学习方法中动态调度，并保留你的自定义选择。</p>
        <div><Sparkles size={15}/> 阶段调度 · 表现触发 · 方法可定制</div>
      </header>
      <StudyPlanBuilder />
    </main>
  );
}
