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

## 本地启动

```bash
npm install
npm run dev
```

然后打开 http://localhost:3000

## 数据库计划

第一版暂时不强依赖数据库，内容存放在 `data/` 中，便于快速迭代。
后续建议接入 Supabase/PostgreSQL，表结构可按以下方向拆分：

- `structures`：生物结构
- `knowledge_cards`：知识卡
- `papers`：论文与 DOI
- `scientists`：科学家角色
- `experiments`：交互实验配置
- `citations`：知识点与论文证据关系
- `user_progress`：用户探索进度与收藏

## 后续开发优先级

1. 用真正的生命尺度可视化替换占位图
2. 加入神经元 SVG/Canvas 动画
3. 加入动作电位曲线
4. 加入科学家卡通讲解角色
5. 接入论文数据与 DOI
6. 接入 Supabase
