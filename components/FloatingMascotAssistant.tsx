"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, FlaskConical, Map, Route, Sparkles, X } from "lucide-react";
import MascotAvatar from "@/components/MascotAvatar";
import AIMentorChat from "@/components/AIMentorChat";
import { usePathname } from "next/navigation";

const routeHints = {
  labs: {
    mentor: "boy" as const,
    name: "小博",
    role: "机制导师",
    text: "实验前先做预测，再改变一个变量。这样你看到的结果才真正有意义。",
  },
  topic: {
    mentor: "boy" as const,
    name: "小博",
    role: "机制导师",
    text: "先抓住关键词，再问“如果这里失效，会发生什么？”——这是理解机制最快的方法。",
  },
  general: {
    mentor: "girl" as const,
    name: "小芽",
    role: "学习向导",
    text: "不知道从哪里开始也没关系。我可以带你从生物学全景或推荐路线开始。",
  },
};

export default function FloatingMascotAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const hidden = pathname.startsWith("/auth") || pathname.startsWith("/register");

  const hint = useMemo(() => {
    if (pathname.startsWith("/labs")) return routeHints.labs;
    if (pathname.startsWith("/atlas/") && pathname.split("/").filter(Boolean).length >= 3) {
      return routeHints.topic;
    }
    return routeHints.general;
  }, [pathname]);

  if (hidden) return null;

  return (
    <div className={"floating-mentor " + (open ? "open" : "")}>
      {open && (
        <div className="floating-mentor-panel">
          <button className="floating-mentor-close" onClick={() => setOpen(false)} aria-label="关闭学习助手">
            <X size={16} />
          </button>
          <div className="floating-mentor-head">
            <MascotAvatar mentor={hint.mentor} portrait className="floating-mentor-avatar" />
            <div>
              <strong>{hint.name}</strong>
              <span>{hint.role}</span>
            </div>
          </div>
          <AIMentorChat compact pageContext={"当前页面路径：" + pathname} starter={hint.text} />
          <div className="floating-mentor-links">
            <Link href="/atlas"><Map size={14} /> 生物全景</Link>
            <Link href="/paths"><Route size={14} /> 学习路线</Link>
            <Link href="/labs"><FlaskConical size={14} /> 实验室</Link>
            <Link href="/challenges"><Sparkles size={14} /> 挑战</Link>
            <Link href="/glossary"><BookOpen size={14} /> 词典</Link>
          </div>
        </div>
      )}

      <button className="floating-mentor-trigger" onClick={() => setOpen((value) => !value)} aria-label="打开 BioScope 学习助手">
        <MascotAvatar mentor={hint.mentor} portrait className="floating-mentor-avatar" />
        <span>{open ? "收起" : "问问 " + hint.name}</span>
      </button>
    </div>
  );
}
