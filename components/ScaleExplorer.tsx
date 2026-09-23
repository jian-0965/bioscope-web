"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Atom,
  Beaker,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Database,
  FlaskConical,
  Lightbulb,
  Microscope,
  ScrollText,
  Sparkles,
  Zap,
} from "lucide-react";
import ActionPotentialChart from "@/components/ActionPotentialChart";
import HumanSystemsMap from "@/components/HumanSystemsMap";
import MascotGuide from "@/components/MascotGuide";
import NeuronScene from "@/components/NeuronScene";
import SiteHeader from "@/components/SiteHeader";
import { scaleNodes as fallbackScaleNodes, type ScaleNode } from "@/data/scaleNodes";
import { supabase } from "@/lib/supabase";

type NeuronPart = "dendrite" | "soma" | "axon" | "synapse";
type DataStatus = "loading" | "live" | "fallback";

type KnowledgeCard = {
  structure_id: string;
  title: string;
  summary: string | null;
  body: string | null;
  card_type: string;
  display_order: number;
};

type Paper = {
  id?: number;
  title: string;
  journal: string | null;
  publication_year: number | null;
  url: string | null;
  abstract_summary: string | null;
};

type Discovery = {
  id: number;
  title: string;
  discovery_year: number | null;
  summary: string | null;
  source_url: string | null;
  structure_id: string | null;
  scientists: {
    name: string;
    name_zh: string | null;
    bio: string | null;
  } | null;
};

type ProgressItem = {
  node_id: string;
  bookmarked: boolean;
  completed: boolean;
};

