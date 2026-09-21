"use client";

import { useMemo, useState } from "react";
import { Info, MousePointerClick, Sparkles } from "lucide-react";
import { cellModels, type CellModel } from "@/data/cellModels";

function ModelGraphic({model}:{model:CellModel}) {
  const common = <><circle cx="50" cy="50" r="34" fill="#dff4df" stroke="#7ab78b" strokeWidth="2"/><circle cx="49" cy="50" r="13" fill="#b6dba9" stroke="#6aa276" strokeWidth="2"/></>;

  if(model.kind==="plant") return <svg viewBox="0 0 100 100"><rect x="10" y="12" width="80" height="76" rx="12" fill="#dcf4c9" stroke="#659a62" strokeWidth="3"/><rect x="16" y="18" width="68" height="64" rx="10" fill="#effbe5" stroke="#83b97b"/><ellipse cx="50" cy="52" rx="24" ry="31" fill="#d8f0ef"/><circle cx="72" cy="36" r="9" fill="#b7d7a5"/><g fill="#79bb56">{[28,42,58].map((x)=><ellipse key={x} cx={x} cy="29" rx="7" ry="4"/>)}{[30,67].map((x)=><ellipse key={x} cx={x} cy="70" rx="7" ry="4"/>)}</g></svg>;
  if(model.kind==="bacterium") return <svg viewBox="0 0 100 100"><rect x="16" y="30" width="66" height="40" rx="20" fill="#dff2cb" stroke="#6da86e" strokeWidth="3"/><path d="M82 48 C95 42 96 60 90 66 C84 72 96 80 94 88" fill="none" stroke="#5e8e63" strokeWidth="2"/><path d="M30 49 C38 38 55 62 68 45" fill="none" stroke="#6f9dbd" strokeWidth="3"/><g fill="#749a63">{[27,38,54,66].map((x)=><circle key={x} cx={x} cy={x%2?42:58} r="2.2"/>)}</g></svg>;
  if(model.kind==="mitochondrion") return <svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="39" ry="25" fill="#ffd7b8" stroke="#e29065" strokeWidth="3"/><path d="M22 46 C30 28 40 69 51 43 S70 33 78 55" fill="none" stroke="#d56f5f" strokeWidth="4" strokeLinecap="round"/></svg>;
  if(model.kind==="chloroplast") return <svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="39" ry="26" fill="#d8f2b8" stroke="#6ea45d" strokeWidth="3"/><g fill="#5e9854">{[30,44,58,72].map((x)=><g key={x}>{[41,47,53,59].map((y)=><rect key={y} x={x-6} y={y} width="12" height="3" rx="1.5"/>)}</g>)}</g></svg>;
  if(model.kind==="nucleus") return <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="#e8e2f5" stroke="#8d7ab1" strokeWidth="3"/><circle cx="50" cy="50" r="31" fill="#f5f1fb" stroke="#b2a4cf"/><circle cx="59" cy="58" r="10" fill="#a88fc9"/><path d="M29 40 C40 31 60 35 70 45 M31 63 C43 54 61 58 70 68" fill="none" stroke="#c0acd5" strokeWidth="3"/><g fill="#7f6aa1">{[25,36,48,62,74].map((x)=><circle key={x} cx={x} cy="19" r="2.2"/>)}</g></svg>;
  if(model.kind==="er") return <svg viewBox="0 0 100 100"><path d="M18 28 C33 18 43 32 58 24 S82 25 82 34 C65 40 35 36 19 44 C33 51 67 45 82 52 C66 60 35 56 19 66 C35 72 68 66 82 74" fill="none" stroke="#74a6be" strokeWidth="6" strokeLinecap="round"/><g fill="#4f7083">{[24,33,43,53,63,73].map((x,i)=><circle key={i} cx={x} cy={i%2?34:28} r="2.2"/>)}</g></svg>;
  if(model.kind==="golgi") return <svg viewBox="0 0 100 100"><g fill="none" stroke="#d88d78" strokeWidth="6" strokeLinecap="round"><path d="M24 30 C43 21 66 23 78 31"/><path d="M20 42 C40 34 68 35 82 43"/><path d="M22 54 C43 47 67 48 79 56"/><path d="M27 66 C45 60 63 60 74 67"/></g><g fill="#efb5a6">{[18,82,76].map((x,i)=><circle key={i} cx={x} cy={[30,60,76][i]} r="5"/>)}</g></svg>;
  if(model.kind==="lysosome") return <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="34" fill="#f2d8e7" stroke="#b2678e" strokeWidth="3"/><circle cx="50" cy="50" r="28" fill="#faeef5"/><g fill="#c07aa0">{[[38,42],[57,38],[61,59],[42,63],[52,51]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i===4?5:3}/>)}</g></svg>;
  if(model.kind==="ribosome") return <svg viewBox="0 0 100 100"><ellipse cx="50" cy="42" rx="25" ry="18" fill="#b8c7df" stroke="#7185a9" strokeWidth="3"/><ellipse cx="50" cy="62" rx="20" ry="13" fill="#d6dff0" stroke="#7185a9" strokeWidth="3"/><path d="M9 66 C28 57 41 72 59 62 S79 61 92 55" fill="none" stroke="#d28c67" strokeWidth="3"/><path d="M64 21 L70 44 M74 16 L78 42" stroke="#76a66e" strokeWidth="3"/></svg>;
  if(model.kind==="neuron") return <svg viewBox="0 0 100 100"><circle cx="34" cy="50" r="15" fill="#e8d8f5" stroke="#8f76af" strokeWidth="2.5"/><circle cx="34" cy="50" r="6" fill="#b89bd0"/><path d="M21 43 L7 32 M22 50 L5 50 M21 57 L8 70 M48 50 C61 50 71 49 91 50" stroke="#8f76af" strokeWidth="3" strokeLinecap="round"/><path d="M90 50 L97 42 M90 50 L98 50 M90 50 L97 58" stroke="#8f76af" strokeWidth="2.5"/></svg>;
  if(model.kind==="dendritic") return <svg viewBox="0 0 100 100">{common}<path d="M50 16 L50 4 M74 26 L86 14 M84 50 L98 50 M74 74 L86 87 M26 74 L13 87 M16 50 L3 50 M26 26 L13 13" stroke="#72a27d" strokeWidth="4" strokeLinecap="round"/></svg>;
  if(model.kind==="plasma") return <svg viewBox="0 0 100 100"><ellipse cx="48" cy="52" rx="36" ry="31" fill="#e7e0f4" stroke="#8a7ba5" strokeWidth="2.5"/><circle cx="34" cy="58" r="12" fill="#b9a7ce"/><path d="M49 29 C66 31 64 43 51 42 M53 48 C71 49 69 61 55 60" fill="none" stroke="#7e63a1" strokeWidth="3"/><path d="M83 35 l7 -6 m-7 6 l7 6 M84 50 l7 -6 m-7 6 l7 6" stroke="#59a37e" strokeWidth="2"/></svg>;
  if(model.kind==="neutrophil") return <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" fill="#f2e8f8" stroke="#8c78a7" strokeWidth="2.5"/><circle cx="38" cy="48" r="9" fill="#8f79aa"/><circle cx="53" cy="45" r="9" fill="#8f79aa"/><circle cx="61" cy="58" r="9" fill="#8f79aa"/><g fill="#c3aada">{[27,46,72,67,34].map((x,i)=><circle key={i} cx={x} cy={[34,69,36,69,61][i]} r="2.5"/>)}</g></svg>;
  if(model.kind==="bcell"||model.kind==="tcell") return <svg viewBox="0 0 100 100">{common}<g stroke={model.kind==="bcell"?"#4d8aae":"#9b6ea8"} strokeWidth="2">{[20,35,50,65,80].map((x)=><path key={x} d={`M${x} 18 l-4 -8 m4 8 l4 -8`} />)}</g></svg>;
  if(model.kind==="macrophage") return <svg viewBox="0 0 100 100"><path d="M18 47 C13 24 36 15 48 21 C64 10 83 28 78 42 C91 54 76 78 60 76 C49 90 28 78 29 68 C13 65 8 54 18 47Z" fill="#d9efcf" stroke="#679d72" strokeWidth="2.5"/><circle cx="48" cy="50" r="12" fill="#aacb9e"/><circle cx="66" cy="40" r="5" fill="#f2b98c"/><circle cx="64" cy="61" r="5" fill="#c6a7d7"/></svg>;
  return <svg viewBox="0 0 100 100">{common}</svg>;
}

