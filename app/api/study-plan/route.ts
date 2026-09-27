import { NextResponse } from "next/server";

type RequestBody = {
  goal?: string;
  focusArea?: string;
  level?: string;
  daysPerWeek?: number;
  minutesPerDay?: number;
  note?: string;
};

type PlanSession = { day: string; title: string; topic: string; tasks: string[] };
type StudyPlan = {
  title: string;
  summary: string;
  focus: string[];
  sessions: PlanSession[];
  habits: string[];
  mode: "doubao" | "local";
};

const curricula = {
  all: [
    ["细胞生物学", "细胞如何分工、交换物质和维持稳态"],
    ["人体生理", "神经、循环、呼吸系统如何协同工作"],
    ["遗传与基因", "遗传信息如何传递并影响性状"],
    ["生物化学与代谢", "酶与能量转换如何驱动生命活动"],
    ["生态与进化", "种群、环境与自然选择如何互相影响"],
  ],
  cell: [
    ["细胞结构", "把细胞器的位置、结构和分工联系起来"],
    ["细胞膜与物质运输", "理解扩散、渗透和主动运输的差别"],
    ["酶与代谢", "用底物、活性位点和能量转换解释生命活动"],
    ["细胞周期", "将 DNA 复制、分裂与生长过程串联起来"],
  ],
  human: [
    ["神经系统", "从神经元到反射，理解信息如何传递"],
    ["循环与呼吸", "把气体交换、血液运输和能量需要连接起来"],
    ["免疫与稳态", "理解防御、炎症和体内调节的关系"],
    ["内分泌调节", "比较激素调节与神经调节的特点"],
  ],
  genetics: [
    ["DNA 与基因", "从 DNA 结构理解遗传信息如何保存"],
    ["遗传规律", "用基因型、表型和概率分析杂交结果"],
    ["基因表达", "理解转录、翻译如何决定蛋白质合成"],
    ["进化机制", "连接变异、选择与种群遗传变化"],
  ],
  ecology: [
    ["生态系统", "识别能量流动与物质循环的基本关系"],
    ["种群与群落", "用限制因素解释种群数量变化"],
    ["自然选择", "用证据区分适应、选择与进化结果"],
    ["生物多样性", "理解环境变化对物种和生态功能的影响"],
  ],
} as const;

const goals: Record<string, string> = {
  foundations: "打好生命科学基础",
  exam: "准备考试与测验",
  weak: "补强薄弱知识点",
  exploration: "系统探索感兴趣的主题",
};

const focusAreas: Record<string, string> = {
  all: "综合生命科学",
  cell: "细胞与分子",
  human: "人体与健康",
  genetics: "遗传与进化",
  ecology: "生态与环境",
};

const levels: Record<string, string> = {
  beginner: "入门",
  learning: "正在学习",
  review: "考前复习",
};

const clamp = (value: unknown, fallback: number, min: number, max: number) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback;
};

function makePlan(input: Required<RequestBody>): StudyPlan {
  const topics = curricula[input.focusArea as keyof typeof curricula] ?? curricula.all;
  const rotationStart = input.goal === "exam" ? 1 : input.goal === "weak" ? 2 : 0;
  const sessions = Array.from({ length: input.daysPerWeek }, (_, index) => {
    const [title, summary] = topics[(index + rotationStart) % topics.length];
    const readMinutes = Math.max(10, Math.round(input.minutesPerDay * 0.45));
    const practiceMinutes = Math.max(8, Math.round(input.minutesPerDay * 0.25));
    const recapMinutes = Math.max(5, input.minutesPerDay - readMinutes - practiceMinutes);
    return {
      day: "第 " + (index + 1) + " 天",
      title,
      topic: summary,
      tasks: [
        "用 " + readMinutes + " 分钟学习“" + title + "”，写下 3 个关键词和它们的关系。",
        input.goal === "exam"
          ? "用 " + practiceMinutes + " 分钟做 3—5 道题，标记每道题考查的概念。"
          : "用 " + practiceMinutes + " 分钟回答：它如何运作？如果失效会怎样？",
        "最后用 " + recapMinutes + " 分钟复盘，把不确定的点写成下一次要解决的问题。",
      ],
    };
  });
  return {
    title: input.daysPerWeek + " 天「" + focusAreas[input.focusArea] + "」" + (goals[input.goal] || goals.foundations) + "计划",
    summary: "以“" + (levels[input.level] || levels.beginner) + "”节奏学习，每天约 " + input.minutesPerDay + " 分钟，按“理解 → 练习 → 复盘”完成。" + (input.note ? " 本周特别关注：" + input.note : ""),
    focus: sessions.slice(0, 3).map((session) => session.title),
    sessions,
    habits: input.goal === "exam"
      ? ["错题要写清楚错因，而不只写答案。", "隔一天重做错题，再隔三天检查是否记住。", "最后一天只复盘薄弱点。"]
      : ["每次结束用一句话复述机制。", "不确定的概念先记录，下一次主动验证。", "最后一天只回顾和补漏。"],
    mode: "local",
  };
}

function getJsonObject(text: string) {
  const clean = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("模型没有返回 JSON");
  return JSON.parse(clean.slice(start, end + 1)) as unknown;
}

