# BioScope Web

BioScope 是一个以“尺度探索 + 思维导图 + 互动实验 + 科学史 + 证据链”为核心的生物科学可视化科普网站。

## 当前代码范围

### 1. 生命尺度探索器
- 人体 → 大脑 → 神经元 → 细胞膜 → 离子通道
- 可点击神经元结构
- Na⁺ / K⁺ 通道互动
- 动作电位曲线
- Supabase 内容读取
- 用户收藏与完成状态

### 2. 人体系统思维导图
- 循环系统
- 呼吸系统
- 神经系统
- 内分泌系统
- 免疫系统
- 消化系统
- 泌尿系统
- 运动系统

### 3. 生物学全景 Atlas
包含八大领域：
- 人体生理
- 细胞生物学
- 遗传与基因
- 生物化学与代谢
- 微生物世界
- 植物科学
- 进化生物学
- 生态与环境

每个领域都有专题页，每个专题包含：
- 核心概念
- 关键词
- “如果……会怎样？”
- “我们怎么知道？”

### 4. BioScope Labs
- 神经元动作电位实验
- 孟德尔杂交模拟
- 酶活性环境模拟
- 光强与光合作用简化模型

### 5. 学习工具
- 跨领域挑战题
- 生物学术语词典
- 推荐学习路线
- 专题收藏 / 学会状态
- 用户 Dashboard

### 6. 用户系统
- Supabase Auth
- 邮箱注册 / 登录
- Profile
- user_progress
- RLS

## 页面路由

```text
/
├─ /atlas
│  ├─ /atlas/human
│  ├─ /atlas/cell
│  ├─ /atlas/genetics
│  ├─ /atlas/biochemistry
│  ├─ /atlas/microbiology
│  ├─ /atlas/plants
│  ├─ /atlas/evolution
│  └─ /atlas/ecology
│
│  每个领域继续进入：
│  /atlas/[领域]/[专题]
│
├─ /labs
├─ /challenges
├─ /glossary
├─ /paths
├─ /auth
├─ /register
└─ /dashboard
```

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Supabase / PostgreSQL
- Supabase Auth + RLS
- lucide-react
- CSS / SVG

## 本地运行

```bash
cp .env.example .env.local
npm ci
npm run dev
```

## 环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

不要把 service role key 或其他 secret 放进前端。

## 产品原则

BioScope 不是把课本搬到网页，而是让学习过程变成：

**探索 → 预测 → 实验 → 观察 → 解释 → 查看证据 → 建立联系**

代码层已经按“领域 → 专题 → 知识骨架 → 实验/证据/学习进度”的方式组织，后续新增新主题时不需要重写整站结构。
