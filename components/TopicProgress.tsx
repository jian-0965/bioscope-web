"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, CheckCircle2 } from "lucide-react";

type TopicProgressState = {
  bookmarked: boolean;
  completed: boolean;
};

export default function TopicProgress({ topicKey }: { topicKey: string }) {
  const storageKey = "bioscope-topic-progress";
  const [state, setState] = useState<TopicProgressState>({ bookmarked: false, completed: false });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const all = raw ? (JSON.parse(raw) as Record<string, TopicProgressState>) : {};
      if (all[topicKey]) setState(all[topicKey]);
    } catch {
      // Ignore corrupted local state and keep defaults.
    }
  }, [topicKey]);

  function update(patch: Partial<TopicProgressState>) {
    const next = { ...state, ...patch };
    setState(next);
    try {
      const raw = window.localStorage.getItem(storageKey);
      const all = raw ? (JSON.parse(raw) as Record<string, TopicProgressState>) : {};
      all[topicKey] = next;
      window.localStorage.setItem(storageKey, JSON.stringify(all));
    } catch {
      // The learning page remains usable even when localStorage is unavailable.
    }
  }

  return (
    <div className="topic-progress-actions">
      <button
        className={state.bookmarked ? "active" : ""}
        onClick={() => update({ bookmarked: !state.bookmarked })}
      >
        {state.bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        {state.bookmarked ? "已收藏" : "收藏主题"}
      </button>
      <button
        className={state.completed ? "active" : ""}
        onClick={() => update({ completed: !state.completed })}
      >
        <CheckCircle2 size={16} />
        {state.completed ? "已学会" : "标记学会"}
      </button>
    </div>
  );
}
