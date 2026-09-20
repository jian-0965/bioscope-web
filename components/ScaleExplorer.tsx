"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Atom,
  Beaker,
  BookOpen,
  ChevronRight,
  Database,
  FlaskConical,
  Microscope,
  ScrollText,
  Sparkles,
  Zap,
} from "lucide-react";
import ActionPotentialChart from "@/components/ActionPotentialChart";
import NeuronScene from "@/components/NeuronScene";
import { scaleNodes as fallbackScaleNodes, type ScaleNode } from "@/data/scaleNodes";
import { supabase } from "@/lib/supabase";

type NeuronPart = "dendrite" | "soma" | "axon" | "synapse";

type KnowledgeCard = {
  structure_id: string;
  title: string;
  summary: string | null;
  body: string | null;
};

type Paper = {
  title: string;
  journal: string | null;
  publication_year: number | null;
  url: string | null;
  abstract_summary: string | null;
};

type Scientist = {
  name: string;
  name_zh: string | null;
  bio: string | null;
};

const partInfo: Record<NeuronPart, { title: string; en: string; body: string; facts: string[] }> = {
  dendrite: {
    title: "树突",
    en: "Dendrite",
    body: "树突像神经元伸出的“接收天线”，负责接收来自其他细胞的大量输入。",
    facts: ["表面可形成大量突触连接", "不同输入会在胞体附近被整合"],
  },
  soma: {
    title: "胞体",
    en: "Soma",
    body: "胞体包含细胞核与主要细胞器，也是神经元进行代谢和整合信号的重要区域。",
    facts: ["维持神经元基本生命活动", "整合树突传来的电信号"],
  },
  axon: {
    title: "轴突",
    en: "Axon",
    body: "轴突负责把动作电位从胞体附近传到远处。髓鞘可以显著提高信号传播效率。",
    facts: ["动作电位沿轴突传播", "郎飞结参与跳跃式传导"],
  },
  synapse: {
    title: "突触末梢",
    en: "Synaptic terminal",
    body: "动作电位到达末梢后，会触发神经递质释放，把信息传给下一个细胞。",
    facts: ["囊泡可释放神经递质", "化学突触把电信号转换成化学信号"],
  },
};

