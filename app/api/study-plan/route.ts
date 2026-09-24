import { NextResponse } from "next/server";

type RequestBody = { goal?: string; daysPerWeek?: number; minutesPerDay?: number; note?: string };

const topics = [
  ["细胞生物学", "细胞如何分工、交换物质和维持稳态"],
  ["人体生理", "神经、循环、呼吸系统如何协同工作"],
  ["遗传与基因", "遗传信息如何传递并影响性状"],
  ["生物化学与代谢", "酶与能量转换如何驱动生命活动"],
  ["生态与进化", "种群、环境与自然选择如何互相影响"],
] as const;

const goals: Record<string, string> = {
  foundations: "打好生命科学基础",
  exam: "准备考试与测验",
  weak: "补强薄弱知识点",
  exploration: "系统探索感兴趣的主题",
};

const clamp = (value: unknown, fallback: number, min: number, max: number) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback;
};

function makePlan(input: Required<RequestBody>) {
  const sessions = Array.from({ length: input.daysPerWeek }, (_, index) => {
    const [title, summary] = topics[index % topics.length];
    const readMinutes = Math.max(10, Math.round(input.minutesPerDay * 0.45));
    const practiceMinutes = Math.max(8, Math.round(input.minutesPerDay * 0.25));
    return {
      day: "第 " + (index + 1) + " 天",
      title,
      topic: summary,
      tasks: [
        "用 " + readMinutes + " 分钟学习“" + title + "”知识卡并标出关键概念。",
        "用自己的话回答：它如何运作？如果失效会怎样？",
        "用 " + practiceMinutes + " 分钟完成挑战题；把错题留给下一次复习。",
      ],
    };
  });

  return {
    title: input.daysPerWeek + " 天 " + (goals[input.goal] || goals.foundations) + "计划",
    summary: "每天约 " + input.minutesPerDay + " 分钟，按“理解 → 解释 → 练习 → 回顾”的节奏完成。" + (input.note ? " 本周重点：" + input.note : ""),
    focus: sessions.slice(0, 3).map((session) => session.title),
    sessions,
    habits: ["每次结束用一句话复述机制。", "错题隔一天重做一次。", "预留一天只做回顾和补漏。"],
    mode: "local" as const,
  };
}

async function improveWithGemini(fallback: ReturnType<typeof makePlan>, input: Required<RequestBody>) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return fallback;

  const prompt = [
    "你是 BioScope 的生命科学学习计划教练。只输出 JSON，不要额外文字。",
    "保留 title、summary、focus、sessions、habits 字段；sessions 必须有 " + input.daysPerWeek + " 天，每天约 " + input.minutesPerDay + " 分钟。",
    "学习目标：" + (goals[input.goal] || goals.foundations),
    "用户补充：" + (input.note || "无"),
    "本地草案：" + JSON.stringify(fallback),
  ].join("
");

  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + encodeURIComponent(apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.35 } }),
    });
    if (!response.ok) return fallback;
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
    const plan = JSON.parse(text);
    return plan && typeof plan.title === "string" && Array.isArray(plan.sessions) ? { ...plan, mode: "gemini" as const } : fallback;
  } catch {
    return fallback;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;
    const input: Required<RequestBody> = {
      goal: String(body.goal || "foundations").slice(0, 32),
      daysPerWeek: clamp(body.daysPerWeek, 4, 2, 7),
      minutesPerDay: clamp(body.minutesPerDay, 30, 15, 120),
      note: String(body.note || "").trim().slice(0, 180),
    };
    const plan = await improveWithGemini(makePlan(input), input);
    return NextResponse.json({ plan, signedIn: false });
  } catch {
    return NextResponse.json({ error: "学习计划暂时无法生成，请稍后再试。" }, { status: 500 });
  }
}
