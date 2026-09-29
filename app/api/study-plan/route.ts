import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type StageKey = "new" | "consolidate" | "improve" | "sprint";
type KnowledgeTypeKey = "memory" | "process" | "problem" | "application";
type PerformanceKey = "unknown" | "high" | "medium" | "low";
type MethodKey = "srs" | "retrieval" | "deliberate" | "feynman" | "interleaving" | "conceptMap" | "cbl" | "contrast" | "modeling";

type RequestBody = {
  goal?: string;
  focusArea?: string;
  stage?: string;
  level?: string;
  knowledgeType?: string;
  performance?: string;
  conceptConfusion?: boolean;
  forgottenReview?: boolean;
  enabledMethods?: string[];
  pblEnabled?: boolean;
  daysPerWeek?: number;
  minutesPerDay?: number;
  note?: string;
};

type ResolvedInput = {
  goal: string;
  focusArea: string;
  stage: StageKey;
  knowledgeType: KnowledgeTypeKey;
  performance: PerformanceKey;
  performanceSource: "答题记录" | "用户选择" | "等待首轮练习";
  conceptConfusion: boolean;
  forgottenReview: boolean;
  enabledMethods: MethodKey[];
  pblEnabled: boolean;
  daysPerWeek: number;
  minutesPerDay: number;
  note: string;
};

type PlanSession = { day: string; title: string; topic: string; methods: string[]; tasks: string[] };
type MethodChoice = { key: MethodKey; label: string; reason: string };
type PlanStrategy = {
  stage: string;
  knowledgeType: string;
  performance: string;
  performanceSource: string;
  triggers: string[];
  methods: MethodChoice[];
  nextRule: string;
};
type SideProject = { title: string; outcome: string; steps: string[] };
type StudyPlan = {
  title: string;
  summary: string;
  focus: string[];
  sessions: PlanSession[];
  habits: string[];
  strategy: PlanStrategy;
  sideProject: SideProject | null;
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

const stages: Record<StageKey, { label: string; goal: string; base: MethodKey[] }> = {
  new: { label: "新学阶段", goal: "看懂定义、分清易混概念，并建立基础思维模型", base: ["contrast", "modeling"] },
  consolidate: { label: "理解巩固阶段", goal: "对抗遗忘，并把零散知识连接成网络", base: ["retrieval", "conceptMap", "srs", "feynman"] },
  improve: { label: "能力提升阶段", goal: "攻克难点、排查误区，并形成稳定解题思路", base: ["deliberate", "feynman", "retrieval", "modeling"] },
  sprint: { label: "综合冲刺阶段", goal: "跨模块调用知识，在综合题和真实案例中完成迁移", base: ["interleaving", "cbl", "srs", "retrieval", "conceptMap"] },
};

const knowledgeTypes: Record<KnowledgeTypeKey, { label: string; methods: MethodKey[] }> = {
  memory: { label: "记忆类", methods: ["srs", "retrieval", "contrast"] },
  process: { label: "过程机理类", methods: ["modeling", "feynman", "conceptMap"] },
  problem: { label: "计算／实验大题类", methods: ["deliberate", "retrieval"] },
  application: { label: "综合应用类", methods: ["interleaving", "cbl", "conceptMap"] },
};

const methodCatalog: Record<MethodKey, { label: string; task: (topic: string, minutes: number) => string }> = {
  srs: { label: "SRS 间隔重复", task: (topic, minutes) => `用 ${minutes} 分钟复习“${topic}”卡片；把答错项加入 1、3、7 天复习队列。` },
  retrieval: { label: "检索练习", task: (topic, minutes) => `合上资料，用 ${minutes} 分钟默写“${topic}”的关键步骤，再对照补漏。` },
  deliberate: { label: "刻意练习", task: (topic, minutes) => `用 ${minutes} 分钟完成 3 道“${topic}”同类变式题，只针对当前薄弱环节。` },
  feynman: { label: "费曼学习法", task: (topic, minutes) => `用 ${minutes} 分钟把“${topic}”讲给零基础同学听；卡住的位置立即标成漏洞。` },
  interleaving: { label: "交错学习", task: (topic, minutes) => `用 ${minutes} 分钟把“${topic}”与另一个模块混合练习，并说明每题调用了哪类知识。` },
  conceptMap: { label: "概念图", task: (topic, minutes) => `用 ${minutes} 分钟画出“${topic}”概念图，至少连接 5 个概念并标注关系词。` },
  cbl: { label: "CBL 案例学习", task: (topic, minutes) => `用 ${minutes} 分钟分析一个与“${topic}”相关的真实案例，写出证据、机制和结论。` },
  contrast: { label: "对比辨析", task: (topic, minutes) => `用 ${minutes} 分钟制作“${topic}”对比表，从条件、过程、能量和结果四项辨析。` },
  modeling: { label: "模型建构", task: (topic, minutes) => `用 ${minutes} 分钟画出“${topic}”机制模型，用箭头标出输入、变化与输出。` },
};

const methodKeys = Object.keys(methodCatalog) as MethodKey[];

const clamp = (value: unknown, fallback: number, min: number, max: number) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback;
};

