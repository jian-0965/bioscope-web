import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
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
        <a className="simple-auth-back" href="/auth">返回登录 →</a>

        <div className="simple-auth-card">
          <div className="simple-auth-heading">
            <span className="simple-auth-kicker">JOIN BIOSCOPE</span>
            <h1>加入 BioScope</h1>
            <p>创建你的账号，开启生命科学探索之旅</p>
          </div>

          <RegisterForm />
        </div>
      </section>
    </main>
  );
}
