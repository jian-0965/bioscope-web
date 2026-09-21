import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const topicKey = String(body?.topicKey ?? "").slice(0, 160);
    const correct = Boolean(body?.correct);
    if (!topicKey) return NextResponse.json({ error: "missing topicKey" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ saved: false, reason: "guest" });

    const { data: existing } = await supabase
      .from("learning_signals")
      .select("attempts, correct, wrong")
      .eq("user_id", user.id)
      .eq("topic_key", topicKey)
      .maybeSingle();

    const attempts = (existing?.attempts ?? 0) + 1;
    const right = (existing?.correct ?? 0) + (correct ? 1 : 0);
    const wrong = (existing?.wrong ?? 0) + (correct ? 0 : 1);

    const { error } = await supabase.from("learning_signals").upsert({
      user_id: user.id,
      topic_key: topicKey,
      attempts,
      correct: right,
      wrong,
      last_result: correct,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,topic_key" });

    if (error) return NextResponse.json({ saved: false, error: error.message }, { status: 500 });
    return NextResponse.json({ saved: true, attempts, correct: right, wrong });
  } catch {
    return NextResponse.json({ saved: false }, { status: 500 });
  }
}
