"use client";

import { useMemo, useState } from "react";
import { Info, MousePointerClick, Sparkles } from "lucide-react";
import CellAnatomy from "@/components/CellAnatomy";
import { cellPathways, getStructureKnowledge, cellReferences } from "@/data/cellKnowledge";
import { cellModels } from "@/data/cellModels";

export default function CellStructureExplorer({initialId="animal-cell",category}:{initialId?:string;category?:"cell"|"immune"|"organelle"}) {
  const options=useMemo(()=>category?cellModels.filter(m=>m.category===category):cellModels,[category]);
  const [modelId,setModelId]=useState(options.some(m=>m.id===initialId)?initialId:(options[0]?.id??"animal-cell"));
  const model=options.find(m=>m.id===modelId)??options[0]??cellModels[0];
  const [selected,setSelected]=useState(model.hotspots[0]?.id??"");
  const hotspot=model.hotspots.find(h=>h.id===selected)??model.hotspots[0];

  const knowledge=getStructureKnowledge(hotspot?.name ?? "",model.id);
  const pathway=cellPathways[model.id];
  const activeId=hotspot?.id;

  function selectModel(id:string){
    const next=options.find(m=>m.id===id);
    setModelId(id);
    setSelected(next?.hotspots[0]?.id??"");
  }

  return <section className="cell-explorer">
    <div className="cell-explorer-head">
      <div><span><Sparkles size={15}/> 结构探索器</span><h2>点击细胞或细胞器的部位</h2><p>先认结构，再把结构和功能联系起来。</p></div>
      <select aria-label="选择细胞或细胞器" value={model.id} onChange={e=>selectModel(e.target.value)}>{options.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select>
    </div>
    <div className="cell-explorer-body">
      <div className="cell-model-stage">
        <div className="cell-model-title"><strong>{model.name}</strong><span>{model.en}</span></div>
        <div className="cell-model-graphic"><CellAnatomy model={model} selected={activeId ?? ""}/>
          {model.hotspots.map((h,index)=><button key={h.id} className={"cell-hotspot "+(activeId===h.id?"active":"")} style={{left:h.x+"%",top:h.y+"%"}} onClick={()=>setSelected(h.id)} aria-label={h.name} aria-pressed={activeId===h.id} title={h.name}><span>{index+1}</span></button>)}
        </div>
        <p>{model.description}</p><p className="cell-schematic-note">结构示意图 · 颜色用于区分部位，大小与数量不按真实比例</p>
        <div className="cell-structure-list" aria-label="图中结构">{model.hotspots.map((h,i)=><button key={h.id} aria-pressed={activeId===h.id} className={activeId===h.id?"active":""} onClick={()=>setSelected(h.id)}><b>{i+1}</b>{h.name}</button>)}</div>
      </div>
      <article className="cell-hotspot-card" aria-live="polite">
        <span className="topic-card-label"><MousePointerClick size={15}/> 当前结构</span>
        <h3>{hotspot?.name}</h3>
        <strong>{hotspot?.function}</strong>
        <p>{hotspot?.detail}</p>
        {knowledge&&<div className="structure-explanation"><section><h4>结构特点</h4><p>{knowledge.structure}</p></section><section><h4>怎样工作</h4><p>{knowledge.mechanism}</p></section><section className="structure-misconception"><h4>容易混淆</h4><p>{knowledge.misconception}</p></section></div>}
        <div className="hotspot-tip"><Info size={15}/> 点击图中编号或下方结构名称，查看对应说明。</div>
      </article>
    </div>
    {pathway&&<div className="cell-pathway"><h3>结构怎样协作</h3><ol>{pathway.steps.map(step=><li key={step}>{step}</li>)}</ol><p>{pathway.note}</p></div>}
    <details className="cell-references"><summary>继续阅读 · 参考资料</summary>{cellReferences.map(ref=><a key={ref.url} href={ref.url} target="_blank" rel="noreferrer">{ref.title}</a>)}</details>
  </section>;
}

