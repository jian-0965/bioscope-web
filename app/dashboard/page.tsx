import { redirect } from "next/navigation";
import { Bookmark, CheckCircle2, Microscope, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const [{ data: progress }, { data: structures }, { data: profile }] = await Promise.all([
    supabase
      .from("user_progress")
      .select("node_id, bookmarked, completed, last_visited_at")
      .eq("user_id", user.id)
      .order("last_visited_at", { ascending: false }),
    supabase
      .from("structures")
      .select("id,name_zh,name_en,scale_label,display_order")
      .order("display_order"),
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  const rows = structures ?? [];
  const progressMap = new Map((progress ?? []).map((item) => [item.node_id, item]));
  const completed = (progress ?? []).filter((item) => item.completed).length;
  const bookmarked = (progress ?? []).filter((item) => item.bookmarked).length;
  const percent = rows.length ? Math.round((completed / rows.length) * 100) : 0;
  const welcome = profile?.display_name ? profile.display_name + "，欢迎回来" : "欢迎回来";

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <span className="eyebrow"><Sparkles size={15} /> BioScope · 我的探索</span>
          <h1>{welcome}</h1>
          <p>{user.email}</p>
        </div>
        <div className="dashboard-actions">
          <a className="secondary" href="/">继续探索</a>
          <form action={signOut}><button className="primary">退出登录</button></form>
        </div>
      </header>

      <section className="dashboard-overview">
        <article>
          <Microscope size={22} />
          <strong>{percent}%</strong>
          <span>探索完成度</span>
        </article>
        <article>
          <CheckCircle2 size={22} />
          <strong>{completed}/{rows.length}</strong>
          <span>已学会尺度</span>
        </article>
        <article>
          <Bookmark size={22} />
          <strong>{bookmarked}</strong>
          <span>收藏知识点</span>
        </article>
      </section>

      <section className="progress-card">
        <div className="dashboard-section-title">
          <div>
            <span className="eyebrow">生命尺度路线</span>
            <h2>从人体一路走到离子通道</h2>
          </div>
          <span>{percent}% 完成</span>
        </div>
        <div className="progress-meter"><span style={{ width: percent + "%" }} /></div>

        <div className="journey-list">
          {rows.map((structure, index) => {
            const item = progressMap.get(structure.id);
            return (
              <article key={structure.id} className={item?.completed ? "journey-item complete" : "journey-item"}>
                <div className="journey-index">{item?.completed ? <CheckCircle2 size={18} /> : index + 1}</div>
                <div>
                  <strong>{structure.name_zh}</strong>
                  <span>{structure.name_en} · {structure.scale_label}</span>
                </div>
                <div className="journey-state">
                  {item?.bookmarked && <Bookmark size={15} />}
                  <span>{item?.completed ? "已完成" : item ? "探索中" : "未开始"}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dashboard-tip">
        <strong>学习不是打卡。</strong>
        <span>完成度只记录你走过的路径。随时回到某个尺度重新实验、重新理解都可以。</span>
      </section>
    </main>
  );
}
