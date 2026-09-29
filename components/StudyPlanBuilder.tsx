"use client";

import { FormEvent, useState } from "react";
import { BrainCircuit, CalendarDays, CheckCircle2, Clock3, FlaskConical, LoaderCircle, SlidersHorizontal, Sparkles, Target } from "lucide-react";

type MethodKey = "srs" | "retrieval" | "deliberate" | "feynman" | "interleaving" | "conceptMap" | "cbl" | "contrast" | "modeling";
type PlanSession = { day: string; title: string; topic: string; methods: string[]; tasks: string[] };
type StudyPlan = {
  title: string;
  summary: string;
  focus: string[];
  sessions: PlanSession[];
  habits: string[];
  strategy: {
    stage: string;
    knowledgeType: string;
    performance: string;
    performanceSource: string;
    triggers: string[];
    methods: Array<{ key: MethodKey; label: string; reason: string }>;
    nextRule: string;
  };
  sideProject: { title: string; outcome: string; steps: string[] } | null;
  mode: "doubao" | "local";
};

const methodOptions: Array<{ key: MethodKey; label: string; hint: string }> = [
  { key: "srs", label: "SRS 间隔重复", hint: "按遗忘节奏复习" },
  { key: "retrieval", label: "检索练习", hint: "不看资料主动回忆" },
  { key: "deliberate", label: "刻意练习", hint: "集中攻克薄弱环节" },
  { key: "feynman", label: "费曼学习法", hint: "用自己的话讲清楚" },
  { key: "interleaving", label: "交错学习", hint: "混合多个知识模块" },
  { key: "conceptMap", label: "概念图", hint: "建立知识关系网络" },
  { key: "cbl", label: "CBL 案例学习", hint: "在真实案例中应用" },
  { key: "contrast", label: "对比辨析", hint: "区分易混概念" },
  { key: "modeling", label: "模型建构", hint: "画出过程与因果关系" },
];

