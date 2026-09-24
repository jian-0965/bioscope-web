import Link from "next/link";
import { ArrowLeft, CalendarCheck2, Sparkles } from "lucide-react";
import StudyPlanBuilder from "@/components/StudyPlanBuilder";

export default function AIPage() {
  return (
    <main className="ai-page">
      <header className="ai-page-hero">
        <Link href="/" className="atlas-back"><ArrowLeft size={15}/> 返回首页</Link>
        <span><CalendarCheck2 size={17}/> BioScope 学习计划</span>
        <h1>别盲目刷内容，按你的时间来学。</h1>
        <p>选择目标、学习天数和每天的时间，系统会把生命科学内容安排成一份可以直接执行的周计划。</p>
        <div><Sparkles size={15}/> 目标驱动 · 每日任务 · 错题复习</div>
      </header>
      <StudyPlanBuilder />
    </main>
  );
}
