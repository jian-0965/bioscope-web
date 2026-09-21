import Link from "next/link";
import MascotAvatar from "@/components/MascotAvatar";

type Mentor = "boy" | "girl";

const mentorMeta = {
  boy: { name: "小博", role: "机制导师" },
  girl: { name: "小芽", role: "学习向导" },
} satisfies Record<Mentor, { name: string; role: string }>;

export default function MascotGuide({
  mentor,
  message,
  actionHref,
  actionLabel,
  compact = false,
}: {
  mentor: Mentor;
  message: string;
  actionHref?: string;
  actionLabel?: string;
  compact?: boolean;
}) {
  const info = mentorMeta[mentor];

  return (
    <aside className={"mascot-guide " + (compact ? "compact" : "")}>
      <div className="mascot-guide-art">
        <MascotAvatar mentor={mentor} className="mascot-vector" />
      </div>
      <div className="mascot-guide-copy">
        <span className="mascot-guide-name">{info.name} · {info.role}</span>
        <p>{message}</p>
        {actionHref && actionLabel && <Link href={actionHref}>{actionLabel} →</Link>}
      </div>
    </aside>
  );
}
