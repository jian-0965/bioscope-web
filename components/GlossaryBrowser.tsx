"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { glossaryEntries } from "@/data/glossary";

export default function GlossaryBrowser() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return glossaryEntries;
    return glossaryEntries.filter((entry) =>
      [entry.term, entry.en, entry.domain, entry.definition].join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <>
      <label className="glossary-search">
        <Search size={18} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索术语、中英文名或领域" />
      </label>

      <div className="glossary-grid">
        {filtered.map((entry) => (
          <article key={entry.term} className="glossary-card">
            <span>{entry.domain}</span>
            <h2>{entry.term}</h2>
            <p className="glossary-en">{entry.en}</p>
            <p>{entry.definition}</p>
          </article>
        ))}
      </div>
    </>
  );
}
