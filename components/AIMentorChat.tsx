"use client";

import Link from "next/link";
import { CalendarCheck2, Sparkles } from "lucide-react";

export default function AIMentorChat({ compact = false, starter }: { compact?: boolean; starter?: string; pageContext?: string; experimentContext?: string }) {
  return (
    <section className={"ai-mentor-chat " + (compact ? "compact" : "")}>
      <div className="ai-mentor-title">
        <div className="ai-mentor-icon"><CalendarCheck2 size={17} /></div>
        <div>
          <strong>学习计划</strong>
          <span>把本页知识变成下一步任务</span>
        </div>
        <em>从提问切换为可执行的每日任务</em>
      </div>
      <div className="ai-chat-messages">
        <article className="ai-message assistant">
          <div className="ai-message-avatar"><Sparkles size={15} /></div>
          <div className="ai-message-body"><p>{starter || "把今天学到的内容加入计划，按自己的时间稳步学习。"}</p></div>
        </article>
      </div>
      <div className="ai-suggestions">
        <Link href="/ai"><Sparkles size={14} /> 生成我的学习计划</Link>
      </div>
    </section>
  );
}
