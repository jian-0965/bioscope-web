"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login";

export default function AuthForm() {
  const [mode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
  

    setLoading(false);
  }

  return (
    <div className="auth-form-wrap">
      <div className="auth-tabs">
        <button className="active" type="button">登录</button>
        <a className="auth-tab-link" href="/register">注册</a>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <label>
          邮箱
          <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
        </label>
        <label>
          密码
          <input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="至少 8 位" />
        </label>
        <button className="primary auth-submit" disabled={loading}>
          {loading ? "请稍候…" : "登录并继续探索"}
        </button>
      </form>
      {message && <p className="auth-message" role="status">{message}</p>}
    </div>
  );
}
