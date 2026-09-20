import { Suspense } from "react";
import { BookOpen, FlaskConical, Network, Sprout } from "lucide-react";
import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
  return (
    <main className="auth-scene-page">
      <section className="auth-scene-art" aria-label="BioScope 生物科学插画">
        <div className="auth-scene-brand">
          <span className="auth-leaf">◆</span>
          <div>
            <strong>BioScope</strong>
            <small>在微观世界里，看见生命如何运作</small>
          </div>
        </div>
        <div className="auth-scene-quote">
          <strong>探索生命的奥秘，<br />从这里开始</strong>
          <span>从细胞到生态，从机制到未来</span>
        </div>
      </section>

      <section className="auth-scene-panel">
        <a className="auth-scene-back" href="/">← 返回首页</a>
        <div className="auth-scene-card">
          <div className="auth-scene-title">
            <span className="auth-leaf large">◆</span>
            <p>BioScope · 生物科学可视化科普平台</p>
            <h1>欢迎回来</h1>
            <span>继续你的生命科学探索之旅</span>
          </div>

          <Suspense fallback={<div className="auth-message">正在加载登录界面…</div>}>
            <AuthForm />
          </Suspense>

          <div className="auth-scene-features">
            <span><BookOpen size={18} /><b>探索生命奥秘</b></span>
            <span><FlaskConical size={18} /><b>互动实验模拟</b></span>
            <span><Network size={18} /><b>可视化学习</b></span>
            <span><Sprout size={18} /><b>让科学更有趣</b></span>
          </div>
        </div>
      </section>
    </main>
  );
}
