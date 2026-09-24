"use client";

import { FormEvent, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, LoaderCircle, Sparkles, Target } from "lucide-react";

type PlanSession = { day: string; title: string; topic: string; tasks: string[] };
type StudyPlan = { title: string; summary: string; focus: string[]; sessions: PlanSession[]; habits: string[]; mode: "gemini" | "local" };

export default function StudyPlanBuilder() {
  const [goal, setGoal] = useState("foundations");
  const [daysPerWeek, setDaysPerWeek] = useState("4");
  const [minutesPerDay, setMinutesPerDay] = useState("30");
  const [note, setNote] = useState("");
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, daysPerWeek: Number(daysPerWeek), minutesPerDay: Number(minutesPerDay), note }),
      });
      const data = await response.json();
      if (!response.ok || !data.plan) throw new Error(data.error || "计划生成失败");
      setPlan(data.plan as StudyPlan);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "计划生成失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="study-plan-builder">
      <div className="study-plan-form-card">
        <span className="study-plan-kicker"><Sparkles size={16} /> 定制学习计划</span>
        <h2>告诉我你的节奏，我来排好这一周。</h2>
        <p>选择目标、学习天数和每天的时间，生成一份可以立刻执行的生命科学学习计划。</p>
        <form onSubmit={submit} className="study-plan-form">
          <label><span><Target size={14} /> 学习目标</span>
            <select value={goal} onChange={(event) => setGoal(event.target.value)}>
              <option value="foundations">打好基础</option><option value="exam">准备考试</option><option value="weak">补强薄弱点</option><option value="exploration">探索感兴趣主题</option>
            </select>
          </label>
          <div className="study-plan-fields">
            <label><span><CalendarDays size={14} /> 每周天数</span>
              <select value={daysPerWeek} onChange={(event) => setDaysPerWeek(event.target.value)}>{[2,3,4,5,6,7].map((value) => <option key={value} value={value}>{value} 天</option>)}</select>
            </label>
            <label><span><Clock3 size={14} /> 每天时长</span>
              <select value={minutesPerDay} onChange={(event) => setMinutesPerDay(event.target.value)}>{[15,20,30,45,60,90].map((value) => <option key={value} value={value}>{value} 分钟</option>)}</select>
            </label>
          </div>
          <label><span>这周特别想学什么？</span><input value={note} onChange={(event) => setNote(event.target.value)} maxLength={180} placeholder="例如：想弄懂神经元和动作电位" /></label>
          <button type="submit" disabled={loading}>{loading ? <><LoaderCircle size={16} /> 正在排计划…</> : <><Sparkles size={16} /> 生成我的学习计划</>}</button>
        </form>
        {error && <p className="study-plan-error" role="status">{error}</p>}
      </div>

      {plan && <section className="study-plan-result" aria-live="polite">
        <div className="study-plan-result-head"><div><span>{plan.mode === "gemini" ? "AI 已优化" : "免费智能排程"}</span><h2>{plan.title}</h2><p>{plan.summary}</p></div></div>
        <div className="study-plan-focus"><b>本周重点</b>{plan.focus.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="study-plan-sessions">{plan.sessions.map((session) => <article key={session.day}><span>{session.day}</span><h3>{session.title}</h3><p>{session.topic}</p><ol>{session.tasks.map((task) => <li key={task}>{task}</li>)}</ol></article>)}</div>
        <div className="study-plan-habits"><CheckCircle2 size={17} /><div><b>保持节奏</b>{plan.habits.map((habit) => <span key={habit}>{habit}</span>)}</div></div>
      </section>}
    </section>
  );
}