function normalizePlan(value: unknown, fallback: StudyPlan, input: Required<RequestBody>): StudyPlan | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<StudyPlan>;
  if (typeof candidate.title !== "string" || typeof candidate.summary !== "string" || !Array.isArray(candidate.focus) || !Array.isArray(candidate.sessions) || !Array.isArray(candidate.habits)) return null;
  if (candidate.sessions.length !== input.daysPerWeek) return null;
  const sessions = candidate.sessions.map((session, index) => {
    if (!session || typeof session !== "object") return null;
    const item = session as Partial<PlanSession>;
    if (typeof item.title !== "string" || typeof item.topic !== "string" || !Array.isArray(item.tasks)) return null;
    const tasks = item.tasks.filter((task): task is string => typeof task === "string").map((task) => task.trim()).filter(Boolean).slice(0, 4);
    if (tasks.length < 2) return null;
    return { day: typeof item.day === "string" ? item.day.slice(0, 24) : "第 " + (index + 1) + " 天", title: item.title.trim().slice(0, 40), topic: item.topic.trim().slice(0, 140), tasks };
  });
  if (sessions.some((session) => !session)) return null;
  return {
    ...fallback,
    title: candidate.title.trim().slice(0, 80),
    summary: candidate.summary.trim().slice(0, 220),
    focus: candidate.focus.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 4),
    sessions: sessions as PlanSession[],
    habits: candidate.habits.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 4),
    mode: "doubao",
  };
}

async function improveWithDoubao(fallback: StudyPlan, input: Required<RequestBody>) {
  const apiKey = process.env.ARK_API_KEY;
  if (!apiKey) return fallback;
  const system = [
    "你是 BioScope 的中文生命科学学习计划教练。你只返回一个合法 JSON 对象，不能使用 Markdown 或解释文字。",
    "JSON 必须严格包含 title、summary、focus、sessions、habits。sessions 必须正好有 " + input.daysPerWeek + " 项；每项必须有 day、title、topic、tasks。tasks 为 2 到 4 条具体、可操作的学习任务。",
    "计划必须根据学习目标、领域、水平、每天时长、用户补充进行差异化安排。不要连续安排相同主题；不要杜撰事实、考试范围或外部资料。",
    "每一天的任务总时长要接近 " + input.minutesPerDay + " 分钟；要加入主动回忆、练习或复盘，而不是只写“阅读”。",
  ].join("\n");
  const planSchema = {
    type: "object",
    additionalProperties: false,
    required: ["title", "summary", "focus", "sessions", "habits"],
    properties: {
      title: { type: "string" },
      summary: { type: "string" },
      focus: { type: "array", minItems: 1, maxItems: 4, items: { type: "string" } },
      sessions: {
        type: "array",
        minItems: input.daysPerWeek,
        maxItems: input.daysPerWeek,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["day", "title", "topic", "tasks"],
          properties: {
            day: { type: "string" },
            title: { type: "string" },
            topic: { type: "string" },
            tasks: { type: "array", minItems: 2, maxItems: 4, items: { type: "string" } },
          },
        },
      },
      habits: { type: "array", minItems: 1, maxItems: 4, items: { type: "string" } },
    },
  };
  const user = [
    "学习目标：" + (goals[input.goal] || goals.foundations),
    "学习领域：" + (focusAreas[input.focusArea] || focusAreas.all),
    "当前水平：" + (levels[input.level] || levels.beginner),
    "每周学习：" + input.daysPerWeek + " 天；每天：" + input.minutesPerDay + " 分钟",
    "用户特别需求：" + (input.note || "无"),
    "可参考的初步主题安排（请优化，不要照抄）：" + JSON.stringify(fallback.sessions.map((session) => ({ title: session.title, topic: session.topic }))),
  ].join("\n");
  try {
    const model = process.env.DOUBAO_MODEL || "doubao-seed-2-0-lite-260215";
    const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        temperature: 0.55,
        max_tokens: 1400,
        thinking: { type: "disabled" },
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "bioscope_study_plan",
            description: "BioScope 的中文生命科学个性化学习计划",
            schema: planSchema,
            strict: true,
          },
        },
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!response.ok) {
      console.warn("Doubao study-plan request failed", response.status, (await response.text()).slice(0, 320));
      return fallback;
    }
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const text = payload.choices?.[0]?.message?.content || "";
    const plan = normalizePlan(getJsonObject(text), fallback, input);
    if (!plan) console.warn("Doubao study-plan response did not match the required plan shape");
    return plan ?? fallback;
  } catch (error) {
    console.warn("Doubao study-plan request failed", error instanceof Error ? error.message : "unknown error");
    return fallback;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;
    const input: Required<RequestBody> = {
      goal: String(body.goal || "foundations").slice(0, 32),
      focusArea: String(body.focusArea || "all").slice(0, 32),
      level: String(body.level || "beginner").slice(0, 32),
      daysPerWeek: clamp(body.daysPerWeek, 4, 2, 7),
      minutesPerDay: clamp(body.minutesPerDay, 30, 15, 120),
      note: String(body.note || "").trim().slice(0, 180),
    };
    const plan = await improveWithDoubao(makePlan(input), input);
    return NextResponse.json({ plan, signedIn: false, provider: plan.mode });
  } catch {
    return NextResponse.json({ error: "学习计划暂时无法生成，请稍后再试。" }, { status: 500 });
  }
}
