"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const next = searchParams.get("next");
    router.push(next && next.startsWith("/") ? next : "/dashboard");
    router.refresh();
  }

  return (
    <div className="simple-auth-form-wrap">
      <form className="simple-auth-form" onSubmit={submit}>
        <label className="simple-auth-field">
          <span className="simple-auth-field-label">邮箱</span>
          <div className="simple-auth-input-shell">
            <Mail size={19} />
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="请输入邮箱"
            />
          </div>
        </label>

        <label className="simple-auth-field">
          <span className="simple-auth-field-label">密码</span>
          <div className="simple-auth-input-shell">
            <LockKeyhole size={19} />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="请输入密码"
            />
            <button
              type="button"
              className="simple-auth-eye"
              onClick={() => setShowPassword((value) => !value)}
              aria-label="切换密码显示"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <div className="simple-auth-meta">
          <label className="simple-auth-check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            <span>记住我</span>
          </label>
          <a href="/register">还没有账号？</a>
        </div>

        <button className="simple-auth-submit" disabled={loading}>
          {loading ? "正在登录…" : "登录"}
          <span>→</span>
        </button>
      </form>

      {message && <p className="register-message" role="status">{message}</p>}

      <div className="simple-auth-divider"><span>还没有账号？</span></div>
      <a className="simple-auth-secondary" href="/register">注册</a>
    </div>
  );
}
