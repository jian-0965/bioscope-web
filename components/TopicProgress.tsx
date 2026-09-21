"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type TopicProgressState = {
  bookmarked: boolean;
  completed: boolean;
};

export default function TopicProgress({ topicKey }: { topicKey: string }) {
  const storageKey = "bioscope-topic-progress";
  const [state, setState] = useState<TopicProgressState>({ bookmarked: false, completed: false });

  useEffect(() => {
    let active = true;

    async function load() {
      let local: TopicProgressState | undefined;
      try {
        const raw = window.localStorage.getItem(storageKey);
        const all = raw ? (JSON.parse(raw) as Record<string, TopicProgressState>) : {};
        local = all[topicKey];
        if (local && active) setState(local);
      } catch {}

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from("user_progress")
          .select("bookmarked, completed")
          .eq("user_id", user.id)
          .eq("node_id", topicKey)
          .maybeSingle();

        if (data && active) {
          const remote = { bookmarked: data.bookmarked, completed: data.completed };
          setState(remote);
          try {
            const raw = window.localStorage.getItem(storageKey);
            const all = raw ? JSON.parse(raw) : {};
            all[topicKey] = remote;
            window.localStorage.setItem(storageKey, JSON.stringify(all));
          } catch {}
        }
      } catch {}
    }

    void load();
    return () => { active = false; };
  }, [topicKey]);

  async function update(patch: Partial<TopicProgressState>) {
    const next = { ...state, ...patch };
    setState(next);

    try {
      const raw = window.localStorage.getItem(storageKey);
      const all = raw ? (JSON.parse(raw) as Record<string, TopicProgressState>) : {};
      all[topicKey] = next;
      window.localStorage.setItem(storageKey, JSON.stringify(all));
    } catch {}

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("user_progress").upsert({
        user_id: user.id,
        node_id: topicKey,
        bookmarked: next.bookmarked,
        completed: next.completed,
        last_visited_at: new Date().toISOString(),
      }, { onConflict: "user_id,node_id" });
    } catch {}
  }

  return (
    <div className="topic-progress-actions">
      <button className={state.bookmarked ? "active" : ""} onClick={() => void update({ bookmarked: !state.bookmarked })}>
        {state.bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        {state.bookmarked ? "已收藏" : "收藏主题"}
      </button>
      <button className={state.completed ? "active" : ""} onClick={() => void update({ completed: !state.completed })}>
        <CheckCircle2 size={16} />
        {state.completed ? "已学会" : "标记学会"}
      </button>
    </div>
  );
}