function resolveStage(stage?: string, legacyLevel?: string): StageKey {
  if (stage && stage in stages) return stage as StageKey;
  if (legacyLevel === "review") return "sprint";
  if (legacyLevel === "learning") return "consolidate";
  return "new";
}

function inferKnowledgeType(requested: string | undefined, note: string, stage: StageKey, goal: string): KnowledgeTypeKey {
  if (requested && requested !== "auto" && requested in knowledgeTypes) return requested as KnowledgeTypeKey;
  const text = note.toLowerCase();
  if (/名词|结构|分类|名称|细胞器|激素|特征/.test(text)) return "memory";
  if (/计算|概率|实验|设计|曲线|大题|杂交|遗传题/.test(text)) return "problem";
  if (/综合|案例|疾病|病例|稳态|生态|应用/.test(text)) return "application";
  if (/过程|机制|运输|分裂|转录|翻译|传导|呼吸|光合|循环/.test(text)) return "process";
  if (stage === "sprint") return "application";
  if (goal === "exam" && stage !== "new") return "problem";
  return stage === "new" ? "process" : "memory";
}

async function inferPerformance(focusArea: string): Promise<{ value: PerformanceKey; source: ResolvedInput["performanceSource"] }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { value: "unknown", source: "等待首轮练习" };
    const { data } = await supabase
      .from("learning_signals")
      .select("topic_key, attempts, correct")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(20);
    const allowedDomains: Record<string, string[]> = {
      all: [], cell: ["cell", "molecular", "biochemistry"], human: ["human"], genetics: ["genetics"], ecology: ["ecology"],
    };
    const domains = allowedDomains[focusArea] ?? [];
    const rows = (data ?? []).filter((row) => !domains.length || domains.includes(String(row.topic_key).split(":")[0]));
    const attempts = rows.reduce((sum, row) => sum + Number(row.attempts || 0), 0);
    const correct = rows.reduce((sum, row) => sum + Number(row.correct || 0), 0);
    if (attempts < 3) return { value: "unknown", source: "等待首轮练习" };
    const rate = correct / attempts;
    return { value: rate >= 0.85 ? "high" : rate >= 0.5 ? "medium" : "low", source: "答题记录" };
  } catch {
    return { value: "unknown", source: "等待首轮练习" };
  }
}

function uniqueMethods(methods: MethodKey[]) {
  return [...new Set(methods)];
}

