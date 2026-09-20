"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { biologyDomains } from "@/data/biologyAtlas";

export default function BiologyAtlas() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return biologyDomains;
    return biologyDomains.filter((domain) =>
      [domain.name, domain.en, domain.description, ...domain.subtopics.flatMap((topic) => [topic.name, topic.en, topic.summary])]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  return (
    <div className="atlas-browser">
      <div className="atlas-search">
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索：DNA、神经系统、免疫、光合作用……"
        />
      </div>

      <div className="atlas-grid">
        {filtered.map((domain) => (
          <article key={domain.slug} className={"atlas-card atlas-" + domain.accent}>
            <div className="atlas-card-top">
              <span className="atlas-emoji">{domain.emoji}</span>
              <span className="atlas-count">{domain.subtopics.length} 个主题</span>
            </div>
            <p className="atlas-en">{domain.en}</p>
            <h2>{domain.name}</h2>
            <p className="atlas-tagline">{domain.tagline}</p>
            <p className="atlas-description">{domain.description}</p>
            <div className="atlas-topic-chips">
              {domain.subtopics.slice(0, 5).map((topic) => <span key={topic.slug}>{topic.name}</span>)}
            </div>
            <Link className="atlas-open" href={"/atlas/" + domain.slug}>
              进入专题 <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="atlas-empty">
          <Sparkles size={22} />
          <strong>暂时没找到这个主题</strong>
          <span>可以换一个关键词，或从上面的生命领域开始探索。</span>
        </div>
      )}
    </div>
  );
}