const partInfo: Record<NeuronPart, { title: string; en: string; body: string; facts: string[] }> = {
  dendrite: {
    title: "树突",
    en: "Dendrite",
    body: "树突像神经元伸出的“接收天线”，接收来自其他细胞的大量输入。",
    facts: ["表面可形成大量突触连接", "不同输入会在胞体附近被整合"],
  },
  soma: {
    title: "胞体",
    en: "Soma",
    body: "胞体包含细胞核与主要细胞器，是神经元维持代谢和整合信号的重要区域。",
    facts: ["维持神经元基本生命活动", "整合树突传来的电信号"],
  },
  axon: {
    title: "轴突",
    en: "Axon",
    body: "轴突把动作电位从胞体附近传向远处。髓鞘可以显著提高传播效率。",
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
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [dataStatus, setDataStatus] = useState<DataStatus>("loading");
  const [userId, setUserId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, ProgressItem>>({});

  const [index, setIndex] = useState(2);
  const [labOpen, setLabOpen] = useState(true);
  const [naOpen, setNaOpen] = useState(true);
  const [kOpen, setKOpen] = useState(true);
  const [stimulus, setStimulus] = useState(62);
  const [threshold, setThreshold] = useState(50);
  const [restingMv, setRestingMv] = useState(-70);
  const [peakMv, setPeakMv] = useState(30);
  const [selectedPart, setSelectedPart] = useState<NeuronPart>("soma");
  const [cardMode, setCardMode] = useState<"overview" | "what_if">("overview");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const authResult = await supabase.auth.getUser();
      const authUser = authResult.data.user;
      if (!cancelled && authUser) {
        setUserId(authUser.id);
      }

      try {
        const [
          structuresResult,
          cardsResult,
          papersResult,
          discoveriesResult,
          experimentResult,
          variablesResult,
          progressResult,
        ] = await Promise.all([
          supabase.from("structures").select("id,name_zh,name_en,scale_label,description,display_order").order("display_order"),
          supabase.from("knowledge_cards").select("structure_id,title,summary,body,card_type,display_order").order("display_order"),
          supabase.from("papers").select("id,title,journal,publication_year,url,abstract_summary").order("publication_year"),
          supabase.from("discoveries").select("id,title,discovery_year,summary,source_url,structure_id,scientists(name,name_zh,bio)").order("discovery_year"),
          supabase.from("experiments").select("config").eq("id", "neuron-action-potential").maybeSingle(),
          supabase.from("experiment_variables").select("key,default_value,config").eq("experiment_id", "neuron-action-potential"),
          authUser
            ? supabase.from("user_progress").select("node_id,bookmarked,completed").eq("user_id", authUser.id)
            : Promise.resolve({ data: [], error: null }),
        ]);

        const firstError =
          structuresResult.error ||
          cardsResult.error ||
          papersResult.error ||
          discoveriesResult.error ||
          experimentResult.error ||
          variablesResult.error ||
          progressResult.error;

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
        setDiscoveries((discoveriesResult.data ?? []) as unknown as Discovery[]);

        const nextProgress: Record<string, ProgressItem> = {};
        for (const item of (progressResult.data ?? []) as ProgressItem[]) {
          nextProgress[item.node_id] = item;
        }
        setProgress(nextProgress);

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
          if (variable.config && typeof variable.config === "object" && !Array.isArray(variable.config)) {
            const variableConfig = variable.config as Record<string, unknown>;
            if (variable.key === "sodium_channel" && typeof variableConfig.default === "boolean") setNaOpen(variableConfig.default);
            if (variable.key === "potassium_channel" && typeof variableConfig.default === "boolean") setKOpen(variableConfig.default);
          }
        }

        setDataStatus("live");
      } catch (error) {
        console.error("BioScope content load failed:", error);
        if (!cancelled) setDataStatus("fallback");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const safeIndex = Math.min(index, Math.max(scaleNodes.length - 1, 0));
  const node = scaleNodes[safeIndex] ?? fallbackScaleNodes[0];
  const selectedInfo = partInfo[selectedPart];
  const nodeCards = knowledgeCards.filter((card) => card.structure_id === node.id);
  const dbCard =
    nodeCards.find((card) => card.card_type === cardMode) ??
    nodeCards.find((card) => card.card_type === "overview");

  const membraneVoltage = useMemo(() => {
    if (!naOpen && !kOpen) return restingMv;
    if (stimulus < threshold) return restingMv + Math.round(stimulus * 0.18);
    if (naOpen && stimulus >= threshold) return kOpen ? peakMv : peakMv + 12;
    return restingMv + 8;
  }, [stimulus, naOpen, kOpen, threshold, restingMv, peakMv]);

  const firing = stimulus >= threshold && naOpen;
  const currentProgress = progress[node.id];
  const completedCount = Object.values(progress).filter((item) => item.completed).length;

  async function saveProgress(nodeId: string, patch: Partial<ProgressItem>) {
    if (!userId) return;
    const existing = progress[nodeId] ?? { node_id: nodeId, bookmarked: false, completed: false };
    const next = { ...existing, ...patch };
    setProgress((old) => ({ ...old, [nodeId]: next }));

    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: userId,
        node_id: nodeId,
        bookmarked: next.bookmarked,
        completed: next.completed,
        last_visited_at: new Date().toISOString(),
      },
      { onConflict: "user_id,node_id" },
    );

    if (error) console.error("Unable to save progress:", error);
  }

  function selectScale(i: number) {
    setIndex(i);
    const nextNode = scaleNodes[i];
    if (nextNode) void saveProgress(nextNode.id, {});
  }

  async function toggleBookmark() {
    if (!userId) {
      window.location.href = "/auth?next=/";
      return;
    }
    await saveProgress(node.id, { bookmarked: !currentProgress?.bookmarked });
  }

  async function markCompleted() {
    if (!userId) {
      window.location.href = "/auth?next=/";
      return;
    }
    await saveProgress(node.id, { completed: !currentProgress?.completed });
  }

  return (
    <main className="page-shell">
      <SiteHeader signedIn={Boolean(userId)} />

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow"><Sparkles size={16} /> BioScope · 生命尺度探索器</span>
            <span className={dataStatus === "live" ? "data-badge live" : "data-badge"}>
              <Database size={13} />
              {dataStatus === "loading" ? "连接数据库中" : dataStatus === "live" ? "Supabase 实时内容" : "本地备用内容"}
            </span>
          </div>
          <h1>进入生命的<br />微观世界</h1>
          <p>从人体一路放大到细胞与离子通道。点击结构、改变变量、阅读经典论文，再亲眼看看生命系统如何运作。</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => selectScale(0)}>开始探索生命</button>
            <button className="secondary" onClick={() => { selectScale(2); setLabOpen(true); document.querySelector("#lab")?.scrollIntoView({ behavior: "smooth" }); }}>体验神经元实验</button>
          </div>
          <div className="hero-stats">
            <div><strong>{scaleNodes.length}</strong><span>尺度层级</span></div>
            <div><strong>{papers.length || 3}</strong><span>经典论文</span></div>
            <div><strong>{discoveries.length || 4}</strong><span>科学史节点</span></div>
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

      <section className="mascot-duo-section" aria-label="BioScope 学习导师">
        <MascotGuide
          mentor="girl"
          message="第一次来 BioScope？先不用急着学细节。我会帮你选路线、记录进度，再一步一步把知识连起来。"
          actionHref="/paths"
          actionLabel="让我带你选学习路线"
        />
        <MascotGuide
          mentor="boy"
          message="遇到机制问题就来找我。我们会从结构、变量和实验结果出发，一起弄清楚生命系统为什么这样运作。"
          actionHref="/labs"
          actionLabel="跟我做一个互动实验"
        />
      </section>

      <section className="explorer-card" id="explorer">
        <div className="section-heading">
          <div>
            <span className="eyebrow"><Microscope size={16} /> 尺度探索</span>
            <h2>一路放大，直到分子级世界</h2>
          </div>
          {userId && <span className="signed-in-note">已登录 · {completedCount}/{scaleNodes.length} 已完成</span>}
        </div>

        <div className="scale-bar">
          {scaleNodes.map((item, i) => (
            <button key={item.id} className={i === safeIndex ? "scale-dot active" : "scale-dot"} onClick={() => selectScale(i)}>
              <b>{item.label}</b>
              <span>{item.scale}</span>
              {progress[item.id]?.completed && <CheckCircle2 size={13} className="scale-check" />}
            </button>
          ))}
        </div>

        <div className="workspace">
          <div className="world-panel">
            <div className="breadcrumb">
              {node.id === "human" ? (
                <>人体系统总览</>
              ) : (
                <>人体 <ChevronRight size={14} /> 大脑 <ChevronRight size={14} /> {node.label}</>
              )}
            </div>

            {node.id === "human" ? (
              <HumanSystemsMap
                onOpenNervous={() => {
                  const brainIndex = scaleNodes.findIndex((item) => item.id === "brain");
                  if (brainIndex >= 0) selectScale(brainIndex);
                }}
              />
            ) : node.id === "neuron" ? (
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
              <button onClick={() => selectScale(Math.max(0, safeIndex - 1))}>缩小一级</button>
              <button onClick={() => selectScale(Math.min(scaleNodes.length - 1, safeIndex + 1))}>放大一级</button>
            </div>
          </div>

          <aside className="knowledge-card">
            <div className="knowledge-toolbar">
              <div className="card-kicker"><BookOpen size={16} /> 知识卡</div>
              <button className="icon-button" onClick={toggleBookmark} aria-label="收藏当前知识点">
                {currentProgress?.bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
            </div>

            {node.id === "neuron" && cardMode === "overview" ? (
              <>
                <h2>{selectedInfo.title}</h2>
                <div className="latin-name">{selectedInfo.en}</div>
                <p className="muted">{selectedInfo.body}</p>
                <div className="fact-list">{selectedInfo.facts.map((fact) => <div key={fact}>• {fact}</div>)}</div>
              </>
            ) : (
              <>
                <h2>{dbCard?.title ?? node.label}</h2>
                <div className="latin-name">{node.subtitle}</div>
                <p className="muted">{dbCard?.summary ?? node.description}</p>
                {dbCard?.body && <div className="db-card-body">{dbCard.body}</div>}
              </>
            )}

            {nodeCards.some((card) => card.card_type === "what_if") && (
              <div className="card-tabs">
                <button className={cardMode === "overview" ? "active" : ""} onClick={() => setCardMode("overview")}>基础</button>
                <button className={cardMode === "what_if" ? "active" : ""} onClick={() => setCardMode("what_if")}><Lightbulb size={14} /> 如果……会怎样？</button>
              </div>
            )}

            <div className="link-chips">{node.links.map((item) => <span key={item}>{item}</span>)}</div>

            <div className="knowledge-actions">
              <button className="lab-launch" onClick={() => setLabOpen((v) => !v)}>
                <Beaker size={17} /> {labOpen ? "收起实验室" : "打开互动实验"}
              </button>
              <button className={currentProgress?.completed ? "complete-button done" : "complete-button"} onClick={markCompleted}>
                <CheckCircle2 size={16} /> {currentProgress?.completed ? "已完成" : "标记学会"}
              </button>
            </div>
          </aside>
        </div>
      </section>

      {labOpen && (
        <section className="lab-card" id="lab">
          <div className="lab-title-row">
            <div>
              <span className="eyebrow"><Zap size={15} /> 神经元实验室</span>
              <h2>亲手触发一次动作电位</h2>
              <p>改变刺激与通道状态，观察离子运动和膜电位曲线。参数由 Supabase 实验配置驱动。</p>
            </div>
            <div className={firing ? "experiment-badge live" : "experiment-badge"}>{firing ? "动作电位触发" : "等待刺激"}</div>
          </div>

          <div className="lab-grid advanced">
            <div className="controls">
              <div className="control-heading"><FlaskConical size={18} /> 实验控制</div>
              <label>刺激强度 <strong>{stimulus}</strong></label>
              <input type="range" min="0" max="100" value={stimulus} onChange={(e) => setStimulus(Number(e.target.value))} />
              <div className="threshold-note">触发阈值：{threshold}</div>
              <button className={naOpen ? "toggle on" : "toggle"} onClick={() => setNaOpen((v) => !v)}>
                <span className="ion-dot sodium">Na⁺</span> Na⁺ 通道：{naOpen ? "开启" : "关闭"}
              </button>
              <button className={kOpen ? "toggle on" : "toggle"} onClick={() => setKOpen((v) => !v)}>
                <span className="ion-dot potassium">K⁺</span> K⁺ 通道：{kOpen ? "开启" : "关闭"}
              </button>
              <div className="mini-task">
                <strong>实验挑战</strong>
                <span>关闭 Na⁺ 通道，把刺激拉到 100。预测结果后，再观察曲线。</span>
              </div>
            </div>

            <div className="membrane-sim">
              <div className="membrane-label top">细胞外</div>
              <div className="ion-field extracellular">
                {[0,1,2,3,4,5].map((i) => (
                  <span key={"na"+i} className={naOpen && firing ? "ion sodium moving-in" : "ion sodium"} style={{ left: (12 + i * 14) + "%" }}>Na⁺</span>
                ))}
                {[0,1,2].map((i) => <span key={"ko"+i} className="ion potassium faint" style={{ left: (28 + i * 22) + "%" }}>K⁺</span>)}
              </div>
              <div className="membrane-band">
                <div className={naOpen ? "channel channel-na open" : "channel channel-na"}><span>Na⁺</span></div>
                <div className={kOpen ? "channel channel-k open" : "channel channel-k"}><span>K⁺</span></div>
              </div>
              <div className="ion-field intracellular">
                {[0,1,2,3,4].map((i) => (
                  <span key={"ki"+i} className={kOpen && firing ? "ion potassium moving-out" : "ion potassium"} style={{ left: (10 + i * 17) + "%" }}>K⁺</span>
                ))}
                {[0,1].map((i) => <span key={"nai"+i} className="ion sodium faint" style={{ left: (55 + i * 19) + "%" }}>Na⁺</span>)}
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

          <ActionPotentialChart
            stimulus={stimulus}
            sodiumOpen={naOpen}
            potassiumOpen={kOpen}
            threshold={threshold}
            restingMv={restingMv}
          />
        </section>
      )}

      <section className="discovery-section" id="discoveries">
        <div className="section-heading">
          <div>
            <span className="eyebrow"><ScrollText size={15} /> 人类是怎么知道的？</span>
            <h2>从现象，到实验，再到模型</h2>
          </div>
          <p>把论文放回发现过程里，而不是藏在参考文献最后。</p>
        </div>
        <div className="timeline">
          {(discoveries.length ? discoveries : [
            { id: 1, title: "动作电位离子机制的定量描述", discovery_year: 1952, summary: "Hodgkin 与 Huxley 用乌贼巨轴突实验与数学模型描述 Na⁺、K⁺ 电导变化。", source_url: null, structure_id: "neuron", scientists: { name: "Alan Hodgkin & Andrew Huxley", name_zh: "霍奇金与赫胥黎", bio: null } },
            { id: 2, title: "膜片钳推动单通道研究", discovery_year: 1981, summary: "高分辨率膜片钳让研究者直接记录极微小膜电流。", source_url: null, structure_id: "ion-channel", scientists: { name: "Erwin Neher & Bert Sakmann", name_zh: "内尔与萨克曼", bio: null } },
          ]).map((item) => (
            <article className="timeline-item" key={item.id}>
              <div className="timeline-year">{item.discovery_year ?? "—"}</div>
              <div className="scientist-mini">
                <span>{item.scientists?.name.split(" ").map((part) => part[0]).join("").slice(0, 2) || "SC"}</span>
              </div>
              <div>
                <h3>{item.title}</h3>
                <p className="timeline-scientist">{item.scientists?.name_zh || item.scientists?.name}</p>
                <p>{item.summary}</p>
                {item.source_url && <a href={item.source_url} target="_blank" rel="noreferrer">查看原始研究 ↗</a>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="papers-section" id="papers">
        <div className="section-heading">
          <div>
            <span className="eyebrow"><BookOpen size={15} /> 证据层</span>
            <h2>经典论文，不再只是一个链接</h2>
          </div>
          <p>每篇论文都解释它解决了什么问题，以及为什么值得继续读。</p>
        </div>
        <div className="paper-grid">
          {papers.map((paper) => (
            <article className="evidence-card" key={paper.id ?? paper.title}>
              <div className="paper-meta">{paper.publication_year ?? "—"} · {paper.journal ?? "Journal"}</div>
              <h3>{paper.title}</h3>
              <p>{paper.abstract_summary}</p>
              {paper.url && <a href={paper.url} target="_blank" rel="noreferrer">打开 DOI / 原文 ↗</a>}
            </article>
          ))}
        </div>
      </section>

      <section className="whole-biology-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow"><Sparkles size={15} /> 生物学全景</span>
            <h2>神经元不是终点，而是整张生命地图的一条路径</h2>
          </div>
          <p>人体、细胞、遗传、代谢、微生物、植物、进化和生态已经接入同一套探索结构。</p>
        </div>
        <div className="whole-biology-actions">
          <a href="/atlas" className="primary cta-link">打开生物学全景地图</a>
          <a href="/labs" className="secondary cta-link">进入互动实验室</a>
          <a href="/challenges" className="secondary cta-link">挑战我的理解</a>
          <a href="/glossary" className="secondary cta-link">打开生物学词典</a>
        </div>
      </section>

      <section className="final-cta">
        <div>
          <span className="eyebrow">下一步：继续进入生命内部</span>
          <h2>神经元只是第一章。</h2>
          <p>同一套尺度、知识卡、论文和实验系统，可以继续扩展到线粒体、DNA、免疫系统和更多生命过程。</p>
        </div>
        <a className="primary cta-link" href={userId ? "/dashboard" : "/auth"}>{userId ? "查看我的探索进度" : "登录并保存进度"}</a>
      </section>

      <footer className="site-footer">
        <span>BioScope · 生物科学可视化科普平台</span>
        <span>Explore · Experiment · Discover</span>
      </footer>
    </main>
  );
}
