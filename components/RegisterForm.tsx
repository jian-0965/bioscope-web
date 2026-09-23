"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getUsernameError, normalizeUsername, usernameToAuthEmail } from "@/lib/auth/username";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

    const usernameError = getUsernameError(username);
    if (usernameError) {
      setMessage(usernameError);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const email = await usernameToAuthEmail(username);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: normalizeUsername(username) },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("注册成功！正在进入你的学习空间。");
    setTimeout(() => router.push("/dashboard"), 900);
    setLoading(false);
  }

  return (
    <div className="simple-auth-form-wrap">
      <form className="simple-auth-form" onSubmit={submit}>
        <label className="simple-auth-field">
          <span className="simple-auth-field-label">账号</span>
          <div className="simple-auth-input-shell">
            <UserRound size={19} />
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="3–24 个英文字母、数字或下划线"
              autoComplete="username"
              maxLength={24}
              required
            />
          </div>
        </label>

        <label className="simple-auth-field">
          <span className="simple-auth-field-label">密码</span>
          <div className="simple-auth-input-shell">
            <LockKeyhole size={19} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="至少 8 个字符"
              minLength={8}
              autoComplete="new-password"
              required
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

        <label className="simple-auth-check simple-auth-terms">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <span>我已阅读并同意 <a href="#">服务条款</a> 和 <a href="#">隐私政策</a></span>
        </label>

        <button className="simple-auth-submit" disabled={loading}>
          {loading ? "正在创建账户…" : "注册"}
          <span>→</span>
        </button>
      </form>

      {message && <p className="register-message" role="status">{message}</p>}

      <div className="simple-auth-divider"><span>已有账号？</span></div>
      <a className="simple-auth-secondary" href="/auth">登录</a>
    </div>
  );
}
  const [password, setPassword] = useState("");
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
    <div className="simple-auth-form-wrap">
      <form className="simple-auth-form" onSubmit={submit}>
        <label className="simple-auth-field">
          <span className="simple-auth-field-label">邮箱</span>
          <div className="simple-auth-input-shell">
            <Mail size={19} />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="请输入邮箱"
              autoComplete="email"
              required
            />
          </div>
        </label>

        <label className="simple-auth-field">
          <span className="simple-auth-field-label">用户名</span>
          <div className="simple-auth-input-shell">
            <UserRound size={19} />
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="请输入用户名"
              autoComplete="name"
            />
          </div>
        </label>

        <label className="simple-auth-field">
          <span className="simple-auth-field-label">密码</span>
          <div className="simple-auth-input-shell">
            <LockKeyhole size={19} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="至少 8 个字符"
              minLength={8}
              autoComplete="new-password"
              required
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

        <label className="simple-auth-check simple-auth-terms">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <span>我已阅读并同意 <a href="#">服务条款</a> 和 <a href="#">隐私政策</a></span>
        </label>

        <button className="simple-auth-submit" disabled={loading}>
          {loading ? "正在创建账户…" : "注册"}
          <span>→</span>
        </button>
      </form>

      {message && <p className="register-message" role="status">{message}</p>}

      <div className="simple-auth-divider"><span>已有账号？</span></div>
      <a className="simple-auth-secondary" href="/auth">登录</a>
    </div>
  );
}
