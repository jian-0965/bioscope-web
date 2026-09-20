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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

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
    setTimeout(() => {
      router.push("/auth");
    }, 1800);
    setLoading(false);
  }

  return (
    <form className="register-form" onSubmit={submit}>
      <label className="register-field">
        <span><UserRound size={17} /></span>
        <input
          type="text"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="昵称（可选）"
          autoComplete="name"
        />
      </label>

      <label className="register-field">
        <span><Mail size={17} /></span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="邮箱"
          autoComplete="email"
          required
        />
      </label>

      <label className="register-field">
        <span><LockKeyhole size={17} /></span>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="密码（至少 8 位）"
          minLength={8}
          autoComplete="new-password"
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "隐藏密码" : "显示密码"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </label>

      <label className="register-field">
        <span><LockKeyhole size={17} /></span>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="再次输入密码"
          minLength={8}
          autoComplete="new-password"
          required
        />
      </label>

      <button className="register-submit" disabled={loading}>
        {loading ? "正在创建账户…" : "创建我的 BioScope 账户"}
        <span>→</span>
      </button>

      {message && <p className="register-message" role="status">{message}</p>}

      <p className="register-switch">
        已经有账户？ <a href="/auth">返回登录</a>
      </p>
    </form>
  );
}
