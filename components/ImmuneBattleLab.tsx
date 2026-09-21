"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Shield, Swords, Syringe } from "lucide-react";
import CellStructureExplorer from "@/components/CellStructureExplorer";

type Mode="humoral"|"cellular";

const humoralSteps=[
  ["病原体进入","细菌进入组织，先天免疫细胞开始识别异常信号。"],
  ["吞噬与呈递","巨噬细胞/树突状细胞吞噬细菌，并呈递抗原片段。"],
  ["辅助性 T 细胞激活","抗原呈递细胞激活辅助性 T 细胞。"],
  ["B 细胞克隆扩增","匹配抗原的 B 细胞在辅助信号下增殖。"],
  ["浆细胞分泌抗体","部分 B 细胞分化成浆细胞，大量分泌抗体。"],
  ["抗体结合病原体","抗体中和、凝集或标记病原体，帮助清除感染。"],
  ["形成记忆","部分 B 细胞成为记忆细胞，为再次感染做准备。"],
] as const;

const cellularSteps=[
  ["病原体进入","病毒感染宿主细胞，感染细胞开始呈递病毒抗原。"],
  ["抗原呈递","树突状细胞把抗原信息带到淋巴组织。"],
  ["辅助性 T 细胞激活","辅助性 T 细胞释放信号，促进细胞毒性 T 细胞活化。"],
  ["细胞毒性 T 细胞扩增","特异性 T 细胞克隆扩增并寻找感染细胞。"],
  ["识别靶细胞","TCR 识别感染细胞表面的抗原肽-MHC I。"],
  ["诱导凋亡","细胞毒性 T 细胞释放穿孔素和颗粒酶，使靶细胞进入凋亡。"],
  ["形成记忆","部分 T 细胞转为记忆细胞。"],
] as const;

export default function ImmuneBattleLab(){
  const [mode,setMode]=useState<Mode>("humoral");
  const [step,setStep]=useState(0);
  const [running,setRunning]=useState(false);
  const [bacteria,setBacteria]=useState(5);
  const timer=useRef<ReturnType<typeof setInterval>|null>(null);
  const steps=mode==="humoral"?humoralSteps:cellularSteps;

  useEffect(()=>{
    if(timer.current) clearInterval(timer.current);
    if(running){
      timer.current=setInterval(()=>setStep(s=>{
        if(s>=steps.length-1){setRunning(false);return s;}
        return s+1;
      }),1400);
    }
    return()=>{if(timer.current)clearInterval(timer.current);};
  },[running,steps.length]);

  function reset(){setRunning(false);setStep(0);setBacteria(5);}
  function release(){setBacteria(v=>Math.min(12,v+2));setStep(0);setRunning(true);}

  const cleared=useMemo(()=>Math.max(0,Math.min(100,Math.round((step/(steps.length-1))*100))),[step,steps.length]);

  return <section className="immune-lab">
    <div className="immune-lab-head">
      <div><span className="topic-card-label"><Shield size={16}/> 免疫作战实验台</span><h2>释放病原体，观察免疫反应</h2><p>低配置 SVG/CSS 模拟：重点展示细胞之间的相互作用顺序，不做真实动力学预测。</p></div>
      <div className="immune-mode-tabs"><button className={mode==="humoral"?"active":""} onClick={()=>{setMode("humoral");reset();}}>体液免疫</button><button className={mode==="cellular"?"active":""} onClick={()=>{setMode("cellular");reset();}}>细胞免疫</button></div>
    </div>

    <div className="immune-arena">
      <div className="immune-toolbar">
        <button onClick={release}><Syringe size={15}/>释放细菌</button>
        <button onClick={()=>setRunning(v=>!v)}>{running?<Pause size={15}/>:<Play size={15}/>} {running?"暂停":"继续"}</button>
        <button onClick={reset}><RotateCcw size={15}/>重置</button>
        <span>病原体：{bacteria} 个</span>
      </div>

      <div className={"immune-scene mode-"+mode+" step-"+step}>
        <div className="tissue-grid"/>
        {Array.from({length:bacteria}).map((_,i)=><div key={i} className={"pathogen pathogen-"+(i%6)}><i/><i/><i/></div>)}
        <div className="immune-cell macrophage"><span>巨噬</span></div>
        <div className="immune-cell dendritic"><span>树突</span></div>
        <div className="immune-cell helper-t"><span>Th</span></div>
        {mode==="humoral"?<>
          <div className="immune-cell b-cell"><span>B</span></div>
          <div className="immune-cell plasma-cell"><span>浆</span></div>
          {Array.from({length:7}).map((_,i)=><div className={"antibody antibody-"+i} key={i}>Y</div>)}
        </>:<>
          <div className="immune-cell killer-t"><span>Tc</span></div>
          <div className="infected-cell"><span>感染细胞</span></div>
          <div className="death-burst">✦</div>
        </>}
        <div className="immune-flow-line"/>
      </div>

      <div className="immune-timeline">
        {steps.map(([title],i)=><button key={title} className={(i===step?"active ":"")+(i<step?"done":"")} onClick={()=>{setStep(i);setRunning(false);}}><b>{i+1}</b><span>{title}</span></button>)}
      </div>

      <div className="immune-readout">
        <div><Swords size={18}/><span>当前阶段</span><strong>{steps[step][0]}</strong><p>{steps[step][1]}</p></div>
        <div className="immune-clear"><span>免疫反应进度</span><b>{cleared}%</b><div><i style={{width:cleared+"%"}}/></div></div>
      </div>
    </div>

    <CellStructureExplorer category="immune" initialId={mode==="humoral"?"b-cell":"t-cell"}/>
  </section>;
}
