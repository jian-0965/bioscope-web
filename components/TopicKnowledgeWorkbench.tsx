"use client";

import { useMemo, useState } from "react";
import { Beaker, BookOpen, CircleHelp, FlaskConical, Lightbulb, Link2, Microscope, Network, Sparkles } from "lucide-react";
import ExperimentStudio from "@/components/ExperimentStudio";
import AIMentorChat from "@/components/AIMentorChat";
import { biologyDomains, type BiologySubtopic } from "@/data/biologyAtlas";
import { getCellConcept } from "@/data/cellConcepts";
import { cellReferences } from "@/data/cellKnowledge";

type Tab = "core" | "whatif" | "evidence" | "connections" | "quiz";

function TopicKnowledgeWorkbenchContent({
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
    const distractors=biologyDomains.flatMap(d=>d.subtopics).filter(t=>t.name!==topic.name&&t.summary!==topic.summary).slice(0,3).map(t=>({text:t.summary,correct:false}));
    const answers=[{text:topic.summary,correct:true},...distractors];
    const offset=topic.slug.length%answers.length;
    return [...answers.slice(offset),...answers.slice(0,offset)];
  }, [topic]);
  const selected = topic.keyPoints[activePoint] ?? topic.name;
  const concept=getCellConcept(selected);
  const relatedTopics=(topic.related??[]).map(key=>{
    const [d,t]=key.includes("/")?key.split("/"):[domain,key];
    const found=biologyDomains.find(item=>item.slug===d)?.subtopics.find(item=>item.slug===t);
    return found?{...found,href:`/atlas/${d}/${t}`}:null;
  }).filter(x=>x!==null);

  function answerQuiz(index: number) {
    setQuizAnswer(index);
    void fetch("/api/learning-signal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicKey: domain + ":" + topic.slug, correct: quizOptions[index]?.correct === true }),
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
            <p>{topic.summary}</p>
            {concept&&<div className="structure-explanation"><section><h4>概念与结构</h4><p>{concept.structure}</p></section><section><h4>工作机制</h4><p>{concept.mechanism}</p></section><section className="structure-misconception"><h4>常见误区</h4><p>{concept.misconception}</p></section></div>}
            <div className="knowledge-explain-grid">
              <div><Lightbulb size={17}/><b>改变后会怎样</b><span>{topic.whatIf}</span></div>
              <div><Link2 size={17}/><b>相关概念</b><span>{topic.keyPoints.filter((_,i)=>i!==activePoint).join("、")}</span></div>
              <div><Beaker size={17}/><b>如何验证</b><span>{topic.evidence}</span></div>
            </div>
          </article>
        </section>
      )}

      {tab==="whatif" && <article className="knowledge-single-panel what-if-panel"><CircleHelp/><div><span>扰动思考</span><h2>如果系统被改变，会发生什么？</h2><p>{topic.whatIf}</p></div></article>}
      {tab==="evidence" && <article className="knowledge-single-panel evidence-panel"><FlaskConical/><div><span>证据链</span><h2>我们怎么知道？</h2><p>{topic.evidence}</p><small>科学结论不是“看起来合理”，而是由观察、测量、对照和可重复证据逐步建立。</small></div></article>}
      {tab==="connections" && <article className="knowledge-single-panel connections-panel"><Network/><div><span>跨尺度连接</span><h2>{domainName}中的位置</h2><p>{topic.name}涉及 {topic.keyPoints.join("、")}。下列主题可帮助你继续理解相关机制：</p><div className="connection-chips">{relatedTopics.map(x=><a key={x.href} href={x.href}>{x.name}</a>)}</div></div></article>}
      {tab==="quiz" && (
        <article className="knowledge-quiz">
          <span className="topic-card-label"><Sparkles size={16}/> 30 秒挑战</span>
          <h2>哪项描述最准确地概括“{topic.name}”？</h2>
          <div className="quiz-options">
            {quizOptions.map((option,index)=><button key={option.text} className={quizAnswer===index?(option.correct?"correct":"wrong"):""} onClick={()=>answerQuiz(index)}>{option.text}</button>)}
          </div>
          {quizAnswer!==null && <p>{quizOptions[quizAnswer]?.correct?"回答正确。" : "这项描述属于其他主题。"} 本主题的关键是：{topic.summary}</p>}
        </article>
      )}

      {concept&&<details className="cell-references"><summary>参考阅读</summary>{cellReferences.map(ref=><a key={ref.url} href={ref.url} target="_blank" rel="noreferrer">{ref.title}</a>)}</details>}
      <AIMentorChat
        compact
        pageContext={[
          "领域：" + domainName,
          "主题：" + topic.name,
          "简介：" + topic.summary,
          "关键词：" + topic.keyPoints.join("、"),
          "当前概念：" + selected,
          ...(concept?["结构："+concept.structure,"机制："+concept.mechanism,"误区："+concept.misconception]:[]),
          "证据：" + topic.evidence,
          "扰动：" + topic.whatIf,
        ].join("\n")}
        starter={"我已经知道你正在学习“" + topic.name + "”。可以直接问我这个页面里的问题。"}
      />
      <ExperimentStudio domain={domain} compact />
    </div>
  );
}


export default function TopicKnowledgeWorkbench(props:{domain:string;domainName:string;topic:BiologySubtopic}) {
  return <TopicKnowledgeWorkbenchContent key={props.domain+":"+props.topic.slug} {...props}/>;
}
