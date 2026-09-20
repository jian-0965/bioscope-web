"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
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
      } else {
        const nextPath = new URLSearchParams(window.location.search).get("next");
        const destination =
          nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
            ? nextPath
            : "/dashboard";
        router.push(destination);
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/auth/callback" },
      });
      setMessage(error ? error.message : "注册成功，请到邮箱点击确认链接。");
    }

    setLoading(false);
  }

  return (
    <div className="auth-form-wrap">
      <div className="auth-tabs">
        <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">登录</button>
        <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")} type="button">注册</button>
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
          {loading ? "请稍候…" : mode === "login" ? "登录并继续探索" : "创建账户"}
        </button>
      </form>
      {message && <p className="auth-message" role="status">{message}</p>}
    </div>
  );
}