function buildStrategy(input: ResolvedInput): PlanStrategy & { methodKeys: MethodKey[] } {
  const enabled = new Set(input.enabledMethods);
  const triggers: string[] = [];
  let selected = uniqueMethods([...stages[input.stage].base, ...knowledgeTypes[input.knowledgeType].methods]);

  if (input.stage === "new") triggers.push("新学阶段：围绕同一知识点集中练习，暂不跨章节交错");

  if (input.performance === "high") {
    selected = uniqueMethods(["srs", ...selected.filter((key) => key !== "deliberate")]);
    triggers.push("正确率 ≥85%：减少同类题，转入间隔复习并推进新知识点");
  } else if (input.performance === "medium") {
    selected = uniqueMethods(["deliberate", "feynman", ...selected]);
    triggers.push("正确率 50%–84%：增加同类变式题，并用口述定位漏洞");
  } else if (input.performance === "low") {
    selected = ["contrast", "modeling", "retrieval"];
    triggers.push("正确率 <50%：退回基础模型，暂停难题与交错练习");
  } else {
    triggers.push("暂无足够答题记录：完成首轮任务后再自动调整强度");
  }

  if (input.conceptConfusion) {
    selected = uniqueMethods(["contrast", "conceptMap", ...selected]);
    triggers.push("检测到概念混淆：插入对比卡片与概念图任务");
  }
  if (input.forgottenReview) {
    selected = uniqueMethods(["retrieval", "srs", ...selected]);
    triggers.push("复习再次答错：提高检索频率并缩短复习间隔");
  }

  selected = selected.filter((key) => enabled.has(key));
  if (!selected.length) selected = methodKeys.filter((key) => enabled.has(key)).slice(0, 2);
  if (!selected.length) selected = ["retrieval"];

  const methods = selected.map((key) => {
    const inStage = stages[input.stage].base.includes(key);
    const inType = knowledgeTypes[input.knowledgeType].methods.includes(key);
    const triggered = (input.performance !== "unknown" || input.conceptConfusion || input.forgottenReview) && !inStage && !inType;
    return {
      key,
      label: methodCatalog[key].label,
      reason: triggered ? "由近期表现触发" : inStage && inType ? "阶段主方法＋知识类型匹配" : inStage ? "当前阶段主方法" : "知识类型匹配",
    };
  });

  const nextRule = input.performance === "high"
    ? "下一轮推进新知识点，保留 1、3、7 天 SRS 复习。"
    : input.performance === "medium"
      ? "下一轮继续同类变式；达到 85% 后减少题量并推进。"
      : input.performance === "low"
        ? "基础判断题达到 50% 后，再恢复刻意练习。"
        : "完成至少 3 次练习后，系统按 ≥85%、50%–84%、<50% 自动切换。";

  return {
    stage: stages[input.stage].label,
    knowledgeType: knowledgeTypes[input.knowledgeType].label,
    performance: input.performance === "high" ? "正确率高" : input.performance === "medium" ? "正确率中等" : input.performance === "low" ? "正确率偏低" : "待检测",
    performanceSource: input.performanceSource,
    triggers,
    methods,
    nextRule,
    methodKeys: selected,
  };
}

function makeSideProject(input: ResolvedInput): SideProject | null {
  if (!input.pblEnabled) return null;
  const projects: Record<string, SideProject> = {
    cell: { title: "设计细胞膜运输变量控制实验", outcome: "形成一页实验方案，不占用主线学习时长。", steps: ["提出可检验问题并确定自变量", "设置对照组与测量指标", "预测结果并说明生物学依据"] },
    human: { title: "制作一份人体稳态病例解释报告", outcome: "用多个系统协同解释一个真实健康现象。", steps: ["选择病例并提取关键症状", "连接神经、内分泌或免疫机制", "画出因果链并提出验证证据"] },
    genetics: { title: "设计遗传规律模拟实验", outcome: "用数据验证一个遗传假设。", steps: ["提出基因型与表型假设", "设计杂交或随机模拟", "比较理论比例与模拟结果"] },
    ecology: { title: "设计校园种群密度调查", outcome: "完成一份可以实际执行的调查方案。", steps: ["选择样方法或标志重捕法", "确定样本、记录表和误差来源", "用模拟数据解释种群变化"] },
    all: { title: "制作生命现象跨尺度解释项目", outcome: "从分子、细胞到个体或生态系统完成一条解释链。", steps: ["选择一个具体生命现象", "收集三个尺度的关键证据", "制作模型并写出可验证预测"] },
  };
  return projects[input.focusArea] ?? projects.all;
}

