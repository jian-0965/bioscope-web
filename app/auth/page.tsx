import { Suspense } from "react";
import { BookOpen, FlaskConical, Network, Sprout } from "lucide-react";
import AuthForm from "@/components/AuthForm";

export default function AuthPage() {
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

        <div className="auth-code-scene" aria-hidden="true">
          <div className="auth-sun" />
          <div className="auth-sky-cloud cloud-one" />
          <div className="auth-sky-cloud cloud-two" />
          <div className="auth-leaf-cluster leaf-a" />
          <div className="auth-leaf-cluster leaf-b" />
          <div className="auth-leaf-cluster leaf-c" />

          <svg className="auth-cell-graphic" viewBox="0 0 300 300">
            <defs>
              <radialGradient id="cellGlow" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity=".95"/>
                <stop offset="55%" stopColor="#d9fff1" stopOpacity=".75"/>
                <stop offset="100%" stopColor="#74cab1" stopOpacity=".45"/>
              </radialGradient>
            </defs>
            <circle cx="150" cy="150" r="132" fill="url(#cellGlow)" stroke="#eafff5" strokeWidth="5"/>
            <circle cx="145" cy="145" r="38" fill="#b8e69f" opacity=".9"/>
            <ellipse cx="83" cy="102" rx="28" ry="13" fill="#f2b867" transform="rotate(-18 83 102)"/>
            <ellipse cx="206" cy="186" rx="31" ry="14" fill="#f59c7c" transform="rotate(22 206 186)"/>
            <ellipse cx="95" cy="202" rx="24" ry="11" fill="#79c6ae" transform="rotate(16 95 202)"/>
            <ellipse cx="213" cy="96" rx="23" ry="10" fill="#6bbbc4" transform="rotate(-15 213 96)"/>
            <path d="M45 151 C75 128, 92 174, 120 150 S172 126, 198 151 S235 175, 255 144" fill="none" stroke="#82cbb0" strokeWidth="8" strokeLinecap="round" opacity=".85"/>
            <g fill="#f1d16b">
              <circle cx="116" cy="91" r="8"/><circle cx="186" cy="125" r="9"/><circle cx="172" cy="207" r="7"/>
            </g>
          </svg>

          <svg className="auth-dna-graphic" viewBox="0 0 180 320">
            <path d="M45 20 C150 70 150 130 45 180 C-10 210 -10 260 45 300" fill="none" stroke="#67b6c9" strokeWidth="15" strokeLinecap="round"/>
            <path d="M135 20 C30 70 30 130 135 180 C190 210 190 260 135 300" fill="none" stroke="#69b8a1" strokeWidth="15" strokeLinecap="round"/>
            <line x1="50" y1="34" x2="130" y2="44" stroke="#f0ce69" strokeWidth="8" strokeLinecap="round"/><line x1="62" y1="65" x2="118" y2="75" stroke="#f0ce69" strokeWidth="8" strokeLinecap="round"/><line x1="50" y1="96" x2="130" y2="106" stroke="#f0ce69" strokeWidth="8" strokeLinecap="round"/><line x1="62" y1="127" x2="118" y2="137" stroke="#f0ce69" strokeWidth="8" strokeLinecap="round"/><line x1="50" y1="158" x2="130" y2="168" stroke="#f0ce69" strokeWidth="8" strokeLinecap="round"/><line x1="62" y1="189" x2="118" y2="199" stroke="#f0ce69" strokeWidth="8" strokeLinecap="round"/><line x1="50" y1="220" x2="130" y2="230" stroke="#f0ce69" strokeWidth="8" strokeLinecap="round"/><line x1="62" y1="251" x2="118" y2="261" stroke="#f0ce69" strokeWidth="8" strokeLinecap="round"/><line x1="50" y1="282" x2="130" y2="292" stroke="#f0ce69" strokeWidth="8" strokeLinecap="round"/>
          </svg>

          <div className="auth-molecule molecule-one">⚛</div>
          <div className="auth-molecule molecule-two">✣</div>
          <img className="auth-code-mascot" src="/mascots/mascot-boy.webp" alt="" />
        </div>

        <div className="auth-reference-slogan">
          <strong>探索生命的奥秘<br />从这里开始</strong>
          <i aria-hidden="true" />
        </div>
      </section>

      <section className="auth-reference-panel">
        <a className="auth-reference-back" href="/">返回首页 <span>→</span></a>

        <div className="auth-reference-card">
          <div className="auth-reference-heading">
            <div className="auth-reference-mark">❧</div>
            <h1>欢迎回来</h1>
            <p>继续你的生命科学探索之旅</p>
          </div>

          <Suspense fallback={<div className="auth-message">正在加载登录界面…</div>}>
            <AuthForm />
          </Suspense>

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
