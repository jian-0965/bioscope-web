import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <main className="simple-auth-page">
      <section className="simple-auth-visual" aria-label="BioScope 生物科学视觉背景">
        <div className="simple-auth-brand">
          <strong>BioScope</strong>
          <span>在微观世界里，看见生命如何运作</span>
        </div>
        <div className="simple-auth-slogan">
          <h2>探索生命的奥秘<br />从这里开始</h2>
          <p>从细胞到生态，理解生命如何运作</p>
        </div>
      </section>

      <section className="simple-auth-panel">
        <a className="simple-auth-back" href="/">返回首页 →</a>

        <div className="simple-auth-card">
          <div className="simple-auth-heading">
            <span className="simple-auth-kicker">BIOLOGY LEARNING</span>
            <h1>欢迎回来</h1>
            <p>登录 BioScope，继续你的生命科学探索之旅</p>
          </div>

          <Suspense fallback={<div className="auth-message">正在加载登录界面…</div>}>
            <AuthForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
