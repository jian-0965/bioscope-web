"use client";

import Link from "next/link";
import { CalendarCheck2, Sparkles } from "lucide-react";

export default function AIMentorChat({ compact = false, starter }: { compact?: boolean; starter?: string; pageContext?: string; experimentContext?: string }) {
  return (
    <section className={"ai-mentor-chat " + (compact ? "compact" : "")}>
      <div className="ai-mentor-title">
        <span><CalendarCheck2 size={17} /> 学习计划</span>
        <em>从提问切换为可执行的每日任务</em>
      </div>
      <div className="ai-chat-messages">
        <article className="ai-message assistant">
          <p>{starter || "把今天学到的内容加入计划，按自己的时间稳步学习。"}</p>
        </article>
      </div>
      <div className="ai-suggestions">
        <Link href="/ai"><Sparkles size={14} /> 生成我的学习计划</Link>
      </div>
    </section>
  );
}