function makePlan(input: ResolvedInput): StudyPlan {
  const topics = curricula[input.focusArea as keyof typeof curricula] ?? curricula.all;
  const strategy = buildStrategy(input);
  const rotationStart = input.goal === "exam" ? 1 : input.goal === "weak" ? 2 : 0;
  const sessions = Array.from({ length: input.daysPerWeek }, (_, index) => {
    const [title, summary] = topics[(index + rotationStart) % topics.length];
    const chosenKeys = Array.from({ length: Math.min(3, strategy.methodKeys.length) }, (__, methodIndex) => strategy.methodKeys[(index + methodIndex) % strategy.methodKeys.length]);
    const minutes = chosenKeys.map((__, methodIndex) => {
      if (methodIndex === chosenKeys.length - 1) return input.minutesPerDay - Math.floor(input.minutesPerDay / chosenKeys.length) * methodIndex;
      return Math.floor(input.minutesPerDay / chosenKeys.length);
    });
    const tasks = chosenKeys.map((key, methodIndex) => methodCatalog[key].task(title, minutes[methodIndex]));
    if (tasks.length === 1) {
      tasks[0] = methodCatalog[chosenKeys[0]].task(title, Math.max(10, input.minutesPerDay - 3));
      tasks.push("最后用 3 分钟记录完成度和错误类型，作为下一轮切换方法的依据。");
    }
    return {
      day: "第 " + (index + 1) + " 天",
      title,
      topic: summary,
      methods: chosenKeys.map((key) => methodCatalog[key].label),
      tasks,
    };
  });
  return {
    title: input.daysPerWeek + " 天「" + focusAreas[input.focusArea] + "」自适应学习计划",
    summary: `当前采用“${stages[input.stage].label}”策略，目标是${stages[input.stage].goal}。每天约 ${input.minutesPerDay} 分钟。${input.note ? " 本周特别关注：" + input.note : ""}`,
    focus: sessions.slice(0, 3).map((session) => session.title),
    sessions,
    habits: ["每次练习都记录正确率和错误类型，作为下一轮切换依据。", "不要只记答案：写清楚概念、机制或步骤中具体卡住的位置。", strategy.nextRule],
    strategy: {
      stage: strategy.stage,
      knowledgeType: strategy.knowledgeType,
      performance: strategy.performance,
      performanceSource: strategy.performanceSource,
      triggers: strategy.triggers,
      methods: strategy.methods,
      nextRule: strategy.nextRule,
    },
    sideProject: makeSideProject(input),
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

function normalizePlan(value: unknown, fallback: StudyPlan, input: ResolvedInput): StudyPlan | null {
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
    return {
      day: typeof item.day === "string" ? item.day.slice(0, 24) : "第 " + (index + 1) + " 天",
      title: item.title.trim().slice(0, 40),
      topic: item.topic.trim().slice(0, 140),
      methods: fallback.sessions[index].methods,
      tasks,
    };
  });
  if (sessions.some((session) => !session)) return null;
  return {
    ...fallback,
    title: candidate.title.trim().slice(0, 80),
    summary: candidate.summary.trim().slice(0, 240),
    focus: candidate.focus.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 4),
    sessions: sessions as PlanSession[],
    habits: candidate.habits.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 4),
    mode: "doubao",
  };
}

