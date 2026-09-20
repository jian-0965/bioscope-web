"use client";

import { useMemo, useState } from "react";
import { Dna, FlaskConical, Gauge, Leaf } from "lucide-react";

export default function BiologyLabs() {
  const [parentA, setParentA] = useState("Aa");
  const [parentB, setParentB] = useState("Aa");
  const [temperature, setTemperature] = useState(37);
  const [ph, setPh] = useState(7);
  const [light, setLight] = useState(60);

  const inheritance = useMemo(() => {
    const allelesA = parentA.split("");
    const allelesB = parentB.split("");
    const counts: Record<string, number> = {};
    for (const a of allelesA) {
      for (const b of allelesB) {
        const genotype = [a, b].sort((x, y) => (x === x.toUpperCase() ? -1 : 1)).join("");
        counts[genotype] = (counts[genotype] ?? 0) + 1;
      }
    }
    return Object.entries(counts).map(([genotype, count]) => ({ genotype, percent: count * 25 }));
  }, [parentA, parentB]);

  const enzymeActivity = Math.max(
    0,
    Math.round(
      100 *
        Math.exp(-Math.pow((temperature - 37) / 14, 2)) *
        Math.exp(-Math.pow((ph - 7) / 2.3, 2)),
    ),
  );

  const photosynthesisRate = Math.round(100 * (1 - Math.exp(-light / 34)));

  return (
    <div className="labs-grid">
      <article className="lab-module">
        <span className="topic-card-label"><Dna size={16} /> 遗传实验</span>
        <h2>孟德尔杂交模拟</h2>
        <p>选择两个亲本基因型，观察子代基因型概率。</p>
        <div className="lab-select-row">
          <label>亲本 A<select value={parentA} onChange={(e) => setParentA(e.target.value)}><option>AA</option><option>Aa</option><option>aa</option></select></label>
          <label>亲本 B<select value={parentB} onChange={(e) => setParentB(e.target.value)}><option>AA</option><option>Aa</option><option>aa</option></select></label>
        </div>
        <div className="inheritance-results">
          {inheritance.map((item) => <div key={item.genotype}><strong>{item.genotype}</strong><span>{item.percent}%</span></div>)}
        </div>
      </article>

      <article className="lab-module">
        <span className="topic-card-label"><FlaskConical size={16} /> 生化实验</span>
        <h2>酶活性环境模拟</h2>
        <p>这是一个教学用简化模型，用来观察温度和 pH 偏离“最适条件”后的趋势。</p>
        <label className="lab-range">温度 <b>{temperature} °C</b><input type="range" min="0" max="80" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} /></label>
        <label className="lab-range">pH <b>{ph.toFixed(1)}</b><input type="range" min="1" max="14" step="0.1" value={ph} onChange={(e) => setPh(Number(e.target.value))} /></label>
        <div className="lab-gauge"><Gauge size={26} /><span>相对活性</span><strong>{enzymeActivity}%</strong></div>
      </article>

      <article className="lab-module">
        <span className="topic-card-label"><Leaf size={16} /> 植物实验</span>
        <h2>光强与光合作用</h2>
        <p>拖动光强，观察一个具有饱和趋势的简化光合响应曲线。</p>
        <label className="lab-range">相对光强 <b>{light}%</b><input type="range" min="0" max="100" value={light} onChange={(e) => setLight(Number(e.target.value))} /></label>
        <div className="photosynthesis-meter"><span style={{ width: photosynthesisRate + "%" }} /></div>
        <div className="lab-gauge"><Leaf size={26} /><span>相对光合速率</span><strong>{photosynthesisRate}%</strong></div>
      </article>
    </div>
  );
}
