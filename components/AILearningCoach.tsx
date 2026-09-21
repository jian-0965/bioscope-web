"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BrainCircuit, CheckCircle2, Route, Target } from "lucide-react";
import { biologyDomains } from "@/data/biologyAtlas";

type TopicState = { bookmarked?: boolean; completed?: boolean };

export default function AILearningCoach() {
  const [progress, setProgress] = useState<Record<string, TopicState>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bioscope-topic-progress");
      setProgress(raw ? JSON.parse(raw) : {});
    } catch {
      setProgress({});
    }
  }, []);

  const stats = useMemo(() => {
    const all = biologyDomains.flatMap((domain) =>
      domain.subtopics.map((topic) => ({
        key: domain.slug + ":" + topic.slug,
        domain,
        topic,
      })),
    );
    const completed = all.filter((item) => progress[item.key]?.completed);
    const bookmarked = all.filter((item) => progress[item.key]?.bookmarked);
    const recommended = all
      .filter((item) => !progress[item.key]?.completed)
      .sort((a,b) => {
        const aBoost = progress[a.key]?.bookmarked ? 5 : 0;
        const bBoost = progress[b.key]?.bookmarked ? 5 : 0;
        return bBoost - aBoost;
      })
      .slice(0,4);
    return { total: all.length, completed, bookmarked, recommended };
  }, [progress]);

  const mastery = stats.total ? Math.round(stats.completed.length / stats.total * 100) : 0;

  return (
    <section className="ai-learning-coach">
      <div className="ai-coach-head">
        <div><span><BrainCircuit size={15}/> AI 学习诊断</span><h2>根据你的学习记录推荐下一步</h2></div>
        <div className="ai-mastery-ring"><b>{mastery}%</b><span>已完成</span></div>
      </div>

      <div className="ai-coach-stats">
        <div><CheckCircle2/><b>{stats.completed.length}</b><span>已学会主题</span></div>
        <div><Target/><b>{stats.bookmarked.length}</b><span>已收藏主题</span></div>
        <div><Route/><b>{stats.recommended.length}</b><span>下一步推荐</span></div>
      </div>

      <div className="ai-recommend-grid">
        {stats.recommended.map(({domain,topic},index)=>(
          <a key={domain.slug+topic.slug} href={"/atlas/"+domain.slug+"/"+topic.slug}>
            <span>{String(index+1).padStart(2,"0")} · {domain.name}</span>
            <strong>{topic.name}</strong>
            <p>{topic.summary}</p>
            <em>开始学习 <ArrowRight size={13}/></em>
          </a>
        ))}
      </div>
    </section>
  );
}
