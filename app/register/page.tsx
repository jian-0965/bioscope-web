import { BookOpen, FlaskConical, Network, Sprout } from "lucide-react";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="auth-reference-page">
      <section className="auth-reference-visual" aria-label="BioScope 生物科学视觉插画">
        <div className="auth-reference-brand">
          <div className="auth-reference-logo">❧</div>
          <div>
            <strong>BioScope</strong>
            <span>在微观世界里，看见生命如何运作</span>
          </div>
        </div>

        <div className="auth-reference-slogan">
          <strong>探索生命的奥秘<br />从这里开始</strong>
          <i aria-hidden="true" />
        </div>
      </section>

      <section className="auth-reference-panel">
        <a className="auth-reference-back" href="/auth">返回登录 <span>→</span></a>

        <div className="auth-reference-card">
          <div className="auth-reference-heading">
            <div className="auth-reference-mark">❧</div>
            <h1>加入 BioScope</h1>
            <p>创建你的账号，开启生命科学探索之旅</p>
          </div>

          <RegisterForm />

          <div className="auth-reference-features">
            <div><BookOpen /><strong>丰富的科普内容</strong><span>系统学习生命科学</span></div>
            <div><FlaskConical /><strong>互动实验模拟</strong><span>在实践中理解原理</span></div>
            <div><Network /><strong>个性化学习路径</strong><span>找到适合你的路线</span></div>
            <div><Sprout /><strong>加入科学社区</strong><span>与同好一起探索</span></div>
          </div>
        </div>
      </section>
    </main>
  );
}
