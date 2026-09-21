"use client";

import { useMemo, useState } from "react";
import { Beaker, BrainCircuit, CheckCircle2, RotateCcw, SlidersHorizontal } from "lucide-react";
import AIMentorChat from "@/components/AIMentorChat";

type ExperimentPreset = {
  domain: string;
  title: string;
  variableA: string;
  variableB: string;
  unitA: string;
  unitB: string;
  minA: number;
  maxA: number;
  minB: number;
  maxB: number;
  defaultA: number;
  defaultB: number;
  explain: string;
  calculate: (a: number, b: number) => { value: number; label: string; note: string };
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export const experimentPresets: Record<string, ExperimentPreset> = {
  human: {
    domain: "human", title: "人体稳态调节模拟", variableA: "生理负荷", variableB: "调节能力", unitA: "%", unitB: "%",
    minA: 0, maxA: 100, minB: 0, maxB: 100, defaultA: 55, defaultB: 75,
    explain: "观察外界负荷和机体调节能力如何共同影响稳态。",
    calculate: (a,b) => {
      const v=clamp(100-(a*0.72)+(b*0.62));
      return {value:Math.round(v),label:"稳态指数",note:v>70?"系统仍能较好维持内部环境。":v>40?"调节压力明显增大。":"稳态受到显著挑战。"};
    },
  },
  cell: {
    domain: "cell", title: "跨膜运输模拟", variableA: "浓度梯度", variableB: "膜通透性", unitA: "%", unitB: "%",
    minA: 0, maxA: 100, minB: 0, maxB: 100, defaultA: 65, defaultB: 55,
    explain: "用简化模型观察浓度梯度与膜通透性对净运输速率的影响。",
    calculate: (a,b) => { const v=clamp(a*b/100); return {value:Math.round(v),label:"相对运输速率",note:v>60?"跨膜净通量较高。":v>25?"存在中等程度净运输。":"净运输较弱。"}; },
  },
  molecular: {
    domain: "molecular", title: "配体-受体结合模拟", variableA: "配体浓度", variableB: "结合亲和力", unitA: "%", unitB: "%",
    minA: 0, maxA: 100, minB: 1, maxB: 100, defaultA: 45, defaultB: 70,
    explain: "观察配体浓度与亲和力共同决定受体占有率的趋势。",
    calculate: (a,b) => { const kd=105-b; const v=clamp(100*a/(a+kd)); return {value:Math.round(v),label:"受体占有率",note:v>65?"多数受体处于结合状态。":v>30?"部分受体被占据。":"结合比例较低。"}; },
  },
  genetics: {
    domain: "genetics", title: "等位基因频率模拟", variableA: "A 等位基因频率", variableB: "随机交配程度", unitA: "%", unitB: "%",
    minA: 1, maxA: 99, minB: 0, maxB: 100, defaultA: 50, defaultB: 90,
    explain: "用 Hardy-Weinberg 思路观察等位基因频率如何影响基因型比例。",
    calculate: (a,b) => { const p=a/100; const hetero=2*p*(1-p)*100*(0.6+0.4*b/100); return {value:Math.round(hetero),label:"Aa 预期比例",note:"这是教学用近似模型，真实群体还会受选择、漂变、迁移等因素影响。"}; },
  },
  biochemistry: {
    domain: "biochemistry", title: "酶活性模拟", variableA: "底物浓度", variableB: "温度", unitA: "%", unitB: "°C",
    minA: 0, maxA: 100, minB: 0, maxB: 70, defaultA: 60, defaultB: 37,
    explain: "观察底物增加带来的饱和趋势，以及温度偏离最适值后的活性变化。",
    calculate: (a,b) => { const sat=a/(a+28); const temp=Math.exp(-Math.pow((b-37)/16,2)); const v=clamp(100*sat*temp); return {value:Math.round(v),label:"相对酶活性",note:v>65?"反应条件较有利。":v>30?"酶仍有一定活性。":"条件明显限制反应。"}; },
  },
  microbiology: {
    domain: "microbiology", title: "微生物生长模拟", variableA: "营养供给", variableB: "环境适宜度", unitA: "%", unitB: "%",
    minA: 0, maxA: 100, minB: 0, maxB: 100, defaultA: 65, defaultB: 70,
    explain: "观察资源与环境条件如何共同影响微生物群体增长。",
    calculate: (a,b) => { const v=clamp(Math.sqrt(a*b)); return {value:Math.round(v),label:"相对生长潜力",note:v>70?"条件支持较快增长。":v>35?"增长受到一定限制。":"增长条件较差。"}; },
  },
  plants: {
    domain: "plants", title: "光合作用模拟", variableA: "光强", variableB: "CO₂ 可用度", unitA: "%", unitB: "%",
    minA: 0, maxA: 100, minB: 0, maxB: 100, defaultA: 60, defaultB: 55,
    explain: "观察光与二氧化碳作为限制因素时，光合速率如何出现饱和。",
    calculate: (a,b) => { const light=1-Math.exp(-a/30); const co2=1-Math.exp(-b/35); const v=clamp(100*Math.min(light,co2)); return {value:Math.round(v),label:"相对光合速率",note:"速率由更强的限制因素主导，并不会随单一变量无限增加。"}; },
  },
  animals: {
    domain: "animals", title: "动物运动性能模拟", variableA: "肌肉激活", variableB: "氧供应", unitA: "%", unitB: "%",
    minA: 0, maxA: 100, minB: 0, maxB: 100, defaultA: 65, defaultB: 70,
    explain: "观察神经驱动与能量供应对运动输出的共同限制。",
    calculate: (a,b) => { const v=clamp(Math.min(a*1.05,b*1.0)); return {value:Math.round(v),label:"运动输出",note:"运动性能通常受多个环节共同限制，最弱环节可能成为瓶颈。"}; },
  },
  development: {
    domain: "development", title: "细胞命运决定模拟", variableA: "形态发生信号", variableB: "响应敏感度", unitA: "%", unitB: "%",
    minA: 0, maxA: 100, minB: 0, maxB: 100, defaultA: 50, defaultB: 65,
    explain: "观察信号强度与细胞响应阈值如何影响发育命运。",
    calculate: (a,b) => { const v=clamp((a*0.7+b*0.3)); return {value:Math.round(v),label:"命运信号指数",note:v>66?"偏向高阈值命运。":v>33?"偏向中间命运。":"偏向低阈值命运。"}; },
  },
  evolution: {
    domain: "evolution", title: "自然选择模拟", variableA: "选择强度", variableB: "世代数", unitA: "%", unitB: "代",
    minA: 0, maxA: 100, minB: 1, maxB: 100, defaultA: 25, defaultB: 35,
    explain: "观察选择强度与时间如何改变有利等位基因的频率。",
    calculate: (a,b) => { const s=a/100; const v=clamp(100*(1-Math.exp(-(0.015+s*0.035)*b))); return {value:Math.round(v),label:"有利等位基因趋势",note:"这是方向性选择的简化趋势，不等同于真实群体的精确预测。"}; },
  },
  ecology: {
    domain: "ecology", title: "种群增长模拟", variableA: "资源水平", variableB: "初始种群", unitA: "%", unitB: "%",
    minA: 1, maxA: 100, minB: 1, maxB: 100, defaultA: 70, defaultB: 35,
    explain: "观察资源承载力和初始种群如何影响种群接近环境上限的程度。",
    calculate: (a,b) => { const k=a; const n=b; const v=clamp(n+(k-n)*0.62); return {value:Math.round(v),label:"后期种群水平",note:n>k?"资源不足会使种群向承载力回落。":"种群会向资源允许的承载水平靠近。"}; },
  },
  biotech: {
    domain: "biotech", title: "PCR 扩增模拟", variableA: "循环数", variableB: "扩增效率", unitA: "轮", unitB: "%",
    minA: 1, maxA: 40, minB: 40, maxB: 100, defaultA: 28, defaultB: 85,
    explain: "观察循环数和每轮扩增效率如何影响 DNA 扩增量。",
    calculate: (a,b) => { const copies=Math.pow(1+b/100,a); const log=Math.log10(copies); const v=clamp(log/12*100); return {value:Math.round(v),label:"相对扩增量",note:"真实 PCR 会受到引物、底物耗尽、非特异扩增等限制。"}; },
  },
  bioinformatics: {
    domain: "bioinformatics", title: "计算证据可信度模拟", variableA: "数据覆盖度", variableB: "模型一致性", unitA: "%", unitB: "%",
    minA: 0, maxA: 100, minB: 0, maxB: 100, defaultA: 75, defaultB: 70,
    explain: "观察数据质量和模型一致性如何共同影响计算结果的可信度。",
    calculate: (a,b) => { const v=clamp((2*a*b)/(a+b||1)); return {value:Math.round(v),label:"综合可信度",note:v>75?"结果较稳健，但仍需独立验证。":v>45?"可作为线索，需要更多证据。":"不宜过度解释。"}; },
  },
};

export default function ExperimentStudio({ domain, compact = false }: { domain: string; compact?: boolean }) {
  const preset = experimentPresets[domain] ?? experimentPresets.cell;
  const [a, setA] = useState(preset.defaultA);
  const [b, setB] = useState(preset.defaultB);
  const [prediction, setPrediction] = useState<"up" | "down" | "same" | null>(null);
  const [observed, setObserved] = useState(false);

  const result = useMemo(() => preset.calculate(a,b), [preset,a,b]);

  function reset() {
    setA(preset.defaultA);
    setB(preset.defaultB);
    setPrediction(null);
    setObserved(false);
  }

  return (
    <section className={"experiment-studio " + (compact ? "compact" : "")}>
      <div className="experiment-studio-head">
        <div>
          <span className="topic-card-label"><Beaker size={16} /> 互动实验</span>
          <h2>{preset.title}</h2>
          <p>{preset.explain}</p>
        </div>
        <button type="button" className="experiment-reset" onClick={reset}><RotateCcw size={15}/>重置</button>
      </div>

      <div className="experiment-cycle">
        <div className="experiment-predict">
          <strong>① 预测</strong>
          <span>改变变量后，你觉得结果会怎样？</span>
          <div>
            <button className={prediction==="up"?"active":""} onClick={()=>setPrediction("up")}>升高</button>
            <button className={prediction==="down"?"active":""} onClick={()=>setPrediction("down")}>降低</button>
            <button className={prediction==="same"?"active":""} onClick={()=>setPrediction("same")}>变化不大</button>
          </div>
        </div>

        <div className="experiment-controls">
          <strong><SlidersHorizontal size={16}/> ② 实验</strong>
          <label>{preset.variableA}<b>{a}{preset.unitA}</b><input type="range" min={preset.minA} max={preset.maxA} value={a} onChange={(e)=>{setA(Number(e.target.value));setObserved(false);}}/></label>
          <label>{preset.variableB}<b>{b}{preset.unitB}</b><input type="range" min={preset.minB} max={preset.maxB} value={b} onChange={(e)=>{setB(Number(e.target.value));setObserved(false);}}/></label>
          <button type="button" className="experiment-run" onClick={()=>setObserved(true)}>运行实验</button>
        </div>

        <div className="experiment-result" aria-live="polite">
          <strong><BrainCircuit size={16}/> ③ 观察与解释</strong>
          <div className="experiment-meter"><span style={{width:(observed?result.value:0)+"%"}} /></div>
          <div className="experiment-score"><b>{observed?result.value:"—"}</b><span>{result.label}</span></div>
          <p>{observed ? result.note : "先做出预测，再运行实验查看结果。"}</p>
          {observed && prediction && <small><CheckCircle2 size={14}/> 已完成一次“预测 → 实验 → 观察 → 解释”循环</small>}
        </div>
      </div>
      <p className="experiment-disclaimer">教学简化模型：用于理解变量关系和趋势，不代表真实实验的精确数值。</p>
      {observed && (
        <AIMentorChat
          compact
          experimentContext={[
            "实验：" + preset.title,
            preset.variableA + "：" + a + preset.unitA,
            preset.variableB + "：" + b + preset.unitB,
            "观察结果：" + result.value + " " + result.label,
            "模型解释：" + result.note,
          ].join("\n")}
          starter="实验已经运行完成。你可以问我为什么会得到这个结果，或者真实实验里还会受到哪些因素影响。"
        />
      )}
    </section>
  );
}
