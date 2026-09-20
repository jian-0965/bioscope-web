"use client";

import { useMemo, useState } from "react";
import { Atom, Beaker, BookOpen, ChevronRight, Microscope, Sparkles, Zap } from "lucide-react";
import { scaleNodes } from "@/data/scaleNodes";

export default function ScaleExplorer() {
  const [index, setIndex] = useState(2);
  const [labOpen, setLabOpen] = useState(false);
  const [naOpen, setNaOpen] = useState(true);
  const [kOpen, setKOpen] = useState(true);
  const [stimulus, setStimulus] = useState(42);

  const node = scaleNodes[index];
  const membraneVoltage = useMemo(() => {
    if (!naOpen && !kOpen) return -70;
    if (stimulus < 50) return -70 + Math.round(stimulus * 0.18);
    if (naOpen && stimulus >= 50) return kOpen ? 30 : 42;
    return -62;
  }, [stimulus, naOpen, kOpen]);

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={16} /> BioScope · 生命尺度探索器</span>
          <h1>进入生命的微观世界</h1>
          <p>从人体到细胞，再到离子通道。不是翻目录，而是一路“放大”进去。</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => setIndex(0)}>从人体开始</button>
            <button className="secondary" onClick={() => { setIndex(2); setLabOpen(true); }}>进入神经元实验</button>
          </div>
        </div>

        <div className="life-orbit" aria-label="生命结构插画占位">
          <div className="orb orb-a">DNA</div>
          <div className="orb orb-b">CELL</div>
          <div className="orb orb-c">Na⁺</div>
          <div className="orb orb-d">K⁺</div>
          <div className="neuron-mark">✦</div>
          <p>这里后续替换成统一卡通插画与 Web 动效</p>
        </div>
      </section>

      <section className="explorer-card">
        <div className="scale-bar">
          {scaleNodes.map((item, i) => (
            <button key={item.id} className={i === index ? "scale-dot active" : "scale-dot"} onClick={() => setIndex(i)}>
              <span>{item.scale}</span>
            </button>
          ))}
        </div>

        <div className="workspace">
          <div className="world-panel">
            <div className="breadcrumb">人体 <ChevronRight size={14} /> 大脑 <ChevronRight size={14} /> {node.label}</div>
            <div className="specimen">
              <div className="specimen-glow" />
              <Microscope size={72} strokeWidth={1.3} />
              <strong>{node.label}</strong>
              <span>{node.subtitle}</span>
              <small>{node.scale}</small>
            </div>
            <div className="world-actions">
              <button onClick={() => setIndex(Math.max(0, index - 1))}>缩小一级</button>
              <button onClick={() => setIndex(Math.min(scaleNodes.length - 1, index + 1))}>放大一级</button>
            </div>
          </div>

          <aside className="knowledge-card">
            <div className="card-kicker"><BookOpen size={16} /> 知识卡</div>
            <h2>{node.label}</h2>
            <p className="muted">{node.description}</p>
            <div className="fact-list">
              {node.facts.map((fact) => <div key={fact}>• {fact}</div>)}
            </div>
            <div className="link-chips">{node.links.map((item) => <span key={item}>{item}</span>)}</div>
            <button className="lab-launch" onClick={() => setLabOpen((v) => !v)}>
              <Beaker size={17} /> {labOpen ? "收起实验室" : "打开互动实验"}
            </button>
          </aside>
        </div>
      </section>

      {labOpen && (
        <section className="lab-card">
          <div>
            <span className="eyebrow"><Zap size={15} /> 神经元实验室</span>
            <h2>改变离子通道，观察膜电位</h2>
            <p>这是第一版交互原型：后续会替换成真正的膜、离子流和动作电位动画。</p>
          </div>

          <div className="lab-grid">
            <div className="controls">
              <label>刺激强度 <strong>{stimulus}</strong></label>
              <input type="range" min="0" max="100" value={stimulus} onChange={(e) => setStimulus(Number(e.target.value))} />
              <button className={naOpen ? "toggle on" : "toggle"} onClick={() => setNaOpen((v) => !v)}>Na⁺ 通道：{naOpen ? "ON" : "OFF"}</button>
              <button className={kOpen ? "toggle on" : "toggle"} onClick={() => setKOpen((v) => !v)}>K⁺ 通道：{kOpen ? "ON" : "OFF"}</button>
            </div>

            <div className="voltage-panel">
              <Atom size={34} />
              <span>当前膜电位</span>
              <strong>{membraneVoltage} mV</strong>
              <small>{stimulus >= 50 && naOpen ? "达到阈值：动作电位触发" : "继续调节刺激或通道状态"}</small>
            </div>
          </div>
        </section>
      )}

      <section className="roadmap">
        <div><strong>探索</strong><span>尺度缩放与结构点击</span></div>
        <div><strong>实验</strong><span>改变变量，观察结果</span></div>
        <div><strong>发现</strong><span>科学史人物与论文证据链</span></div>
        <div><strong>挑战</strong><span>预测 → 实验 → 解释</span></div>
      </section>
    </main>
  );
}
