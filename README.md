# BioScope Web

BioScope 是一个“生命尺度探索器”式的生物科学科普 Web：用户从人体一路放大到大脑、神经元、细胞膜和离子通道，通过点击结构、互动实验、科学史和经典论文理解生命过程。

## 当前版本

这一版已经形成完整可用的第一章——**神经元世界**：

- 生命尺度探索：人体 → 大脑 → 神经元 → 细胞膜 → 离子通道
- 可点击神经元：树突、胞体、轴突、突触末梢
- 知识卡与“如果……会怎样？”模式
- Na⁺ / K⁺ 通道开关、刺激强度与离子跨膜动画
- 动作电位曲线与膜电位反馈
- Hodgkin、Huxley、Neher、Sakmann 等科学史节点
- 经典论文与 DOI 证据层
- Supabase 实时内容数据库
- 邮箱注册 / 登录
- 收藏、完成状态与学习进度
- 用户 Dashboard
- RLS 安全策略
- GitHub Actions 类型检查与生产构建

## 技术栈

- Next.js 15
- React 19
- TypeScript
- Supabase / PostgreSQL
- Supabase Auth + RLS
- lucide-react
- CSS / SVG 动画

## 本地运行

复制环境变量：

```bash
cp .env.example .env.local
```

然后：

```bash
npm ci
npm run dev
```

打开 http://localhost:3000

## 环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

只在客户端使用 publishable key。不要把 secret/service-role key 放入前端或提交到 GitHub。

## 数据结构

核心表：

- `structures`：生命尺度与结构树
- `knowledge_cards`：知识卡
- `papers` / `structure_papers`：论文与结构关系
- `scientists` / `discoveries`：科学家和发现史
- `experiments` / `experiment_variables`：互动实验配置
- `learning_paths` / `learning_path_nodes`：探索路线
- `profiles` / `user_progress`：用户学习数据

SQL 版本记录位于 `supabase/`。

## 产品原则

BioScope 的核心不是“把教科书搬上网页”，而是：

**探索 → 预测 → 实验 → 观察 → 解释 → 查看证据**

神经元是第一章。后续可以沿同一套数据模型扩展到线粒体、DNA、蛋白质、免疫系统、光合作用等主题。