export default function StudyPlanBuilder() {
  const [goal, setGoal] = useState("foundations");
  const [focusArea, setFocusArea] = useState("all");
  const [stage, setStage] = useState("new");
  const [knowledgeType, setKnowledgeType] = useState("auto");
  const [performance, setPerformance] = useState("auto");
  const [conceptConfusion, setConceptConfusion] = useState(false);
  const [forgottenReview, setForgottenReview] = useState(false);
  const [enabledMethods, setEnabledMethods] = useState<MethodKey[]>(methodOptions.map((method) => method.key));
  const [pblEnabled, setPblEnabled] = useState(false);
  const [daysPerWeek, setDaysPerWeek] = useState("4");
  const [minutesPerDay, setMinutesPerDay] = useState("30");
  const [note, setNote] = useState("");
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleMethod(key: MethodKey) {
    setEnabledMethods((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabledMethods.length) {
      setError("请至少保留一种学习方法。");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          focusArea,
          stage,
          knowledgeType,
          performance,
          conceptConfusion,
          forgottenReview,
          enabledMethods,
          pblEnabled,
          daysPerWeek: Number(daysPerWeek),
          minutesPerDay: Number(minutesPerDay),
          note,
        }),
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
        <span className="study-plan-kicker"><BrainCircuit size={17} /> 自适应学习调度器</span>
        <h2>不同阶段，用不同的方法学。</h2>
        <p>系统先按学习阶段选主方法，再根据知识类型和近期表现动态切换；你也可以关闭不喜欢的方法。</p>
        <form onSubmit={submit} className="study-plan-form">
          <div className="study-plan-fields">
            <label><span><Target size={15} /> 学习目标</span>
              <select value={goal} onChange={(event) => setGoal(event.target.value)}>
                <option value="foundations">打好基础</option><option value="exam">准备考试</option><option value="weak">补强薄弱点</option><option value="exploration">探索感兴趣主题</option>
              </select>
            </label>
            <label><span>学习领域</span>
              <select value={focusArea} onChange={(event) => setFocusArea(event.target.value)}>
                <option value="all">综合生命科学</option><option value="cell">细胞与分子</option><option value="human">人体与健康</option><option value="genetics">遗传与进化</option><option value="ecology">生态与环境</option>
              </select>
            </label>
          </div>

          <div className="study-plan-fields">
            <label><span>当前学习阶段</span>
              <select value={stage} onChange={(event) => setStage(event.target.value)}>
                <option value="new">1. 新学阶段</option><option value="consolidate">2. 理解巩固阶段</option><option value="improve">3. 能力提升阶段</option><option value="sprint">4. 综合冲刺阶段</option>
              </select>
            </label>
            <label><span>知识点类型</span>
              <select value={knowledgeType} onChange={(event) => setKnowledgeType(event.target.value)}>
                <option value="auto">让 AI 自动判断</option><option value="memory">记忆类</option><option value="process">过程机理类</option><option value="problem">计算／实验大题类</option><option value="application">综合应用类</option>
              </select>
            </label>
          </div>

          <div className="study-plan-fields">
            <label><span><CalendarDays size={15} /> 每周天数</span>
              <select value={daysPerWeek} onChange={(event) => setDaysPerWeek(event.target.value)}>{[2,3,4,5,6,7].map((value) => <option key={value} value={value}>{value} 天</option>)}</select>
            </label>
            <label><span><Clock3 size={15} /> 每天时长</span>
              <select value={minutesPerDay} onChange={(event) => setMinutesPerDay(event.target.value)}>{[15,20,30,45,60,90].map((value) => <option key={value} value={value}>{value} 分钟</option>)}</select>
            </label>
          </div>

          <label><span>这周特别想学什么？</span><input value={note} onChange={(event) => setNote(event.target.value)} maxLength={180} placeholder="例如：想弄懂物质跨膜运输，容易混淆主动运输和协助扩散" /></label>

          <details className="study-plan-advanced">
            <summary><SlidersHorizontal size={16} /> 自定义方法与动态触发</summary>
            <div className="study-plan-adaptive-fields">
              <label><span>近期正确率</span>
                <select value={performance} onChange={(event) => setPerformance(event.target.value)}>
                  <option value="auto">自动读取答题记录</option><option value="high">≥85%：推进并转入 SRS</option><option value="medium">50%–84%：刻意练习</option><option value="low">＜50%：退回基础模型</option>
                </select>
              </label>
              <div className="study-plan-signal-checks">
                <label><input type="checkbox" checked={conceptConfusion} onChange={(event) => setConceptConfusion(event.target.checked)} /><span>最近经常混淆相近概念</span></label>
                <label><input type="checkbox" checked={forgottenReview} onChange={(event) => setForgottenReview(event.target.checked)} /><span>SRS 复习时再次答错</span></label>
              </div>
            </div>

            <div className="study-plan-method-head"><div><b>主线方法开关</b><span>关闭后，调度器不会把这种方法排入计划。</span></div><em>{enabledMethods.length} / {methodOptions.length} 已开启</em></div>
            <div className="study-plan-method-grid">
              {methodOptions.map((method) => {
                const checked = enabledMethods.includes(method.key);
                return <label key={method.key} className={checked ? "active" : ""}>
                  <input type="checkbox" checked={checked} onChange={() => toggleMethod(method.key)} />
                  <span><b>{method.label}</b><small>{method.hint}</small></span>
                  <i aria-hidden="true" />
                </label>;
              })}
            </div>

            <label className={pblEnabled ? "study-plan-pbl-toggle active" : "study-plan-pbl-toggle"}>
              <input type="checkbox" checked={pblEnabled} onChange={(event) => setPblEnabled(event.target.checked)} />
              <FlaskConical size={18} />
              <span><b>开启 PBL 项目支线</b><small>额外生成一个探究项目，不占用、不替换主线学习任务。</small></span>
              <i aria-hidden="true" />
            </label>
          </details>

          <button type="submit" disabled={loading}>{loading ? <><LoaderCircle size={17} /> 正在匹配学习方法…</> : <><Sparkles size={17} /> 生成自适应学习计划</>}</button>
        </form>
        {error && <p className="study-plan-error" role="status">{error}</p>}
      </div>

      {plan && <section className="study-plan-result" aria-live="polite">
        <div className="study-plan-result-head"><div><span>{plan.mode === "doubao" ? "豆包 AI 已生成" : "智能学习草案"}</span><h2>{plan.title}</h2><p>{plan.summary}</p></div></div>

        <div className="study-plan-strategy">
          <div className="study-plan-strategy-head"><div><BrainCircuit size={18} /><b>本轮调度策略</b></div><span>{plan.strategy.performanceSource}</span></div>
          <div className="study-plan-strategy-facts">
            <div><small>阶段</small><strong>{plan.strategy.stage}</strong></div>
            <div><small>知识类型</small><strong>{plan.strategy.knowledgeType}</strong></div>
            <div><small>近期表现</small><strong>{plan.strategy.performance}</strong></div>
          </div>
          <div className="study-plan-active-methods">
            {plan.strategy.methods.map((method) => <span key={method.key}><b>{method.label}</b><small>{method.reason}</small></span>)}
          </div>
          <div className="study-plan-triggers">{plan.strategy.triggers.map((trigger) => <p key={trigger}>{trigger}</p>)}</div>
        </div>

        <div className="study-plan-focus"><b>本周重点</b>{plan.focus.map((item) => <span key={item}>{item}</span>)}</div>
        <div className="study-plan-sessions">{plan.sessions.map((session) => <article key={session.day}>
          <span>{session.day}</span><h3>{session.title}</h3><p>{session.topic}</p>
          <div className="study-plan-session-methods">{session.methods.map((method) => <em key={method}>{method}</em>)}</div>
          <ol>{session.tasks.map((task) => <li key={task}>{task}</li>)}</ol>
        </article>)}</div>

        {plan.sideProject && <aside className="study-plan-pbl-card">
          <div><FlaskConical size={19} /><span>PBL 可选支线</span></div>
          <h3>{plan.sideProject.title}</h3><p>{plan.sideProject.outcome}</p>
          <ol>{plan.sideProject.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        </aside>}

        <div className="study-plan-habits"><CheckCircle2 size={19} /><div><b>动态切换依据</b>{plan.habits.map((habit) => <span key={habit}>{habit}</span>)}</div></div>
      </section>}
    </section>
  );
}
