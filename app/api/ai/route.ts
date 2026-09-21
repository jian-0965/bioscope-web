import { NextResponse } from "next/server";
import { makeFallbackAnswer, retrieveBioKnowledge, type BioRagDocument } from "@/lib/ai/bioRag";

type ChatMessage = { role: "user" | "assistant"; content: string };

function formatContext(docs: BioRagDocument[], pageContext?: string, experimentContext?: string) {
  const chunks = docs.map((doc, index) =>
    [
      "[知识库 " + (index + 1) + "]",
      "主题：" + doc.title,
      "领域：" + doc.domain,
      "内容：" + doc.text,
      doc.evidence ? "证据：" + doc.evidence : "",
      doc.whatIf ? "扰动：" + doc.whatIf : "",
      "页面：" + doc.href,
    ].filter(Boolean).join("\n"),
  );

  if (pageContext) chunks.unshift("[当前页面]\n" + pageContext);
  if (experimentContext) chunks.unshift("[当前实验]\n" + experimentContext);
  return chunks.join("\n\n");
}

function parseResponseText(data: any): string {
  if (typeof data?.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  const parts: string[] = [];
  for (const item of data?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (typeof content?.text === "string") parts.push(content.text);
    }
  }
  return parts.join("\n").trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = String(body?.message ?? "").trim().slice(0, 1600);
    const pageContext = String(body?.pageContext ?? "").slice(0, 2400);
    const experimentContext = String(body?.experimentContext ?? "").slice(0, 1600);
    const history = Array.isArray(body?.history)
      ? (body.history as ChatMessage[]).slice(-6).filter((item) => item?.content)
      : [];

    if (!message) {
      return NextResponse.json({ error: "请输入问题。" }, { status: 400 });
    }

    const retrievalQuery = [message, pageContext, experimentContext].filter(Boolean).join(" ");
    const docs = retrieveBioKnowledge(retrievalQuery, 4);
    const sources = docs.map((doc) => ({
      title: doc.title,
      domain: doc.domain,
      href: doc.href,
    }));

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        answer: makeFallbackAnswer(message, docs),
        sources,
        mode: "rag-fallback",
        notice: "当前使用 BioScope 本地检索导师；配置模型密钥后会自动启用生成式 AI。",
      });
    }

    const system = [
      "你是 BioScope 的 AI 生物导师“小博”。",
      "目标是帮助学习者理解生命科学，而不是只给结论。",
      "优先使用提供的 BioScope 知识库上下文回答；上下文不足时明确说明不确定性。",
      "回答使用简洁中文，先给核心解释，再给因果链或对比，最后给一个可操作的下一步学习建议。",
      "不要编造论文、实验数据或来源。",
      "如果问题涉及实验结果，要区分教学模拟和真实生物实验。",
      "回答最多约 500 字。",
    ].join("\n");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: [
          { role: "system", content: system },
          ...history.map((item) => ({ role: item.role, content: item.content.slice(0, 1000) })),
          {
            role: "user",
            content:
              "BioScope 上下文：\n" + formatContext(docs, pageContext, experimentContext) +
              "\n\n学习者问题：\n" + message,
          },
        ],
        max_output_tokens: 700,
      }),
    });

    if (!response.ok) {
      const fallback = makeFallbackAnswer(message, docs);
      return NextResponse.json({
        answer: fallback,
        sources,
        mode: "rag-fallback",
        notice: "生成式模型暂时不可用，已切换到 BioScope 知识库回答。",
      });
    }

    const data = await response.json();
    const answer = parseResponseText(data) || makeFallbackAnswer(message, docs);

    return NextResponse.json({ answer, sources, mode: "ai-rag" });
  } catch {
    return NextResponse.json({ error: "AI 导师暂时无法处理这个问题，请稍后重试。" }, { status: 500 });
  }
}
