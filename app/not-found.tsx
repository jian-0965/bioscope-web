import Link from "next/link";
import { ArrowLeft, Microscope } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <Microscope size={44} strokeWidth={1.5} />
        <span>404 · 没找到这个生命节点</span>
        <h1>这条探索路径暂时不存在</h1>
        <p>返回生物学全景，换一条路径继续探索。</p>
        <Link href="/atlas"><ArrowLeft size={15} /> 返回生物学全景</Link>
      </div>
    </main>
  );
}