async function improveWithDoubao(fallback: StudyPlan, input: ResolvedInput) {
  const apiKey = process.env.ARK_API_KEY;
  if (!apiKey) return fallback;
  const system = [
    "你是 BioScope 的中文生命科学自适应学习教练。你只返回合法 JSON，不能使用 Markdown 或解释文字。",
    "调度器已根据学习阶段、知识类型、正确率和用户开关选好方法。你只能把指定方法落实为具体任务，不能自行添加被关闭的方法。",
    "每个任务必须写清动作、对象、时间或产出；避免连续重复同一种活动，也不能只写‘阅读’或‘复习’。",
    "sessions 必须正好有 " + input.daysPerWeek + " 项，每项 2 到 4 个任务；每天总时长接近 " + input.minutesPerDay + " 分钟。",
    "不要杜撰考试范围、研究结论、外部资料或用户成绩。",
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
        type: "array", minItems: input.daysPerWeek, maxItems: input.daysPerWeek,
        items: {
          type: "object", additionalProperties: false, required: ["day", "title", "topic", "methods", "tasks"],
          properties: {
            day: { type: "string" }, title: { type: "string" }, topic: { type: "string" },
            methods: { type: "array", minItems: 1, maxItems: 3, items: { type: "string" } },
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
    "阶段策略：" + fallback.strategy.stage,
    "知识类型：" + fallback.strategy.knowledgeType,
    "动态表现：" + fallback.strategy.performance + "（" + fallback.strategy.performanceSource + "）",
    "触发规则：" + fallback.strategy.triggers.join("；"),
    "每周学习：" + input.daysPerWeek + " 天；每天：" + input.minutesPerDay + " 分钟",
    "用户特别需求：" + (input.note || "无"),
    "不可改变的方法安排：" + JSON.stringify(fallback.sessions.map((session) => ({ day: session.day, title: session.title, topic: session.topic, methods: session.methods }))),
  ].join("\n");
  try {
    const model = process.env.DOUBAO_MODEL || "doubao-seed-2-0-lite-260428";
    const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        temperature: 0.5,
        max_tokens: 1800,
        thinking: { type: "disabled" },
        response_format: { type: "json_schema", json_schema: { name: "bioscope_adaptive_study_plan", description: "BioScope 中文生命科学自适应学习计划", schema: planSchema, strict: true } },
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
    const goal = String(body.goal || "foundations").slice(0, 32);
    const focusArea = String(body.focusArea || "all").slice(0, 32);
    const stage = resolveStage(body.stage, body.level);
    const note = String(body.note || "").trim().slice(0, 180);
    const knowledgeType = inferKnowledgeType(body.knowledgeType, note, stage, goal);
    const requestedPerformance = ["high", "medium", "low"].includes(String(body.performance)) ? body.performance as PerformanceKey : "unknown";
    const inferred = requestedPerformance === "unknown" ? await inferPerformance(focusArea) : { value: requestedPerformance, source: "用户选择" as const };
    const enabledMethods = Array.isArray(body.enabledMethods)
      ? body.enabledMethods.filter((key): key is MethodKey => methodKeys.includes(key as MethodKey))
      : methodKeys;
    const input: ResolvedInput = {
      goal,
      focusArea: focusArea in focusAreas ? focusArea : "all",
      stage,
      knowledgeType,
      performance: inferred.value,
      performanceSource: inferred.source,
      conceptConfusion: Boolean(body.conceptConfusion),
      forgottenReview: Boolean(body.forgottenReview),
      enabledMethods,
      pblEnabled: Boolean(body.pblEnabled),
      daysPerWeek: clamp(body.daysPerWeek, 4, 2, 7),
      minutesPerDay: clamp(body.minutesPerDay, 30, 15, 120),
      note,
    };
    const plan = await improveWithDoubao(makePlan(input), input);
    return NextResponse.json({ plan, provider: plan.mode });
  } catch {
    return NextResponse.json({ error: "学习计划暂时无法生成，请稍后再试。" }, { status: 500 });
  }
}
