"use client";

import { useMemo, useState } from "react";
import { Beaker, BookOpen, CircleHelp, FlaskConical, Lightbulb, Link2, Microscope, Network, Sparkles } from "lucide-react";
import ExperimentStudio from "@/components/ExperimentStudio";
import AIMentorChat from "@/components/AIMentorChat";
import type { BiologySubtopic } from "@/data/biologyAtlas";

type Tab = "core" | "whatif" | "evidence" | "connections" | "quiz";

export default function TopicKnowledgeWorkbench({
  domain,
  domainName,
  topic,
}: {
  domain: string;
  domainName: string;
  topic: BiologySubtopic;
}) {
  const [activePoint, setActivePoint] = useState(0);
  const [tab, setTab] = useState<Tab>("core");
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const quizOptions = useMemo(() => {
    const correct = topic.keyPoints[0] ?? topic.name;
    const others = topic.keyPoints.slice(1,4);
    return [correct,...others].slice(0,4);
  }, [topic]);

  const selected = topic.keyPoints[activePoint] ?? topic.name;

  function answerQuiz(index: number) {
    setQuizAnswer(index);
    void fetch("/api/learning-signal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicKey: domain + ":" + topic.slug, correct: index === 0 }),
    }).catch(() => undefined);
  }

  return (
    <div className="knowledge-workbench">
      <nav className="knowledge-tabs" aria-label="知识卡类型">
        <button className={tab==="core"?"active":""} onClick={()=>setTab("core")}><BookOpen size={15}/>核心知识</button>
        <button className={tab==="whatif"?"active":""} onClick={()=>setTab("whatif")}><CircleHelp size={15}/>如果……会怎样</button>
        <button className={tab==="evidence"?"active":""} onClick={()=>setTab("evidence")}><FlaskConical size={15}/>我们怎么知道</button>
        <button className={tab==="connections"?"active":""} onClick={()=>setTab("connections")}><Network size={15}/>知识连接</button>
        <button className={tab==="quiz"?"active":""} onClick={()=>setTab("quiz")}><Sparkles size={15}/>小挑战</button>
      </nav>

      {tab==="core" && (
        <section className="interactive-knowledge-card">
          <div className="knowledge-point-list">
            {topic.keyPoints.map((point,index)=>(
              <button key={point} className={activePoint===index?"active":""} onClick={()=>setActivePoint(index)}>
                <b>{String(index+1).padStart(2,"0")}</b><span>{point}</span>
              </button>
            ))}
          </div>
          <article className="knowledge-point-detail">
            <span className="topic-card-label"><Microscope size={16}/> 可点击知识卡</span>
            <h2>{selected}</h2>
            <p><strong>{selected}</strong> 是理解“{topic.name}”的重要入口。{topic.summary}</p>
            <div className="knowledge-explain-grid">
              <div><Lightbulb size={17}/><b>为什么重要</b><span>它与本主题中的其他概念共同构成机制链条，单独记名词很难真正理解。</span></div>
              <div><Link2 size={17}/><b>怎么连接</b><span>把“{selected}”和 {topic.keyPoints.filter((_,i)=>i!==activePoint).slice(0,2).join("、") || "其他关键概念"} 放在一起看。</span></div>
              <div><Beaker size={17}/><b>如何验证</b><span>{topic.evidence}</span></div>
            </div>
          </article>
        </section>
      )}

      {tab==="whatif" && <article className="knowledge-single-panel what-if-panel"><CircleHelp/><div><span>扰动思考</span><h2>如果系统被改变，会发生什么？</h2><p>{topic.whatIf}</p></div></article>}
      {tab==="evidence" && <article className="knowledge-single-panel evidence-panel"><FlaskConical/><div><span>证据链</span><h2>我们怎么知道？</h2><p>{topic.evidence}</p><small>科学结论不是“看起来合理”，而是由观察、测量、对照和可重复证据逐步建立。</small></div></article>}
      {tab==="connections" && <article className="knowledge-single-panel connections-panel"><Network/><div><span>跨尺度连接</span><h2>{domainName}中的位置</h2><p>{topic.name}连接了这些关键词：{topic.keyPoints.join(" → ")}。</p><div className="connection-chips">{(topic.related??[]).map(x=><span key={x}>{x}</span>)}</div></div></article>}
      {tab==="quiz" && (
        <article className="knowledge-quiz">
          <span className="topic-card-label"><Sparkles size={16}/> 30 秒挑战</span>
          <h2>下面哪一个是“{topic.name}”页面中的核心关键词？</h2>
          <div className="quiz-options">
            {quizOptions.map((option,index)=><button key={option} className={quizAnswer===index?(index===0?"correct":"wrong"):""} onClick={()=>answerQuiz(index)}>{option}</button>)}
          </div>
          {quizAnswer!==null && <p>{quizAnswer===0?"回答正确。接下来试着用自己的话解释它与其他关键词的关系。":"再看一次核心知识卡：答案就在本页关键词中。"}</p>}
        </article>
      )}

      <AIMentorChat
        compact
        pageContext={[
          "领域：" + domainName,
          "主题：" + topic.name,
          "简介：" + topic.summary,
          "关键词：" + topic.keyPoints.join("、"),
          "证据：" + topic.evidence,
          "扰动：" + topic.whatIf,
        ].join("\n")}
        starter={"我已经知道你正在学习“" + topic.name + "”。可以直接问我这个页面里的问题。"}
      />
      <ExperimentStudio domain={domain} compact />
    </div>
  );
}
