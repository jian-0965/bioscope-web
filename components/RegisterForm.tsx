"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!accepted) {
      setMessage("请先同意服务条款和隐私政策。");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("两次输入的密码不一致。");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback",
        data: { display_name: displayName.trim() || undefined },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("注册成功！请到邮箱点击确认链接，然后回来登录。");
    setTimeout(() => router.push("/auth"), 1800);
    setLoading(false);
  }

  return (
    <div className="scene-form-wrap">
      <form className="scene-form" onSubmit={submit}>
        <label className="scene-field">
          <UserRound size={19} />
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="用户名"
            autoComplete="name"
          />
        </label>

        <label className="scene-field">
          <Mail size={19} />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="邮箱地址"
            autoComplete="email"
            required
          />
        </label>

        <label className="scene-field">
          <LockKeyhole size={19} />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="密码（至少 8 位）"
            minLength={8}
            autoComplete="new-password"
            required
          />
          <button type="button" className="scene-eye" onClick={() => setShowPassword((value) => !value)} aria-label="切换密码显示">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </label>

        <label className="scene-field">
          <LockKeyhole size={19} />
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="确认密码"
            minLength={8}
            autoComplete="new-password"
            required
          />
        </label>

        <label className="scene-check scene-terms">
          <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
          <span>我已阅读并同意 <a href="#">服务条款</a> 和 <a href="#">隐私政策</a></span>
        </label>

        <button className="scene-submit" disabled={loading}>
          {loading ? "正在创建账户…" : "注册账号"}
          <span>→</span>
        </button>
      </form>

      {message && <p className="register-message" role="status">{message}</p>}

      <div className="scene-divider"><span>已有账号？</span></div>
      <a className="scene-secondary-action" href="/auth">登录</a>
    </div>
  );
}
