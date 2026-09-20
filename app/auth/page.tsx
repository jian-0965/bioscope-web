import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <main className="auth-shell">
      <a className="back-link" href="/">← 返回生命尺度探索器</a>
      <section className="auth-card">
        <div className="auth-intro">
          <span className="eyebrow">BioScope · 学习账户</span>
          <h1>保存你的生命探索旅程</h1>
          <p>登录后可以同步收藏、实验记录和学习进度。</p>
        </div>
        <Suspense fallback={<div className="auth-message">正在加载登录界面…</div>}>
          <AuthForm />
        </Suspense>
      </section>
    </main>
  );
}
