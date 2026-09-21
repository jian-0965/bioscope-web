"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { Bot, ExternalLink, LoaderCircle, Send, Sparkles, UserRound } from "lucide-react";

type Source = { title: string; domain: string; href: string };
type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  mode?: string;
};

export default function AIMentorChat({
  pageContext = "",
  experimentContext = "",
  compact = false,
  starter,
}: {
  pageContext?: string;
  experimentContext?: string;
  compact?: boolean;
  starter?: string;
}) {
  const [messages, setMessages] = useState<Message[]>(starter ? [{ role: "assistant", content: starter }] : []);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const suggestions = useMemo(() => {
    if (experimentContext) return ["为什么会得到这个结果？", "改变哪个变量影响最大？", "真实实验还会受什么影响？"];
    if (pageContext) return ["用简单的话解释这个知识点", "如果这个环节失效会怎样？", "我们怎么知道这个结论？"];
    return ["T细胞和B细胞有什么区别？", "为什么线粒体内膜有褶皱？", "动作电位为什么会突然上升？"];
  }, [experimentContext, pageContext]);

  async function ask(text: string) {
    const question = text.trim();
    if (!question || loading) return;

    const nextMessages = [...messages, { role: "user" as const, content: question }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          pageContext,
          experimentContext,
          history: nextMessages.slice(-6).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await response.json();
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer || data.error || "暂时没有得到答案。",
          sources: data.sources,
          mode: data.mode,
        },
      ]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "网络连接失败，请稍后再试。" }]);
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void ask(input);
  }

  return (
    <section className={"ai-mentor-chat " + (compact ? "compact" : "")}>
      <div className="ai-mentor-title">
        <div className="ai-mentor-icon"><Bot size={18}/></div>
        <div>
          <strong>AI 生物导师 · 小博</strong>
          <span>结合当前页面和 BioScope 知识库回答</span>
        </div>
        <em><Sparkles size={12}/> RAG</em>
      </div>

      <div className="ai-chat-messages" aria-live="polite">
        {messages.length === 0 && (
          <div className="ai-empty">
            <Bot size={28}/>
            <strong>直接问我这个页面里的任何问题</strong>
            <span>我会优先根据 BioScope 知识卡、机制说明和证据内容回答。</span>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={"ai-message " + message.role}>
            <div className="ai-message-avatar">
              {message.role === "assistant" ? <Bot size={15}/> : <UserRound size={15}/>}
            </div>
            <div className="ai-message-body">
              <p>{message.content}</p>
              {message.sources && message.sources.length > 0 && (
                <div className="ai-sources">
                  <span>相关知识：</span>
                  {message.sources.slice(0,3).map((source) => (
                    <a key={source.href} href={source.href}>
                      {source.title}<ExternalLink size={10}/>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="ai-thinking"><LoaderCircle size={16}/> 正在检索知识库并组织解释…</div>}
      </div>

      <div className="ai-suggestions">
        {suggestions.map((item) => <button key={item} onClick={() => void ask(item)}>{item}</button>)}
      </div>

      <form ref={formRef} className="ai-chat-form" onSubmit={submit}>
        <input value={input} onChange={(event)=>setInput(event.target.value)} placeholder="例如：为什么抗体不能直接杀死所有病原体？" maxLength={1600}/>
        <button disabled={loading || !input.trim()} aria-label="发送问题"><Send size={17}/></button>
      </form>
    </section>
  );
}
