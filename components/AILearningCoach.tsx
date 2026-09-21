"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BrainCircuit, CheckCircle2, Route, Target } from "lucide-react";
import { biologyDomains } from "@/data/biologyAtlas";
import { createClient } from "@/lib/supabase/client";

type TopicState = { bookmarked?: boolean; completed?: boolean };
type Signal = { attempts: number; correct: number; wrong: number; last_result?: boolean | null };

export default function AILearningCoach() {
  const [progress, setProgress] = useState<Record<string, TopicState>>({});
  const [signals, setSignals] = useState<Record<string, Signal>>({});

  useEffect(() => {
    async function load() {
      let local: Record<string, TopicState> = {};
      try {
        const raw = localStorage.getItem("bioscope-topic-progress");
        local = raw ? JSON.parse(raw) : {};
        setProgress(local);
      } catch {}

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [{ data: remoteProgress }, { data: remoteSignals }] = await Promise.all([
          supabase.from("user_progress").select("node_id, bookmarked, completed").eq("user_id", user.id),
          supabase.from("learning_signals").select("topic_key, attempts, correct, wrong, last_result").eq("user_id", user.id),
        ]);

        if (remoteProgress) {
          const merged = { ...local };
          for (const row of remoteProgress) merged[row.node_id] = { bookmarked: row.bookmarked, completed: row.completed };
          setProgress(merged);
        }

        if (remoteSignals) {
          const map: Record<string, Signal> = {};
          for (const row of remoteSignals) map[row.topic_key] = row;
          setSignals(map);
        }
      } catch {}
    }
    void load();
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
    const weak = all.filter((item) => (signals[item.key]?.wrong ?? 0) > (signals[item.key]?.correct ?? 0));

    const recommended = all
      .filter((item) => !progress[item.key]?.completed)
      .sort((a,b) => {
        const score = (key:string) => {
          const signal = signals[key];
          const weakBoost = signal ? signal.wrong * 6 - signal.correct * 2 : 0;
          const bookmarkBoost = progress[key]?.bookmarked ? 5 : 0;
          return weakBoost + bookmarkBoost;
        };
        return score(b.key) - score(a.key);
      })
      .slice(0,4);

    return { total: all.length, completed, bookmarked, weak, recommended };
  }, [progress, signals]);

  const mastery = stats.total ? Math.round(stats.completed.length / stats.total * 100) : 0;

  return (
    <section className="ai-learning-coach">
      <div className="ai-coach-head">
        <div><span><BrainCircuit size={15}/> AI 学习诊断</span><h2>根据你的学习记录推荐下一步</h2></div>
        <div className="ai-mastery-ring"><b>{mastery}%</b><span>已完成</span></div>
      </div>

      <div className="ai-coach-stats">
        <div><CheckCircle2/><b>{stats.completed.length}</b><span>已学会主题</span></div>
        <div><Target/><b>{stats.weak.length}</b><span>需要巩固</span></div>
        <div><Route/><b>{stats.recommended.length}</b><span>下一步推荐</span></div>
      </div>

      <div className="ai-recommend-grid">
        {stats.recommended.map(({domain,topic,key},index)=>(
          <a key={key} href={"/atlas/"+domain.slug+"/"+topic.slug}>
            <span>{String(index+1).padStart(2,"0")} · {domain.name}{signals[key]?.wrong ? " · 错题优先" : ""}</span>
            <strong>{topic.name}</strong>
            <p>{topic.summary}</p>
            <em>开始学习 <ArrowRight size={13}/></em>
          </a>
        ))}
      </div>
    </section>
  );
}