export default function ScaleExplorer() {
  const [scaleNodes, setScaleNodes] = useState<ScaleNode[]>(fallbackScaleNodes);
  const [knowledgeCards, setKnowledgeCards] = useState<KnowledgeCard[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [scientists, setScientists] = useState<Scientist[]>([]);
  const [dataStatus, setDataStatus] = useState<"loading" | "live" | "fallback">("loading");

  const [index, setIndex] = useState(2);
  const [labOpen, setLabOpen] = useState(true);
  const [naOpen, setNaOpen] = useState(true);
  const [kOpen, setKOpen] = useState(true);
  const [stimulus, setStimulus] = useState(62);
  const [threshold, setThreshold] = useState(50);
  const [restingMv, setRestingMv] = useState(-70);
  const [peakMv, setPeakMv] = useState(30);
  const [selectedPart, setSelectedPart] = useState<NeuronPart>("soma");

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        const [structuresResult, cardsResult, papersResult, scientistsResult, experimentResult, variablesResult] =
          await Promise.all([
            supabase
              .from("structures")
              .select("id,name_zh,name_en,scale_label,description,display_order")
              .order("display_order"),
            supabase
              .from("knowledge_cards")
              .select("structure_id,title,summary,body,display_order")
              .order("display_order"),
            supabase
              .from("papers")
              .select("title,journal,publication_year,url,abstract_summary")
              .order("publication_year", { ascending: true }),
            supabase
              .from("scientists")
              .select("name,name_zh,bio")
              .order("id"),
            supabase
              .from("experiments")
              .select("config")
              .eq("id", "neuron-action-potential")
              .maybeSingle(),
            supabase
              .from("experiment_variables")
              .select("key,default_value,config")
              .eq("experiment_id", "neuron-action-potential"),
          ]);

        const firstError =
          structuresResult.error ||
          cardsResult.error ||
          papersResult.error ||
          scientistsResult.error ||
          experimentResult.error ||
          variablesResult.error;

        if (firstError) throw firstError;
        if (cancelled) return;

        if (structuresResult.data?.length) {
          const localLinks = new Map(fallbackScaleNodes.map((node) => [node.id, node.links]));
          setScaleNodes(
            structuresResult.data.map((row) => ({
              id: row.id,
              label: row.name_zh,
              subtitle: row.name_en ?? "",
              scale: row.scale_label ?? "—",
              description: row.description ?? "",
              facts: [],
              links: localLinks.get(row.id) ?? [],
            })),
          );
        }

        setKnowledgeCards((cardsResult.data ?? []) as KnowledgeCard[]);
        setPapers((papersResult.data ?? []) as Paper[]);
        setScientists((scientistsResult.data ?? []) as Scientist[]);

        const config = experimentResult.data?.config;
        if (config && typeof config === "object" && !Array.isArray(config)) {
          const record = config as Record<string, unknown>;
          if (typeof record.threshold === "number") setThreshold(record.threshold);
          if (typeof record.resting_mv === "number") setRestingMv(record.resting_mv);
          if (typeof record.peak_mv === "number") setPeakMv(record.peak_mv);
        }

        for (const variable of variablesResult.data ?? []) {
          if (variable.key === "stimulus" && typeof variable.default_value === "number") {
            setStimulus(variable.default_value);
          }
          if (variable.key === "sodium_channel" && variable.config && typeof variable.config === "object") {
            const config = variable.config as Record<string, unknown>;
            if (typeof config.default === "boolean") setNaOpen(config.default);
          }
          if (variable.key === "potassium_channel" && variable.config && typeof variable.config === "object") {
            const config = variable.config as Record<string, unknown>;
            if (typeof config.default === "boolean") setKOpen(config.default);
          }
        }

        setDataStatus("live");
      } catch (error) {
        console.error("BioScope Supabase load failed:", error);
        if (!cancelled) setDataStatus("fallback");
      }
    }

    loadContent();
    return () => {
      cancelled = true;
    };
  }, []);

  const safeIndex = Math.min(index, Math.max(scaleNodes.length - 1, 0));
  const node = scaleNodes[safeIndex] ?? fallbackScaleNodes[0];
  const selectedInfo = partInfo[selectedPart];
  const dbCard = knowledgeCards.find((card) => card.structure_id === node.id);
  const featuredPaper = papers[0];
  const featuredScientists = scientists.slice(0, 2);

  const membraneVoltage = useMemo(() => {
    if (!naOpen && !kOpen) return restingMv;
    if (stimulus < threshold) return restingMv + Math.round(stimulus * 0.18);
    if (naOpen && stimulus >= threshold) return kOpen ? peakMv : peakMv + 12;
    return restingMv + 8;
  }, [stimulus, naOpen, kOpen, threshold, restingMv, peakMv]);

  const firing = stimulus >= threshold && naOpen;

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow"><Sparkles size={16} /> BioScope · 生命尺度探索器</span>
            <span className={dataStatus === "live" ? "data-badge live" : "data-badge"}>
              <Database size={13} />
              {dataStatus === "loading" ? "连接数据库中" : dataStatus === "live" ? "Supabase 实时内容" : "本地备用内容"}
            </span>
          </div>
          <h1>进入生命的微观世界</h1>
          <p>从人体一路放大到细胞与离子通道。点击结构、改变变量，再亲眼看看生命系统会发生什么。</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => setIndex(0)}>从人体开始</button>
            <button className="secondary" onClick={() => { setIndex(2); setLabOpen(true); }}>直接体验神经元</button>
          </div>
        </div>

        <div className="life-orbit" aria-label="生命尺度视觉概念">
          <div className="hero-cell">
            <span className="hero-nucleus" />
            <span className="organelle one" />
            <span className="organelle two" />
            <span className="organelle three" />
          </div>
          <div className="dna-ribbon">DNA</div>
          <div className="orb orb-c">Na⁺</div>
          <div className="orb orb-d">K⁺</div>
          <div className="micro-copy">
            <strong>从 1 m 到 1 nm</strong>
            <span>不是翻页，是进入生命内部。</span>
          </div>
        </div>
      </section>

      <section className="explorer-card">
        <div className="scale-bar">
          {scaleNodes.map((item, i) => (
            <button key={item.id} className={i === safeIndex ? "scale-dot active" : "scale-dot"} onClick={() => setIndex(i)}>
              <b>{item.label}</b>
              <span>{item.scale}</span>
            </button>
          ))}
        </div>

        <div className="workspace">
          <div className="world-panel">
            <div className="breadcrumb">人体 <ChevronRight size={14} /> 大脑 <ChevronRight size={14} /> {node.label}</div>

            {node.id === "neuron" ? (
              <NeuronScene selected={selectedPart} onSelect={setSelectedPart} />
            ) : (
              <div className="specimen">
                <div className="specimen-glow" />
                <Microscope size={72} strokeWidth={1.3} />
                <strong>{node.label}</strong>
                <span>{node.subtitle}</span>
                <small>{node.scale}</small>
              </div>
            )}

            <div className="world-actions">
              <button onClick={() => setIndex(Math.max(0, safeIndex - 1))}>缩小一级</button>
              <button onClick={() => setIndex(Math.min(scaleNodes.length - 1, safeIndex + 1))}>放大一级</button>
            </div>
          </div>

          <aside className="knowledge-card">
            <div className="card-kicker"><BookOpen size={16} /> 知识卡</div>

            {node.id === "neuron" ? (
              <>
                <h2>{selectedInfo.title}</h2>
                <div className="latin-name">{selectedInfo.en}</div>
                <p className="muted">{selectedInfo.body}</p>
                <div className="fact-list">
                  {selectedInfo.facts.map((fact) => <div key={fact}>• {fact}</div>)}
                </div>
              </>
            ) : (
              <>
                <h2>{dbCard?.title ?? node.label}</h2>
                <div className="latin-name">{node.subtitle}</div>
                <p className="muted">{dbCard?.summary ?? node.description}</p>
                {dbCard?.body && <div className="db-card-body">{dbCard.body}</div>}
              </>
            )}

            <div className="link-chips">{node.links.map((item) => <span key={item}>{item}</span>)}</div>
            <button className="lab-launch" onClick={() => setLabOpen((v) => !v)}>
              <Beaker size={17} /> {labOpen ? "收起实验室" : "打开互动实验"}
            </button>
          </aside>
        </div>
      </section>

      {labOpen && (
        <section className="lab-card">
          <div className="lab-title-row">
            <div>
              <span className="eyebrow"><Zap size={15} /> 神经元实验室</span>
              <h2>亲手触发一次动作电位</h2>
              <p>这些默认实验参数现在已经从 Supabase 读取。调整刺激强度、关闭离子通道，再观察膜电位曲线。</p>
            </div>
            <div className={firing ? "experiment-badge live" : "experiment-badge"}>
              {firing ? "实验进行中" : "等待刺激"}
            </div>
          </div>

          <div className="lab-grid advanced">
            <div className="controls">
              <div className="control-heading"><FlaskConical size={18} /> 实验控制</div>
              <label>刺激强度 <strong>{stimulus}</strong></label>
              <input type="range" min="0" max="100" value={stimulus} onChange={(e) => setStimulus(Number(e.target.value))} />
              <div className="threshold-note">数据库阈值：{threshold}</div>
              <button className={naOpen ? "toggle on" : "toggle"} onClick={() => setNaOpen((v) => !v)}>
                <span className="ion-dot sodium">Na⁺</span> Na⁺ 通道：{naOpen ? "开启" : "关闭"}
              </button>
              <button className={kOpen ? "toggle on" : "toggle"} onClick={() => setKOpen((v) => !v)}>
                <span className="ion-dot potassium">K⁺</span> K⁺ 通道：{kOpen ? "开启" : "关闭"}
              </button>

              <div className="mini-task">
                <strong>挑战</strong>
                <span>关闭 Na⁺ 通道后，把刺激拉到 100，看看还能不能触发动作电位。</span>
              </div>
            </div>

            <div className="membrane-sim">
              <div className="membrane-label top">细胞外</div>
              <div className="ion-field extracellular">
                {[0,1,2,3,4,5].map((i) => (
                  <span key={"na"+i} className={naOpen && firing ? "ion sodium moving-in" : "ion sodium"} style={{ left: (12 + i * 14) + "%" }}>Na⁺</span>
                ))}
                {[0,1,2].map((i) => (
                  <span key={"ko"+i} className="ion potassium faint" style={{ left: (28 + i * 22) + "%" }}>K⁺</span>
                ))}
              </div>

              <div className="membrane-band">
                <div className={naOpen ? "channel channel-na open" : "channel channel-na"}><span>Na⁺</span></div>
                <div className={kOpen ? "channel channel-k open" : "channel channel-k"}><span>K⁺</span></div>
              </div>

              <div className="ion-field intracellular">
                {[0,1,2,3,4].map((i) => (
                  <span key={"ki"+i} className={kOpen && firing ? "ion potassium moving-out" : "ion potassium"} style={{ left: (10 + i * 17) + "%" }}>K⁺</span>
                ))}
                {[0,1].map((i) => (
                  <span key={"nai"+i} className="ion sodium faint" style={{ left: (55 + i * 19) + "%" }}>Na⁺</span>
                ))}
              </div>
              <div className="membrane-label bottom">细胞内</div>
            </div>

            <div className="voltage-panel">
              <Atom size={30} />
              <span>当前膜电位</span>
              <strong>{membraneVoltage} mV</strong>
              <small>{firing ? "达到阈值：Na⁺ 内流触发快速去极化" : "尚未达到触发动作电位的条件"}</small>
            </div>
          </div>

          <ActionPotentialChart stimulus={stimulus} sodiumOpen={naOpen} potassiumOpen={kOpen} />
        </section>
      )}

      <section className="story-grid">
        <article className="scientist-card">
          <div className="scientist-avatar">
            <div className="hair" />
            <div className="face">HH</div>
          </div>
          <div>
            <span className="eyebrow"><ScrollText size={15} /> 科学史讲解</span>
            <h3>
              {featuredScientists.length
                ? featuredScientists.map((scientist) => scientist.name.split(" ").slice(-1)[0]).join(" & ")
                : "Hodgkin & Huxley"}
            </h3>
            <p>
              {featuredScientists[0]?.bio ??
                "“别只记住动作电位的形状。真正关键的问题是：膜对 Na⁺ 和 K⁺ 的通透性，为什么会随时间改变？”"}
            </p>
          </div>
        </article>

        <article className="paper-card">
          <span className="eyebrow"><BookOpen size={15} /> 数据库论文</span>
          <h3>{featuredPaper?.title ?? "A quantitative description of membrane current..."}</h3>
          <p>
            {featuredPaper
              ? [featuredPaper.publication_year, featuredPaper.journal].filter(Boolean).join(" · ")
              : "1952 · The Journal of Physiology"}
          </p>
          {featuredPaper?.abstract_summary && <p className="paper-summary">{featuredPaper.abstract_summary}</p>}
          <a
            href={featuredPaper?.url ?? "https://doi.org/10.1113/jphysiol.1952.sp004764"}
            target="_blank"
            rel="noreferrer"
          >
            打开论文 ↗
          </a>
        </article>
      </section>

      <section className="roadmap">
        <div><strong>探索</strong><span>尺度缩放与结构点击</span></div>
        <div><strong>实验</strong><span>改变变量，观察结果</span></div>
        <div><strong>发现</strong><span>科学史人物与论文证据链</span></div>
        <div><strong>挑战</strong><span>预测 → 实验 → 解释</span></div>
      </section>
    </main>
  );
}
