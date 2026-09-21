"use client";

import { useState } from "react";
import { biologyDomains } from "@/data/biologyAtlas";
import ExperimentStudio from "@/components/ExperimentStudio";

export default function BiologyLabs() {
  const [domain, setDomain] = useState(biologyDomains[0]?.slug ?? "human");
  const current = biologyDomains.find((item)=>item.slug===domain) ?? biologyDomains[0];

  return (
    <div className="all-labs-shell">
      <aside className="lab-domain-picker">
        <span>选择实验领域</span>
        {biologyDomains.map((item)=>(
          <button key={item.slug} className={domain===item.slug?"active":""} onClick={()=>setDomain(item.slug)}>
            <b>{item.emoji}</b><span><strong>{item.name}</strong><small>{item.en}</small></span>
          </button>
        ))}
      </aside>
      <div className="lab-domain-stage">
        <div className="lab-domain-intro">
          <span>{current.emoji} {current.name}</span>
          <h2>{current.tagline}</h2>
          <p>{current.description}</p>
        </div>
        <ExperimentStudio domain={domain} />
        <div className="lab-topic-links">
          <strong>这个领域的知识点</strong>
          <div>{current.subtopics.map(topic=><a key={topic.slug} href={"/atlas/"+current.slug+"/"+topic.slug}>{topic.name}</a>)}</div>
        </div>
      </div>
    </div>
  );
}
