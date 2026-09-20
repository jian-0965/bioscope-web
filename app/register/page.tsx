import { BookOpen, Network, Sprout } from "lucide-react";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="register-page">
      <div className="register-art" aria-hidden="true" />

      <section className="register-panel">
        <a className="register-back" href="/">← 返回探索器</a>

        <div className="register-card">
          <div className="register-logo">
            <span className="leaf-mark">◆</span>
          </div>

          <div className="register-copy">
            <span className="register-kicker">BioScope · 创建学习账户</span>
            <h1>生物科学可视化科普平台</h1>
            <p className="register-subtitle">在微观世界里，看见生命如何运作</p>
            <p className="register-desc">
              创建账户后，你可以保存探索进度、收藏知识卡，并同步自己的学习路径。
            </p>
          </div>

          <RegisterForm />

          <div className="register-features">
            <span><BookOpen size={17} /> 探索生命奥秘</span>
            <span><Network size={17} /> 可视化学习</span>
            <span><Sprout size={17} /> 让科学更有趣</span>
          </div>
        </div>
      </section>
    </main>
  );
}
