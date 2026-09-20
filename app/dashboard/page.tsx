import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: progress } = await supabase
    .from("user_progress")
    .select("node_id, bookmarked, completed, last_visited_at")
    .order("last_visited_at", { ascending: false });

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <span className="eyebrow">BioScope · 我的探索</span>
          <h1>欢迎回来</h1>
          <p>{user.email}</p>
        </div>
        <div className="dashboard-actions">
          <a className="secondary" href="/">继续探索</a>
          <form action={signOut}><button className="primary">退出登录</button></form>
        </div>
      </header>
      <section className="progress-card">
        <h2>学习进度</h2>
        {progress?.length ? (
          <div className="progress-list">
            {progress.map((item) => (
              <article key={item.node_id}>
                <strong>{item.node_id}</strong>
                <span>{item.completed ? "已完成" : "探索中"}{item.bookmarked ? " · 已收藏" : ""}</span>
              </article>
            ))}
          </div>
        ) : (
          <p>还没有保存记录。返回探索器，开始你的第一次微观旅行吧。</p>
        )}
      </section>
    </main>
  );
}
