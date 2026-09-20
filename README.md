# BioScope Web

生物科学可视化科普平台第一版原型。

## 当前已实现

- 生命尺度探索器：人体 → 大脑 → 神经元 → 细胞膜 → 离子通道
- 点击尺度节点切换知识卡
- 神经元实验室原型
  - 调整刺激强度
  - 开关 Na⁺ / K⁺ 通道
  - 观察简化膜电位结果
- 响应式首页视觉骨架

## 技术栈

- Next.js 15
- React 19
- TypeScript
- 原生 CSS
- lucide-react 图标
- Supabase Auth、PostgreSQL 与 Row Level Security

## 本地启动

```bash
npm install
cp .env.example .env.local
npm run dev
```

然后打开 http://localhost:3000

## Supabase 配置

1. 在 .env.local 填入项目 URL 和 Publishable Key（不要使用 Secret/Service Role Key）。
2. 在 Supabase SQL Editor 执行 supabase/schema.sql。
3. 在 Auth URL Configuration 中加入本地与生产地址的 /auth/callback。

已实现邮箱注册、登录、邮箱确认回调、退出、会话刷新、/dashboard 受保护路由，以及带 RLS 的用户资料和学习进度表。

## 后续开发优先级

1. 用真正的生命尺度可视化替换占位图
2. 加入神经元 SVG/Canvas 动画
3. 加入动作电位曲线
4. 加入科学家卡通讲解角色
5. 接入论文数据与 DOI
6. 将知识卡与论文内容迁移到 Supabase