export default function CellStructureExplorer({initialId="animal-cell",category}:{initialId?:string;category?:"cell"|"immune"|"organelle"}) {
  const options=useMemo(()=>category?cellModels.filter(m=>m.category===category):cellModels,[category]);
  const [modelId,setModelId]=useState(options.some(m=>m.id===initialId)?initialId:(options[0]?.id??"animal-cell"));
  const model=options.find(m=>m.id===modelId)??options[0]??cellModels[0];
  const [selected,setSelected]=useState(model.hotspots[0]?.id??"");
  const hotspot=model.hotspots.find(h=>h.id===selected)??model.hotspots[0];

  function selectModel(id:string){
    const next=options.find(m=>m.id===id);
    setModelId(id);
    setSelected(next?.hotspots[0]?.id??"");
  }

  return <section className="cell-explorer">
    <div className="cell-explorer-head">
      <div><span><Sparkles size={15}/> 结构探索器</span><h2>点击细胞或细胞器的部位</h2><p>先认结构，再把结构和功能联系起来。</p></div>
      <select value={model.id} onChange={e=>selectModel(e.target.value)}>{options.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select>
    </div>
    <div className="cell-explorer-body">
      <div className="cell-model-stage">
        <div className="cell-model-title"><strong>{model.name}</strong><span>{model.en}</span></div>
        <div className="cell-model-graphic"><ModelGraphic model={model}/>
          {model.hotspots.map(h=><button key={h.id} className={"cell-hotspot "+(selected===h.id?"active":"")} style={{left:h.x+"%",top:h.y+"%"}} onClick={()=>setSelected(h.id)} aria-label={h.name}><span/></button>)}
        </div>
        <p>{model.description}</p>
      </div>
      <article className="cell-hotspot-card">
        <span className="topic-card-label"><MousePointerClick size={15}/> 当前结构</span>
        <h3>{hotspot?.name}</h3>
        <strong>{hotspot?.function}</strong>
        <p>{hotspot?.detail}</p>
        <div className="hotspot-tip"><Info size={15}/> 点击图中的发光圆点切换结构。</div>
      </article>
    </div>
  </section>;
}
