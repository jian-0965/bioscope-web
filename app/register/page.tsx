import { BookOpen, FlaskConical, Network, Sprout } from "lucide-react";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
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
        <div className="auth-scene-bio-visual" aria-hidden="true">
          <div className="bio-orb bio-orb-cell"><span>🧫</span></div>
          <div className="bio-orb bio-orb-molecule"><span>⚛</span></div>
          <div className="bio-orb bio-orb-dna"><span>🧬</span></div>
          <img className="auth-scene-mascot" src="/mascots/mascot-girl.webp" alt="" />
        </div>
        <div className="auth-scene-quote">
          <strong>生命，<br />比你想象的更精彩</strong>
          <span>用科学的眼睛，发现更大的世界</span>
        </div>
      </section>

      <section className="auth-scene-panel">
        <a className="auth-scene-back" href="/auth">已有账号？立即登录 →</a>
        <div className="auth-scene-card">
          <div className="auth-scene-title">
            <span className="auth-leaf large">◆</span>
            <p>BioScope · 生物科学可视化科普平台</p>
            <h1>加入 BioScope</h1>
            <span>创建你的账号，开启生命科学探索之旅</span>
          </div>

          <RegisterForm />

          <div className="auth-scene-features">
            <span><BookOpen size={18} /><b>丰富科学内容</b></span>
            <span><FlaskConical size={18} /><b>互动实验模拟</b></span>
            <span><Network size={18} /><b>个性学习路径</b></span>
            <span><Sprout size={18} /><b>探索生命奥秘</b></span>
          </div>
        </div>
      </section>
    </main>
  );
}
