import Link from "next/link";
import { ArrowLeft, Bot, Sparkles } from "lucide-react";
import AIMentorChat from "@/components/AIMentorChat";
import AILearningCoach from "@/components/AILearningCoach";

export default function AIPage(){
  return (
    <main className="ai-page">
      <header className="ai-page-hero">
        <Link href="/" className="atlas-back"><ArrowLeft size={15}/> 返回首页</Link>
        <span><Bot size={17}/> BioScope AI</span>
        <h1>把“问问题”变成一条学习路径</h1>
        <p>AI 导师会结合 BioScope 知识库、当前知识点和你的学习记录，解释机制、连接证据，并推荐下一步。</p>
        <div><Sparkles size={15}/> 检索增强 · 页面上下文 · 学习诊断 · 实验解释</div>
      </header>
      <section className="ai-page-grid">
        <AIMentorChat starter="你好，我是小博。你可以直接问生命科学问题，我会先检索 BioScope 的知识库，再组织解释。"/>
        <AILearningCoach />
      </section>
    </main>
  );
}
